import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";
import { SimulatorAuthContextProvider } from "../providers/auth-context";
import type { SimulatorAuthContextValue } from "../providers";
import { SimulatorSettingsProvider, useSimulatorSettings } from "./SimulatorSettingsProvider";
import type { SimulatorSettings } from "./simulator-settings";

describe("SimulatorSettingsProvider", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test("ignores stale hydration after a local volume edit", async () => {
    const getSettings = deferred<Response>();
    const fetchMock = vi.fn((_: RequestInfo | URL, init?: RequestInit) => {
      if (init?.method === "PUT") {
        return Promise.resolve(new Response("{}", { status: 200 }));
      }
      return getSettings.promise;
    });
    vi.stubGlobal("fetch", fetchMock);

    renderSettingsProbe(authContext({ isAuthenticated: true, userId: "user-1" }));

    fireEvent.click(screen.getByRole("button", { name: "set volume" }));
    expect(screen.getByTestId("volume").textContent).toBe("80");

    await act(async () => {
      getSettings.resolve(
        new Response(JSON.stringify({ gameplaySettings: { soundVolume: 20 } }), { status: 200 }),
      );
      await Promise.resolve();
    });

    expect(screen.getByTestId("volume").textContent).toBe("80");

    await act(async () => {
      vi.advanceTimersByTime(500);
      await Promise.resolve();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/v1/users/me/settings"),
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ gameplaySettings: { soundVolume: 80 } }),
      }),
    );
  });

  test("uses server-provided settings without a client hydration fetch", async () => {
    const fetchMock = vi.fn(() => Promise.resolve(new Response("{}", { status: 200 })));
    vi.stubGlobal("fetch", fetchMock);

    renderSettingsProbe(authContext({ isAuthenticated: true, userId: "user-1" }), {
      soundVolume: 35,
    });

    expect(screen.getByTestId("volume").textContent).toBe("35");

    await act(async () => {
      await Promise.resolve();
    });

    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("does not re-apply initial settings after an authenticated user switch", async () => {
    const getSettings = deferred<Response>();
    const fetchMock = vi.fn((_: RequestInfo | URL, init?: RequestInit) => {
      if (init?.method === "PUT") {
        return Promise.resolve(new Response("{}", { status: 200 }));
      }
      return getSettings.promise;
    });
    vi.stubGlobal("fetch", fetchMock);

    const { rerender } = renderSettingsProbe(
      authContext({ isAuthenticated: true, userId: "user-1" }),
      {
        soundVolume: 35,
      },
    );
    fireEvent.click(screen.getByRole("button", { name: "set volume" }));
    expect(screen.getByTestId("volume").textContent).toBe("80");

    rerender(
      <SimulatorAuthContextProvider
        value={authContext({ isAuthenticated: true, userId: "user-2" })}
      >
        <SimulatorSettingsProvider initialSettings={{ soundVolume: 35 }}>
          <SettingsProbe />
        </SimulatorSettingsProvider>
      </SimulatorAuthContextProvider>,
    );

    expect(screen.getByTestId("volume").textContent).toBe("80");
    expect(fetchMock.mock.calls.some(([, init]) => init?.method !== "PUT")).toBe(true);
  });

  test("clears a pending server save when authentication is lost", async () => {
    const fetchMock = vi.fn((_: RequestInfo | URL, init?: RequestInit) => {
      if (init?.method === "PUT") {
        return Promise.resolve(new Response("{}", { status: 200 }));
      }
      return Promise.resolve(
        new Response(JSON.stringify({ gameplaySettings: { soundVolume: 50 } }), { status: 200 }),
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    const { rerender } = renderSettingsProbe(
      authContext({ isAuthenticated: true, userId: "user-1" }),
    );

    fireEvent.click(screen.getByRole("button", { name: "set volume" }));
    expect(screen.getByTestId("volume").textContent).toBe("80");

    rerender(
      <SimulatorAuthContextProvider value={authContext({ isAuthenticated: false, userId: null })}>
        <SimulatorSettingsProvider>
          <SettingsProbe />
        </SimulatorSettingsProvider>
      </SimulatorAuthContextProvider>,
    );

    await act(async () => {
      vi.advanceTimersByTime(500);
      await Promise.resolve();
    });

    expect(fetchMock.mock.calls.some(([, init]) => init?.method === "PUT")).toBe(false);
  });
});

function renderSettingsProbe(
  auth: SimulatorAuthContextValue,
  initialSettings: SimulatorSettings | null = null,
) {
  return render(
    <SimulatorAuthContextProvider value={auth}>
      <SimulatorSettingsProvider initialSettings={initialSettings}>
        <SettingsProbe />
      </SimulatorSettingsProvider>
    </SimulatorAuthContextProvider>,
  );
}

function SettingsProbe() {
  const {
    settings: { soundVolume },
    setSoundVolume,
  } = useSimulatorSettings();

  return (
    <section>
      <output data-testid="volume">{soundVolume}</output>
      <button type="button" onClick={() => setSoundVolume(80)}>
        set volume
      </button>
    </section>
  );
}

function authContext({
  isAuthenticated,
  userId,
}: {
  readonly isAuthenticated: boolean;
  readonly userId: string | null;
}): SimulatorAuthContextValue {
  return {
    auth: null,
    userId,
    displayName: userId,
    isAuthenticated,
    subscriptionTier: null,
    isPremium: false,
  };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}
