import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakniMarionette } from "../heroes/arakni-marionette.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { whittleFromBoneRed } from "./whittle-from-bone.ts";

/**
 * Whittle from Bone (HNT020) — When this attacks a marked hero, equip a Graphene Chelicera token.
 */

describe("Whittle from Bone family AAA", () => {
  it("happy: attacking a marked hero equips a Graphene Chelicera token", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [whittleFromBoneRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, marked: true, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.playAttack(whittleFromBoneRed, { stopAt: "on-attack" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Arakni).toHaveTokenCount("graphene-chelicera", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("graphene-chelicera", 0);
  });

  it("boundary: attacking an unmarked hero does not create Graphene Chelicera", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [whittleFromBoneRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.playAttack(whittleFromBoneRed, { stopAt: "on-attack" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Arakni).toHaveTokenCount("graphene-chelicera", 0);
  });

  it("boundary: a different attack does not mint Graphene Chelicera", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, marked: true, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.playAttack(brutalAssaultBlue, { stopAt: "on-attack" });
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(Arakni).toHaveTokenCount("graphene-chelicera", 0);
  });
});
