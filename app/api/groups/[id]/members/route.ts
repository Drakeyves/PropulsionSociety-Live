import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Get members of a group
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
    
    // Get members with pagination
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const search = url.searchParams.get('search') || '';
    const role = url.searchParams.get('role');
    
    const skip = (page - 1) * limit;
    
    // Build the where clause based on filters
    const where: any = { groupId: id };
    
    if (role) {
      where.role = role;
    }
    
    // Get members with their user info
    const [members, totalCount] = await Promise.all([
      prisma.groupMember.findMany({
        where,
        orderBy: [
          { role: 'asc' },
          { createdAt: 'asc' }
        ],
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              email: true
            }
          }
        }
      }),
      prisma.groupMember.count({ where })
    ]);
    
    // If search is provided, filter members by name or email
    const filteredMembers = search
      ? members.filter(member => 
          member.user.name?.toLowerCase().includes(search.toLowerCase()) ||
          member.user.email?.toLowerCase().includes(search.toLowerCase())
        )
      : members;
    
    return NextResponse.json({
      members: filteredMembers,
      pagination: {
        page,
        limit,
        totalCount: search ? filteredMembers.length : totalCount,
        totalPages: search ? Math.ceil(filteredMembers.length / limit) : Math.ceil(totalCount / limit)
      }
    });
    
  } catch (error) {
    console.error('Error fetching group members:', error);
    return NextResponse.json({ error: 'Failed to fetch group members' }, { status: 500 });
  }
}

// Add a member to a group
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
    const { userId, role = 'MEMBER' } = await req.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // Check if the group exists
    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        members: {
          where: {
            userId: session.user.id,
            role: { in: ['ADMIN', 'MODERATOR'] }
          }
        }
      }
    });
    
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    
    // Check if the user has permission to add members
    const isOwner = group.ownerId === session.user.id;
    const isAdminOrMod = group.members.length > 0;
    
    if (!isOwner && !isAdminOrMod) {
      return NextResponse.json({ error: 'You do not have permission to add members to this group' }, { status: 403 });
    }
    
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Check if the user is already a member
    const existingMember = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: id,
          userId
        }
      }
    });
    
    if (existingMember) {
      return NextResponse.json({ error: 'User is already a member of this group' }, { status: 400 });
    }
    
    // Only owners can add admins
    if (role === 'ADMIN' && !isOwner) {
      return NextResponse.json({ error: 'Only the group owner can add admins' }, { status: 403 });
    }
    
    // Add the user to the group
    const member = await prisma.groupMember.create({
      data: {
        groupId: id,
        userId,
        role
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true
          }
        }
      }
    });
    
    return NextResponse.json(member);
    
  } catch (error) {
    console.error('Error adding group member:', error);
    return NextResponse.json({ error: 'Failed to add group member' }, { status: 500 });
  }
}

// Update a member's role
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { id } = params;
    const { userId, role } = await req.json();
    
    if (!userId || !role) {
      return NextResponse.json({ error: 'User ID and role are required' }, { status: 400 });
    }
    
    // Check if the group exists
    const group = await prisma.group.findUnique({
      where: { id }
    });
    
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    
    // Check if the user has permission to update roles
    const isOwner = group.ownerId === session.user.id;
    
    if (!isOwner) {
      return NextResponse.json({ error: 'Only the group owner can update member roles' }, { status: 403 });
    }
    
    // Check if the member exists
    const member = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: id,
          userId
        }
      }
    });
    
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }
    
    // Update the member's role
    const updatedMember = await prisma.groupMember.update({
      where: {
        groupId_userId: {
          groupId: id,
          userId
        }
      },
      data: { role },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            email: true
          }
        }
      }
    });
    
    return NextResponse.json(updatedMember);
    
  } catch (error) {
    console.error('Error updating group member:', error);
    return NextResponse.json({ error: 'Failed to update group member' }, { status: 500 });
  }
}

// Remove a member from a group
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
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // Check if the group exists
    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        members: {
          where: {
            userId: session.user.id,
            role: { in: ['ADMIN', 'MODERATOR'] }
          }
        }
      }
    });
    
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    
    // Users can remove themselves
    const isSelf = userId === session.user.id;
    // Owners can remove anyone
    const isOwner = group.ownerId === session.user.id;
    // Admins and moderators can remove regular members
    const isAdminOrMod = group.members.length > 0;
    
    if (!isSelf && !isOwner && !isAdminOrMod) {
      return NextResponse.json({ error: 'You do not have permission to remove members from this group' }, { status: 403 });
    }
    
    // Check if the member exists
    const member = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: id,
          userId
        }
      }
    });
    
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }
    
    // Admins can only be removed by the owner
    if (member.role === 'ADMIN' && !isOwner) {
      return NextResponse.json({ error: 'Only the group owner can remove admins' }, { status: 403 });
    }
    
    // Cannot remove the owner
    if (userId === group.ownerId) {
      return NextResponse.json({ error: 'Cannot remove the group owner' }, { status: 403 });
    }
    
    // Remove the member
    await prisma.groupMember.delete({
      where: {
        groupId_userId: {
          groupId: id,
          userId
        }
      }
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error removing group member:', error);
    return NextResponse.json({ error: 'Failed to remove group member' }, { status: 500 });
  }
}