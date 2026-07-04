import { Suspense, lazy, useMemo } from "react";
import { createBrowserRouter, RouterProvider, type RouteObject } from "react-router-dom";
import { normalizeRouterBasename } from "../../routes/router-paths.ts";
import { BoardPrototypePage } from "./pages/BoardPrototype.page.tsx";
import { OnePieceFixtureIndexPage, OnePieceFixturePage } from "./pages/FixtureRoutes.page.tsx";
import { OnePieceTestStatePage } from "./pages/TestState.page.tsx";

const OnePiecePracticePage = lazy(async () => {
  const module = await import("./pages/Practice.page.tsx");
  return { default: module.OnePiecePracticePage };
});

export const onePieceSimulatorRoutes: RouteObject[] = [
  {
    path: "/",
    element: <BoardPrototypePage />,
  },
  {
    path: "/play/practice",
    element: (
      <Suspense fallback={null}>
        <OnePiecePracticePage />
      </Suspense>
    ),
  },
  {
    path: "/tests",
    element: <OnePieceFixtureIndexPage />,
  },
  {
    path: "/tests/test-engine-state",
    element: <OnePieceTestStatePage />,
  },
  {
    path: "/tests/:fixtureId",
    element: <OnePieceFixturePage />,
  },
];

export function createOnePieceRouter(basename: string) {
  return createBrowserRouter(onePieceSimulatorRoutes, {
    basename: normalizeRouterBasename(basename),
  });
}

export interface RouterProps {
  basename?: string;
}

export function Router({ basename = "/one-piece/simulator" }: RouterProps) {
  const router = useMemo(() => createOnePieceRouter(basename), [basename]);
  return <RouterProvider router={router} />;
}
