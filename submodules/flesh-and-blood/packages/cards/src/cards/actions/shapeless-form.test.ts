import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  expectWait,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { crouchingTiger } from "./crouching-tiger.ts";
import { zen } from "../heroes/zen.ts";
import { snatchRed } from "./snatch.ts";
import { shapelessFormBlue } from "./shapeless-form.ts";

/**
 * Shapeless Form (PEN264) — Mystic Ninja Attack.
 *
 * Printed: Whenever you play an attack action card with ephemeral, choose a
 * name. It gets the chosen name. Go again.
 */

describe("Shapeless Form (PEN264) AAA", () => {
  it("happy: an ephemeral attack played while this is on the chain gets the named name", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [shapelessFormBlue, crouchingTiger],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.playAttack(shapelessFormBlue);
    game.advanceUntil({ stopAt: "resolution" });
    Zen.playAttack(crouchingTiger, { stopAt: "on-attack" });
    expectWait(game).toHaveDecision("effect-resolution");
    Zen.choose("Snatch");
    game.advanceUntil({ stopAt: "defend" });

    expectFabCard(Zen, crouchingTiger).toHaveName("Crouching Tiger").toHaveName("Snatch");
    game.helpers.expectLog("flesh-and-blood.name-card", {
      playerId: Zen.id,
      cardName: "Snatch",
    });
    game.helpers.expectLog("flesh-and-blood.gain-name", {
      cardName: "Crouching Tiger",
      gainedName: "Snatch",
    });
  });

  it("boundary: a non-ephemeral attack played after this does not get a named name", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [shapelessFormBlue, snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.playAttack(shapelessFormBlue);
    game.advanceUntil({ stopAt: "resolution" });
    Zen.playAttack(snatchRed);

    expectFabCard(Zen, snatchRed).toHaveName("Snatch");
    expectFabCard(Zen, snatchRed).notToHaveName("Dash");
  });

  it("timing: go again refunds AP so the ephemeral attack can chain", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [shapelessFormBlue, crouchingTiger],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);

    Zen.playAttack(shapelessFormBlue);
    game.advanceUntil({ stopAt: "resolution" });
    expectFabPlayer(Zen).toHaveAP(1);
  });

  it("timing: the granted name persists through attack resolution until ephemeral removes it", () => {
    const game = FabTestEngine.start(
      {
        hero: zen,
        hand: [shapelessFormBlue, crouchingTiger],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zen = game.as(zen);
    const Dash = game.as(dash);

    Zen.playAttack(shapelessFormBlue);
    game.advanceUntil({ stopAt: "resolution" });
    Zen.playAttack(crouchingTiger, { stopAt: "on-attack" });
    Zen.choose("Snatch");
    game.advanceUntil({ stopAt: "defend" });
    Dash.defendWith();
    game.advanceUntil({ stopAt: "resolution" });

    expectFabCard(Zen, crouchingTiger).toHaveName("Snatch");

    game.closeCombat();

    expect(Zen.cardsIn("graveyard", crouchingTiger)).toHaveLength(0);
  });
});
