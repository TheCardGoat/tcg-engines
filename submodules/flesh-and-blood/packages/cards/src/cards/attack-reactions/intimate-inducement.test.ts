import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { biteBlue } from "../actions/bite.ts";
import { nuu } from "../heroes/nuu.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { intimateInducementRed } from "./intimate-inducement.ts";

/**
 * Intimate Inducement (MST017) — Mystic Assassin Attack Reaction, cost 0, 3{d}.
 *
 * Printed: "Target Assassin or Mystic attack action card gets +1{p}.
 * Look at the top 4 cards of the defending hero's deck and choose a card. If
 * it's blue, it has 0 base {d}. Put the chosen card onto the active chain link
 * as a defending card and the rest on top in any order."
 */

describe("Intimate Inducement (MST017) AAA", () => {
  it("happy: target Assassin attack action card gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [biteBlue, intimateInducementRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deckTop: [snatchRed, nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.attackWith(biteBlue);
    game.advanceCombatTo("reaction");
    Nuu.must.playReaction(intimateInducementRed);
    game.passBoth();
    game.advanceUntil({ stopAt: "reaction", entityTargets: "minimum", ordering: "listed" });

    expectCombat(game).toHaveAttackPower(2);
    expectFabCard(Nuu, intimateInducementRed).toBeIn("graveyard");
  });

  it("boundary: Generic Snatch is not a legal Assassin/Mystic AAC (silent no-op)", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [snatchRed, intimateInducementRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);

    Nuu.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() => Nuu.must.playReaction(intimateInducementRed));

    expectFabCard(Nuu, intimateInducementRed).toBeIn("hand");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: look/choose puts the chosen blue card onto the chain as a 0{d} defender", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [biteBlue, intimateInducementRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deckTop: [nimblismBlue, snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Nuu = game.as(nuu);
    const Dash = game.as(dash);

    Nuu.attackWith(biteBlue);
    game.advanceCombatTo("reaction");
    Nuu.must.playReaction(intimateInducementRed);
    game.passBoth();
    Nuu.target(Dash.cardIn("deck", nimblismBlue));
    game.advanceUntil({ stopAt: "reaction", entityTargets: "minimum", ordering: "listed" });

    expectCombat(game).toHaveAttackPower(2);
    expect(Dash.zone("combatChain")).toContain(nimblismBlue.canonicalId);
    expect(Dash.zone("deck")).toContain(snatchRed.canonicalId);
    expectFabCard(Nuu, intimateInducementRed).toBeIn("graveyard");
  });
});
