import { useEffect, useRef, type ComponentType, type ReactNode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { createBrowserRouter, RouterProvider, type RouteObject } from "react-router-dom";
import { normalizeRouterBasename } from "../router-paths";

export interface MountedBrowserSimulatorProps {
  basename: string;
  routes: RouteObject[];
  Providers: ComponentType<{ children: ReactNode }>;
}

export function MountedBrowserSimulator({
  basename,
  routes,
  Providers,
}: MountedBrowserSimulatorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const normalizedBasename = normalizeRouterBasename(basename);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return undefined;
    }

    const root: Root = createRoot(container);
    const router = createBrowserRouter(routes, {
      basename: normalizedBasename,
    });

    root.render(
      <Providers>
        <RouterProvider router={router} />
      </Providers>,
    );

    return () => {
      root.unmount();
      router.dispose();
    };
  }, [Providers, normalizedBasename, routes]);

  return <div ref={containerRef} data-mounted-browser-simulator={normalizedBasename} />;
}
