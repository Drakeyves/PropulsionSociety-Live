"use client";

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

interface GroupCardProps {
  group: Group;
  onJoin?: (groupId: string) => Promise<void>;
  onLeave?: (groupId: string) => Promise<void>;
}

export default function GroupCard({ group, onJoin, onLeave }: GroupCardProps) {
  const handleJoin = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (onJoin) {
      try {
        await onJoin(group.id);
      } catch (error) {
        console.error("Error joining group:", error);
      }
    }
  };

  const handleLeave = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (onLeave) {
      try {
        await onLeave(group.id);
      } catch (error) {
        console.error("Error leaving group:", error);
      }
    }
  };

  return (
    <Link
      href={`/dashboard/groups/${group.slug}`}
      className="block rounded-lg border bg-card shadow-sm transition-shadow hover:shadow-md"
      aria-label={`View ${group.name} group details`}
    >
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary text-lg font-semibold">
              {group.name.charAt(0)}
            </div>
            <div>
              <h3 className="font-medium">
                {group.name}
                {group.isPrivate && (
                  <span className="ml-2 text-xs rounded-full bg-secondary px-2 py-0.5 text-secondary-foreground">
                    Private
                  </span>
                )}
              </h3>
              <p className="text-xs text-muted-foreground">
                Created {formatDistanceToNow(new Date(group.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          {/* Join/Leave button */}
          {!group.isMember && onJoin && (
            <button
              onClick={handleJoin}
              className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              Join
            </button>
          )}
          
          {group.isMember && onLeave && group.role !== "ADMIN" && (
            <button
              onClick={handleLeave}
              className="rounded-md border px-3 py-1 text-xs font-medium hover:bg-muted"
            >
              Leave
            </button>
          )}
        </div>
        
        <div className="mt-3">
          <p className="text-sm line-clamp-2">
            {group.description || "No description provided."}
          </p>
        </div>
        
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1 h-3.5 w-3.5"
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
                className="mr-1 h-3.5 w-3.5"
              >
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              </svg>
              <span>{group._count?.posts || 0} posts</span>
            </div>
          </div>
          
          <div className="flex items-center">
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
    </Link>
  );
}