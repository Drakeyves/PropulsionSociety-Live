"use client";

import { useRouter } from "next/navigation";
import PostEditor from "@/components/posts/PostEditor";

export default function CreatePostPage() {
  const router = useRouter();

  const handleCreatePost = async (post: { title: string; content: string }) => {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const data = await response.json();
      router.push(`/dashboard/posts/${data.id}`);
      router.refresh();
    } catch (error) {
      console.error("Error creating post:", error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Create Post</h1>
        <p className="text-muted-foreground">
          Share your thoughts with the community
        </p>
      </div>

      <div className="rounded-lg border shadow-sm">
        <div className="p-6">
          <PostEditor onSubmit={handleCreatePost} />
        </div>
      </div>
    </div>
  );
}