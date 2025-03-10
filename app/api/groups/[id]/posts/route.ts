import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Get posts for a group
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = params;
    
    // Check if the group exists
    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        members: {
          where: { userId: session.user.id }
        }
      }
    });
    
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    
    // If the group is private, check if the user is a member
    if (group.isPrivate && group.members.length === 0) {
      return NextResponse.json({ error: 'You do not have access to this group' }, { status: 403 });
    }
    
    // Get posts with pagination
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    
    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
        where: { groupId: id, published: true },
        orderBy: { createdAt: 'desc' },
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
          _count: {
            select: {
              comments: true,
              reactions: true
            }
          }
        }
      }),
      prisma.post.count({ where: { groupId: id, published: true } })
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
    console.error('Error fetching group posts:', error);
    return NextResponse.json({ error: 'Failed to fetch group posts' }, { status: 500 });
  }
}

// Create a post in a group
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = params;
    const { title, content } = await req.json();
    
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }
    
    // Check if the group exists
    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        members: {
          where: { userId: session.user.id }
        }
      }
    });
    
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    
    // Check if the user is a member of the group
    if (group.members.length === 0) {
      return NextResponse.json({ error: 'You must be a member of the group to create posts' }, { status: 403 });
    }
    
    // Create the post
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: session.user.id,
        groupId: id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            comments: true,
            reactions: true
          }
        }
      }
    });
    
    return NextResponse.json(post);
    
  } catch (error) {
    console.error('Error creating group post:', error);
    return NextResponse.json({ error: 'Failed to create group post' }, { status: 500 });
  }
}