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

  test("flushes the final edit on page exit without waiting for the debounce", async () => {
    const fetchMock = vi.fn(() => Promise.resolve(new Response("{}", { status: 200 })));
    vi.stubGlobal("fetch", fetchMock);
    renderSettingsProbe(authContext({ isAuthenticated: true, userId: "user-1" }), {
      soundVolume: 50,
      cardInteractionMode: "detailed",
      animationSpeed: "normal",
      paymentSelectionMode: "automatic",
    });
    fireEvent.click(screen.getByRole("button", { name: "set volume" }));
    fireEvent(window, new Event("pagehide"));
    expect(fetchMock).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        method: "PUT",
        keepalive: true,
        body: JSON.stringify({
          playerSettings: {
            soundVolume: 80,
            cardInteractionMode: "detailed",
            animationSpeed: "normal",
            paymentSelectionMode: "automatic",
          },
        }),
      }),
    );
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  test("ignores stale hydration after local settings edits", async () => {
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
    fireEvent.click(screen.getByRole("button", { name: "use quick actions" }));
    expect(screen.getByTestId("volume").textContent).toBe("80");
    expect(screen.getByTestId("card-mode").textContent).toBe("quick");

    await act(async () => {
      getSettings.resolve(
        new Response(JSON.stringify({ gameplaySettings: { soundVolume: 20 } }), { status: 200 }),
      );
      await Promise.resolve();
    });

    expect(screen.getByTestId("volume").textContent).toBe("80");
    expect(screen.getByTestId("card-mode").textContent).toBe("quick");

    await act(async () => {
      vi.advanceTimersByTime(500);
      await Promise.resolve();
    });

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/v1/users/me/settings"),
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({
          playerSettings: {
            soundVolume: 80,
            cardInteractionMode: "quick",
            animationSpeed: "normal",
            paymentSelectionMode: "automatic",
          },
        }),
      }),
    );
  });

  test("uses server-provided settings without a client hydration fetch", async () => {
    const fetchMock = vi.fn(() => Promise.resolve(new Response("{}", { status: 200 })));
    vi.stubGlobal("fetch", fetchMock);

    renderSettingsProbe(authContext({ isAuthenticated: true, userId: "user-1" }), {
      soundVolume: 35,
      cardInteractionMode: "quick",
      animationSpeed: "slow",
      paymentSelectionMode: "automatic",
    });

    expect(screen.getByTestId("volume").textContent).toBe("35");
    expect(screen.getByTestId("card-mode").textContent).toBe("quick");
    expect(screen.getByTestId("animation-speed").textContent).toBe("slow");

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
        cardInteractionMode: "detailed",
        animationSpeed: "normal",
        paymentSelectionMode: "automatic",
      },
    );
    fireEvent.click(screen.getByRole("button", { name: "set volume" }));
    expect(screen.getByTestId("volume").textContent).toBe("80");

    rerender(
      <SimulatorAuthContextProvider
        value={authContext({ isAuthenticated: true, userId: "user-2" })}
      >
        <SimulatorSettingsProvider
          initialSettings={{
            soundVolume: 35,
            cardInteractionMode: "detailed",
            animationSpeed: "normal",
            paymentSelectionMode: "automatic",
          }}
        >
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
    settings: { soundVolume, cardInteractionMode, animationSpeed },
    setSoundVolume,
    setCardInteractionMode,
    setAnimationSpeed,
  } = useSimulatorSettings();

  return (
    <section>
      <output data-testid="volume">{soundVolume}</output>
      <output data-testid="card-mode">{cardInteractionMode}</output>
      <output data-testid="animation-speed">{animationSpeed}</output>
      <button type="button" onClick={() => setSoundVolume(80)}>
        set volume
      </button>
      <button type="button" onClick={() => setCardInteractionMode("quick")}>
        use quick actions
      </button>
      <button type="button" onClick={() => setAnimationSpeed("slow")}>
        set slow animations
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
