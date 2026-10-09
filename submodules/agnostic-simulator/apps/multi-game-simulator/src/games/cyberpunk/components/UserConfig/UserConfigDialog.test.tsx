// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vite-plus/test";

import { UserConfigProvider } from "../../engine";
import {
  EMPTY_SIMULATOR_AUTH_CONTEXT,
  SimulatorAuthContextProvider,
} from "../../../../simulator/providers/auth-context";
import { SimulatorSettingsProvider } from "../../../../simulator/settings";
import { SIMULATOR_ANIMATION_SPEED_STORAGE_KEY } from "../../../../simulator/settings/simulator-settings";
import { UserConfigButton } from "./UserConfigDialog";

describe("UserConfigButton", () => {
  afterEach(() => {
    cleanup();
    window.localStorage.clear();
  });

  test("updates the field card size setting", () => {
    render(
      <SimulatorSettingsProvider>
        <UserConfigProvider>
          <UserConfigButton />
        </UserConfigProvider>
      </SimulatorSettingsProvider>,
    );

    fireEvent.click(screen.getByLabelText("Open simulator settings"));

    expect(screen.getByRole("dialog", { name: "Settings" })).toBeTruthy();
    fireEvent.click(screen.getByRole("tab", { name: "Game" }));
    expect(screen.getByLabelText("Compact")).toBeTruthy();
    expect(screen.getByLabelText("Standard")).toBeTruthy();
    expect(screen.getByLabelText("Large")).toBeTruthy();

    fireEvent.click(screen.getByLabelText("Large"));

    expect(JSON.parse(window.localStorage.getItem("cyberpunk:userConfig") ?? "{}")).toMatchObject({
      fieldCardSize: "large",
    });
  });

  test("changes the visible card back and keeps supporter playmats unavailable to free users", () => {
    render(
      <SimulatorSettingsProvider>
        <UserConfigProvider>
          <UserConfigButton />
        </UserConfigProvider>
      </SimulatorSettingsProvider>,
    );

    fireEvent.click(screen.getByLabelText("Open simulator settings"));
    fireEvent.click(screen.getByRole("tab", { name: "Game" }));
    const cardBack = screen.getByRole("combobox", { name: "Card back" });
    fireEvent.change(cardBack, { target: { value: "goat-celestial" } });

    expect((cardBack as HTMLSelectElement).value).toBe("goat-celestial");
    expect(screen.getByAltText("Card Goat Celestial preview").getAttribute("src")).toContain(
      "/v3/card-back-400.webp",
    );
    expect(
      JSON.parse(window.localStorage.getItem("cyberpunk:visualSelection") ?? "{}"),
    ).toMatchObject({
      cardBackId: "goat-celestial",
    });
    expect(
      (screen.getByRole("option", { name: "Night Market · Supporter" }) as HTMLOptionElement)
        .disabled,
    ).toBe(true);
  });

  test("lets a supporter select a playmat during a game", () => {
    render(
      <SimulatorAuthContextProvider
        value={{
          ...EMPTY_SIMULATOR_AUTH_CONTEXT,
          isAuthenticated: true,
          isPremium: true,
          subscriptionTier: "tier2",
        }}
      >
        <SimulatorSettingsProvider>
          <UserConfigProvider>
            <UserConfigButton />
          </UserConfigProvider>
        </SimulatorSettingsProvider>
      </SimulatorAuthContextProvider>,
    );

    fireEvent.click(screen.getByLabelText("Open simulator settings"));
    fireEvent.click(screen.getByRole("tab", { name: "Game" }));
    const playmat = screen.getByRole("combobox", { name: "Playmat" });
    fireEvent.change(playmat, { target: { value: "night-market" } });

    expect((playmat as HTMLSelectElement).value).toBe("night-market");
    expect(screen.getByAltText("Night Market preview").getAttribute("src")).toContain(
      "/night-market.webp",
    );
  });

  test("exposes the shared animation speed setting for Cyberpunk", () => {
    render(
      <SimulatorSettingsProvider>
        <UserConfigProvider>
          <UserConfigButton />
        </UserConfigProvider>
      </SimulatorSettingsProvider>,
    );

    fireEvent.click(screen.getByLabelText("Open simulator settings"));

    const animationSpeed = screen.getByLabelText("Animation speed") as HTMLSelectElement;
    expect(animationSpeed.value).toBe("normal");

    fireEvent.change(animationSpeed, { target: { value: "fast" } });

    expect(animationSpeed.value).toBe("fast");
    expect(window.localStorage.getItem(SIMULATOR_ANIMATION_SPEED_STORAGE_KEY)).toBe("fast");

    fireEvent.click(screen.getByRole("tab", { name: "Game" }));
    expect(screen.queryByText("Animation Pacing")).toBeNull();
  });

  test("toggles persisted payment-source selection", () => {
    render(
      <SimulatorSettingsProvider>
        <UserConfigProvider>
          <UserConfigButton />
        </UserConfigProvider>
      </SimulatorSettingsProvider>,
    );

    fireEvent.click(screen.getByLabelText("Open simulator settings"));
    fireEvent.click(screen.getByRole("tab", { name: "Game" }));
    const paymentToggle = screen.getByRole("checkbox");
    fireEvent.click(paymentToggle);

    expect((paymentToggle as HTMLInputElement).checked).toBe(true);
    expect(JSON.parse(window.localStorage.getItem("cyberpunk:userConfig") ?? "{}")).toMatchObject({
      choosePaymentSources: true,
    });
  });
});
