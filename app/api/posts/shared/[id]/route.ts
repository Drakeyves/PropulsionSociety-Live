import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Get a shared post by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const sharedPostId = params.id;
    
    if (!sharedPostId) {
      return NextResponse.json({ error: 'Missing shared post ID' }, { status: 400 });
    }
    
    // Fetch the shared post with related data
    const sharedPost = await prisma.sharedPost.findUnique({
      where: {
        id: sharedPostId
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
    
    if (!sharedPost) {
      return NextResponse.json({ error: 'Shared post not found' }, { status: 404 });
    }
    
    // Check if the user is either the sharer or the receiver
    if (sharedPost.sharerId !== session.user.id && sharedPost.receiverId !== session.user.id) {
      return NextResponse.json({ error: 'You do not have permission to view this shared post' }, { status: 403 });
    }
    
    return NextResponse.json({
      success: true,
      sharedPost
    });
    
  } catch (error) {
    console.error('Error fetching shared post:', error);
    return NextResponse.json({ error: 'Failed to fetch shared post' }, { status: 500 });
  }
} 