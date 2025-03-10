import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Get a single group by ID
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
    
    // Get the group with member count and post count
    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            members: true,
            posts: true
          }
        }
      }
    });
    
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    
    // Check if the user is a member and get their role
    const membership = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: id,
          userId: session.user.id
        }
      },
      select: {
        role: true
      }
    });
    
    // If the group is private and the user is not a member, deny access
    if (group.isPrivate && !membership) {
      return NextResponse.json({ error: 'You do not have access to this group' }, { status: 403 });
    }
    
    // Return the group with membership info
    return NextResponse.json({
      ...group,
      isMember: !!membership,
      role: membership?.role || null
    });
    
  } catch (error) {
    console.error('Error fetching group:', error);
    return NextResponse.json({ error: 'Failed to fetch group' }, { status: 500 });
  }
}

// Update a group
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = params;
    const { name, description, isPrivate } = await req.json();
    
    // Check if the group exists
    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        members: {
          where: {
            userId: session.user.id,
            role: { in: ['ADMIN'] }
          }
        }
      }
    });
    
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    
    // Check if the user has permission to update the group
    const isOwner = group.ownerId === session.user.id;
    const isAdmin = group.members.length > 0;
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: 'You do not have permission to update this group' }, { status: 403 });
    }
    
    // Generate a new slug if name is changed
    let slug = group.slug;
    if (name && name !== group.name) {
      slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Check if new slug is already taken
      const existingGroup = await prisma.group.findFirst({
        where: {
          slug,
          id: { not: id }
        }
      });
      
      if (existingGroup) {
        return NextResponse.json({ error: 'A group with this name already exists' }, { status: 400 });
      }
    }
    
    // Update the group
    const updatedGroup = await prisma.group.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description !== undefined ? description : undefined,
        slug: name ? slug : undefined,
        isPrivate: isPrivate !== undefined ? isPrivate : undefined
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            members: true,
            posts: true
          }
        }
      }
    });
    
    return NextResponse.json(updatedGroup);
    
  } catch (error) {
    console.error('Error updating group:', error);
    return NextResponse.json({ error: 'Failed to update group' }, { status: 500 });
  }
}

// Delete a group
export async function DELETE(
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
      where: { id }
    });
    
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    
    // Only the owner can delete the group
    if (group.ownerId !== session.user.id) {
      return NextResponse.json({ error: 'Only the group owner can delete the group' }, { status: 403 });
    }
    
    // Delete the group
    await prisma.group.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting group:', error);
    return NextResponse.json({ error: 'Failed to delete group' }, { status: 500 });
  }
}