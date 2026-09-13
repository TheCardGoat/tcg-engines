// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import type { ReactNode } from "react";
import { afterEach, expect, it, vi } from "vitest";
import { installBrowserShims } from "../testing/browser-shims";
import { fetchSharedSimulatorRouteDataForRoute } from "../simulator/routeData";
import { SimulatorRouteModule } from "./simulator-route-module";
import { matchReturnUrl } from "./match-return-url";
const mounts = vi.hoisted(() => ({ provider: vi.fn(), page: vi.fn() }));
vi.mock("../simulator/routeRegistry", () => ({
  resolveSimulatorRoute: () => ({
    Providers: ({ children }: { children: ReactNode }) => {
      mounts.provider();
      return children;
    },
    Page: () => {
      mounts.page();
      return <h1>Game page</h1>;
    },
  }),
}));
vi.mock("../simulator/providers", () => ({
  SimulatorProviders: ({ children }: { children: ReactNode }) => children,
}));
vi.mock("../simulator/debug-export/SimulatorDebugExportContext", () => ({
  SimulatorDebugExportProvider: ({ children }: { children: ReactNode }) => children,
}));
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
it.each(["live-match", "match-landing"] as const)(
  "guards %s providers on failed bootstrap and retries the real loader",
  async (routeKind) => {
    installBrowserShims();
    const fetcher = vi.fn(async () => new Response(null, { status: 404 }));
    const router = createMemoryRouter([
      {
        path: "/",
        loader: ({ request }) =>
          fetchSharedSimulatorRouteDataForRoute({
            request,
            route: { gameSlug: "gundam", routeKind, matchId: "m1", gameId: "g1" },
            fetcher,
          }),
        element: <SimulatorRouteModule routeKind={routeKind} />,
      },
    ]);
    render(
      <MantineProvider>
        <RouterProvider router={router} />
      </MantineProvider>,
    );
    expect(await screen.findByRole("heading", { name: "Match unavailable" })).toBeTruthy();
    expect(mounts.provider).not.toHaveBeenCalled();
    expect(mounts.page).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));
    expect(fetcher).toHaveBeenCalledTimes(2);
    router.dispose();
  },
);
it("does not swallow a replay route's own error handling", async () => {
  installBrowserShims();
  const router = createMemoryRouter([
    {
      path: "/",
      loader: () => ({ gameSlug: "gundam", error: "Replay unavailable" }),
      element: <SimulatorRouteModule routeKind="replay" />,
    },
  ]);
  render(
    <MantineProvider>
      <RouterProvider router={router} />
    </MantineProvider>,
  );
  expect(await screen.findByRole("heading", { name: "Game page" })).toBeTruthy();
  expect(mounts.provider).toHaveBeenCalled();
  router.dispose();
});
it("preserves trusted return navigation without leaking session credentials", () => {
  expect(
    matchReturnUrl(
      "gundam",
      new URLSearchParams({
        returnTo: "https://tcg.online/gundam/matchmaking?mode=ranked&ticket=secret&role=player",
      }).toString(),
    ),
  ).toBe("https://tcg.online/gundam/matchmaking?mode=ranked");
  for (const returnTo of [
    "https://evil.example",
    "//evil.example",
    "javascript:alert(1)",
    "https://tcg.online@evil.example",
  ]) {
    expect(matchReturnUrl("gundam", new URLSearchParams({ returnTo }).toString())).toBe(
      "/gundam/matchmaking",
    );
  }
});
