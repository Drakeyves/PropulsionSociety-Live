'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface SharedPostMessageProps {
  sharedPostId: string;
  messageId: string;
  senderId: string;
  timestamp: Date;
}

interface SharedPost {
  id: string;
  message: string | null;
  post: {
    id: string;
    title: string;
    content: string;
    author: {
      id: string;
      name: string;
      image: string | null;
    };
  };
  sharer: {
    id: string;
    name: string;
    image: string | null;
  };
}

export default function SharedPostMessage({ 
  sharedPostId, 
  messageId, 
  senderId, 
  timestamp 
}: SharedPostMessageProps) {
  const [sharedPost, setSharedPost] = useState<SharedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSharedPost = async () => {
      try {
        const response = await fetch(`/api/posts/shared/${sharedPostId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch shared post');
        }
        const data = await response.json();
        setSharedPost(data.sharedPost);
      } catch (err) {
        console.error('Error fetching shared post:', err);
        setError('This shared post is no longer available');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedPost();
  }, [sharedPostId]);

  if (loading) {
    return (
      <div className="flex flex-col p-4 rounded-lg bg-gray-50 border border-gray-200 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (error || !sharedPost) {
    return (
      <div className="flex flex-col p-4 rounded-lg bg-red-50 border border-red-200">
        <p className="text-sm text-red-600">{error || 'Shared post not found'}</p>
      </div>
    );
  }

  // Truncate content for preview
  const truncatedContent = sharedPost.post.content.length > 100 
    ? `${sharedPost.post.content.substring(0, 100)}...` 
    : sharedPost.post.content;

  const formattedDate = new Date(timestamp).toLocaleString();

  return (
    <div className="flex flex-col p-4 rounded-lg bg-indigo-50 border border-indigo-200">
      {/* Shared post message if any */}
      {sharedPost.message && (
        <p className="text-sm text-gray-700 mb-2">{sharedPost.message}</p>
      )}
      
      {/* Shared post preview */}
      <Link 
        href={`/dashboard/posts/${sharedPost.post.id}`}
        className="block p-3 bg-white rounded-md border border-gray-200 hover:border-indigo-300 transition-colors"
      >
        <div className="flex items-start space-x-3">
          {/* Author avatar */}
          <div className="flex-shrink-0">
            <div className="relative h-8 w-8 rounded-full overflow-hidden">
              {sharedPost.post.author.image ? (
                <Image
                  src={sharedPost.post.author.image}
                  alt={`${sharedPost.post.author.name}'s avatar`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-indigo-200 flex items-center justify-center">
                  <span className="text-indigo-700 text-xs font-medium">
                    {sharedPost.post.author.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Post content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {sharedPost.post.title}
            </p>
            <p className="text-sm text-gray-500 line-clamp-2">
              {truncatedContent}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              By {sharedPost.post.author.name}
            </p>
          </div>
        </div>
      </Link>
      
      {/* Timestamp and shared by info */}
      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
        <span>Shared by {sharedPost.sharer.name}</span>
        <span>{formattedDate}</span>
      </div>
    </div>
  );
} 