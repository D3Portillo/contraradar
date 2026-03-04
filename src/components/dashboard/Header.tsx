"use client";

import { UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="h-16 border-b bg-card px-6 flex items-center justify-between">
      <div>
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </div>
      <UserButton afterSignOutUrl="/" />
    </header>
  );
}
