import type { ComponentType, ReactNode } from "react";
import type { RouteObject } from "react-router-dom";

import type {
  GameSlug,
  SimulatorRendererPackage,
  SimulatorRendererProps,
} from "@tcg/simulator-contract";
import { CyberpunkSimulatorProviders } from "../games/cyberpunk/App";
import { cyberpunkSimulatorRoutes } from "../games/cyberpunk/Router";
import { cyberpunkRendererPackage } from "../games/cyberpunk/cyberpunkRenderer";
import { GundamSimulatorProviders } from "../games/gundam/App";
import { gundamSimulatorRoutes } from "../games/gundam/Router";
import { OnePieceSimulatorProviders } from "../games/one-piece/App";
import { onePieceSimulatorRoutes } from "../games/one-piece/Router";

type RendererPackage = ComponentType<SimulatorRendererProps>;

export interface MountedSimulatorRoute {
  gameSlug: GameSlug;
  routeSegment: string;
  basename: string;
  Providers: ComponentType<{ children: ReactNode }>;
  routes: RouteObject[];
  rendererPackage?: SimulatorRendererPackage<RendererPackage>;
}

export const MOUNTED_SIMULATOR_ROUTES: readonly MountedSimulatorRoute[] = [
  {
    gameSlug: "one-piece",
    routeSegment: "simulator",
    basename: "/one-piece/simulator",
    Providers: OnePieceSimulatorProviders,
    routes: onePieceSimulatorRoutes,
  },
  {
    gameSlug: "gundam",
    routeSegment: "simulator",
    basename: "/gundam/simulator",
    Providers: GundamSimulatorProviders,
    routes: gundamSimulatorRoutes,
  },
  {
    gameSlug: "cyberpunk",
    routeSegment: "simulator",
    basename: "/cyberpunk/simulator",
    Providers: CyberpunkSimulatorProviders,
    routes: cyberpunkSimulatorRoutes,
    rendererPackage: cyberpunkRendererPackage,
  },
];

export function findMountedSimulatorRoute(pathValue: string): MountedSimulatorRoute | undefined {
  return MOUNTED_SIMULATOR_ROUTES.find((route) => {
    return pathValue === route.basename || pathValue.startsWith(`${route.basename}/`);
  });
}

export function findMountedSimulatorRouteForGame(
  gameSlug: GameSlug,
  routeSegment = "simulator",
): MountedSimulatorRoute | undefined {
  return MOUNTED_SIMULATOR_ROUTES.find(
    (route) => route.gameSlug === gameSlug && route.routeSegment === routeSegment,
  );
}

export function mountedSimulatorPath(gameSlug: GameSlug, routeSegment = "simulator"): string {
  const mounted = findMountedSimulatorRouteForGame(gameSlug, routeSegment);
  return mounted?.basename ?? `/${gameSlug}/${routeSegment}`;
}
