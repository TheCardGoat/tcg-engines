import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { kayo } from "../heroes/kayo.ts";
import { snatchRed } from "./snatch.ts";
import { kayoStrongArm } from "../heroes/kayo-strong-arm.ts";
import { challengeTheAlphaYellow } from "./challenge-the-alpha.ts";

/**
 * Challenge the Alpha (SUP129) — Brute Action - Attack, cost 3, 6{p}/3{d}.
 *
 * Printed: When this attacks a Brute hero, +2{p}. When this hits a Brute hero,
 * they discard a card. If it has 6 or more {p}, you lose 2{h}.
 */

describe("Challenge the Alpha (SUP129) AAA", () => {
  it("happy: attacking a Brute hero is 8{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        hand: [challengeTheAlphaYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: kayoStrongArm, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);

    Kayo.playAttack(challengeTheAlphaYellow, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(8);
  });

  it("boundary: attacking a Guardian stays 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        hand: [challengeTheAlphaYellow],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);

    Kayo.playAttack(challengeTheAlphaYellow, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(6);
  });

  it("timing: hitting a Brute hero discards; a 4{p} card does not tax 2{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        hand: [challengeTheAlphaYellow],
        resourcePoints: 3,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      {
        hero: kayoStrongArm,
        hand: [snatchRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);
    const StrongArm = game.as(kayoStrongArm);

    Kayo.playAttack(challengeTheAlphaYellow);
    game.closeCombat({ optionals: "decline" });
    expectFabCard(StrongArm, snatchRed).toBeIn("graveyard");
    expectFabPlayer(Kayo).toHaveLife(20);
  });
});
