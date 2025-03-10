import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages | PropulsionSociety Live",
  description: "Your messages and conversations",
};

export default function MessagesPage() {
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
          <div className="border-b p-4">
            <div className="relative">
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
                placeholder="Search messages..."
                className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto p-2">
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
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium">No conversations yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Start a new conversation to connect with others
              </p>
              <button className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                New Message
              </button>
            </div>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex flex-col rounded-lg border shadow-sm md:col-span-2">
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
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
        </div>
      </div>
    </div>
  );
}