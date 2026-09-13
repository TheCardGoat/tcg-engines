import { SimulatorAudioCueIdSchema } from "@tcg/protocol";
import { describe, expect, test } from "vite-plus/test";

import { FAB_VISUAL_FIXTURES } from "../../games/flesh-and-blood/fixtures";
import {
  ANIMATION_STEP_INVENTORY,
  AUDIO_CUE_FIXTURES,
  FAB_MOTION_SURFACE_FIXTURES,
  type AnimationFixtureGameId,
} from "./inventory";

const FAB_GAME_ID = "flesh-and-blood" satisfies AnimationFixtureGameId;

describe("Flesh and Blood animation fixture inventory", () => {
  test("accounts for every shared animation step type", () => {
    expect(ANIMATION_STEP_INVENTORY).toHaveLength(11);
    expect(
      ANIMATION_STEP_INVENTORY.filter((item) => item.games[FAB_GAME_ID].status === "ready").map(
        (item) => item.stepType,
      ),
    ).toEqual(["entityTransfer"]);
    expect(
      ANIMATION_STEP_INVENTORY.filter((item) => item.stepType !== "entityTransfer").every(
        (item) =>
          item.games[FAB_GAME_ID].status === "disabled" && item.games[FAB_GAME_ID].route === null,
      ),
    ).toBe(true);
  });

  test("catalogs FAB-owned Motion surfaces outside the shared plan", () => {
    expect(FAB_MOTION_SURFACE_FIXTURES.map((fixture) => fixture.status)).toEqual([
      "ready",
      "missing",
      "ready",
      "ready",
      "ready",
      "ready",
      "partial",
      "missing",
    ]);
  });

  test("does not count synthetic FAB labs as browser proof", () => {
    const claimedRoutes = [
      ...ANIMATION_STEP_INVENTORY.map((item) => item.games[FAB_GAME_ID]),
      ...FAB_MOTION_SURFACE_FIXTURES,
      ...AUDIO_CUE_FIXTURES.flatMap((item) => {
        const fixture = item.games[FAB_GAME_ID];
        return fixture ? [fixture] : [];
      }),
    ].flatMap((fixture) => (fixture.status === "ready" && fixture.route ? [fixture.route] : []));

    expect(claimedRoutes).not.toContain("/flesh-and-blood/simulator/tests/multiple-trigger-open");
    expect(claimedRoutes).not.toContain("/flesh-and-blood/simulator/tests/clash-sequence-lab");
    expect(claimedRoutes).not.toContain("/flesh-and-blood/simulator/tests/reveal-and-shuffle");
    expect(claimedRoutes).not.toContain("/flesh-and-blood/simulator/tests/damage-prevention");
    expect(claimedRoutes).not.toContain("/flesh-and-blood/simulator/tests/trigger-decision-lab");
  });

  test("accounts for every shared sound cue exactly once", () => {
    expect(AUDIO_CUE_FIXTURES.map((item) => item.cue)).toEqual(SimulatorAudioCueIdSchema.options);
    expect(new Set(AUDIO_CUE_FIXTURES.map((item) => item.cue)).size).toBe(
      SimulatorAudioCueIdSchema.options.length,
    );
  });

  test("links every claimed FAB runtime case to an engine-backed visual fixture", () => {
    const scenarioIds = new Set(FAB_VISUAL_FIXTURES.map((fixture) => fixture.id));
    const runtimeRoutes = [
      ...ANIMATION_STEP_INVENTORY.map((item) => item.games[FAB_GAME_ID]),
      ...FAB_MOTION_SURFACE_FIXTURES,
      ...AUDIO_CUE_FIXTURES.flatMap((item) => {
        const fixture = item.games[FAB_GAME_ID];
        return fixture ? [fixture] : [];
      }),
    ].flatMap((fixture) => (fixture.route ? [fixture.route] : []));

    for (const route of runtimeRoutes.filter((candidate) => candidate.includes("/tests/"))) {
      const scenarioId = route.split("/").at(-1);
      expect(scenarioIds, `missing engine-backed fixture for ${route}`).toContain(scenarioId);
    }
  });
});
