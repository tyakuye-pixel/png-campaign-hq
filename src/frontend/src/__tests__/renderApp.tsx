import { Layout } from "@/components/Layout";
import { ElectorateDetailPage } from "@/pages/ElectorateDetailPage";
import { ElectorateDirectoryPage } from "@/pages/ElectorateDirectoryPage";
import { NationalOverviewPage } from "@/pages/NationalOverviewPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { render } from "@testing-library/react";
import { coreInfrastructureState } from "./coreInfrastructureState";
import type { MockBackend } from "./mockBackend";

export interface RenderOptions {
  backend: MockBackend;
  isAuthenticated?: boolean;
  initialPath?: string;
}

/**
 * Builds the same route tree the app declares in `App.tsx`, but on a memory
 * history so a test can start at any route. The app's own router is a module
 * singleton, so reusing it would leak navigation between tests.
 */
function buildTestRouter(initialPath: string) {
  const rootRoute = createRootRoute({ component: () => <Outlet /> });
  const layoutRoute = createRoute({
    getParentRoute: () => rootRoute,
    id: "layout",
    component: Layout,
  });
  const overviewRoute = createRoute({
    getParentRoute: () => layoutRoute,
    path: "/",
    component: NationalOverviewPage,
  });
  const directoryRoute = createRoute({
    getParentRoute: () => layoutRoute,
    path: "/electorates",
    component: ElectorateDirectoryPage,
  });
  const detailRoute = createRoute({
    getParentRoute: () => layoutRoute,
    path: "/electorates/$id",
    component: ElectorateDetailPage,
  });
  const routeTree = rootRoute.addChildren([
    layoutRoute.addChildren([overviewRoute, directoryRoute, detailRoute]),
  ]);
  return createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  });
}

export interface RenderAppResult extends ReturnType<typeof render> {
  router: ReturnType<typeof buildTestRouter>;
}

/**
 * Renders the app's real pages and providers against a typed local actor mock.
 * `@caffeineai/core-infrastructure` is mocked in `vitest.setup.ts`; this sets
 * the holder that mock reads from before mounting.
 */
export function renderApp({
  backend,
  isAuthenticated = false,
  initialPath = "/",
}: RenderOptions): RenderAppResult {
  coreInfrastructureState.backend = backend;
  coreInfrastructureState.isAuthenticated = isAuthenticated;

  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const router = buildTestRouter(initialPath);

  const result = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );

  return Object.assign(result, { router });
}
