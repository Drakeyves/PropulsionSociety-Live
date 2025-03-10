import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createErrorResponse, createSuccessResponse, handleApiError } from '@/lib/api-utils';

// Share a post with another user
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return createErrorResponse(
        'UNAUTHORIZED',
        'You must be logged in to share posts'
      );
    }
    
    const { postId, receiverId, message = '' } = await req.json();
    
    if (!postId || !receiverId) {
      return createErrorResponse(
        'BAD_REQUEST',
        'Missing required fields',
        { required: ['postId', 'receiverId'] }
      );
    }
    
    // Check if post exists and is published
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        published: true
      }
    });
    
    if (!post) {
      return createErrorResponse(
        'NOT_FOUND',
        'Post not found or not published'
      );
    }
    
    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: {
        id: receiverId
      }
    });
    
    if (!receiver) {
      return createErrorResponse(
        'NOT_FOUND',
        'Receiver not found'
      );
    }
    
    // Create shared post record
    const sharedPost = await prisma.sharedPost.create({
      data: {
        postId,
        sharerId: session.user.id,
        receiverId,
        message: message || null
      },
      include: {
        post: {
          select: {
            id: true,
            title: true,
            content: true,
            author: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        sharer: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });
    
    // Create message with reference to shared post
    const messageContent = message || `Shared a post: ${post.title}`;
    
    const newMessage = await prisma.message.create({
      data: {
        content: messageContent,
        senderId: session.user.id,
        receiverId,
        sharedPostId: sharedPost.id
      }
    });
    
    return createSuccessResponse({
      sharedPost,
      message: newMessage
    });
    
  } catch (error) {
    return handleApiError(error, 'Failed to share post');
  }
}