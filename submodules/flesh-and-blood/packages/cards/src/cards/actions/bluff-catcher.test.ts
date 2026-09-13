import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { hala } from "../heroes/hala.ts";
import { gold } from "../tokens/gold.ts";
import { durendal } from "../weapons/durendal.ts";
import { bluffCatcherYellow } from "./bluff-catcher.ts";

describe("Bluff Catcher (MPW029) AAA", () => {
  it("happy: Gold pays the alternative cost and the winning sword gets +1 intellect next end phase", () => {
    const game = FabTestEngine.start(
      {
        hero: hala,
        weapon1: [durendal],
        hand: [bluffCatcherYellow],
        arena: [gold],
        resourcePoints: 2,
        deck: 8,
      },
      { hero: dash, hand: [], life: 20, deck: 8 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(hala);

    Hala.play(bluffCatcherYellow, { modeIds: ["pay"] });
    game.untilIdle({ entityTargets: "minimum" });
    expect(Hala.zone("arena")).not.toContain("token:gold");
    expectFabPlayer(Hala).toHaveAP(1);

    Hala.activateAttack(durendal, { stopAt: "on-attack" });
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat({ optionals: "accept", entityTargets: "minimum" });
    Hala.endTurn();

    expect(Hala.zone("hand")).toHaveLength(5);
  });

  it("boundary: declining the Gold alternative requires the printed resources", () => {
    const game = FabTestEngine.start(
      {
        hero: hala,
        hand: [bluffCatcherYellow],
        arena: [gold],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Hala = game.as(hala);

    expect(() => Hala.play(bluffCatcherYellow, { modeIds: ["decline"] })).toThrow();
    expectFabCard(Hala, gold).toBeIn("arena");
    expectFabCard(Hala, bluffCatcherYellow).toBeIn("hand");
  });
});
