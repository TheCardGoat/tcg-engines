// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { installBrowserShims } from "../../testing/browser-shims";
import { FleshAndBloodSimulatorProviders } from "./App";
import { FleshAndBloodTabletop } from "./FleshAndBloodTabletop";
import { FabPresentationTestProvider, testFabArt } from "./presentation-test-provider";
import { EFFECT_DISCLOSURE_SCENARIOS } from "./engine-scenarios/effect-disclosure";
import { presentRuntime } from "./projection";

describe("public effect source rendering", () => {
  beforeEach(() => {
    installBrowserShims();
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1440 });
  });
  afterEach(cleanup);

  it("keeps the center effects rail visible when no effects are active", () => {
    const scenario = Object.values(EFFECT_DISCLOSURE_SCENARIOS)[0];
    if (!scenario) throw new Error("Missing effect-disclosure scenario.");
    const match = scenario.boot();
    const state = {
      ...presentRuntime(match.runtime, scenario.viewerId, testFabArt),
      activeEffects: [],
    };

    render(
      <FleshAndBloodSimulatorProviders>
        <FabPresentationTestProvider>
          <FleshAndBloodTabletop state={state} viewerId={scenario.viewerId} readOnly />
        </FabPresentationTestProvider>
      </FleshAndBloodSimulatorProviders>,
    );

    const rail = screen.getByTestId("fab-active-effects-rail");
    expect(within(rail).getByTestId("fab-active-effects-self-button").textContent).toContain("0");
    expect(within(rail).getByTestId("fab-active-effects-opponent-button").textContent).toContain(
      "0",
    );
    expect(within(rail).queryByRole("button", { name: /Open all/i })).toBeNull();
  });

  it.each(Object.values(EFFECT_DISCLOSURE_SCENARIOS))(
    "$id opens the known card's effect and artwork",
    (scenario) => {
      const match = scenario.boot();
      const state = presentRuntime(match.runtime, scenario.viewerId, testFabArt);
      render(
        <FleshAndBloodSimulatorProviders>
          <FabPresentationTestProvider>
            <FleshAndBloodTabletop state={state} viewerId={scenario.viewerId} readOnly />
          </FabPresentationTestProvider>
        </FleshAndBloodSimulatorProviders>,
      );

      const rail = screen.getByTestId("fab-active-effects-rail");
      const source = within(rail).getByRole("button", { name: /Authority of Ataya: Cost \+1/i });
      expect(source.querySelector("img")?.getAttribute("src")).toMatch(/^https:\/\//);
      expect(within(rail).queryByText("Hidden source")).toBeNull();
      fireEvent.click(source);

      const inspector = screen.getByTestId("fab-active-effects-inspector");
      expect(within(inspector).getByText(/^Authority of Ataya$/i)).not.toBeNull();
      expect(within(inspector).getByText(/Source: Authority of Ataya\./i)).not.toBeNull();
      fireEvent.click(screen.getByRole("button", { name: "Close active effects" }));
      expect(screen.queryByTestId("fab-active-effects-inspector")).toBeNull();
    },
  );
});
