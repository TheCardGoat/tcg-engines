import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { dorinthea } from "../heroes/dorinthea.ts";
import { snatchRed } from "../actions/snatch.ts";
import { ironsongResponseRed } from "./ironsong-response.ts";
import { singingSteelbladeYellow } from "./singing-steelblade.ts";

/**
 * Singing Steelblade Yellow (WTR121) — Warrior Attack Reaction.
 *
 * Printed:
 *   Dorinthea Specialization
 *   Target weapon attack gains +1{p}.
 *   Reprise - If the defending hero has defended with a card from hand this
 *   chain link, search your deck for an attack reaction card, banish it face
 *   up, then shuffle your deck. You may play it this chain link.
 */

describe("Singing Steelblade (WTR121) AAA", () => {
  it("happy: target weapon attack gains +1 power", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [cintariSaber],
        hand: [singingSteelbladeYellow],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.must.activate(cintariSaber);
    game.advanceCombatTo("reaction");
    Dori.must.playReaction(singingSteelbladeYellow);
    game.passBoth();

    // Cintari Saber base 2 + 1 = 3. No hand defense, so Reprise does not search.
    expectCombat(game).toHaveAttackPower(3);
    expectFabCard(Dori, singingSteelbladeYellow).toBeIn("graveyard");
  });

  it("boundary: cannot play targeting a non-weapon attack", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [singingSteelbladeYellow, snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");

    expect(() => Dori.must.playReaction(singingSteelbladeYellow)).toThrow();
  });

  it("interaction: Reprise searches an attack reaction after a hand defense and banishes it face up", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        weapon1: [cintariSaber],
        hand: [singingSteelbladeYellow],
        deck: [snatchRed, ironsongResponseRed, snatchRed, snatchRed],
        resourcePoints: 2,
        actionPoints: 1,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);
    const Dash = game.as(dash);

    Dori.must.activate(cintariSaber);
    game.advanceCombatTo("defend");
    Dash.defendWith(snatchRed);
    game.advanceCombatTo("reaction");
    Dori.must.playReaction(singingSteelbladeYellow);
    game.passBoth();
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: ironsongResponseRed.canonicalId,
      optionalBoolean: false,
    });

    expectFabCard(Dori, ironsongResponseRed).toBeBanished();
  });
});
