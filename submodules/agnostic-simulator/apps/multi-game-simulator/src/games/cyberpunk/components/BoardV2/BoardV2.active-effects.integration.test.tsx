// @vitest-environment jsdom
import { cleanup, fireEvent, waitFor, within } from "@testing-library/react";
import {
  welcomeToNightCityRetailChromeReverie,
  welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "@tcg/cyberpunk-engine";
import type { ReactNode } from "react";
import { afterEach, expect, test, vi } from "vite-plus/test";

import { createLiveMatchViewerEngine } from "../../engine/live/liveState";
import { DEFAULT_SCENARIO } from "../../engine/fixtures/scenarios";
import { ensureJsdomAnimationSupport } from "../../testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import { renderCyberpunkSimulatorScenario } from "../../testing/render-cyberpunk-simulator";

vi.mock("./Scene", () => ({ default: () => null }));
vi.mock("../../animation", async () => {
  const actual = await vi.importActual<typeof import("../../animation")>("../../animation");
  return {
    ...actual,
    CyberpunkSharedAnimationLayer: ({ children }: { children: ReactNode }) => children,
    SoundPlayer: () => null,
  };
});

afterEach(cleanup);

test("V2 explains temporary effects while V1 keeps its compact source-card rail", async () => {
  const source = CyberpunkTestEngine.createWithFixture(
    { hand: [welcomeToNightCityRetailChromeReverie], eddies: 3 },
    {
      field: [
        {
          card: welcomeToNightCityRetailJohnnySilverhandNeverStopFighting,
          spent: false,
          hasLag: false,
        },
      ],
    },
  );
  source.playCard(welcomeToNightCityRetailChromeReverie, { as: P1 });
  source.resolveEffectTarget(welcomeToNightCityRetailJohnnySilverhandNeverStopFighting, {
    as: P1,
  });
  const projection = source.getFilteredView(P1);

  ensureJsdomAnimationSupport();
  const v2 = renderCyberpunkSimulatorScenario({
    scenarioId: DEFAULT_SCENARIO,
    ui: "v2",
    boardProps: {
      initialEngineBuilder: () => createLiveMatchViewerEngine(projection),
      remoteProjection: projection,
    },
  });
  const dock = await waitFor(() => {
    const dockEl = v2.container.querySelector<HTMLElement>('[data-testid="active-effects-dock"]');
    expect(dockEl).not.toBeNull();
    return dockEl!;
  });
  // One miniature chip per source card (no inline wording); focusing it mounts
  // a tooltip (portal-rendered at body level) and outlines the target card.
  const chip = within(dock).getByLabelText("Chrome Reverie: CANT ATTACK");
  expect(within(chip).queryByText("CANT ATTACK")).toBeNull();
  fireEvent.focus(chip);
  const tip = within(document.body).getByRole("tooltip");
  expect(within(tip).getByText("Chrome Reverie")).toBeDefined();
  expect(within(tip).getByText("CANT ATTACK")).toBeDefined();
  expect(
    within(tip).getByText("Chrome Reverie: CANT ATTACK until source's next turn."),
  ).toBeDefined();
  expect(within(tip).getByText("Target: Johnny Silverhand: Never Stop Fighting")).toBeDefined();
  const highlighted = document.querySelector<HTMLElement>('[data-effect-target="true"]');
  expect(highlighted?.getAttribute("data-instance-id")).toBeTruthy();
  fireEvent.blur(chip);
  expect(within(document.body).queryByRole("tooltip")).toBeNull();
  expect(document.querySelector('[data-effect-target="true"]')).toBeNull();
  v2.unmount();

  ensureJsdomAnimationSupport();
  const v1 = renderCyberpunkSimulatorScenario({
    scenarioId: DEFAULT_SCENARIO,
    boardProps: {
      initialEngineBuilder: () => createLiveMatchViewerEngine(projection),
      remoteProjection: projection,
    },
  });
  const compactRail = await waitFor(() => {
    const rail = v1.container.querySelector<HTMLElement>(
      '[data-testid="active-effects-rail-rival"]',
    );
    expect(rail).not.toBeNull();
    return rail!;
  });
  expect(compactRail.hasAttribute("data-show-details")).toBe(false);
  expect(within(compactRail).queryByText("CANT ATTACK")).toBeNull();
  expect(within(compactRail).getByRole("img", { name: "Chrome Reverie" })).toBeDefined();
  v1.unmount();
});
