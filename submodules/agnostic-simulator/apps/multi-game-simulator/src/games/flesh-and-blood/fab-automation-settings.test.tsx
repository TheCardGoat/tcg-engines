// @vitest-environment jsdom
import { CanonicalUserSettingsSchema } from "@tcg/game-page-contract";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

import {
  EMPTY_SIMULATOR_AUTH_CONTEXT,
  SimulatorAuthContextProvider,
} from "../../simulator/providers/auth-context.tsx";
import {
  EMPTY_SIMULATOR_USER_SETTINGS_CONTEXT,
  SimulatorUserSettingsContextProvider,
} from "../../simulator/providers/user-settings-context.tsx";
import {
  FAB_PRIORITY_MODE_STORAGE_KEY,
  FAB_TRIGGER_DECLINES_STORAGE_KEY,
  LEGACY_FAB_PRIORITY_MODE_STORAGE_KEY,
  FabAutomationSettingsProvider,
  useFabAutomationSettings,
} from "./fab-automation-settings.tsx";

function Probe() {
  const {
    priorityMode,
    declinedCanonicalIds,
    ready,
    setPriorityMode,
    setCardOptionalMode,
    readSeed,
  } = useFabAutomationSettings();
  return (
    <>
      <button
        type="button"
        data-testid="mode"
        disabled={!ready}
        onClick={() => setPriorityMode(priorityMode === "auto-pass" ? "always-hold" : "auto-pass")}
      >
        {ready ? priorityMode : "loading"}
      </button>
      <button
        type="button"
        data-testid="decline-card-a"
        onClick={() =>
          setCardOptionalMode("card-a", declinedCanonicalIds.has("card-a") ? "ask" : "auto-decline")
        }
      >
        {declinedCanonicalIds.has("card-a") ? "declined" : "asking"}
      </button>
      <button
        type="button"
        data-testid="force-decline-card-a"
        onClick={() => setCardOptionalMode("card-a", "auto-decline")}
      >
        force
      </button>
      <button
        type="button"
        data-testid="accept-card-a"
        onClick={() => setCardOptionalMode("card-a", "auto-accept")}
      >
        accept
      </button>
      <output data-testid="seed">{JSON.stringify(readSeed())}</output>
    </>
  );
}

function renderProvider({
  authenticated = false,
  serverSimulator,
}: {
  readonly authenticated?: boolean;
  readonly serverSimulator?: {
    readonly priorityMode?: "auto-pass" | "always-hold" | "play-and-skip";
    readonly autoSelectSingletonTargets?: boolean;
    readonly optionalTriggerDeclines?: readonly string[];
    readonly optionalTriggerAccepts?: readonly string[];
  };
} = {}) {
  return render(
    <SimulatorAuthContextProvider
      value={
        authenticated
          ? {
              ...EMPTY_SIMULATOR_AUTH_CONTEXT,
              auth: { user: { id: "user_1" } } as never,
              userId: "user_1",
              isAuthenticated: true,
            }
          : EMPTY_SIMULATOR_AUTH_CONTEXT
      }
    >
      <SimulatorUserSettingsContextProvider
        value={{
          ...EMPTY_SIMULATOR_USER_SETTINGS_CONTEXT,
          viewerSettings:
            serverSimulator === undefined
              ? null
              : CanonicalUserSettingsSchema.parse({
                  playerSettings: {},
                  gameSettings: {
                    "flesh-and-blood": {
                      simulator: {
                        priorityMode: serverSimulator.priorityMode,
                        autoSelectSingletonTargets: serverSimulator.autoSelectSingletonTargets,
                        optionalTriggerDeclines: serverSimulator.optionalTriggerDeclines,
                        optionalTriggerAccepts: serverSimulator.optionalTriggerAccepts,
                      },
                    },
                  },
                }),
        }}
      >
        <FabAutomationSettingsProvider>
          <Probe />
        </FabAutomationSettingsProvider>
      </SimulatorUserSettingsContextProvider>
    </SimulatorAuthContextProvider>,
  );
}

function storedDeclines(): readonly string[] {
  const raw = window.localStorage.getItem(FAB_TRIGGER_DECLINES_STORAGE_KEY);
  return raw ? (JSON.parse(raw) as string[]) : [];
}

describe("FabAutomationSettingsProvider", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    window.localStorage.clear();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ success: true }), { status: 200 })),
    );
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("defaults to auto-pass and uses the browser fallback for anonymous players", () => {
    const first = renderProvider();
    expect(screen.getByTestId("mode").textContent).toBe("auto-pass");
    expect(screen.getByTestId("decline-card-a").textContent).toBe("asking");
    expect((screen.getByTestId("mode") as HTMLButtonElement).disabled).toBe(false);
    first.unmount();

    window.localStorage.setItem(FAB_PRIORITY_MODE_STORAGE_KEY, "always-hold");
    window.localStorage.setItem(FAB_TRIGGER_DECLINES_STORAGE_KEY, JSON.stringify(["card-a"]));
    renderProvider();
    expect(screen.getByTestId("mode").textContent).toBe("always-hold");
    expect(screen.getByTestId("decline-card-a").textContent).toBe("declined");
  });

  it("migrates the legacy priority-mode key on read and writes only the canonical key", () => {
    // Legacy key only: the provider still honors the saved mode.
    window.localStorage.setItem(LEGACY_FAB_PRIORITY_MODE_STORAGE_KEY, "always-hold");
    const legacyOnly = renderProvider();
    expect(screen.getByTestId("mode").textContent).toBe("always-hold");
    legacyOnly.unmount();

    // Canonical key wins when both exist.
    window.localStorage.setItem(FAB_PRIORITY_MODE_STORAGE_KEY, "play-and-skip");
    renderProvider();
    expect(screen.getByTestId("mode").textContent).toBe("play-and-skip");

    // New writes land on the canonical key only; the legacy value is left
    // in place and never consulted again once the canonical key is set.
    fireEvent.click(screen.getByTestId("mode"));
    expect(window.localStorage.getItem(FAB_PRIORITY_MODE_STORAGE_KEY)).toBe("auto-pass");
    expect(window.localStorage.getItem(LEGACY_FAB_PRIORITY_MODE_STORAGE_KEY)).toBe("always-hold");
  });

  it("gives the canonical account value precedence over browser storage", () => {
    window.localStorage.setItem(FAB_PRIORITY_MODE_STORAGE_KEY, "always-hold");
    window.localStorage.setItem(FAB_TRIGGER_DECLINES_STORAGE_KEY, JSON.stringify(["card-b"]));
    renderProvider({
      authenticated: true,
      serverSimulator: { priorityMode: "auto-pass", optionalTriggerDeclines: ["card-a"] },
    });

    expect(screen.getByTestId("mode").textContent).toBe("auto-pass");
    expect(screen.getByTestId("decline-card-a").textContent).toBe("declined");
    expect(window.localStorage.getItem(FAB_PRIORITY_MODE_STORAGE_KEY)).toBe("auto-pass");
    expect(storedDeclines()).toEqual(["card-a"]);
  });

  it("accepts the play-and-skip mode from storage and from the canonical account value", () => {
    window.localStorage.setItem(FAB_PRIORITY_MODE_STORAGE_KEY, "play-and-skip");
    const anonymous = renderProvider();
    expect(screen.getByTestId("mode").textContent).toBe("play-and-skip");
    anonymous.unmount();

    renderProvider({
      authenticated: true,
      serverSimulator: { priorityMode: "play-and-skip" },
    });
    expect(screen.getByTestId("mode").textContent).toBe("play-and-skip");
    expect(window.localStorage.getItem(FAB_PRIORITY_MODE_STORAGE_KEY)).toBe("play-and-skip");
  });

  it("waits for account hydration before becoming ready for authenticated players", async () => {
    vi.useRealTimers();
    window.localStorage.setItem(FAB_PRIORITY_MODE_STORAGE_KEY, "always-hold");
    let resolveFetch: ((response: Response) => void) | undefined;
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise<Response>((resolve) => {
            resolveFetch = resolve;
          }),
      ),
    );

    renderProvider({ authenticated: true });
    expect(screen.getByTestId("mode").textContent).toBe("loading");
    expect((screen.getByTestId("mode") as HTMLButtonElement).disabled).toBe(true);

    await act(async () => {
      resolveFetch?.(
        new Response(
          JSON.stringify({
            gameSettings: {
              "flesh-and-blood": {
                simulator: { priorityMode: "always-hold", optionalTriggerDeclines: ["card-a"] },
              },
            },
          }),
          { status: 200 },
        ),
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId("mode").textContent).toBe("always-hold");
    });
    expect((screen.getByTestId("mode") as HTMLButtonElement).disabled).toBe(false);
    expect(screen.getByTestId("decline-card-a").textContent).toBe("declined");
    expect(window.localStorage.getItem(FAB_PRIORITY_MODE_STORAGE_KEY)).toBe("always-hold");
    expect(storedDeclines()).toEqual(["card-a"]);
  });

  it("falls back to browser storage when authenticated hydration fails", async () => {
    vi.useRealTimers();
    window.localStorage.setItem(FAB_PRIORITY_MODE_STORAGE_KEY, "always-hold");
    window.localStorage.setItem(FAB_TRIGGER_DECLINES_STORAGE_KEY, JSON.stringify(["card-a"]));
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }),
    );

    renderProvider({ authenticated: true });
    expect(screen.getByTestId("mode").textContent).toBe("loading");

    await waitFor(() => {
      expect(screen.getByTestId("mode").textContent).toBe("always-hold");
    });
    expect((screen.getByTestId("mode") as HTMLButtonElement).disabled).toBe(false);
    expect(screen.getByTestId("decline-card-a").textContent).toBe("declined");
  });

  it("preserves an authenticated account opt-out during hydration", () => {
    renderProvider({
      authenticated: true,
      serverSimulator: {
        priorityMode: "auto-pass",
        autoSelectSingletonTargets: false,
      },
    });

    expect(screen.getByTestId("seed").textContent).toContain('"autoSelectSingletonTargets":false');
  });

  it("updates the mode locally immediately and persists the full simulator patch", async () => {
    renderProvider({
      authenticated: true,
      serverSimulator: { priorityMode: "auto-pass", optionalTriggerDeclines: ["card-b"] },
    });
    fireEvent.click(screen.getByTestId("mode"));

    expect(screen.getByTestId("mode").textContent).toBe("always-hold");
    expect(window.localStorage.getItem(FAB_PRIORITY_MODE_STORAGE_KEY)).toBe("always-hold");

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/v1/users/me/settings"),
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({
          gameSettings: {
            "flesh-and-blood": {
              simulator: {
                priorityMode: "always-hold",
                countdownSpeed: "normal",
                autoOrderTriggers: false,
                autoSelectSingletonTargets: true,
                playAndSkipHoldCardIds: [],
                opponentTriggerYieldCardIds: [],
                optionalTriggerDeclines: ["card-b"],
                optionalTriggerAccepts: [],
              },
            },
          },
        }),
      }),
    );
  });

  it("accumulates card declines into the full-list PUT and removes them on disable", async () => {
    renderProvider({
      authenticated: true,
      serverSimulator: { priorityMode: "auto-pass", optionalTriggerDeclines: ["card-b"] },
    });

    fireEvent.click(screen.getByTestId("decline-card-a"));
    expect(screen.getByTestId("decline-card-a").textContent).toBe("declined");
    expect(screen.getByTestId("seed").textContent).toBe(
      JSON.stringify({
        priorityMode: "auto-pass",
        countdownSpeed: "normal",
        autoOrderTriggers: false,
        autoSelectSingletonTargets: true,
        playAndSkipHoldCardIds: [],
        opponentTriggerYieldCardIds: [],
        optionalTriggerDeclines: ["card-b", "card-a"],
        optionalTriggerAccepts: [],
      }),
    );

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/v1/users/me/settings"),
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({
          gameSettings: {
            "flesh-and-blood": {
              simulator: {
                priorityMode: "auto-pass",
                countdownSpeed: "normal",
                autoOrderTriggers: false,
                autoSelectSingletonTargets: true,
                playAndSkipHoldCardIds: [],
                opponentTriggerYieldCardIds: [],
                optionalTriggerDeclines: ["card-b", "card-a"],
                optionalTriggerAccepts: [],
              },
            },
          },
        }),
      }),
    );

    fireEvent.click(screen.getByTestId("decline-card-a"));
    expect(screen.getByTestId("decline-card-a").textContent).toBe("asking");

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(fetch).toHaveBeenLastCalledWith(
      expect.stringContaining("/v1/users/me/settings"),
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({
          gameSettings: {
            "flesh-and-blood": {
              simulator: {
                priorityMode: "auto-pass",
                countdownSpeed: "normal",
                autoOrderTriggers: false,
                autoSelectSingletonTargets: true,
                playAndSkipHoldCardIds: [],
                opponentTriggerYieldCardIds: [],
                optionalTriggerDeclines: ["card-b"],
                optionalTriggerAccepts: [],
              },
            },
          },
        }),
      }),
    );
  });

  it("ignores duplicate decline entries and never blocks local state on a failed PUT", async () => {
    renderProvider({
      authenticated: true,
      serverSimulator: { priorityMode: "auto-pass" },
    });

    // Enabling an already-declined canonical id must stay a single entry.
    fireEvent.click(screen.getByTestId("decline-card-a"));
    fireEvent.click(screen.getByTestId("force-decline-card-a"));
    expect(JSON.parse(screen.getByTestId("seed").textContent as string)).toMatchObject({
      priorityMode: "auto-pass",
      optionalTriggerDeclines: ["card-a"],
    });

    // A rejected PUT is logged, never thrown into the toggle path: the local
    // flip still applies immediately.
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.mocked(fetch).mockRejectedValue(new Error("save failed") as never);
    fireEvent.click(screen.getByTestId("decline-card-a"));
    expect(screen.getByTestId("decline-card-a").textContent).toBe("asking");

    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(consoleError).toHaveBeenCalledWith(
      "[fab-automation-settings] Failed to save setting:",
      expect.any(Error),
    );
    consoleError.mockRestore();
  });

  it("keeps always-use and always-decline mutually exclusive for one card", () => {
    renderProvider({
      serverSimulator: { priorityMode: "auto-pass", optionalTriggerDeclines: ["card-a"] },
    });

    fireEvent.click(screen.getByTestId("accept-card-a"));

    expect(JSON.parse(screen.getByTestId("seed").textContent as string)).toMatchObject({
      optionalTriggerDeclines: [],
      optionalTriggerAccepts: ["card-a"],
    });
  });

  it("surfaces an HTTP error status instead of treating a rejected save as persisted", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    renderProvider({
      authenticated: true,
      serverSimulator: { priorityMode: "auto-pass" },
    });

    // fetch resolves normally on HTTP errors; only the status carries the
    // failure, so an unchecked response makes a rejected save look persisted.
    vi.mocked(fetch).mockResolvedValue(new Response("nope", { status: 500 }) as never);
    fireEvent.click(screen.getByTestId("mode"));
    expect(screen.getByTestId("mode").textContent).toBe("always-hold");

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(consoleError).toHaveBeenCalledWith(expect.stringContaining("500"));
    consoleError.mockRestore();
  });

  it("flushes a pending debounced save on unmount instead of dropping it", () => {
    const view = renderProvider({
      authenticated: true,
      serverSimulator: { priorityMode: "auto-pass" },
    });

    fireEvent.click(screen.getByTestId("mode"));
    expect(fetch).not.toHaveBeenCalled();

    // The match unmounts inside the debounce window: the account PUT must
    // still leave — the account column is the source of truth for new games.
    view.unmount();

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/v1/users/me/settings"),
      expect.objectContaining({
        method: "PUT",
        keepalive: true,
        body: JSON.stringify({
          gameSettings: {
            "flesh-and-blood": {
              simulator: {
                priorityMode: "always-hold",
                countdownSpeed: "normal",
                autoOrderTriggers: false,
                autoSelectSingletonTargets: true,
                playAndSkipHoldCardIds: [],
                opponentTriggerYieldCardIds: [],
                optionalTriggerDeclines: [],
                optionalTriggerAccepts: [],
              },
            },
          },
        }),
      }),
    );

    // The unmount flush must also cancel the still-armed debounce timer;
    // otherwise the callback re-fires at T+500ms and duplicates the PUT.
    vi.advanceTimersByTime(500);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("flushes a pending debounced save on pagehide without duplicating it", () => {
    renderProvider({
      authenticated: true,
      serverSimulator: { priorityMode: "auto-pass" },
    });

    fireEvent.click(screen.getByTestId("mode"));
    expect(fetch).not.toHaveBeenCalled();

    // Tab close and reload never run React cleanup; pagehide is the last
    // reliable hook and must flush the pending PUT exactly once.
    fireEvent(window, new Event("pagehide"));

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/v1/users/me/settings"),
      expect.objectContaining({ method: "PUT", keepalive: true }),
    );

    vi.advanceTimersByTime(500);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
});
