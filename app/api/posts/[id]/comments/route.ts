import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Get comments for a post
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const page = parseInt(url.searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    const comments = await prisma.comment.findMany({
      where: {
        postId: params.id,
        parentId: null // Only get top-level comments
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        _count: {
          select: {
            reactions: true
          }
        }
      }
    });
    
    return NextResponse.json(comments);
    
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

// Create a comment on a post
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { content, parentId } = await req.json();
    
    if (!content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: {
        id: params.id
      }
    });
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // If parentId is provided, check if the parent comment exists and belongs to the post
    if (parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: {
          id: parentId
        }
      });
      
      if (!parentComment || parentComment.postId !== params.id) {
        return NextResponse.json({ error: 'Parent comment not found or does not belong to this post' }, { status: 400 });
      }
    }
    
    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: session.user.id,
        postId: params.id,
        parentId: parentId || null
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });
    
    return NextResponse.json(comment);
    
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
  }
}