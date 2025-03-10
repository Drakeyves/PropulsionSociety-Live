"use client";

import { useState, useEffect } from "react";
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

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: Author;
}

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      try {
        // Fetch post
        const postResponse = await fetch(`/api/posts/${params.id}`);
        if (!postResponse.ok) throw new Error("Failed to fetch post");
        const postData = await postResponse.json();
        setPost(postData);

        // Fetch comments
        const commentsResponse = await fetch(`/api/posts/${params.id}/comments`);
        if (!commentsResponse.ok) throw new Error("Failed to fetch comments");
        const commentsData = await commentsResponse.json();
        setComments(commentsData);
      } catch (err) {
        console.error("Error fetching post details:", err);
        setError("Failed to load post. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostAndComments();
  }, [params.id]);

  const handleLike = async () => {
    try {
      await fetch(`/api/posts/${params.id}/reactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "LIKE" }),
      });
      
      // Update post with incremented reaction count
      setPost((prev) => {
        if (!prev) return prev;
        const prevCount = prev._count || { comments: 0, reactions: 0 };
        return {
          ...prev,
          _count: {
            ...prevCount,
            reactions: (prevCount.reactions || 0) + 1,
          },
        };
      });
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/posts/${params.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) throw new Error("Failed to submit comment");

      const comment = await response.json();
      setComments((prev) => [comment, ...prev]);
      setNewComment("");
      
      // Update post with incremented comment count
      setPost((prev) => {
        if (!prev) return prev;
        const prevCount = prev._count || { comments: 0, reactions: 0 };
        return {
          ...prev,
          _count: {
            ...prevCount,
            comments: (prevCount.comments || 0) + 1,
          },
        };
      });
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="space-y-6">
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
          {error || "Post not found"}
        </div>
        <Link
          href="/dashboard/posts"
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1 h-4 w-4"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to Posts
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/posts"
        className="inline-flex items-center text-sm font-medium text-primary hover:underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-1 h-4 w-4"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Posts
      </Link>

      <div className="rounded-lg border shadow-sm">
        <div className="p-6">
          {/* Author info */}
          <div className="flex items-center gap-3 mb-6">
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
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="prose max-w-none dark:prose-invert mb-6">
            <p>{post.content}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t">
            <button
              onClick={handleLike}
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
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
              <span>{post._count?.reactions || 0}</span>
            </button>

            <button
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
              <span>{post._count?.comments || 0}</span>
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}/dashboard/posts/${post.id}`
                );
                alert("Link copied to clipboard!");
              }}
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

      {/* Comments section */}
      <div className="rounded-lg border shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Comments</h2>
          
          {/* Comment form */}
          <form onSubmit={handleSubmitComment} className="mb-6">
            <div className="space-y-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                disabled={isSubmitting}
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  disabled={!newComment.trim() || isSubmitting}
                >
                  {isSubmitting ? "Posting..." : "Post Comment"}
                </button>
              </div>
            </div>
          </form>
          
          {/* Comments list */}
          {comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No comments yet</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Be the first to comment on this post
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="rounded-lg border p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full">
                      {comment.author.image ? (
                        <Image
                          src={comment.author.image}
                          alt={comment.author.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                          {comment.author.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{comment.author.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}