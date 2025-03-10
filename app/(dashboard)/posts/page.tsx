import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Posts | PropulsionSociety Live",
  description: "Create and manage your posts",
};

export default function PostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
          <p className="text-muted-foreground">
            Create and manage your posts
          </p>
        </div>
        <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Create Post
        </button>
      </div>

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
              Create your first post to share with the community
            </p>
            <button className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
              Create Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}