import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { markOfTheBlackWidowRed } from "./mark-of-the-black-widow.ts";
import { orbWeaverSpinneretRed } from "./orb-weaver-spinneret.ts";

describe("orb-weaver-spinneret family AAA", () => {
  it("happy: the next stealth attack this turn gets +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [orbWeaverSpinneretRed, markOfTheBlackWidowRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.play(orbWeaverSpinneretRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabPlayer(Arakni).toHaveAP(1);
    expectFabToken(game, "graphene-chelicera").toHaveCount(1).toBeIn("weapon1");

    Arakni.playAttack(markOfTheBlackWidowRed);
    expectCombat(game).toHaveAttackPower(6);
    expectCombat(game).toHaveKeyword("stealth");
  });

  it("boundary: a non-stealth attack does not receive the +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [orbWeaverSpinneretRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);

    Arakni.play(orbWeaverSpinneretRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Arakni.playAttack(brutalAssaultBlue);
    expectCombat(game).toHaveAttackPower(4);
  });
});
