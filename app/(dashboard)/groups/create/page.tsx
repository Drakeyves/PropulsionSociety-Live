"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import GroupForm from "@/components/groups/GroupForm";

export default function CreateGroupPage() {
  const router = useRouter();

  const handleCreateGroup = async (data: {
    name: string;
    description: string;
    isPrivate: boolean;
  }) => {
    try {
      const response = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create group");
      }

      const group = await response.json();
      router.push(`/dashboard/groups/${group.slug}`);
    } catch (error) {
      console.error("Error creating group:", error);
      throw error;
    }
  };

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

      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Create Group</h1>
        <p className="text-muted-foreground">
          Create a new group to connect with others
        </p>
      </div>

      <div className="rounded-lg border shadow-sm">
        <div className="p-6">
          <GroupForm onSubmit={handleCreateGroup} />
        </div>
      </div>
    </div>
  );
}