"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import GroupCard from "@/components/groups/GroupCard";

interface Group {
  id: string;
  name: string;
  description: string | null;
  slug: string;
  isPrivate: boolean;
  createdAt: string;
  owner: {
    id: string;
    name: string;
    image: string | null;
  };
  isMember?: boolean;
  role?: string | null;
  _count?: {
    members: number;
    posts: number;
  };
}

export default function GroupsPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "my">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true);
      try {
        const url = new URL("/api/groups", window.location.origin);
        if (filter === "my") {
          url.searchParams.append("myGroups", "true");
        }
        if (search) {
          url.searchParams.append("search", search);
        }
        
        const response = await fetch(url.toString());
        if (!response.ok) throw new Error("Failed to fetch groups");
        
        const data = await response.json();
        setGroups(data.groups || []);
      } catch (error) {
        console.error("Error fetching groups:", error);
        setError("Failed to load groups. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, [filter, search]);

  const handleJoin = async (groupId: string) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/join`, {
        method: "POST",
      });
      
      if (!response.ok) throw new Error("Failed to join group");
      
      // Update the group in the list
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === groupId
            ? { ...group, isMember: true, role: "MEMBER" }
            : group
        )
      );
    } catch (error) {
      console.error("Error joining group:", error);
      throw error;
    }
  };

  const handleLeave = async (groupId: string) => {
    try {
      const response = await fetch(`/api/groups/${groupId}/members?userId=${encodeURIComponent(groups.find(g => g.id === groupId)?.owner.id || "")}`, {
        method: "DELETE",
      });
      
      if (!response.ok) throw new Error("Failed to leave group");
      
      // Update the group in the list
      setGroups((prevGroups) =>
        prevGroups.map((group) =>
          group.id === groupId
            ? { ...group, isMember: false, role: null }
            : group
        )
      );
    } catch (error) {
      console.error("Error leaving group:", error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Groups</h1>
          <p className="text-muted-foreground">
            Join and manage your groups
          </p>
        </div>
        <Link
          href="/dashboard/groups/create"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Create Group
        </Link>
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
        <div className="relative flex-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            placeholder="Search groups..."
            className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-l-md px-4 py-2 text-sm font-medium ${
              filter === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            All Groups
          </button>
          <button
            onClick={() => setFilter("my")}
            className={`rounded-r-md px-4 py-2 text-sm font-medium ${
              filter === "my"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            My Groups
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      ) : groups.length === 0 ? (
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
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <h3 className="mt-4 text-lg font-medium">No groups found</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {filter === "my"
                  ? "You haven't joined any groups yet."
                  : search
                  ? `No groups found matching "${search}".`
                  : "Create a group or join existing ones to connect with others."}
              </p>
              <div className="mt-4 flex gap-2">
                <Link
                  href="/dashboard/groups/create"
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                >
                  Create Group
                </Link>
                {filter === "my" && (
                  <button
                    onClick={() => setFilter("all")}
                    className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90"
                  >
                    Discover Groups
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onJoin={handleJoin}
              onLeave={handleLeave}
            />
          ))}
        </div>
      )}
    </div>
  );
}