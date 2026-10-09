// @vitest-environment jsdom
import { act, cleanup, fireEvent, waitFor } from "@testing-library/react";
import { welcomeToNightCityRetailChromeReverie } from "@tcg/cyberpunk-cards";
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

test("gig dice read smallest die type first on both boards", async () => {
  const source = CyberpunkTestEngine.createWithFixture(
    {
      hand: [welcomeToNightCityRetailChromeReverie],
      gigArea: [
        { dieType: "d10", faceValue: 9 },
        { dieType: "d4", faceValue: 1 },
        { dieType: "d6", faceValue: 4 },
      ],
      eddies: 3,
    },
    {
      gigArea: [
        { dieType: "d20", faceValue: 5 },
        { dieType: "d6", faceValue: 2 },
      ],
    },
  );
  const projection = source.getFilteredView(P1);

  for (const ui of ["v2", "v1"] as const) {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: DEFAULT_SCENARIO,
      ui,
      boardProps: {
        initialEngineBuilder: () => createLiveMatchViewerEngine(projection),
        remoteProjection: projection,
      },
    });
    const dieTypesIn = (zone: "p-gigArea" | "opp-gigArea") =>
      [
        ...view.container.querySelectorAll(
          `[data-testid="gig-row"][data-sim-zone-id="${zone}"] [data-testid="gig-die"]`,
        ),
      ].map((die) => die.getAttribute("data-die-type"));
    await waitFor(() => {
      expect(dieTypesIn("p-gigArea")).toEqual(["d4", "d6", "d10"]);
    });
    expect(dieTypesIn("opp-gigArea")).toEqual(["d6", "d20"]);
    view.unmount();
  }
});

test("closes a pinned gig die popover when the die's face changes under it", async () => {
  ensureJsdomAnimationSupport();
  const source = CyberpunkTestEngine.createWithFixture(
    {
      hand: [welcomeToNightCityRetailChromeReverie],
      gigArea: [{ dieType: "d6", faceValue: 4 }],
      eddies: 3,
    },
    {},
  );
  const projection = source.getFilteredView(P1);
  const view = renderCyberpunkSimulatorScenario({
    scenarioId: DEFAULT_SCENARIO,
    ui: "v2",
    boardProps: {
      initialEngineBuilder: () => createLiveMatchViewerEngine(projection),
      remoteProjection: projection,
    },
  });
  try {
    const die = () =>
      view.container.querySelector(
        '[data-testid="gig-row"][data-sim-zone-id="p-gigArea"] [data-testid="gig-die"]',
      )!;
    await waitFor(() => {
      expect(die()).not.toBeNull();
      expect(die().getAttribute("data-face")).toBe("4");
    });

    // Click pins the read-only info popover for a die with no active selection.
    fireEvent.click(die());
    await waitFor(() => {
      expect(die().getAttribute("data-popover-open")).toBe("true");
      expect(document.body.textContent).toContain("rolled 4");
    });

    // A face change under the pinned popover makes its snapshot stale; the
    // lane must drop it instead of leaving the old value on screen.
    const dieId = die().getAttribute("data-die-id")!;
    const harness = (
      window as unknown as {
        __cyberpunkSimulator?: {
          engine: { executeMove: (move: string, input: unknown, player: string) => unknown };
          forceRender: () => void;
        };
      }
    ).__cyberpunkSimulator;
    expect(harness).not.toBeUndefined();
    act(() => {
      harness!.engine.executeMove("manualSetGigValue", { args: { dieId, value: 5 } }, P1);
      harness!.forceRender();
    });
    await waitFor(() => {
      expect(die().getAttribute("data-face")).toBe("5");
      expect(die().getAttribute("data-popover-open")).toBe("false");
      expect(document.body.textContent).not.toContain("rolled 4");
    });
  } finally {
    view.unmount();
  }
});
