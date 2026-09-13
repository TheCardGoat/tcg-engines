import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { fai } from "../heroes/fai.ts";
import { dash } from "../heroes/dash.ts";
import { pledgeFealtyRed } from "../instants/pledge-fealty.ts";
import { snatchRed } from "./snatch.ts";
import { marchOfLoyaltyRed } from "./march-of-loyalty.ts";

/**
 * March of Loyalty (HNT153) — go again if you've created a Fealty token this turn.
 */

describe("March of Loyalty (HNT153) AAA", () => {
  it("happy: creating Fealty this turn grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [pledgeFealtyRed, marchOfLoyaltyRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.must.playInstant(pledgeFealtyRed);
    game.helpers.resolveUntilIdle();
    Fai.attackWith(marchOfLoyaltyRed);
    expectCombat(game).toHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Fai).toHaveAP(1);
  });

  it("boundary: without creating Fealty this turn there is no go again", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [marchOfLoyaltyRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(marchOfLoyaltyRed);
    expectCombat(game).notToHaveKeyword("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Fai).toHaveAP(0);
  });

  it("boundary: defends for its printed 3{d}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [marchOfLoyaltyRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], resourcePoints: 1, actionPoints: 1, life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Fai = game.as(fai);
    const Dash = game.as(dash);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Fai.defendWith([marchOfLoyaltyRed]);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Fai).toHaveLife(19);
  });
});
