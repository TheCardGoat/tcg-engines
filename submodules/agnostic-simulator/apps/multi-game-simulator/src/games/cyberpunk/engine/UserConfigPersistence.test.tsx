import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import {
  EMPTY_SIMULATOR_AUTH_CONTEXT,
  SimulatorAuthContextProvider,
} from "../../../simulator/providers/auth-context";
import { UserConfigProvider, useUserConfig, useSetUserConfig } from "./UserConfigContext";

function SettingsProbe() {
  const config = useUserConfig();
  const setConfig = useSetUserConfig();
  return (
    <>
      <output aria-label="card size">{config.fieldCardSize}</output>
      <button onClick={() => setConfig({ diceDisplayMode: "image" })}>Use image dice</button>
    </>
  );
}

afterEach(() => {
  cleanup();
  localStorage.clear();
  vi.unstubAllGlobals();
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
                    simulator: { fieldCardSize: "large", animationPacing: "cinematic" },
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
    animationPacing: "cinematic",
    diceDisplayMode: "image",
  });
});
