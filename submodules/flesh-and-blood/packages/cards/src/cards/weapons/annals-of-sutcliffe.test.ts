import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { sharpenSteelRed } from "../actions/sharpen-steel.ts";
import { snatchRed } from "../actions/snatch.ts";
import { briar } from "../shared/test-recipients.ts";
import { annalsOfSutcliffe } from "./annals-of-sutcliffe.ts";

/**
 * Annals of Sutcliffe (DYN172) — Runeblade 2H Book Weapon.
 *
 * Printed:
 *   Once per Turn Action - {r}{r}{r}: Draw a card. If an attack action card
 *   and a 'non-attack' action card were pitched this way, create a Runechant
 *   token.
 *
 * CR 1.14.2d/1.14.3: "this way" is the pitch payment made for THIS
 * activation — cards pitched one at a time from hand while paying the 3{r}
 * cost. The activation payment stamps the
 * pitched-attack-and-non-attack-action-to-play-this binding from the pitched
 * cards' printed type boxes (attack actions carry the Attack subtype).
 */

describe("Annals of Sutcliffe (DYN172) AAA", () => {
  it("happy: attack action + non-attack action pitched this way → draw and create a Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        weapon1: [annalsOfSutcliffe],
        hand: [snatchRed, sharpenSteelRed], // attack action + non-attack action
        resourcePoints: 1, // banked first; the 2{r} remainder pitches one card each
        actionPoints: 1,
        deck: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const attack = Briar.cardsIn("hand", snatchRed)[0]!;
    const nonAttack = Briar.cardsIn("hand", sharpenSteelRed)[0]!;

    // Activate; the 3{r} cost suspends on the one-at-a-time pitch payment.
    Briar.activate(annalsOfSutcliffe);
    game.answerDecision(Briar.id, { kind: "payment", instanceIds: [attack.instanceId] });
    game.answerDecision(Briar.id, { kind: "payment", instanceIds: [nonAttack.instanceId] });
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    // Drew the deck's card; both pitched kinds were present → 1 Runechant.
    expectFabPlayer(Briar).toHaveHandCount(1);
    expectFabPlayer(Briar).toHaveTokenCount("runechant", 1);
    expect(Briar.zone("pitch")).toContain(snatchRed.canonicalId);
    expect(Briar.zone("pitch")).toContain(sharpenSteelRed.canonicalId);
  });

  it("boundary: banked resources only (nothing pitched this way) → draw, no Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        weapon1: [annalsOfSutcliffe],
        hand: [],
        resourcePoints: 3, // fully banked — no card is pitched "this way"
        actionPoints: 1,
        deck: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.activate(annalsOfSutcliffe);
    game.passBoth();

    expectFabPlayer(Briar).toHaveHandCount(1);
    expectFabPlayer(Briar).toHaveTokenCount("runechant", 0);
  });

  it("boundary: two attack actions pitched (no non-attack action) → draw, no Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        weapon1: [annalsOfSutcliffe],
        hand: [snatchRed, snatchRed], // both pitched cards are attack actions
        resourcePoints: 1,
        actionPoints: 1,
        deck: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);
    const pitched = Briar.cardsIn("hand", snatchRed);

    Briar.activate(annalsOfSutcliffe);
    game.answerDecision(Briar.id, { kind: "payment", instanceIds: [pitched[0]!.instanceId] });
    game.answerDecision(Briar.id, { kind: "payment", instanceIds: [pitched[1]!.instanceId] });
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    // The AND-clause fails: an attack action was pitched but no non-attack action.
    expectFabPlayer(Briar).toHaveHandCount(1);
    expectFabPlayer(Briar).toHaveTokenCount("runechant", 0);
  });

  it("timing: once per turn — the second activation is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        weapon1: [annalsOfSutcliffe],
        hand: [],
        resourcePoints: 6,
        actionPoints: 2,
        deck: 2,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.activate(annalsOfSutcliffe);
    game.passBoth();
    expectFabPlayer(Briar).toHaveHandCount(1);

    Briar.expectActivationRejected(annalsOfSutcliffe);
    expectFabPlayer(Briar).toHaveHandCount(1);
  });
});
