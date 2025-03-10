"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { formatRelative } from "date-fns";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  read: boolean;
  createdAt: string;
  sender: {
    id: string;
    name: string;
    image: string | null;
  };
  receiver: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface MessageThreadProps {
  userId: string;
}

export default function MessageThread({ userId }: MessageThreadProps) {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages for the conversation
  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`/api/messages?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch messages");
        const data = await response.json();
        setMessages(data);
        
        // Mark messages as read
        if (data.some(m => m.senderId === userId && !m.read)) {
          await fetch("/api/messages", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ senderId: userId }),
          });
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
    
    // Poll for new messages every 10 seconds
    const intervalId = setInterval(fetchMessages, 10000);
    return () => clearInterval(intervalId);
  }, [userId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a new message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !userId || !session?.user?.id) return;
    
    setIsSending(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          receiverId: userId,
        }),
      });
      
      if (!response.ok) throw new Error("Failed to send message");
      
      const sentMessage = await response.json();
      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  // Get the other user's details
  const otherUser = messages[0]?.senderId === session?.user?.id 
    ? messages[0]?.receiver 
    : messages[0]?.sender;

  if (!userId) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-16 w-16 text-muted-foreground"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <h3 className="mt-4 text-xl font-medium">Select a conversation</h3>
        <p className="mt-2 text-muted-foreground">
          Choose a conversation from the list or start a new one
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center border-b p-4">
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          {otherUser?.image ? (
            <Image
              src={otherUser.image}
              alt={otherUser.name || "User"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/10 text-primary">
              {otherUser?.name?.charAt(0) || "U"}
            </div>
          )}
        </div>
        <div className="ml-3">
          <p className="font-medium">{otherUser?.name || "User"}</p>
          <p className="text-xs text-muted-foreground">
            {messages.length > 0 ? `${messages.length} messages` : "No messages yet"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <p className="text-muted-foreground">No messages yet</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Send a message to start the conversation
              </p>
            </div>
          ) : (
            messages.map((message) => {
              const isCurrentUser = message.senderId === session?.user?.id;
              return (
                <div
                  key={message.id}
                  className={cn("flex", isCurrentUser ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-lg px-4 py-2",
                      isCurrentUser
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <p className="break-words">{message.content}</p>
                    <p className="mt-1 text-right text-xs opacity-70">
                      {formatRelative(new Date(message.createdAt), new Date())}
                      {isCurrentUser && (
                        <span className="ml-1">
                          {message.read ? "• Read" : "• Sent"}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t p-4">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={isSending}
          />
          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            disabled={!newMessage.trim() || isSending}
          >
            {isSending ? (
              <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-t-2 border-primary-foreground"></div>
            ) : (
              "Send"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}