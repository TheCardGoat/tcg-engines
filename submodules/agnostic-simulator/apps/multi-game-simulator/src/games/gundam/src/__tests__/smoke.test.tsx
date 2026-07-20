// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { cleanup } from "@testing-library/react";

import { renderSimulator } from "../test/renderSimulator.tsx";
import { loadSetupDefault } from "../game/fixtures/setup-default.ts";

describe("SimulatorApp smoke", () => {
  let consoleErrorSpy: ReturnType<typeof vi.fn> | undefined;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    // Force RTL unmount now so any console.error raised during
    // cleanup is still captured by our spy — the module-level
    // afterEach(cleanup) registered by renderSimulator would
    // otherwise run AFTER this describe-scoped afterEach.
    cleanup();
    consoleErrorSpy?.mockRestore();
  });

  it("boots with the setup-default fixture without throwing or logging errors", async () => {
    const { container } = renderSimulator(loadSetupDefault);
    expect(container.firstChild).not.toBeNull();
    expect(container.querySelector("[data-sim-board]")).not.toBeNull();
    expect(container.querySelector("[data-testid='desktop-match-rail']")).not.toBeNull();
    expect(container.querySelector("[data-seat-side='top']")?.getAttribute("aria-label")).toBe(
      "Opponent board",
    );
    expect(container.querySelector("[data-seat-side='bottom']")?.getAttribute("aria-label")).toBe(
      "Active player board",
    );
    expect(container.querySelector("[data-testid='primary-action']")?.className).not.toContain(
      "absolute",
    );
    const selfBase = container.querySelector("[data-sim-zone-id='baseSection:player_one']");
    expect(selfBase?.closest("[data-zone-group='base-and-shields']")).not.toBeNull();
    expect(selfBase?.closest("[data-sim-zone-id='battleArea:player_one']")).toBeNull();
    expect(
      container
        .querySelector("[data-sim-zone-id='resourceArea:player_one']")
        ?.querySelector("[data-resource-capacity='6']"),
    ).not.toBeNull();

    // `game/adapter.ts` defers store notifications via `queueMicrotask`,
    // so any React warnings/errors triggered by the first projection
    // only reach console.error on the next microtask. Flush a couple
    // of microtasks before asserting.
    await Promise.resolve();
    await Promise.resolve();

    // Replaces the e2e smoke's pageerror/console-error watcher: React
    // pipes render-time throws and key warnings through console.error
    // in dev, so any uncaught issue lands here.
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });
});
