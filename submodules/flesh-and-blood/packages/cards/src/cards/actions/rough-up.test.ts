import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { kayo } from "../heroes/kayo.ts";
import { snatchRed } from "./snatch.ts";
import { roughUpRed } from "./rough-up.ts";

/**
 * Rough Up (SUP158) — Brute Action - Attack, cost 2, 6{p}/3{d}.
 *
 * Printed: When this attacks, if there is a card with 6 or more {p} in your
 * pitch zone, this gets +1{p}.
 */

describe("Rough Up (SUP158) AAA", () => {
  it("happy: a 6{p} card in pitch makes this 7{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        hand: [roughUpRed],
        pitch: [roughUpRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);

    Kayo.playAttack(roughUpRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: empty pitch leaves this at 6{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        hand: [roughUpRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);

    Kayo.playAttack(roughUpRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(6);
  });

  it("timing: a 4{p} pitch card is not enough", () => {
    const game = FabTestEngine.start(
      {
        hero: kayo,
        hand: [roughUpRed],
        pitch: [snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kayo = game.as(kayo);

    Kayo.playAttack(roughUpRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(6);
  });
});
