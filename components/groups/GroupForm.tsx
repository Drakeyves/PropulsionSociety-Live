"use client";

import { useState } from "react";

interface GroupFormProps {
  onSubmit: (data: { name: string; description: string; isPrivate: boolean }) => Promise<void>;
  initialData?: {
    name: string;
    description: string;
    isPrivate: boolean;
  };
  submitLabel?: string;
  isEdit?: boolean;
}

export default function GroupForm({
  onSubmit,
  initialData = { name: "", description: "", isPrivate: false },
  submitLabel = "Create Group",
  isEdit = false,
}: GroupFormProps) {
  const [name, setName] = useState(initialData.name);
  const [description, setDescription] = useState(initialData.description);
  const [isPrivate, setIsPrivate] = useState(initialData.isPrivate);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate inputs
    if (!name.trim()) {
      setError("Group name is required");
      return;
    }
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      await onSubmit({ name, description, isPrivate });
      if (!isEdit) {
        // Reset form after successful submission for new groups
        setName("");
        setDescription("");
        setIsPrivate(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to save group. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-500 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          Group Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Enter group name"
          disabled={isSubmitting}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Describe your group..."
          disabled={isSubmitting}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          id="isPrivate"
          type="checkbox"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          disabled={isSubmitting}
        />
        <label htmlFor="isPrivate" className="text-sm font-medium">
          Private Group
        </label>
      </div>
      
      <div className="pt-2">
        <p className="text-xs text-muted-foreground mb-4">
          {isPrivate
            ? "Private groups are only visible to members. New members must be approved by admins."
            : "Public groups are visible to everyone. Anyone can join without approval."}
        </p>
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}