import type { ComponentType, ReactNode } from "react";
import type { RouteObject } from "react-router-dom";

import type { GameSlug } from "@tcg/simulator-contract";
import { CyberpunkSimulatorProviders } from "../games/cyberpunk/App";
import { cyberpunkSimulatorRoutes } from "../games/cyberpunk/Router";
import { GundamSimulatorProviders } from "../games/gundam/App";
import { gundamSimulatorRoutes } from "../games/gundam/Router";

export interface MountedSimulatorRoute {
  gameSlug: GameSlug;
  routeSegment: string;
  basename: string;
  Providers: ComponentType<{ children: ReactNode }>;
  routes: RouteObject[];
}

export const MOUNTED_SIMULATOR_ROUTES: readonly MountedSimulatorRoute[] = [
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
