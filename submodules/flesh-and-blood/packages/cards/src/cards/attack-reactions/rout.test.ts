import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { kassaiOfTheGoldenSand } from "../heroes/kassai-of-the-golden-sand.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { routRed } from "./rout.ts";

/**
 * Rout (WTR120) — Warrior Attack Reaction, cost 2, 3{d}.
 *
 * Printed: "Target weapon attack gains +3{p}.
 * Reprise - If the defending hero has defended with a card from their hand
 * this chain link, you may return target non-equipment defending card to its
 * owners hand."
 */

describe("Rout (WTR120) AAA", () => {
  it("happy: target weapon attack gains +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [routRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.activate(cintariSaber);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(routRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Kassai, routRed).toBeIn("graveyard");
  });

  it("boundary: Generic Snatch is not a legal weapon attack (silent no-op)", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        hand: [routRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);

    Kassai.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    expectFabUnplayable(() => Kassai.must.playReaction(routRed));

    expectFabCard(Kassai, routRed).toBeIn("hand");
    expectCombat(game).toHaveAttackPower(4);
  });

  it("happy: reprise returns the non-equipment defending card to hand", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [routRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);
    const Dash = game.as(dash);

    Kassai.activate(cintariSaber);
    game.advanceCombatTo("defend");
    Dash.defendWith(nimblismBlue);
    game.advanceCombatTo("reaction");
    const reactionId = Kassai.findCardInZone("hand", routRed);
    game.playInstance(Kassai.id, reactionId, undefined, "explicit");
    game.passBoth();
    Kassai.accept();
    Kassai.target(nimblismBlue);
    game.passBoth();

    expectFabCard(Kassai, routRed).toBeIn("graveyard");
    expectCombat(game).toHaveAttackPower(5);
    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
  });

  it("timing: no hand defense this chain link — no Reprise bounce", () => {
    const game = FabTestEngine.start(
      {
        hero: kassaiOfTheGoldenSand,
        weapon1: [cintariSaber],
        hand: [routRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassaiOfTheGoldenSand);
    const Dash = game.as(dash);

    Kassai.activate(cintariSaber);
    game.advanceCombatTo("defend");
    Dash.defendWith();
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(routRed);
    game.passBoth();
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
  });
});
