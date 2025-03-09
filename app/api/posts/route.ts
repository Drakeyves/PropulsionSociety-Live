import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Get posts with pagination and filtering
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const groupId = url.searchParams.get('groupId');
    const userId = url.searchParams.get('userId');
    
    const skip = (page - 1) * limit;
    
    // Build the where clause based on filters
    const where: any = {
      published: true
    };
    
    if (groupId) {
      where.groupId = groupId;
    }
    
    if (userId) {
      where.authorId = userId;
    }
    
    // Get posts with pagination
    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where,
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
          group: {
            select: {
              id: true,
              name: true,
              slug: true
            }
          },
          _count: {
            select: {
              comments: true,
              reactions: true
            }
          }
        }
      }),
      prisma.post.count({ where })
    ]);
    
    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}

// Create a new post
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { title, content, groupId } = await req.json();
    
    if (!title || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // If groupId is provided, check if user is a member of the group
    if (groupId) {
      const isMember = await prisma.groupMember.findFirst({
        where: {
          groupId,
          userId: session.user.id
        }
      });
      
      if (!isMember) {
        return NextResponse.json({ error: 'You are not a member of this group' }, { status: 403 });
      }
    }
    
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        groupId: groupId || null
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        group: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });
    
    return NextResponse.json(post);
    
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 500 });
  }
}

// Update a post
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id, title, content, published } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Missing post ID' }, { status: 400 });
    }
    
    // Check if user is the author of the post
    const post = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true, groupId: true }
    });
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // Check if user is the author or a group admin/moderator
    let canEdit = post.authorId === session.user.id;
    
    if (!canEdit && post.groupId) {
      const groupMember = await prisma.groupMember.findFirst({
        where: {
          groupId: post.groupId,
          userId: session.user.id,
          role: { in: ['ADMIN', 'MODERATOR'] }
        }
      });
      
      canEdit = !!groupMember;
    }
    
    if (!canEdit) {
      return NextResponse.json({ error: 'You do not have permission to edit this post' }, { status: 403 });
    }
    
    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title: title !== undefined ? title : undefined,
        content: content !== undefined ? content : undefined,
        published: published !== undefined ? published : undefined
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        group: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    });
    
    return NextResponse.json(updatedPost);
    
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Failed to update post' }, { status: 500 });
  }
}

// Delete a post
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Missing post ID' }, { status: 400 });
    }
    
    // Check if user is the author of the post
    const post = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true, groupId: true }
    });
    
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    // Check if user is the author or a group admin/moderator
    let canDelete = post.authorId === session.user.id;
    
    if (!canDelete && post.groupId) {
      const groupMember = await prisma.groupMember.findFirst({
        where: {
          groupId: post.groupId,
          userId: session.user.id,
          role: { in: ['ADMIN', 'MODERATOR'] }
        }
      });
      
      canDelete = !!groupMember;
    }
    
    if (!canDelete) {
      return NextResponse.json({ error: 'You do not have permission to delete this post' }, { status: 403 });
    }
    
    // Delete the post
    await prisma.post.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
} 