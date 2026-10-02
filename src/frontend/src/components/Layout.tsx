import { useIsAdmin } from "@/hooks/useElectorates";
import { cn } from "@/lib/utils";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BadgeCheck,
  LayoutDashboard,
  LogIn,
  LogOut,
  MapPinned,
  ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  {
    to: "/",
    label: "National Overview",
    icon: <LayoutDashboard className="size-4" />,
    exact: true,
  },
  {
    to: "/electorates",
    label: "Electorate Directory",
    icon: <MapPinned className="size-4" />,
  },
];

function shortenPrincipal(principal: string): string {
  if (principal.length <= 14) return principal;
  return `${principal.slice(0, 6)}…${principal.slice(-5)}`;
}

export function Layout() {
  const { identity, isAuthenticated, login, clear, isLoggingIn } =
    useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const principal = identity?.getPrincipal().toText();

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        data-ocid="app.sidebar"
        className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground lg:flex"
      >
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-5">
          <span className="flex size-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <ShieldCheck className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold leading-tight">
              PNG Campaign Desk
            </p>
            <p className="truncate text-[11px] uppercase tracking-[0.14em] text-sidebar-foreground/60">
              Electorate Intelligence
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Primary">
          <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/50">
            Navigation
          </p>
          {NAV_ITEMS.map((item) => {
            const active = item.exact
              ? pathname === item.to
              : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                data-ocid={`nav.${item.to === "/" ? "overview" : "electorates"}.link`}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                {item.icon}
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border px-5 py-4">
          <p className="text-[11px] uppercase tracking-[0.14em] text-sidebar-foreground/50">
            Coverage
          </p>
          <p className="mt-1 text-xs text-sidebar-foreground/70">
            All 22 provinces · 118 electorates
          </p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col lg:pl-64">
        <header
          data-ocid="app.header"
          className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-4 shadow-subtle sm:px-6"
        >
          <div className="flex min-w-0 items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground lg:hidden">
              <ShieldCheck className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold leading-tight text-foreground">
                Papua New Guinea · National Campaign
              </p>
              <p className="hidden truncate text-xs text-muted-foreground sm:block">
                Electorate support and campaign activity tracking
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin ? (
              <span
                data-ocid="app.admin_badge"
                className="hidden items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/25 sm:inline-flex"
              >
                <BadgeCheck className="size-3.5" />
                Admin
              </span>
            ) : null}

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span
                  data-ocid="app.principal"
                  className="hidden max-w-[14rem] truncate rounded-md bg-muted px-2.5 py-1 font-mono text-xs text-muted-foreground md:inline-block"
                  title={principal}
                >
                  {principal ? shortenPrincipal(principal) : "Signed in"}
                </span>
                <button
                  type="button"
                  data-ocid="app.signout_button"
                  onClick={clear}
                  className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                data-ocid="app.signin_button"
                onClick={() => login()}
                disabled={isLoggingIn}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
              >
                <LogIn className="size-4" />
                {isLoggingIn ? "Signing in…" : "Sign in"}
              </button>
            )}
          </div>
        </header>

        <nav
          className="flex items-center gap-1 overflow-x-auto border-b border-border bg-card px-4 py-2 lg:hidden"
          aria-label="Primary mobile"
        >
          {NAV_ITEMS.map((item) => {
            const active = item.exact
              ? pathname === item.to
              : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:bg-secondary/60",
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <main className="flex-1 bg-background px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </main>

        <footer className="border-t border-border bg-card px-4 py-4 sm:px-6">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
            <p className="flex items-center gap-1.5">
              <Activity className="size-3.5" />
              Public read-only · Administrator editing
            </p>
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-foreground"
            >
              © {new Date().getFullYear()}. Built with love using caffeine.ai
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
