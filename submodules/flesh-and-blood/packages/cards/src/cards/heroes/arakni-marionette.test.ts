import { describe, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { arakniMarionette } from "./arakni-marionette.ts";
import { hunterSKlaive } from "../weapons/hunter-s-klaive.ts";
import { whittleFromBoneRed } from "../actions/whittle-from-bone.ts";
import { arakniTrapDoor } from "../demi-heroes/arakni-trap-door.ts";

/**
 * Hero behavior acceptance test — Arakni, Marionette (HNT001).
 *
 * Implements the per-hero AAA requirements:
 * - Core mechanic: stealth vs marked hero → +1{p} + on-hit go again
 * - Core interaction: end-phase Agents of Chaos transform
 * - Boundaries: 40hp health, weapon mark-on-hit, no bonus vs unmarked
 *
 * Signature weapon: Hunter's Klaive (HNT009)
 *
 * FLUENT API ONLY — no .exec(), listLegalCommands, or answerPaymentDecision.
 */

const opponentHero = dash;

describe("arakni-marionette (HNT001)", () => {
  it("boundaries: hero defaults to 40 life (Adult health boundary)", () => {
    const game = FabTestEngine.start(
      { hero: arakniMarionette, deck: 6 },
      { hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(arakniMarionette)).toHaveLife(40);
  });

  it("signature weapon: Hunter's Klaive (HNT009) activates and opens combat at 1 power", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [hunterSKlaive],
        resourcePoints: 2,
        actionPoints: 1,
        inventory: [arakniTrapDoor],
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.activate(hunterSKlaive);
    game.passBoth();

    expectCombat(game).toBeOpen().toHaveAttackPower(1);
  });

  it("core mechanic: Hunter's Klaive hit marks the opponent", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [hunterSKlaive],
        resourcePoints: 2,
        actionPoints: 1,
        inventory: [arakniTrapDoor],
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.activate(hunterSKlaive);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    // After combat closes, opponent should be marked.
    const opponentPlayer = game.as(opponentHero);
    expectFabPlayer(opponentPlayer).toBeMarked();
  });

  it("core mechanic: stealth attack vs marked hero gets +1 power", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [hunterSKlaive],
        hand: [whittleFromBoneRed],
        resourcePoints: 4,
        actionPoints: 2,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Arakni = game.as(arakniMarionette);

    // Step 1 — mark opponent with Hunter's Klaive.
    Arakni.activate(hunterSKlaive);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    // Step 2 — attack marked opponent with stealth card.
    Arakni.attackWith(whittleFromBoneRed);
    game.passBoth();

    // Combat advanced to reaction after passBoth.
    expectCombat(game).toBeAtStep("reaction");
    // whittle-from-bone-red base 3{p} + 1 from mark = 4.
    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundaries: stealth attack vs unmarked hero does NOT get the power bonus", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [whittleFromBoneRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.attackWith(whittleFromBoneRed);
    game.passBoth();

    // Combat advanced to reaction after passBoth.
    expectCombat(game).toBeAtStep("reaction");
    expectCombat(game).toHaveAttackPower(3);
  });

  it("core mechanic: a stealth hit on a marked hero grants go again (AP refund)", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        hand: [whittleFromBoneRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: opponentHero, life: 20, marked: true, deck: 6 },
    );
    const Arakni = game.as(arakniMarionette);
    const Opponent = game.as(opponentHero);

    Arakni.must.playAttack(whittleFromBoneRed);
    game.helpers.resolveUntilIdle({ ordering: "listed" });

    // The printed on-hit rider grants go again, refunding the spent action point.
    expectFabPlayer(Opponent).toHaveLife(16);
    expectFabPlayer(Arakni).toHaveAP(1);
  });

  it("core mechanic: end-phase transform trigger fires when opponent is marked", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        weapon1: [hunterSKlaive],
        resourcePoints: 2,
        actionPoints: 1,
        inventory: [arakniTrapDoor],
        deck: 6,
      },
      { hero: opponentHero, life: 20, deck: 6 },
    );
    const Arakni = game.as(arakniMarionette);

    // Mark opponent with Hunter's Klaive.
    Arakni.activate(hunterSKlaive);
    game.passBoth();
    game.passBoth();

    // End turn — end phase begins, transform trigger fires.
    Arakni.endTurn();

    // Random Agent selection is journal-committed. The selected Agent's newly
    // active Become trigger is then collected from the post-copy rules view
    // and exposes its genuine optional search decision.
    Arakni.expectDecision("boolean");
  });
});
