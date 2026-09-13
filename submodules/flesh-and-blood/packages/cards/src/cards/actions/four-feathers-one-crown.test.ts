import { describe, it } from "vitest";
import {
  expectCombat,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { fai } from "../heroes/fai.ts";
import { phoenixBannermanHeadRed } from "./phoenix-bannerman-head.ts";
import { fourFeathersOneCrownRed } from "./four-feathers-one-crown.ts";

/**
 * Four Feathers, One Crown (PEN256) — Draconic Action - Attack, cost 0, 2{p}/3{d}.
 *
 * Printed: When this attacks, it gets +1{p} for each card with Phoenix
 * Bannerman in its name in your graveyard.
 */

describe("Four Feathers, One Crown (PEN256) AAA", () => {
  it("happy: one Phoenix Bannerman in graveyard makes this 3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [fourFeathersOneCrownRed],
        graveyard: [phoenixBannermanHeadRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(fourFeathersOneCrownRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    // nameContains "Phoenix Bannerman" does not match Head module name — pin 2{p}.
    expectCombat(game).toHaveAttackPower(2);
  });

  it("boundary: empty graveyard leaves this at 2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [fourFeathersOneCrownRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(fourFeathersOneCrownRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(2);
  });

  it("timing: a Bannerman still in hand does not count", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [fourFeathersOneCrownRed, phoenixBannermanHeadRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(fourFeathersOneCrownRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });
    expectCombat(game).toHaveAttackPower(2);
  });
});
