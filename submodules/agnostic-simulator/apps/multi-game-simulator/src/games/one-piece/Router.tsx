import { Suspense, lazy } from "react";
import type { JSX, LazyExoticComponent } from "react";
import type { RouteObject } from "react-router-dom";
import { createSimulatorBrowserRouter, SimulatorRouterProvider } from "../../lib/router.tsx";

const OnePiecePracticePage = lazy(async () => {
  const module = await import("./pages/Practice.page.tsx");
  return { default: module.OnePiecePracticePage };
});
const OnePieceFixtureIndexPage = lazy(async () => {
  const module = await import("./pages/FixtureRoutes.page.tsx");
  return { default: module.OnePieceFixtureIndexPage };
});
const OnePieceFixturePage = lazy(async () => {
  const module = await import("./pages/FixtureRoutes.page.tsx");
  return { default: module.OnePieceFixturePage };
});
const OnePieceTestStatePage = lazy(async () => {
  const module = await import("./pages/TestState.page.tsx");
  return { default: module.OnePieceTestStatePage };
});

function onePieceLazyPage(Page: LazyExoticComponent<() => JSX.Element>) {
  return (
    <Suspense fallback={null}>
      <Page />
    </Suspense>
  );
}

export const onePieceSimulatorRoutes: RouteObject[] = [
  {
    path: "/",
    element: onePieceLazyPage(OnePiecePracticePage),
  },
  {
    path: "/play/practice",
    element: onePieceLazyPage(OnePiecePracticePage),
  },
  {
    path: "/tests",
    element: onePieceLazyPage(OnePieceFixtureIndexPage),
  },
  {
    path: "/tests/test-engine-state",
    element: onePieceLazyPage(OnePieceTestStatePage),
  },
  {
    path: "/tests/:fixtureId",
    element: onePieceLazyPage(OnePieceFixturePage),
  },
];

export function createOnePieceRouter(basename: string) {
  return createSimulatorBrowserRouter(onePieceSimulatorRoutes, basename);
}

export interface RouterProps {
  basename?: string;
}

export function Router({ basename = "/one-piece/simulator" }: RouterProps) {
  return <SimulatorRouterProvider basename={basename} routes={onePieceSimulatorRoutes} />;
}
