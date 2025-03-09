import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Get groups with pagination and filtering
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const myGroups = url.searchParams.get('myGroups') === 'true';
    
    const skip = (page - 1) * limit;
    
    // Build the where clause based on filters
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // If myGroups is true, only show groups the user is a member of
    if (myGroups) {
      where.members = {
        some: {
          userId: session.user.id
        }
      };
    } else {
      // Otherwise, show public groups and groups the user is a member of
      where.OR = [
        { isPrivate: false },
        {
          members: {
            some: {
              userId: session.user.id
            }
          }
        }
      ];
    }
    
    // Get groups with pagination
    const [groups, totalCount] = await Promise.all([
      prisma.group.findMany({
        where,
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit,
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
      }),
      prisma.group.count({ where })
    ]);
    
    // For each group, check if the user is a member and their role
    const groupsWithMembership = await Promise.all(
      groups.map(async (group) => {
        const membership = await prisma.groupMember.findUnique({
          where: {
            groupId_userId: {
              groupId: group.id,
              userId: session.user.id
            }
          },
          select: {
            role: true
          }
        });
        
        return {
          ...group,
          isMember: !!membership,
          role: membership?.role || null
        };
      })
    );
    
    return NextResponse.json({
      groups: groupsWithMembership,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 });
  }
}

// Create a new group
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { name, description, isPrivate } = await req.json();
    
    if (!name) {
      return NextResponse.json({ error: 'Group name is required' }, { status: 400 });
    }
    
    // Generate a slug from the name
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Check if slug is already taken
    const existingGroup = await prisma.group.findUnique({
      where: { slug }
    });
    
    if (existingGroup) {
      return NextResponse.json({ error: 'A group with this name already exists' }, { status: 400 });
    }
    
    // Create the group and add the creator as an admin
    const group = await prisma.group.create({
      data: {
        name,
        description,
        slug,
        isPrivate: isPrivate || false,
        ownerId: session.user.id,
        members: {
          create: {
            userId: session.user.id,
            role: 'ADMIN'
          }
        }
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
            members: true
          }
        }
      }
    });
    
    return NextResponse.json(group);
    
  } catch (error) {
    console.error('Error creating group:', error);
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
  }
}

// Update a group
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id, name, description, isPrivate } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
    }
    
    // Check if user is the owner or an admin of the group
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
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
    }
    
    // Check if user is the owner of the group
    const group = await prisma.group.findUnique({
      where: { id }
    });
    
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    
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