"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import GroupHeader from "@/components/groups/GroupHeader";
import GroupTabs from "@/components/groups/GroupTabs";
import GroupForm from "@/components/groups/GroupForm";

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

export default function GroupSettingsPage({ params }: { params: { slug: string } }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [group, setGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      setIsLoading(true);
      try {
        // Find the group by slug
        const groupsResponse = await fetch(`/api/groups?search=${params.slug}`);
        if (!groupsResponse.ok) throw new Error("Failed to fetch group");
        
        const groupsData = await groupsResponse.json();
        const foundGroup = groupsData.groups?.find((g: Group) => g.slug === params.slug);
        
        if (!foundGroup) {
          throw new Error("Group not found");
        }
        
        setGroup(foundGroup);
      } catch (err) {
        console.error("Error fetching group:", err);
        setError("Failed to load group. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.slug) {
      fetchGroup();
    }
  }, [params.slug]);

  const handleUpdateGroup = async (data: {
    name: string;
    description: string;
    isPrivate: boolean;
  }) => {
    if (!group) return;
    
    try {
      const response = await fetch(`/api/groups/${group.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update group");
      }
      
      const updatedGroup = await response.json();
      setGroup(updatedGroup);
      
      // If the slug changed, redirect to the new URL
      if (updatedGroup.slug !== params.slug) {
        router.push(`/dashboard/groups/${updatedGroup.slug}/settings`);
      }
    } catch (error) {
      console.error("Error updating group:", error);
      throw error;
    }
  };

  const handleDeleteGroup = async () => {
    if (!group || !confirm("Are you sure you want to delete this group? This action cannot be undone.")) {
      return;
    }
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/groups/${group.id}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to delete group");
      
      router.push("/dashboard/groups");
    } catch (error) {
      console.error("Error deleting group:", error);
      alert("Failed to delete group. Please try again.");
    } finally {
      setIsDeleting(false);
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

  // Check if user has permission to access settings
  const isAdmin = group.role === "ADMIN";
  const isModerator = group.role === "MODERATOR";
  const canManage = isAdmin || isModerator;

  if (!canManage) {
    return (
      <div className="space-y-6">
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
          You do not have permission to access group settings
        </div>
        <Link
          href={`/dashboard/groups/${group.slug}`}
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
          Back to Group
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
    {
      label: "Settings",
      href: `/dashboard/groups/${group.slug}/settings`,
    },
  ];

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

      <GroupHeader group={group} />

      <GroupTabs slug={group.slug} tabs={tabs} />

      <div className="space-y-6">
        <div className="rounded-lg border shadow-sm">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Group Settings</h2>
            <GroupForm
              initialData={{
                name: group.name,
                description: group.description || "",
                isPrivate: group.isPrivate,
              }}
              onSubmit={handleUpdateGroup}
              submitLabel="Save Changes"
              isEdit={true}
            />
          </div>
        </div>

        {isAdmin && (
          <div className="rounded-lg border border-red-200 bg-red-50 shadow-sm dark:border-red-900/20 dark:bg-red-900/10">
            <div className="p-6">
              <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">
                Danger Zone
              </h2>
              <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                Once you delete a group, there is no going back. Please be certain.
              </p>
              <button
                onClick={handleDeleteGroup}
                disabled={isDeleting}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Group"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}