"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import GroupHeader from "@/components/groups/GroupHeader";
import GroupTabs from "@/components/groups/GroupTabs";
import PostCard from "@/components/posts/PostCard";

interface Author {
  id: string;
  name: string;
  image: string | null;
}

interface Group {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  isPrivate: boolean;
  createdAt: string;
  owner: Author;
  isMember?: boolean;
  role?: string | null;
  _count?: {
    members: number;
    posts: number;
  };
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

export default function GroupDetailPage({ params }: { params: { slug: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupAndPosts = async () => {
      setIsLoading(true);
      try {
        // First, find the group by slug
        const groupsResponse = await fetch(`/api/groups?search=${params.slug}`);
        if (!groupsResponse.ok) throw new Error("Failed to fetch group");
        
        const groupsData = await groupsResponse.json();
        const foundGroup = groupsData.groups?.find((g: Group) => g.slug === params.slug);
        
        if (!foundGroup) {
          throw new Error("Group not found");
        }
        
        setGroup(foundGroup);
        
        // Then, fetch the group's posts
        if (foundGroup.isMember || !foundGroup.isPrivate) {
          const postsResponse = await fetch(`/api/groups/${foundGroup.id}/posts`);
          if (postsResponse.ok) {
            const postsData = await postsResponse.json();
            setPosts(postsData.posts || []);
          }
        }
      } catch (err) {
        console.error("Error fetching group:", err);
        setError("Failed to load group. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.slug) {
      fetchGroupAndPosts();
    }
  }, [params.slug]);

  const handleJoin = async () => {
    if (!group) return;
    
    try {
      const response = await fetch(`/api/groups/${group.id}/join`, {
        method: "POST",
      });
      
      if (!response.ok) throw new Error("Failed to join group");
      
      // Update the group state
      setGroup((prevGroup) => {
        if (!prevGroup) return null;
        return {
          ...prevGroup,
          isMember: true,
          role: "MEMBER",
          _count: {
            ...prevGroup._count,
            members: (prevGroup._count?.members || 0) + 1,
          },
        };
      });
    } catch (error) {
      console.error("Error joining group:", error);
      throw error;
    }
  };

  const handleLeave = async () => {
    if (!group || !session?.user?.id) return;
    
    try {
      const response = await fetch(`/api/groups/${group.id}/members?userId=${encodeURIComponent(session.user.id)}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to leave group");
      
      // Update the group state
      setGroup((prevGroup) => {
        if (!prevGroup) return null;
        return {
          ...prevGroup,
          isMember: false,
          role: null,
          _count: {
            ...prevGroup._count,
            members: Math.max((prevGroup._count?.members || 1) - 1, 0),
          },
        };
      });
    } catch (error) {
      console.error("Error leaving group:", error);
      throw error;
    }
  };

  const handleLike = async (postId: string) => {
    try {
      await fetch(`/api/posts/${postId}/reactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "LIKE" }),
      });
      
      // Update the post in the list
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                _count: {
                  ...post._count,
                  reactions: (post._count?.reactions || 0) + 1,
                },
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (error || !group) {
    return (
      <div className="space-y-6">
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
          {error || "Group not found"}
        </div>
        <Link
          href="/dashboard/groups"
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
          Back to Groups
        </Link>
      </div>
    );
  }

  const tabs = [
    {
      label: "Posts",
      href: `/dashboard/groups/${group.slug}`,
      count: group._count?.posts,
    },
    {
      label: "Members",
      href: `/dashboard/groups/${group.slug}/members`,
      count: group._count?.members,
    },
  ];

  if (group.isMember && (group.role === "ADMIN" || group.role === "MODERATOR")) {
    tabs.push({
      label: "Settings",
      href: `/dashboard/groups/${group.slug}/settings`,
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Link
          href="/dashboard/groups"
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
          Back to Groups
        </Link>
      </div>

      <GroupHeader
        group={group}
        onJoin={handleJoin}
        onLeave={handleLeave}
      />

      <GroupTabs slug={group.slug} tabs={tabs} />

      <div className="space-y-4">
        {group.isMember && (
          <div className="flex justify-end">
            <Link
              href={`/dashboard/groups/${group.slug}/posts/create`}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Create Post
            </Link>
          </div>
        )}

        {posts.length === 0 ? (
          <div className="rounded-lg border shadow-sm">
            <div className="p-6">
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-10 w-10 text-muted-foreground"
                >
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
                <h3 className="mt-4 text-lg font-medium">No posts yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {group.isMember
                    ? "Be the first to create a post in this group."
                    : "Join this group to create posts."}
                </p>
                {group.isMember && (
                  <Link
                    href={`/dashboard/groups/${group.slug}/posts/create`}
                    className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Create Post
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onComment={(postId) => {
                  router.push(`/dashboard/posts/${postId}`);
                }}
                onShare={(postId) => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/dashboard/posts/${postId}`
                  );
                  alert("Link copied to clipboard!");
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}