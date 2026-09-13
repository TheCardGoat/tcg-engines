import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { runeholdRelease } from "./runehold-release.ts";

describe("Runehold Release (AUA005) AAA", () => {
  it("happy: destroy this to create a Runechant and keep the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        arms: [runeholdRelease],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );
    const Viserai = game.as(viserai);

    Viserai.must.activate(runeholdRelease);
    game.helpers.resolveUntilIdle();

    expectFabCard(Viserai, runeholdRelease).toBeIn("graveyard");
    expect(Viserai.zone("arena")).toContain("token:runechant");
    expectFabPlayer(Viserai).toHaveAP(1);
  });

  it("boundary: 0 action points cannot activate", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        arms: [runeholdRelease],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
    );

    game.as(viserai).expectActivationRejected(runeholdRelease);
    expectFabCard(game.as(viserai), runeholdRelease).toBeIn("arms");
    expect(game.as(viserai).zone("arena")).not.toContain("token:runechant");
  });

  it("timing: arms slot is empty after the destroy-self cost", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        arms: [runeholdRelease],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    expect(Viserai.zone("arms")).toHaveLength(1);
    Viserai.must.activate(runeholdRelease);
    expect(Viserai.zone("arms")).toHaveLength(0);
    expect(Viserai.zone("arena")).not.toContain("token:runechant");
    game.helpers.resolveUntilIdle();

    expectFabCard(Viserai, runeholdRelease).toBeIn("graveyard");
    expect(Viserai.zone("arena")).toContain("token:runechant");
  });
});
