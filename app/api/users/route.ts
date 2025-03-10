import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Get all users (excluding the current user)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get query parameters
    const url = new URL(req.url);
    const search = url.searchParams.get('search') || '';
    const limit = parseInt(url.searchParams.get('limit') || '20');
    
    // Find users excluding the current user
    const users = await prisma.user.findMany({
      where: {
        id: { not: session.user.id },
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      },
      take: limit,
      orderBy: { name: 'asc' }
    });
    
    return NextResponse.json({
      success: true,
      users
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
} 