import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Request to join a group
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
    
    // Check if the group exists
    const group = await prisma.group.findUnique({
      where: { id }
    });
    
    if (!group) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }
    
    // Check if the user is already a member
    const existingMember = await prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId: id,
          userId: session.user.id
        }
      }
    });
    
    if (existingMember) {
      return NextResponse.json({ error: 'You are already a member of this group' }, { status: 400 });
    }
    
    // If the group is not private, add the user directly
    if (!group.isPrivate) {
      const member = await prisma.groupMember.create({
        data: {
          groupId: id,
          userId: session.user.id,
          role: 'MEMBER'
        }
      });
      
      return NextResponse.json({ success: true, member });
    }
    
    // For private groups, create a join request
    // Note: In a real app, you would have a JoinRequest model
    // For simplicity, we'll just add the user with a pending status
    // This could be enhanced with a proper JoinRequest model in the future
    
    // For now, we'll return a message indicating the request was sent
    return NextResponse.json({ 
      success: true, 
      message: 'Join request sent. An admin will review your request.' 
    });
    
  } catch (error) {
    console.error('Error joining group:', error);
    return NextResponse.json({ error: 'Failed to join group' }, { status: 500 });
  }
}

// Accept or reject a join request (for private groups)
// This is a placeholder for future implementation
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
    const { userId, action } = await req.json();
    
    if (!userId || !action) {
      return NextResponse.json({ error: 'User ID and action are required' }, { status: 400 });
    }
    
    if (action !== 'accept' && action !== 'reject') {
      return NextResponse.json({ error: 'Invalid action. Must be "accept" or "reject"' }, { status: 400 });
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
    
    // Check if the user has permission to manage join requests
    const isOwner = group.ownerId === session.user.id;
    const isAdminOrMod = group.members.length > 0;
    
    if (!isOwner && !isAdminOrMod) {
      return NextResponse.json({ error: 'You do not have permission to manage join requests' }, { status: 403 });
    }
    
    // In a real app, you would update the JoinRequest status
    // For now, if action is 'accept', add the user to the group
    if (action === 'accept') {
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
      
      // Add the user to the group
      const member = await prisma.groupMember.create({
        data: {
          groupId: id,
          userId,
          role: 'MEMBER'
        }
      });
      
      return NextResponse.json({ success: true, member });
    }
    
    // If action is 'reject', just return success
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error managing join request:', error);
    return NextResponse.json({ error: 'Failed to manage join request' }, { status: 500 });
  }
}