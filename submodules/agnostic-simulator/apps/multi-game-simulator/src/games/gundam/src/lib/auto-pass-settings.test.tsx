// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";

import {
  EMPTY_SIMULATOR_AUTH_CONTEXT,
  SimulatorAuthContextProvider,
} from "../../../../simulator/providers/auth-context.tsx";
import {
  EMPTY_SIMULATOR_USER_SETTINGS_CONTEXT,
  SimulatorUserSettingsContextProvider,
} from "../../../../simulator/providers/user-settings-context.tsx";
import {
  AUTO_PASS_WHEN_NO_VALID_ACTION_STORAGE_KEY,
  AutoPassWhenNoValidActionProvider,
  useAutoPassWhenNoValidAction,
} from "./auto-pass-settings.tsx";

function Probe() {
  const { enabled, ready, setEnabled } = useAutoPassWhenNoValidAction();
  return (
    <button type="button" disabled={!ready} onClick={() => setEnabled(!enabled)}>
      {ready ? (enabled ? "enabled" : "disabled") : "loading"}
    </button>
  );
}

function renderProvider({
  authenticated = false,
  serverValue,
}: {
  readonly authenticated?: boolean;
  readonly serverValue?: boolean;
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
            serverValue === undefined
              ? null
              : {
                  playerSettings: {},
                  gameSettings: {
                    gundam: {
                      simulator: { autoPassWhenNoValidAction: serverValue },
                    },
                  },
                },
        }}
      >
        <AutoPassWhenNoValidActionProvider>
          <Probe />
        </AutoPassWhenNoValidActionProvider>
      </SimulatorUserSettingsContextProvider>
    </SimulatorAuthContextProvider>,
  );
}

describe("AutoPassWhenNoValidActionProvider", () => {
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

  it("defaults to enabled and uses the browser fallback for anonymous players", () => {
    const first = renderProvider();
    expect(screen.getByRole("button").textContent).toBe("enabled");
    expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(false);
    first.unmount();

    window.localStorage.setItem(AUTO_PASS_WHEN_NO_VALID_ACTION_STORAGE_KEY, "off");
    renderProvider();
    expect(screen.getByRole("button").textContent).toBe("disabled");
  });

  it("gives the canonical account value precedence over browser storage", () => {
    window.localStorage.setItem(AUTO_PASS_WHEN_NO_VALID_ACTION_STORAGE_KEY, "off");
    renderProvider({ authenticated: true, serverValue: true });

    expect(screen.getByRole("button").textContent).toBe("enabled");
    expect(window.localStorage.getItem(AUTO_PASS_WHEN_NO_VALID_ACTION_STORAGE_KEY)).toBe("on");
  });

  it("waits for account hydration before becoming ready for authenticated players", async () => {
    vi.useRealTimers();
    window.localStorage.setItem(AUTO_PASS_WHEN_NO_VALID_ACTION_STORAGE_KEY, "on");
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
    expect(screen.getByRole("button").textContent).toBe("loading");
    expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);

    await act(async () => {
      resolveFetch?.(
        new Response(
          JSON.stringify({
            gameSettings: {
              gundam: {
                simulator: { autoPassWhenNoValidAction: false },
              },
            },
          }),
          { status: 200 },
        ),
      );
    });

    await waitFor(() => {
      expect(screen.getByRole("button").textContent).toBe("disabled");
    });
    expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(false);
    expect(window.localStorage.getItem(AUTO_PASS_WHEN_NO_VALID_ACTION_STORAGE_KEY)).toBe("off");
  });

  it("falls back to browser storage when authenticated hydration fails", async () => {
    vi.useRealTimers();
    window.localStorage.setItem(AUTO_PASS_WHEN_NO_VALID_ACTION_STORAGE_KEY, "off");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new Error("network down");
      }),
    );

    renderProvider({ authenticated: true });
    expect(screen.getByRole("button").textContent).toBe("loading");

    await waitFor(() => {
      expect(screen.getByRole("button").textContent).toBe("disabled");
    });
    expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(false);
  });

  it("updates locally immediately and persists the Gundam-only account patch", async () => {
    renderProvider({ authenticated: true, serverValue: true });
    fireEvent.click(screen.getByRole("button"));

    expect(screen.getByRole("button").textContent).toBe("disabled");
    expect(window.localStorage.getItem(AUTO_PASS_WHEN_NO_VALID_ACTION_STORAGE_KEY)).toBe("off");

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/v1/users/me/settings"),
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({
          gameSettings: {
            gundam: {
              simulator: { autoPassWhenNoValidAction: false },
            },
          },
        }),
      }),
    );
  });
});
