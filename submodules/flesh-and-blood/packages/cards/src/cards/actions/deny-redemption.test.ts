import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { snatchRed } from "./snatch.ts";
import { denyRedemptionRed } from "./deny-redemption.ts";

describe("Deny Redemption (SEA254) AAA", () => {
  it("happy: attacking a hero with more life deals 1 unpreventable arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [denyRedemptionRed],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 30, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.playAttack(denyRedemptionRed, { stopAt: "on-attack" });
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(27);
  });

  it("boundary: attacking a hero with equal life does not ping", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [denyRedemptionRed],
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.playAttack(denyRedemptionRed);
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });

  it("timing: cannot be played as an instant during the opponent's combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: viserai, hand: [denyRedemptionRed], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    game.as(dash).playAttack(snatchRed);
    game.toReaction();
    expect(() => game.as(viserai).play(denyRedemptionRed)).toThrow();
    expectFabCard(game.as(viserai), denyRedemptionRed).toBeIn("hand");
  });
});
