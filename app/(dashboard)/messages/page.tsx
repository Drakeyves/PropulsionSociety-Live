"use client";

import { useState } from "react";
import ConversationList from "@/components/messaging/ConversationList";
import MessageThread from "@/components/messaging/MessageThread";

export default function MessagesPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>(undefined);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col space-y-4">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground">
          Manage your conversations and messages
        </p>
      </div>

      <div className="grid flex-1 gap-4 md:grid-cols-3">
        {/* Conversations List */}
        <div className="flex flex-col rounded-lg border shadow-sm md:col-span-1">
          <ConversationList 
            selectedUserId={selectedUserId}
            onSelectConversation={setSelectedUserId}
          />
        </div>

        {/* Message Thread */}
        <div className="flex flex-col rounded-lg border shadow-sm md:col-span-2">
          <MessageThread userId={selectedUserId || ""} />
        </div>
      </div>
    </div>
  );
}