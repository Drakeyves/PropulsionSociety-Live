import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Share a post with another user
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { postId, receiverId, message } = await req.json();
    
    if (!postId || !receiverId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if post exists and is published
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        published: true
      }
    });
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found or not published' }, { status: 404 });
    }
    
    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: {
        id: receiverId
      }
    });
    
    if (!receiver) {
      return NextResponse.json({ error: 'Receiver not found' }, { status: 404 });
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
    
    return NextResponse.json({
      success: true,
      sharedPost,
      message: newMessage
    });
    
  } catch (error) {
    console.error('Error sharing post:', error);
    return NextResponse.json({ error: 'Failed to share post' }, { status: 500 });
  }
}