"use client";

import { useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";

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

interface MemberListProps {
  members: Member[];
  currentUserId: string;
  isAdmin: boolean;
  onRemoveMember?: (userId: string) => Promise<void>;
  onUpdateRole?: (userId: string, role: string) => Promise<void>;
}

export default function MemberList({
  members,
  currentUserId,
  isAdmin,
  onRemoveMember,
  onUpdateRole,
}: MemberListProps) {
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleRemove = async (userId: string) => {
    if (!onRemoveMember) return;
    
    try {
      setIsUpdating(userId);
      await onRemoveMember(userId);
    } catch (error) {
      console.error("Error removing member:", error);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRoleChange = async (userId: string, role: string) => {
    if (!onUpdateRole) return;
    
    try {
      setIsUpdating(userId);
      await onUpdateRole(userId, role);
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setIsUpdating(null);
    }
  };

  // Sort members by role (Admin first, then Moderator, then Member)
  const sortedMembers = [...members].sort((a, b) => {
    const roleOrder = { ADMIN: 0, MODERATOR: 1, MEMBER: 2 };
    return roleOrder[a.role as keyof typeof roleOrder] - roleOrder[b.role as keyof typeof roleOrder];
  });

  return (
    <div className="space-y-4">
      {sortedMembers.map((member) => {
        const isCurrentUser = member.user.id === currentUserId;
        const isOwnerOrAdmin = member.role === "ADMIN";
        const canManage = isAdmin && !isCurrentUser && !isOwnerOrAdmin;
        const isExpanded = expandedMember === member.id;

        return (
          <div
            key={member.id}
            className="rounded-lg border bg-card shadow-sm overflow-hidden"
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    {member.user.image ? (
                      <Image
                        src={member.user.image}
                        alt={member.user.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
                        {member.user.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center">
                      <p className="font-medium">
                        {member.user.name}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            (You)
                          </span>
                        )}
                      </p>
                      <span
                        className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                          member.role === "ADMIN"
                            ? "bg-primary/10 text-primary"
                            : member.role === "MODERATOR"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {member.role}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Joined {formatDistanceToNow(new Date(member.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                
                {canManage && (
                  <button
                    onClick={() => setExpandedMember(isExpanded ? null : member.id)}
                    className="rounded-md p-1 hover:bg-muted"
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`h-5 w-5 transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                )}
              </div>
              
              {isExpanded && (
                <div className="mt-4 space-y-3 border-t pt-3">
                  <div>
                    <label className="text-sm font-medium">Role</label>
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.user.id, e.target.value)}
                      disabled={isUpdating === member.user.id}
                      className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="MEMBER">Member</option>
                      <option value="MODERATOR">Moderator</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleRemove(member.user.id)}
                      disabled={isUpdating === member.user.id}
                      className="rounded-md bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-50"
                    >
                      {isUpdating === member.user.id ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
      
      {members.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No members found</p>
        </div>
      )}
    </div>
  );
}