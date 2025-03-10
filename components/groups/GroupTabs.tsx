"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Tab {
  label: string;
  href: string;
  count?: number;
}

interface GroupTabsProps {
  slug: string;
  tabs: Tab[];
}

export default function GroupTabs({ slug, tabs }: GroupTabsProps) {
  const pathname = usePathname();

  return (
    <div className="border-b">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium border-b-2 -mb-px whitespace-nowrap",
              pathname === tab.href
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
                {tab.count}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}