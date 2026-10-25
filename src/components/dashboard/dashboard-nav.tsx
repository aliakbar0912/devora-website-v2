"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CreditCard, Cpu, LayoutDashboard, Loader2, LogOut, MonitorSmartphone } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/subscription", label: "Subscription", icon: CreditCard },
  { href: "/dashboard/devices", label: "Devices", icon: MonitorSmartphone },
  { href: "/dashboard/usage", label: "Usage", icon: Cpu },
];

export function DashboardNav({
  user,
}: {
  user: { email: string; name?: string | null };
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const displayName = user.name?.trim() || user.email;
  const initial = (displayName.trim()?.[0] ?? "?").toUpperCase();

  async function signOut() {
    if (signingOut) return;
    setSigningOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.replace("/");
      router.refresh();
    }
  }

  return (
    <nav aria-label="Dashboard" className="flex flex-col">
      {/* Identity — Claude/Devin-style account block pinned above the menu */}
      <div className="mb-5 hidden items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 lg:flex">
        <span
          aria-hidden="true"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-white/[0.14] to-white/[0.05] text-sm font-semibold text-zinc-200 ring-1 ring-inset ring-white/[0.08]"
        >
          {initial}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium leading-tight text-foreground">
            {displayName}
          </p>
          <p className="truncate text-xs leading-tight text-muted-foreground">
            {user.name?.trim() ? user.email : "Devora account"}
          </p>
        </div>
      </div>

      <p className="hidden px-3 pb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-zinc-600 lg:block">
        Account
      </p>

      <div className="flex flex-row gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {LINKS.map((link) => {
          const active =
            link.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-white/[0.06] font-medium text-foreground"
                  : "text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200"
              )}
            >
              <link.icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors",
                  active ? "text-zinc-300" : "text-zinc-600 group-hover:text-zinc-400"
                )}
                aria-hidden="true"
              />
              {link.label}
            </Link>
          );
        })}
      </div>

      <div className="mt-4 hidden border-t border-white/[0.06] pt-4 lg:block">
        <button
          type="button"
          onClick={signOut}
          disabled={signingOut}
          className="group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/[0.03] hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {signingOut ? (
            <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
          ) : (
            <LogOut className="h-4 w-4 shrink-0 text-zinc-600 transition-colors group-hover:text-zinc-400" aria-hidden="true" />
          )}
          Sign out
        </button>
      </div>

      {/* Mobile: sign out lives at the end of the scrollable row */}
      <button
        type="button"
        onClick={signOut}
        disabled={signingOut}
        className="mt-1 flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-white/[0.03] hover:text-zinc-200 disabled:cursor-not-allowed disabled:opacity-60 lg:hidden"
      >
        {signingOut ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin" aria-hidden="true" />
        ) : (
          <LogOut className="h-4 w-4 shrink-0 text-zinc-600" aria-hidden="true" />
        )}
        Sign out
      </button>
    </nav>
  );
}
