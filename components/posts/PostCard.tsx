"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

interface Author {
  id: string;
  name: string;
  image: string | null;
}

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  author: Author;
  _count?: {
    comments: number;
    reactions: number;
  };
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => Promise<void>;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

export default function PostCard({
  post,
  onLike,
  onComment,
  onShare,
}: PostCardProps) {
  const [isLiking, setIsLiking] = useState(false);
  const [likesCount, setLikesCount] = useState(post._count?.reactions || 0);
  const [commentsCount, setCommentsCount] = useState(post._count?.comments || 0);

  const handleLike = async () => {
    if (!onLike || isLiking) return;
    
    setIsLiking(true);
    try {
      await onLike(post.id);
      setLikesCount((prev) => prev + 1);
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setIsLiking(false);
    }
  };

  // Truncate content if it's too long
  const truncatedContent = post.content.length > 200
    ? `${post.content.slice(0, 200)}...`
    : post.content;

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="p-6">
        {/* Author info */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative h-10 w-10 overflow-hidden rounded-full">
            {post.author.image ? (
              <Image
                src={post.author.image}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                {post.author.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <p className="font-medium">{post.author.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Post content */}
        <Link href={`/dashboard/posts/${post.id}`} className="block" aria-label={`Read full post: ${post.title}`}>
          <h3 className="text-xl font-bold mb-2">{post.title}</h3>
          <p className="text-muted-foreground mb-4">{truncatedContent}</p>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-4 border-t">
          <button
            onClick={handleLike}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            disabled={isLiking}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
            <span>{likesCount}</span>
          </button>

          <button
            onClick={() => onComment?.(post.id)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>{commentsCount}</span>
          </button>

          <button
            onClick={() => onShare?.(post.id)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" x2="15.42" y1="13.51" y2="17.49" />
              <line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />
            </svg>
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}