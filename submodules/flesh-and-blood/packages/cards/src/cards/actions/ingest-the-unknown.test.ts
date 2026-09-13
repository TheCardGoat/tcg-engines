import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { heartOfFyendalBlue } from "../resources/heart-of-fyendal.ts";
import { snatchRed } from "./snatch.ts";
import { ingestTheUnknownYellow } from "./ingest-the-unknown.ts";

/**
 * Ingest the Unknown (yellow) — Shadow Brute Action - Attack, cost 1, 0{p},
 * Blood Debt.
 *
 * Printed: "When this attacks, banish the top card of your deck. This gets
 * +X{p}, where X is the banished card's base {p}.\nBlood Debt"
 */

describe("Ingest the Unknown (IAR007) AAA", () => {
  it("happy: the banished deck-top's base power becomes the attack's bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [ingestTheUnknownYellow],
        deck: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(ingestTheUnknownYellow);
    game.advanceUntil({ stopAt: "defend" });

    // 0 base + 4 from the banished Snatch (base 4{p}).
    expectCombat(game).toHaveAttackPower(4);
    expectFabCard(Rhinar, snatchRed).toBeIn("banished");
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: a power-less banished card leaves the attack at 0{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [ingestTheUnknownYellow],
        deck: [heartOfFyendalBlue],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.playAttack(ingestTheUnknownYellow);
    game.advanceUntil({ stopAt: "defend" });

    expectCombat(game).toHaveAttackPower(0);
    expectFabCard(Rhinar, heartOfFyendalBlue).toBeIn("banished");
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });
});
