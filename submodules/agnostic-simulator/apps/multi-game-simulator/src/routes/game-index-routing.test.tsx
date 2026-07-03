// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { cleanup, render, screen, waitFor } from "@testing-library/react";

import App from "../App.tsx";

vi.mock("../components/MountedBrowserSimulator", () => ({
  MountedBrowserSimulator({
    basename,
    routes,
  }: {
    basename: string;
    routes: readonly { path?: string }[];
  }) {
    return (
      <div
        data-testid="mounted-simulator-route"
        data-basename={basename}
        data-route-paths={routes.map((route) => route.path ?? "").join(",")}
      />
    );
  },
}));

describe("multi-game index routing", () => {
  beforeEach(() => {
    installBrowserShims();
    window.history.pushState({}, "", "/");
  });

  afterEach(() => {
    cleanup();
    window.history.pushState({}, "", "/");
  });

  it("uses the real visual fixture index as the One Piece game index", async () => {
    window.history.pushState({}, "", "/one-piece");

    render(<App initialPath="/one-piece" />);

    await waitFor(() => expect(window.location.pathname).toBe("/one-piece/simulator/tests"));
    const mountedSimulator = await screen.findByTestId("mounted-simulator-route");
    expect(mountedSimulator.getAttribute("data-basename")).toBe("/one-piece/simulator");
    expect(mountedSimulator.getAttribute("data-route-paths")).toContain("/tests");
  });

  it("redirects trailing-slash game indexes to the visual fixture index", async () => {
    window.history.pushState({}, "", "/one-piece/");
    const replaceState = vi.spyOn(window.history, "replaceState");

    render(<App initialPath="/one-piece/" />);

    await waitFor(() => expect(window.location.pathname).toBe("/one-piece/simulator/tests"));
    expect(replaceState).toHaveBeenCalledWith({}, "", "/one-piece/simulator/tests");
    const mountedSimulator = await screen.findByTestId("mounted-simulator-route");
    expect(mountedSimulator.getAttribute("data-basename")).toBe("/one-piece/simulator");
  });

  it("uses the real visual fixture index as the Cyberpunk game index", async () => {
    window.history.pushState({}, "", "/cyberpunk");

    render(<App initialPath="/cyberpunk" />);

    await waitFor(() => expect(window.location.pathname).toBe("/cyberpunk/simulator/tests"));
    const mountedSimulator = await screen.findByTestId("mounted-simulator-route");
    expect(mountedSimulator.getAttribute("data-basename")).toBe("/cyberpunk/simulator");
    expect(mountedSimulator.getAttribute("data-route-paths")).toContain("/tests");
  });

  it("uses the real visual fixture index as the Gundam game index", async () => {
    window.history.pushState({}, "", "/gundam");

    render(<App initialPath="/gundam" />);

    await waitFor(() => expect(window.location.pathname).toBe("/gundam/simulator/tests"));
    const mountedSimulator = await screen.findByTestId("mounted-simulator-route");
    expect(mountedSimulator.getAttribute("data-basename")).toBe("/gundam/simulator");
    expect(mountedSimulator.getAttribute("data-route-paths")).toContain("/tests");
  });

  it("does not expose a fake Lorcana game fixture route", async () => {
    window.history.pushState({}, "", "/lorcana");

    render(<App initialPath="/lorcana" />);

    expect(await screen.findByText("Page not found")).not.toBeNull();
    expect(screen.queryByText("Lorcana ordering prompt")).toBeNull();
  });
});

function installBrowserShims() {
  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  }

  window.HTMLElement.prototype.scrollIntoView = () => {};
  window.scrollTo = () => {};

  if (!window.ResizeObserver) {
    window.ResizeObserver = class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
}
