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

interface GroupHeaderProps {
  group: Group;
  onJoin?: () => Promise<void>;
  onLeave?: () => Promise<void>;
}

export default function GroupHeader({ group, onJoin, onLeave }: GroupHeaderProps) {
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const handleJoin = async () => {
    if (!onJoin) return;
    
    setIsJoining(true);
    try {
      await onJoin();
    } catch (error) {
      console.error("Error joining group:", error);
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!onLeave) return;
    
    setIsLeaving(true);
    try {
      await onLeave();
    } catch (error) {
      console.error("Error leaving group:", error);
    } finally {
      setIsLeaving(false);
    }
  };

  const isAdmin = group.role === "ADMIN";
  const isModerator = group.role === "MODERATOR";
  const canManage = isAdmin || isModerator;

  return (
    <div className="rounded-lg border bg-card shadow-sm">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary text-2xl font-semibold">
              {group.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{group.name}</h1>
                {group.isPrivate && (
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                    Private
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Created {formatDistanceToNow(new Date(group.createdAt), { addSuffix: true })}
              </p>
              <div className="mt-1 flex items-center text-sm">
                <div className="relative h-5 w-5 overflow-hidden rounded-full">
                  {group.owner.image ? (
                    <Image
                      src={group.owner.image}
                      alt={group.owner.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary text-xs">
                      {group.owner.name.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="ml-1">by {group.owner.name}</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {!group.isMember && onJoin && (
              <button
                onClick={handleJoin}
                disabled={isJoining}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                {isJoining ? "Joining..." : group.isPrivate ? "Request to Join" : "Join Group"}
              </button>
            )}
            
            {group.isMember && !isAdmin && onLeave && (
              <button
                onClick={handleLeave}
                disabled={isLeaving}
                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
              >
                {isLeaving ? "Leaving..." : "Leave Group"}
              </button>
            )}
            
            {canManage && (
              <Link
                href={`/dashboard/groups/${group.slug}/settings`}
                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
              >
                Manage Group
              </Link>
            )}
          </div>
        </div>
        
        {group.description && (
          <div className="mt-4">
            <p className="text-sm">{group.description}</p>
          </div>
        )}
        
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center">
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
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span>{group._count?.members || 0} members</span>
          </div>
          
          <div className="flex items-center">
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
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
            </svg>
            <span>{group._count?.posts || 0} posts</span>
          </div>
          
          {group.isMember && (
            <div className="flex items-center">
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
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>
                {isAdmin ? "Admin" : isModerator ? "Moderator" : "Member"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}