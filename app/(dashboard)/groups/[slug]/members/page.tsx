"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import GroupHeader from "@/components/groups/GroupHeader";
import GroupTabs from "@/components/groups/GroupTabs";
import MemberList from "@/components/groups/MemberList";

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

interface User {
  id: string;
  name: string;
  image: string | null;
  email: string | null;
}

interface Member {
  id: string;
  role: string;
  createdAt: string;
  user: User;
}

export default function GroupMembersPage({ params }: { params: { slug: string } }) {
  const { data: session } = useSession();
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroupAndMembers = async () => {
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
        
        // Then, fetch the group's members
        const membersResponse = await fetch(`/api/groups/${foundGroup.id}/members`);
        if (!membersResponse.ok) throw new Error("Failed to fetch members");
        
        const membersData = await membersResponse.json();
        setMembers(membersData.members || []);
      } catch (err) {
        console.error("Error fetching group members:", err);
        setError("Failed to load group members. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.slug) {
      fetchGroupAndMembers();
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
      
      // Refresh the members list
      if (session?.user) {
        setMembers((prevMembers) => [
          ...prevMembers,
          {
            id: `temp-${Date.now()}`,
            role: "MEMBER",
            createdAt: new Date().toISOString(),
            user: {
              id: session.user.id,
              name: session.user.name || "",
              image: session.user.image,
              email: session.user.email,
            },
          },
        ]);
      }
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
      
      // Remove the user from the members list
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.user.id !== session.user.id)
      );
    } catch (error) {
      console.error("Error leaving group:", error);
      throw error;
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!group) return;
    
    try {
      const response = await fetch(`/api/groups/${group.id}/members?userId=${encodeURIComponent(userId)}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to remove member");
      
      // Update the members list
      setMembers((prevMembers) =>
        prevMembers.filter((member) => member.user.id !== userId)
      );
      
      // Update the group member count
      setGroup((prevGroup) => {
        if (!prevGroup) return null;
        return {
          ...prevGroup,
          _count: {
            ...prevGroup._count,
            members: Math.max((prevGroup._count?.members || 1) - 1, 0),
          },
        };
      });
    } catch (error) {
      console.error("Error removing member:", error);
      throw error;
    }
  };

  const handleUpdateRole = async (userId: string, role: string) => {
    if (!group) return;
    
    try {
      const response = await fetch(`/api/groups/${group.id}/members`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, role }),
      });
      
      if (!response.ok) throw new Error("Failed to update role");
      
      // Update the members list
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.user.id === userId ? { ...member, role } : member
        )
      );
    } catch (error) {
      console.error("Error updating role:", error);
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

  const isAdmin = group.role === "ADMIN";

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
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Members</h2>
          {isAdmin && (
            <Link
              href={`/dashboard/groups/${group.slug}/invite`}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Invite Members
            </Link>
          )}
        </div>

        {session?.user && (
          <MemberList
            members={members}
            currentUserId={session.user.id}
            isAdmin={isAdmin}
            onRemoveMember={isAdmin ? handleRemoveMember : undefined}
            onUpdateRole={isAdmin ? handleUpdateRole : undefined}
          />
        )}
      </div>
    </div>
  );
}