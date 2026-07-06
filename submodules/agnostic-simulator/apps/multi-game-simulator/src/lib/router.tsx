import { useEffect, useMemo } from "react";
import { createBrowserRouter, RouterProvider, type RouteObject } from "react-router-dom";

import { normalizeRouterBasename } from "../routes/router-paths.ts";
import { SimulatorAudioBridgeProvider, useSimulatorAudio } from "../simulator/audio";
import {
  SimulatorAuthContextProvider,
  useSimulatorAuth,
} from "../simulator/providers/auth-context";
import { SimulatorSettingsBridgeProvider, useSimulatorSettings } from "../simulator/settings";

export function createSimulatorBrowserRouter(routes: RouteObject[], basename: string) {
  return createBrowserRouter(routes, {
    basename: normalizeRouterBasename(basename),
  });
}

export interface SimulatorRouterProviderProps {
  basename: string;
  routes: RouteObject[];
}

export function SimulatorRouterProvider({ basename, routes }: SimulatorRouterProviderProps) {
  const router = useMemo(() => createSimulatorBrowserRouter(routes, basename), [basename, routes]);
  const auth = useSimulatorAuth();
  const settingsContext = useSimulatorSettings();
  const audioContext = useSimulatorAudio();
  useEffect(() => () => router.dispose(), [router]);

  return (
    <SimulatorAuthContextProvider value={auth}>
      <SimulatorSettingsBridgeProvider value={settingsContext}>
        <SimulatorAudioBridgeProvider value={audioContext}>
          <RouterProvider router={router} />
        </SimulatorAudioBridgeProvider>
      </SimulatorSettingsBridgeProvider>
    </SimulatorAuthContextProvider>
  );
}
