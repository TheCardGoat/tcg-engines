import { useEffect, useState, type ComponentType } from "react";

import { makeSimulatorRouteLoader } from "./simulator-route-loader";

export const loader = makeSimulatorRouteLoader("test-demo");

export default function SimulatorTestDemoRoute() {
  const [DemoClient, setDemoClient] = useState<ComponentType | undefined>();

  useEffect(() => {
    let active = true;
    void import("./simulator-test-demo-client").then((module) => {
      if (active) setDemoClient(() => module.default);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!DemoClient) {
    return (
      <main
        className="flex min-h-svh items-center justify-center bg-[var(--surface)] text-sm text-[var(--muted)]"
        data-testid="simulator-route-loading"
      >
        Loading demo…
      </main>
    );
  }

  return <DemoClient />;
}
