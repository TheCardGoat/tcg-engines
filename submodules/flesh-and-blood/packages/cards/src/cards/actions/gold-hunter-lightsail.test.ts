import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { goldHunterLightsailYellow } from "./gold-hunter-lightsail.ts";

/**
 * Gold Hunter Lightsail (SEA162) — Pirate Action - Attack, cost 1, 4{p}/2{d}.
 *
 * Printed: When this attacks, if you control less Gold than an opponent,
 * this gets go again.
 */

describe("Gold Hunter Lightsail (SEA162) AAA", () => {
  it("happy: attacking while controlling less Gold grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [goldHunterLightsailYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arena: [fabToken("gold")], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(goldHunterLightsailYellow);

    expectCombat(game).toHaveAttackPower(4).toHaveKeyword("go-again");
  });

  it("boundary: equal or more Gold does not grant go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [goldHunterLightsailYellow],
        arena: [fabToken("gold")],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(goldHunterLightsailYellow);

    expectCombat(game).toHaveAttackPower(4).notToHaveKeyword("go-again");
  });

  it("timing: go again refunds AP after the chain when you control less Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [goldHunterLightsailYellow],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arena: [fabToken("gold")], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(goldHunterLightsailYellow);
    expectCombat(game).toHaveKeyword("go-again");
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });
});
