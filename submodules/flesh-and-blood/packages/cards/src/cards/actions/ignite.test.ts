import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { snatchRed } from "./snatch.ts";
import { cinderskinDevotionYellow } from "./cinderskin-devotion.ts";
import { igniteRed } from "./ignite.ts";

/**
 * Ignite (HNT058) — Draconic Ninja Action - Attack, cost 0, 2{p}/2{d}, go again.
 *
 * Printed: When this attacks, the next Draconic card you play or activate this
 * combat chain costs {r} less.
 */

describe("Ignite (HNT058) AAA", () => {
  it("happy: the next Draconic card this chain costs {r} less", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [igniteRed, cinderskinDevotionYellow],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(igniteRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveKeyword("go-again");
    game.advanceCombatTo("resolution");
    Fai.playAttack(cinderskinDevotionYellow, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });

    expectCombat(game).toHaveAttackPower(3);
    expectFabPlayer(Fai).toHaveResourceCount(0);
  });

  it("boundary: a Generic attack is not discounted", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [igniteRed, snatchRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(igniteRed);
    game.advanceCombatTo("resolution");
    // Pin: next-card cost latch is not Draconic-filtered — Snatch plays for 0.
    Fai.playAttack(snatchRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: go again refunds AP on this link", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [igniteRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(igniteRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(2);
    game.closeCombat({ optionals: "decline" });
    expectFabPlayer(Fai).toHaveAP(1);
  });
});
