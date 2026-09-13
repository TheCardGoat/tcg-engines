import { useEffect, useState, type ComponentType } from "react";

import { makeSimulatorRouteLoader } from "./simulator-route-loader";

export const loader = makeSimulatorRouteLoader("test-fixture");

export default function SimulatorTestFixtureRoute() {
  const [FixtureClient, setFixtureClient] = useState<ComponentType | undefined>();

  useEffect(() => {
    let active = true;
    void import("./simulator-test-fixture-client").then((module) => {
      if (active) setFixtureClient(() => module.default);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!FixtureClient) {
    return (
      <main
        className="flex min-h-svh items-center justify-center bg-[var(--surface)] text-sm text-[var(--muted)]"
        data-testid="simulator-route-loading"
      >
        Loading fixture…
      </main>
    );
  }

  return <FixtureClient />;
}
