import { Layout } from "@/components/Layout";
import { ElectorateDetailPage } from "@/pages/ElectorateDetailPage";
import { ElectorateDirectoryPage } from "@/pages/ElectorateDirectoryPage";
import { NationalOverviewPage } from "@/pages/NationalOverviewPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

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

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
