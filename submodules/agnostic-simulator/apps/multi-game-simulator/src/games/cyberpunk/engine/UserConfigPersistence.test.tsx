// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import {
  EMPTY_SIMULATOR_AUTH_CONTEXT,
  SimulatorAuthContextProvider,
} from "../../../simulator/providers/auth-context";
import {
  UserConfigProvider,
  useUserConfig,
  useSetUserConfig,
  useCyberpunkVisualSelection,
  useSetCyberpunkVisualSelection,
} from "./UserConfigContext";

function SettingsProbe() {
  const config = useUserConfig();
  const setConfig = useSetUserConfig();
  const visual = useCyberpunkVisualSelection();
  const setVisual = useSetCyberpunkVisualSelection();
  return (
    <>
      <output aria-label="card size">{config.fieldCardSize}</output>
      <output aria-label="card back">{visual.cardBackId}</output>
      <button onClick={() => setConfig({ diceDisplayMode: "image" })}>Use image dice</button>
      <button onClick={() => setConfig({ choosePaymentSources: true })}>
        Enable payment selection
      </button>
      <button onClick={() => setVisual({ cardBackId: "goat-heraldic" })}>Use heraldic back</button>
    </>
  );
}

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
});

test("loads the account card back and saves a live visual change for the next match", async () => {
  const fetchMock = vi.fn((_: RequestInfo | URL, init?: RequestInit) =>
    Promise.resolve(
      new Response(
        JSON.stringify(
          init?.method === "PUT"
            ? {}
            : {
                gameSettings: {
                  cyberpunk: { visual: { cardBackId: "goat-classic", playmatId: "default" } },
                },
              },
        ),
        { status: 200 },
      ),
    ),
  );
  vi.stubGlobal("fetch", fetchMock);
  render(
    <SimulatorAuthContextProvider
      value={{ ...EMPTY_SIMULATOR_AUTH_CONTEXT, isAuthenticated: true, userId: "user-1" }}
    >
      <UserConfigProvider>
        <SettingsProbe />
      </UserConfigProvider>
    </SimulatorAuthContextProvider>,
  );
  await waitFor(() => expect(screen.getByLabelText("card back").textContent).toBe("goat-classic"));
  fireEvent.click(screen.getByRole("button", { name: "Use heraldic back" }));
  expect(screen.getByLabelText("card back").textContent).toBe("goat-heraldic");
  await waitFor(() =>
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/users/me/settings"),
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({
          gameSettings: { cyberpunk: { visual: { cardBackId: "goat-heraldic" } } },
        }),
      }),
    ),
  );
});

test("hydrates matchmaking preferences and saves only the changed Cyberpunk field", async () => {
  const fetchMock = vi.fn((_: RequestInfo | URL, init?: RequestInit) =>
    Promise.resolve(
      new Response(
        JSON.stringify(
          init?.method === "PUT"
            ? {}
            : {
                gameSettings: {
                  cyberpunk: {
                    simulator: { fieldCardSize: "large" },
                  },
                },
              },
        ),
        { status: 200 },
      ),
    ),
  );
  vi.stubGlobal("fetch", fetchMock);
  render(
    <SimulatorAuthContextProvider
      value={{ ...EMPTY_SIMULATOR_AUTH_CONTEXT, isAuthenticated: true, userId: "user-1" }}
    >
      <UserConfigProvider>
        <SettingsProbe />
      </UserConfigProvider>
    </SimulatorAuthContextProvider>,
  );
  await waitFor(() => expect(screen.getByLabelText("card size").textContent).toBe("large"));
  fireEvent.click(screen.getByRole("button", { name: "Use image dice" }));
  await waitFor(() =>
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/users/me/settings"),
      expect.objectContaining({
        method: "PUT",
        keepalive: true,
        body: JSON.stringify({
          gameSettings: { cyberpunk: { simulator: { diceDisplayMode: "image" } } },
        }),
      }),
    ),
  );
  expect(JSON.parse(localStorage.getItem("cyberpunk:userConfig") ?? "{}")).toMatchObject({
    fieldCardSize: "large",
    diceDisplayMode: "image",
  });
});

test("persists the payment-source toggle in the Cyberpunk game profile", async () => {
  const fetchMock = vi.fn((_: RequestInfo | URL, init?: RequestInit) =>
    Promise.resolve(
      new Response(JSON.stringify(init?.method === "PUT" ? {} : {}), { status: 200 }),
    ),
  );
  vi.stubGlobal("fetch", fetchMock);
  render(
    <SimulatorAuthContextProvider
      value={{ ...EMPTY_SIMULATOR_AUTH_CONTEXT, isAuthenticated: true, userId: "user-1" }}
    >
      <UserConfigProvider>
        <SettingsProbe />
      </UserConfigProvider>
    </SimulatorAuthContextProvider>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Enable payment selection" }));

  await waitFor(() =>
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/users/me/settings"),
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({
          gameSettings: { cyberpunk: { simulator: { choosePaymentSources: true } } },
        }),
      }),
    ),
  );
  expect(JSON.parse(localStorage.getItem("cyberpunk:userConfig") ?? "{}")).toMatchObject({
    choosePaymentSources: true,
  });
});
