import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Get all messages for the current user
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const url = new URL(req.url);
    const conversationWith = url.searchParams.get('userId');
    
    // If userId is provided, get conversation with that user
    if (conversationWith) {
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId, receiverId: conversationWith },
            { senderId: conversationWith, receiverId: userId }
          ]
        },
        orderBy: {
          createdAt: 'asc'
        },
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          receiver: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        }
      });
      
      return NextResponse.json(messages);
    }
    
    // Get all conversations
    const conversations = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });
    
    // Group by conversation
    const conversationMap = new Map();
    
    conversations.forEach(message => {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          userId: otherUserId,
          name: message.senderId === userId ? message.receiver.name : message.sender.name,
          image: message.senderId === userId ? message.receiver.image : message.sender.image,
          lastMessage: message.content,
          lastMessageDate: message.createdAt,
          unreadCount: message.senderId !== userId && !message.read ? 1 : 0
        });
      } else if (message.senderId !== userId && !message.read) {
        const conversation = conversationMap.get(otherUserId);
        conversation.unreadCount += 1;
      }
    });
    
    return NextResponse.json(Array.from(conversationMap.values()));
    
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// Send a new message
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { receiverId, content } = await req.json();
    
    if (!receiverId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const message = await prisma.message.create({
      data: {
        content,
        senderId: session.user.id,
        receiverId
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });
    
    return NextResponse.json(message);
    
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}

// Mark messages as read
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { senderId } = await req.json();
    
    if (!senderId) {
      return NextResponse.json({ error: 'Missing senderId' }, { status: 400 });
    }
    
    // Mark all messages from sender as read
    await prisma.message.updateMany({
      where: {
        senderId,
        receiverId: session.user.id,
        read: false
      },
      data: {
        read: true
      }
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error marking messages as read:', error);
    return NextResponse.json({ error: 'Failed to mark messages as read' }, { status: 500 });
  }
} 