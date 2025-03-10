import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Get reactions for a post
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
    const type = url.searchParams.get('type');
    
    const where: any = {
      postId: params.id
    };
    
    if (type) {
      where.type = type;
    }
    
    const reactions = await prisma.reaction.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });
    
    return NextResponse.json(reactions);
    
  } catch (error) {
    console.error('Error fetching reactions:', error);
    return NextResponse.json({ error: 'Failed to fetch reactions' }, { status: 500 });
  }
}

// Create a reaction on a post
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { type } = await req.json();
    
    if (!type) {
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
    
    // Check if the user has already reacted with this type
    const existingReaction = await prisma.reaction.findFirst({
      where: {
        postId: params.id,
        userId: session.user.id,
        type
      }
    });
    
    if (existingReaction) {
      return NextResponse.json({ error: 'You have already reacted with this type' }, { status: 400 });
    }
    
    // Create the reaction
    const reaction = await prisma.reaction.create({
      data: {
        type,
        userId: session.user.id,
        postId: params.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });
    
    return NextResponse.json(reaction);
    
  } catch (error) {
    console.error('Error creating reaction:', error);
    return NextResponse.json({ error: 'Failed to create reaction' }, { status: 500 });
  }
}

// Delete a reaction
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const url = new URL(req.url);
    const type = url.searchParams.get('type');
    
    if (!type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Delete the reaction
    await prisma.reaction.deleteMany({
      where: {
        postId: params.id,
        userId: session.user.id,
        type
      }
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting reaction:', error);
    return NextResponse.json({ error: 'Failed to delete reaction' }, { status: 500 });
  }
}