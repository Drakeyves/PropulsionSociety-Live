import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import crypto from 'crypto';

// Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address')
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate input
    const result = forgotPasswordSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }
    
    const { email } = body;
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    // For security reasons, don't reveal if the email exists or not
    if (!user) {
      return NextResponse.json({ 
        message: 'If your email is registered, you will receive a password reset link' 
      });
    }
    
    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Token expires in 1 hour
    
    // Store token in database
    await prisma.passwordReset.upsert({
      where: { userId: user.id },
      update: {
        token,
        expires
      },
      create: {
        userId: user.id,
        email,
        token,
        expires
      }
    });
    
    // TODO: Send password reset email
    // This would typically involve sending an email with a link containing the token
    // Example: `${process.env.APP_URL}/reset-password?token=${token}`
    
    return NextResponse.json({ 
      message: 'If your email is registered, you will receive a password reset link' 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
} 