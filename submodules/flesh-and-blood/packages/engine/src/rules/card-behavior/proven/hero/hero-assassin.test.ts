/**
 * Hero behavior acceptance tests — Assassin family.
 *
 * Implements the per-hero AAA requirements from HEROES.md for the Assassin
 * class heroes: arakni (6 identities), nuu (2), uzuri (2).
 *
 * Each test covers Core mechanic, Core interaction, and Boundaries/edge cases
 * following the Arrange / Act / Assert standard in INTENT.md. Heroes whose
 * mechanics depend on engine subsystems not yet implemented are marked with
 * it.todo and a gap note so the requirement stays visible.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine, expectCombat, expectFabCard, expectFabPlayer } from "../../../../index.ts";
import { listLegalCommands } from "../../../../automation/legal-commands.ts";
import { AGENT_OF_CHAOS_CANONICAL_IDS } from "../../../../testing/demi-hero-registry.ts";
import { creepRed, nimblismBlue, snatchRed, tomeOfFyendalYellow } from "../../../fixtures.ts";

import { arakniSolitaryConfinement } from "../../../../../../cards/src/cards/heroes/arakni-solitary-confinement.ts";
import { arakni } from "../../../../../../cards/src/cards/heroes/arakni.ts";
import { arakniHuntsman } from "../../../../../../cards/src/cards/heroes/arakni-huntsman.ts";
import { robTheRichBlue } from "../../../../../../cards/src/cards/actions/rob-the-rich.ts";
import { bravo } from "../../../../../../cards/src/cards/heroes/bravo.ts";
import { plungeTheProspectBlue } from "../../../../../../cards/src/cards/actions/plunge-the-prospect.ts";
import { whittleFromBoneRed } from "../../../../../../cards/src/cards/actions/whittle-from-bone.ts";
import { arakni5lP3d7hru7h3Cr4x } from "../../../../../../cards/src/cards/heroes/arakni-5l-p3d-7hru-7h3-cr4x.ts";
import { arakniMarionette } from "../../../../../../cards/src/cards/heroes/arakni-marionette.ts";
import { arakniTrapDoor } from "../../../../../../cards/src/cards/demi-heroes/arakni-trap-door.ts";
import { arakniWebOfDeceit } from "../../../../../../cards/src/cards/heroes/arakni-web-of-deceit.ts";
import { nuu } from "../../../../../../cards/src/cards/heroes/nuu.ts";
import { nuuAlluringDesire } from "../../../../../../cards/src/cards/heroes/nuu-alluring-desire.ts";
import { uzuri } from "../../../../../../cards/src/cards/heroes/uzuri.ts";
import { uzuriSwitchblade } from "../../../../../../cards/src/cards/heroes/uzuri-switchblade.ts";

/** Accept optional look / put-on-bottom booleans after a contract play trigger. */
function acceptArakniContractOptionals(
  game: ReturnType<typeof FabTestEngine.start>,
  actor: ReturnType<ReturnType<typeof FabTestEngine.start>["as"]>,
): void {
  for (let i = 0; i < 8; i++) {
    const decision = game.getState().decision;
    if (!decision) break;
    if (decision.kind === "boolean") {
      actor.exec({
        move: "answer-decision",
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: true },
        },
      });
      continue;
    }
    break;
  }
}

const opponentHero = bravo;

// ---------------------------------------------------------------------------
// arakni-solitary-confinement — ARA001 — 19hp Young
// Printed: "Your first attack with stealth each turn has go again."
// ---------------------------------------------------------------------------

describe("arakni-solitary-confinement (ARA001)", () => {
  it("core mechanic: first stealth attack each turn gains go again from the hero passive", () => {
    // Arrange — Arakni Solitary Confinement with a stealth attack in hand.
    const game = FabTestEngine.start(
      { hero: arakniSolitaryConfinement, hand: [creepRed], deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Arakni = game.as(arakniSolitaryConfinement);

    // Act — attack with creep-red (a stealth attack).
    Arakni.attackWith(creepRed);

    // Assert — the combat chain link carries the go-again keyword from the
    // hero's passive ability (creep-red's own trigger targets the NEXT attack).
    expectCombat(game).toBeAtStep("defend");
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
  });

  it("boundaries: a non-stealth attack does NOT gain go again from the hero passive", () => {
    // Arrange — snatch-red is a non-stealth attack action.
    const game = FabTestEngine.start(
      { hero: arakniSolitaryConfinement, hand: [snatchRed], deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Arakni = game.as(arakniSolitaryConfinement);

    // Act — attack with snatch-red (no stealth keyword).
    Arakni.attackWith(snatchRed);

    // Assert — go-again is NOT granted because snatch-red lacks stealth.
    expectCombat(game).toBeAtStep("defend");
    expect(game.combat()?.activeLink?.keywords).not.toContain("go-again");
  });

  it("boundaries: hero defaults to 19 life (Young health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: arakniSolitaryConfinement, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(arakniSolitaryConfinement)).toHaveLife(19);
  });

  it("core interaction: the go-again granted by the hero passive refunds the AP spent, enabling a second action", () => {
    // Arrange — Arakni with two attacks in hand: creep-red (a stealth attack
    // whose own triggered ability targets the NEXT stealth attack this combat
    // chain) and snatch-red (a plain non-stealth follow-up). To cleanly
    // attribute the go-again to the hero passive (not creep-red's own trigger),
    // we resolve the first attack fully out of the combat chain before playing
    // the second.
    const game = FabTestEngine.start(
      { hero: arakniSolitaryConfinement, hand: [creepRed, snatchRed], deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Arakni = game.as(arakniSolitaryConfinement);
    const Opponent = game.as(opponentHero);

    // Act — play creep-red; the hero passive grants go-again (AP spent: 1→0).
    Arakni.attackWith(creepRed);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    expectFabPlayer(Arakni).toHaveAP(0);

    // Resolve creep-red fully out of the combat chain. At the resolution step
    // go-again refunds 1 AP (CR 8.3.5). resolveRestOfCombat closes the chain
    // through damage → resolution → close; the refund persists past close.
    game.helpers.resolveRestOfCombat();
    expect(game.combat()).toBeNull();
    expectFabPlayer(Arakni).toHaveAP(1); // go-again refunded the spent AP

    // The refunded AP finances a second action this turn — play snatch-red.
    // Capture opponent life right before the second attack so the assertion
    // is independent of creep-red's already-resolved damage.
    const opponentLifeBeforeSecond = Opponent.life();
    Arakni.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    // Assert — snatch-red connected (opponent took exactly its power in
    // damage) and the refunded AP was consumed by the second attack (1→0).
    // This proves the hero's go-again has real economic value, not just a
    // keyword flag.
    expectFabPlayer(Arakni).toHaveAP(0);
    expectFabPlayer(Opponent).toHaveLife(opponentLifeBeforeSecond - snatchRed.base.numeric.power!);
  });

  it("boundaries: only the FIRST stealth attack each turn gains go again; a second stealth attack the same turn does not", () => {
    // Arrange — Arakni with two CLEAN stealth attacks in hand: whittle-from-bone-red
    // (HNT020) and plunge-the-prospect-blue (HNT043). Neither card grants go-again
    // itself, and neither carries an `appliesTo.next` continuous effect that could
    // mask the hero-passive boundary while the first chain remains open. This is
    // why we avoid creep-red here: its own "the next attack with stealth this
    // combat chain gets go again" trigger creates another source of go again.
    // whittle-from-bone-red's trigger
    // fires only vs a MARKED hero (absent here); plunge-the-prospect-blue's
    // resolution effect is +1 power vs a marked hero (absent here). So the only
    // possible go-again source on either chain link is the hero passive.
    const game = FabTestEngine.start(
      {
        hero: arakniSolitaryConfinement,
        hand: [whittleFromBoneRed, plungeTheProspectBlue],
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Arakni = game.as(arakniSolitaryConfinement);

    // Act — first stealth attack: gains go-again from the hero passive
    // (per-turn quota consumed: remaining 1→0).
    Arakni.attackWith(whittleFromBoneRed);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    // Resolve fully out of the combat chain (closes the chain).
    game.helpers.resolveRestOfCombat();
    expect(game.combat()).toBeNull();

    // Second stealth attack the SAME turn: the per-turn quota is spent, so
    // the hero passive does NOT grant go-again.
    Arakni.attackWith(plungeTheProspectBlue);

    // Assert — second stealth attack carries no go-again (the boundary holds).
    expect(game.combat()?.activeLink?.keywords).not.toContain("go-again");
  });

  it("boundaries: the per-turn quota resets — the first stealth attack on turn 2 gains go again (foundation-fix proof)", () => {
    // Arrange — Arakni with two CLEAN stealth attacks: whittle-from-bone-red
    // (HNT020) for turn 1 and plunge-the-prospect-blue (HNT043) for turn 2.
    // Both are clean of any own go-again grant (see the previous test's
    // rationale), so any go-again on turn 2's chain link must come from the
    // hero passive — and only if the per-turn quota reset at the turn boundary.
    const game = FabTestEngine.start(
      {
        hero: arakniSolitaryConfinement,
        hand: [whittleFromBoneRed, plungeTheProspectBlue],
        deck: 6,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Arakni = game.as(arakniSolitaryConfinement);
    const Opponent = game.as(opponentHero);

    // Act — Turn 1 (global turn 1): first stealth attack gains go-again;
    // resolve fully. The hero passive's per-turn quota is consumed (1→0).
    Arakni.attackWith(whittleFromBoneRed);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    game.helpers.resolveRestOfCombat();
    expect(game.combat()).toBeNull();

    // Pass the turn. The engine uses GLOBAL turn counting: Arakni (player 1)
    // turn 1 → Opponent turn 2 → Arakni turn 3. advance-turn re-arms the
    // per-turn future applicator on every turn boundary (remaining 0→1,
    // observed/latched cleared); consumption is already controller-scoped, so
    // an opponent's turn cannot spend Arakni's quota.
    Arakni.endTurn();
    Opponent.endTurn();
    expect(game.turn()).toBe(3); // global turn counter; Arakni's 2nd turn
    expect(game.active().id).toBe(Arakni.id);

    // Turn 2 (global turn 3): the first stealth attack of THIS turn gains
    // go-again again — the proof that the foundation fix re-arms the per-turn
    // quota at the turn boundary.
    Arakni.attackWith(plungeTheProspectBlue);

    // Assert — go-again is present on this turn's first stealth attack.
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
  });
});

// ---------------------------------------------------------------------------
// arakni — DYN114 — 20hp Young
// Printed: "Whenever you play a card with contract, you may look at the top
// card of target opponent's deck. You may put it on the bottom."
// ---------------------------------------------------------------------------

describe("arakni (DYN114)", () => {
  it("boundaries: hero defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: arakni, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(arakni)).toHaveLife(20);
  });

  it("core mechanic: play contract → look opponent top → may put on bottom", () => {
    // HEROES.md arakni core — contract play triggers optional look + optional bottom.
    // Opponent deck top = snatch (array end). Rob the Rich is a labeled contract attack.
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [robTheRichBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      {
        hand: [],
        hero: opponentHero,
        deck: [tomeOfFyendalYellow, nimblismBlue, snatchRed],
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Arakni = game.as(arakni);
    const Opponent = game.as(opponentHero);
    const topBefore = Opponent.zone("deck").at(-1);
    expect(topBefore).toBe(snatchRed.canonicalId);

    Arakni.play(robTheRichBlue);
    game.passBoth();
    // Trigger layer: optional look + optional bottom.
    acceptArakniContractOptionals(game, Arakni);
    game.passBoth();

    // Assert — looked card moved from top to bottom of opponent's deck.
    expect(Opponent.zone("deck")[0]).toBe(snatchRed.canonicalId);
    expect(Opponent.zone("deck").at(-1)).not.toBe(snatchRed.canonicalId);
  });

  it("boundaries: non-contract plays do not reorder the opponent's deck", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      {
        hand: [],
        hero: opponentHero,
        deck: [tomeOfFyendalYellow, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Arakni = game.as(arakni);
    const Opponent = game.as(opponentHero);
    const topBefore = Opponent.zone("deck").at(-1);

    Arakni.play(snatchRed);
    game.passBoth();
    // Accept any unexpected optionals if presented (should not fire).
    acceptArakniContractOptionals(game, Arakni);
    game.passBoth();

    expect(Opponent.zone("deck").at(-1)).toBe(topBefore);
    expect(Opponent.zone("deck")[0]).toBe(tomeOfFyendalYellow.canonicalId);
  });

  it("core interaction: declining the look leaves the opponent deck order unchanged", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [robTheRichBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      {
        hand: [],
        hero: opponentHero,
        deck: [tomeOfFyendalYellow, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Arakni = game.as(arakni);
    const Opponent = game.as(opponentHero);
    const topBefore = Opponent.zone("deck").at(-1);
    const bottomBefore = Opponent.zone("deck")[0];

    Arakni.play(robTheRichBlue);
    game.passBoth();
    // Decline the optional look.
    for (let i = 0; i < 4; i++) {
      const decision = game.getState().decision;
      if (!decision) break;
      if (decision.kind === "boolean") {
        Arakni.exec({
          move: "answer-decision",
          payload: {
            decisionId: decision.decisionId,
            stateVersion: decision.stateVersion,
            answer: { kind: "boolean", value: false },
          },
        });
        continue;
      }
      break;
    }
    game.passBoth();

    expect(Opponent.zone("deck").at(-1)).toBe(topBefore);
    expect(Opponent.zone("deck")[0]).toBe(bottomBefore);
  });
});

// ---------------------------------------------------------------------------
// arakni-huntsman — DYN113 — 40hp Adult
// Shares the same mechanic as arakni (DYN114) — assert Adult health boundary.
// ---------------------------------------------------------------------------

describe("arakni-huntsman (DYN113)", () => {
  it("boundaries: hero defaults to 40 life (Adult health boundary, distinct from Young arakni's 20)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: arakniHuntsman, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(arakniHuntsman)).toHaveLife(40);
  });

  it("core mechanic: Adult shares contract look + bottom (parity)", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniHuntsman,
        hand: [robTheRichBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 4,
      },
      {
        hand: [],
        hero: opponentHero,
        deck: [tomeOfFyendalYellow, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Arakni = game.as(arakniHuntsman);
    const Opponent = game.as(opponentHero);

    Arakni.play(robTheRichBlue);
    game.passBoth();
    acceptArakniContractOptionals(game, Arakni);
    game.passBoth();

    expect(Opponent.zone("deck")[0]).toBe(snatchRed.canonicalId);
  });
});

// ---------------------------------------------------------------------------
// arakni-marionette — HNT001 — 40hp Chaos/Assassin
// arakni-web-of-deceit — HNT002 — 20hp Chaos/Young
// Printed: stealth attacks vs a marked hero get +1{p} and go-again-on-hit;
// end-phase transformation into a random Agent of Chaos if an opponent is marked.
// ---------------------------------------------------------------------------

/** Drain end-phase priority so end-phase triggers (e.g. arakni-marionette's
 * Agent-of-Chaos transformation) fully resolve. Mirrors the helper in the
 * warrior-wizard-adjudicator suite. */
function drainEndPhasePriority(game: ReturnType<typeof FabTestEngine.start>): void {
  const players = game.getState().playerIds;
  for (let safety = 0; safety < 40; safety += 1) {
    if (game.answerForcedDecision()) continue;
    const decision = game.getState().decision;
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "ordering", orderedIds: decision.entries.map((e) => e.id) },
        },
      });
      continue;
    }
    if (decision) {
      if (game.answerForcedDecision()) continue;
      break;
    }
    if ((game.getState().rulesStack?.length ?? 0) === 0 && !game.getState().rulesProcess) break;
    for (const actorId of players) {
      try {
        game.exec({ move: "pass", actorId });
      } catch {
        /* not this player's pass window */
      }
    }
  }
}

describe("arakni-marionette family (HNT001/HNT002)", () => {
  it("boundaries: arakni-marionette defaults to 40 life (Adult health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: arakniMarionette, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(arakniMarionette)).toHaveLife(40);
  });

  it("boundaries: arakni-web-of-deceit defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: arakniWebOfDeceit, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(arakniWebOfDeceit)).toHaveLife(20);
  });

  it("variant: arakni-marionette (HNT001) shares the same marked-hero +1 power mechanic", () => {
    // Arrange — Arakni Marionette (Adult version) with creep-red attacking
    // a marked opponent.  Same continuous effect as HNT002.
    const game = FabTestEngine.start(
      { hero: arakniMarionette, hand: [creepRed], deck: 6 },
      { hand: [], hero: opponentHero, deck: 6, marked: true },
      { autoPassPriority: false },
    );
    const Arakni = game.as(arakniMarionette);

    // Act — attack with creep-red targeting the marked hero.
    Arakni.attackWith(creepRed);

    // Assert — +1 power from the shared continuous effect (3 + 1 = 4).
    expectCombat(game).toBeAtStep("defend");
    expectFabCard(Arakni, creepRed).toHavePower(4);
  });

  it("core mechanic: stealth attacks vs a marked hero get +1 power", () => {
    // Arrange — Arakni Web of Deceit with creep-red (stealth, base power 3)
    // attacking an opponent who is marked.
    const game = FabTestEngine.start(
      { hero: arakniWebOfDeceit, hand: [creepRed], deck: 6 },
      { hand: [], hero: opponentHero, deck: 6, marked: true },
      { autoPassPriority: false },
    );
    const Arakni = game.as(arakniWebOfDeceit);

    // Act — attack with creep-red targeting the marked hero.
    Arakni.attackWith(creepRed);

    // Assert — the attack gets +1 power from the continuous effect
    // (base 3 + 1 = 4).
    expectCombat(game).toBeAtStep("defend");
    expectFabCard(Arakni, creepRed).toHavePower(4);
  });

  it("core mechanic: at end phase with a marked opponent, become a random Agent of Chaos", () => {
    // Pool = catalog demi-heroes registered via demi-hero-registry (HNT003–008).
    const agentOfChaosIds = new Set(AGENT_OF_CHAOS_CANONICAL_IDS);
    const game = FabTestEngine.start(
      { hand: [], hero: arakniMarionette, inventory: [arakniTrapDoor], deck: 6 },
      { hand: [], hero: opponentHero, deck: 6, marked: true },
      { autoPassPriority: false },
    );
    const Arakni = game.as(arakniMarionette);

    // Act — end the turn; the end-phase trigger fires (opponent is marked).
    Arakni.endTurn();
    drainEndPhasePriority(game);

    // Assert — Become preserves the seated hero's physical identity and
    // freezes one actual inventory Agent's copyable properties.
    const heroId = game.getState().players[Arakni.id]?.heroCardId;
    const heroObj = heroId ? game.getState().objects[heroId] : null;
    expect(heroObj).not.toBeNull();
    expect(heroObj!.canonicalId).toBe(arakniMarionette.canonicalId);
    const copiedAgentId = game
      .getState()
      .continuousEffectInstances.flatMap((instance) =>
        instance.atoms.flatMap((atom) =>
          atom.kind === "copy" && atom.sourceProvenance ? [atom.sourceProvenance.instanceId] : [],
        ),
      )[0];
    expect(copiedAgentId).toBeTruthy();
    expect(agentOfChaosIds.has(game.getState().objects[copiedAgentId!]!.canonicalId)).toBe(true);
  });

  it("boundaries: at end phase with NO marked opponent, the hero does NOT transform", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: arakniMarionette, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 }, // NOT marked
      { autoPassPriority: false },
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.endTurn();
    drainEndPhasePriority(game);

    // Assert — the hero is still arakni-marionette (no transformation).
    const heroId = game.getState().players[Arakni.id]?.heroCardId;
    const heroObj = heroId ? game.getState().objects[heroId] : null;
    expect(heroObj?.canonicalId).toBe(arakniMarionette.canonicalId);
  });

  it("boundaries: attacking a non-marked hero yields no +1 power", () => {
    // Arrange — same setup but opponent is NOT marked.
    const game = FabTestEngine.start(
      { hero: arakniWebOfDeceit, hand: [creepRed], deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Arakni = game.as(arakniWebOfDeceit);

    // Act — attack with creep-red targeting the unmarked hero.
    Arakni.attackWith(creepRed);

    // Assert — the attack stays at its printed power (3) — no bonus.
    expectCombat(game).toBeAtStep("defend");
    expectFabCard(Arakni, creepRed).toHavePower(3);
  });

  it("core mechanic: a stealth attack that HITS a marked hero gains go again (on hit)", () => {
    // Arrange — Arakni Marionette with creep-red (stealth, base power 3, no
    // innate go-again — its own text buffs the NEXT stealth attack) attacking
    // a marked opponent. 1 AP.
    const game = FabTestEngine.start(
      { hero: arakniMarionette, hand: [creepRed], deck: 6, actionPoints: 1 },
      { hand: [], hero: opponentHero, deck: 6, marked: true },
      { autoPassPriority: false },
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.attackWith(creepRed);

    // Before the hit: the +1 power is applied (3 → 4), but go-again is NOT yet
    // on the link — arakni-marionette grants go-again ON HIT, not on play.
    expectCombat(game).toBeAtStep("defend");
    expectFabCard(Arakni, creepRed).toHavePower(4);
    expect(game.combat()?.activeLink?.keywords).not.toContain("go-again");

    // Resolve (no defense) → the attack hits → the granted hit-trigger fires.
    game.helpers.resolveRestOfCombat();

    // go-again refunds the AP spent to play the attack (CR 8.3.5).
    expectFabPlayer(Arakni).toHaveAP(1);
  });

  it("boundaries: a NON-stealth attack vs a marked hero gets neither +1 nor go-again", () => {
    // The dual gate requires BOTH stealth AND a marked target. snatch-red
    // (power 4, no stealth) vs a marked hero yields no bonus.
    const game = FabTestEngine.start(
      { hero: arakniMarionette, hand: [snatchRed], deck: 6, actionPoints: 1 },
      { hand: [], hero: opponentHero, deck: 6, marked: true },
      { autoPassPriority: false },
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.attackWith(snatchRed);
    expectCombat(game).toBeAtStep("defend");
    // No +1 (stays at printed 4, not 5).
    expectFabCard(Arakni, snatchRed).toHavePower(4);

    game.helpers.resolveRestOfCombat();
    // No go-again → the spent AP is NOT refunded.
    expectFabPlayer(Arakni).toHaveAP(0);
  });
});

// ---------------------------------------------------------------------------
// arakni-5l-p3d-7hru-7h3-cr4x — HNT261 — 38hp Chaos/Assassin promo
// Printed: "The first attack with stealth each turn gets go again."
// Mechanically identical to arakni-solitary-confinement but NOT gated on a
// marked target and at a different health boundary.
// ---------------------------------------------------------------------------

describe("arakni-5l-p3d-7hru-7h3-cr4x (HNT261)", () => {
  it("boundaries: hero defaults to 38 life (Adult health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: arakni5lP3d7hru7h3Cr4x, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(arakni5lP3d7hru7h3Cr4x)).toHaveLife(38);
  });

  it("core mechanic: first stealth attack each turn gains go again (same as ARA001 but ungated)", () => {
    // Arrange — Arakni promo with a stealth attack in hand. No marked status
    // is present on the opponent, yet go-again fires — this hero's passive
    // is NOT gated on a marked target (contrast arakni-marionette, whose
    // stealth bonus IS marked-gated).
    const game = FabTestEngine.start(
      { hero: arakni5lP3d7hru7h3Cr4x, hand: [creepRed], deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Arakni = game.as(arakni5lP3d7hru7h3Cr4x);

    // Act — attack with creep-red (a stealth attack).
    Arakni.attackWith(creepRed);

    // Assert — the combat chain link carries go-again from the hero passive.
    expectCombat(game).toBeAtStep("defend");
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
  });

  it("core interaction: the go-again granted by the hero passive refunds the AP spent, enabling a second action", () => {
    // Arrange — Arakni promo with two attacks in hand: creep-red (a stealth
    // attack whose own triggered ability targets the NEXT stealth attack this
    // combat chain) and snatch-red (a plain non-stealth follow-up). To cleanly
    // attribute the go-again to the hero passive (not creep-red's own trigger),
    // we resolve the first attack fully out of the combat chain before playing
    // the second.
    const game = FabTestEngine.start(
      { hero: arakni5lP3d7hru7h3Cr4x, hand: [creepRed, snatchRed], deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Arakni = game.as(arakni5lP3d7hru7h3Cr4x);
    const Opponent = game.as(opponentHero);

    // Act — play creep-red; the hero passive grants go-again (AP spent: 1→0).
    Arakni.attackWith(creepRed);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    expectFabPlayer(Arakni).toHaveAP(0);

    // Resolve creep-red fully out of the combat chain. At the resolution step
    // go-again refunds 1 AP (CR 8.3.5). resolveRestOfCombat closes the chain
    // through damage → resolution → close; the refund persists past close.
    game.helpers.resolveRestOfCombat();
    expect(game.combat()).toBeNull();
    expectFabPlayer(Arakni).toHaveAP(1); // go-again refunded the spent AP

    // The refunded AP finances a second action this turn — play snatch-red.
    // Capture opponent life right before the second attack so the assertion
    // is independent of creep-red's already-resolved damage.
    const opponentLifeBeforeSecond = Opponent.life();
    Arakni.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();

    // Assert — snatch-red connected (opponent took exactly its power in
    // damage) and the refunded AP was consumed by the second attack (1→0).
    // This proves the hero's go-again has real economic value, not just a
    // keyword flag.
    expectFabPlayer(Arakni).toHaveAP(0);
    expectFabPlayer(Opponent).toHaveLife(opponentLifeBeforeSecond - snatchRed.base.numeric.power!);
  });

  it("boundaries: only the FIRST stealth attack each turn gains go again; a second stealth attack the same turn does not", () => {
    // Arrange — Arakni promo with two CLEAN stealth attacks in hand:
    // whittle-from-bone-red (HNT020) and plunge-the-prospect-blue (HNT043).
    // Neither card grants go-again itself, and neither carries an
    // `appliesTo.next` continuous effect that could mask the hero-passive
    // boundary while its combat chain remains open. This is why we avoid
    // creep-red here: its own "the next attack with stealth this combat chain
    // gets go again" trigger creates another source of go again.
    // whittle-from-bone-red's trigger fires
    // only vs a MARKED hero (absent here); plunge-the-prospect-blue's
    // resolution effect is +1 power vs a marked hero (absent here). So the
    // only possible go-again source on either chain link is the hero passive.
    const game = FabTestEngine.start(
      { hero: arakni5lP3d7hru7h3Cr4x, hand: [whittleFromBoneRed, plungeTheProspectBlue], deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Arakni = game.as(arakni5lP3d7hru7h3Cr4x);

    // Act — first stealth attack: gains go-again from the hero passive
    // (per-turn quota consumed: remaining 1→0).
    Arakni.attackWith(whittleFromBoneRed);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    // Resolve fully out of the combat chain (closes the chain).
    game.helpers.resolveRestOfCombat();
    expect(game.combat()).toBeNull();

    // Second stealth attack the SAME turn: the per-turn quota is spent, so
    // the hero passive does NOT grant go-again.
    Arakni.attackWith(plungeTheProspectBlue);

    // Assert — second stealth attack carries no go-again (the boundary holds).
    expect(game.combat()?.activeLink?.keywords).not.toContain("go-again");
  });

  it("boundaries: the per-turn quota resets — the first stealth attack on turn 2 gains go again (foundation-fix proof)", () => {
    // Arrange — Arakni promo with two CLEAN stealth attacks:
    // whittle-from-bone-red (HNT020) for turn 1 and plunge-the-prospect-blue
    // (HNT043) for turn 2. Both are clean of any own go-again grant (see the
    // previous test's rationale), so any go-again on turn 2's chain link must
    // come from the hero passive — and only if the per-turn quota reset at
    // the turn boundary. This is the proof that the card's `perTurn: true`
    // (the card-model change) and the engine foundation fix (advance-turn
    // re-arming futureApplicability for instances with resets === "turn")
    // work together for this hero.
    const game = FabTestEngine.start(
      { hero: arakni5lP3d7hru7h3Cr4x, hand: [whittleFromBoneRed, plungeTheProspectBlue], deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Arakni = game.as(arakni5lP3d7hru7h3Cr4x);
    const Opponent = game.as(opponentHero);

    // Act — Turn 1 (global turn 1): first stealth attack gains go-again;
    // resolve fully. The hero passive's per-turn quota is consumed (1→0).
    Arakni.attackWith(whittleFromBoneRed);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    game.helpers.resolveRestOfCombat();
    expect(game.combat()).toBeNull();

    // Pass the turn. The engine uses GLOBAL turn counting: Arakni (player 1)
    // turn 1 → Opponent turn 2 → Arakni turn 3. advance-turn re-arms the
    // per-turn future applicator on every turn boundary (remaining 0→1,
    // observed/latched cleared); consumption is already controller-scoped, so
    // an opponent's turn cannot spend Arakni's quota.
    Arakni.endTurn();
    Opponent.endTurn();
    expect(game.turn()).toBe(3); // global turn counter; Arakni's 2nd turn
    expect(game.active().id).toBe(Arakni.id);

    // Turn 2 (global turn 3): the first stealth attack of THIS turn gains
    // go-again again — the proof that the foundation fix re-arms the per-turn
    // quota at the turn boundary.
    Arakni.attackWith(plungeTheProspectBlue);

    // Assert — go-again is present on this turn's first stealth attack.
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
  });
});

// ---------------------------------------------------------------------------
// nuu — MST002 — 20hp Mystic/Assassin/Young
// Printed: stealth attacks gain a chain-link-resolve banish of defending
// action cards; Instant {c}{c}{c}: peek opponent top deck, may banish if blue,
// free-cast blue cards from their banished zone until end of turn.
// Status: Engine-ready (chi Instant peek/banish + cross-owner banished free play).
// Stealth a2 chain-link-resolve banish remains a follow-up dimension.
// ---------------------------------------------------------------------------

/**
 * Activate Nuu's chi Instant (MST002-a3 / MST001-a3), answer the optional
 * answer optional banish when prompted, drain stack.
 */
function resolveNuuChiPeek(
  game: ReturnType<typeof FabTestEngine.start>,
  hero: typeof nuu,
  options: { acceptBanish?: boolean; abilityId?: string } = {},
): void {
  const acceptBanish = options.acceptBanish ?? true;
  const abilityId =
    options.abilityId ??
    (hero === nuuAlluringDesire
      ? "MghLPDjq8CfBJ8RzNc7Ft:instantChiChiChiLookTopOpposingHerosDeckBlueBanishEndTurnPlayBlueHerosBanishedZoneWithoutPayingResourceCost"
      : "prMJkPd8w9KQHQ9BjgMmG:instantChiChiChiLookTopOpposingHerosDeckBlueBanishEndTurnPlayBlueHerosBanishedZoneWithoutPayingResourceCost");
  const player = game.as(hero);
  const opponent = game.as(opponentHero);

  const activate = listLegalCommands(game.getRuntime(), player.id).find(
    (cmd) => cmd.move === "activate" && cmd.payload.ability === abilityId,
  );
  expect(activate).toBeDefined();
  game.exec({ move: "activate", actorId: player.id, payload: activate!.payload });

  for (let safety = 0; safety < 48; safety += 1) {
    if (game.hasGameEnded()) return;
    const decision = game.getState().decision;
    if (decision?.kind === "payment" && decision.actorId === player.id) {
      throw new Error(`Nuu chi activation unexpectedly required payment (${decision.label})`);
    }
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: acceptBanish },
        },
      });
      continue;
    }
    if (decision) {
      if (game.answerForcedDecision()) continue;
      throw new Error(`resolveNuuChiPeek: unhandled ${decision.kind}`);
    }
    if (!game.combat()?.open && game.getState().rulesStack.length === 0) return;
    try {
      game.exec({ move: "pass", actorId: player.id });
      continue;
    } catch {
      /* not this player's pass window */
    }
    try {
      game.exec({ move: "pass", actorId: opponent.id });
      continue;
    } catch {
      /* not this player's pass window */
    }
    break;
  }
}

describe("nuu family (MST001/MST002)", () => {
  it("boundaries: nuu defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: nuu, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(nuu)).toHaveLife(20);
  });

  it("boundaries: nuu-alluring-desire defaults to 40 life (Adult health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: nuuAlluringDesire, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(nuuAlluringDesire)).toHaveLife(40);
  });

  it("core mechanic: pay 3 chi → peek opp top; blue may banish + free-play blue from their banished", () => {
    // Deck array end is top; opening hand draws from top. Leave a blue as the
    // remaining top after 4 draws: [fillers…, blue, drawn, drawn, drawn, drawn].
    const game = FabTestEngine.start(
      { hero: nuu, hand: [], deck: 6, resourcePoints: 0, actionPoints: 1, chiPoints: 3 },
      {
        hand: [],
        hero: opponentHero,
        deck: [robTheRichBlue],
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Nuu = game.as(nuu);
    const Opponent = game.as(opponentHero);

    resolveNuuChiPeek(game, nuu, { acceptBanish: true });

    // Assert — blue banished from opponent; chi spent; free play permission.
    expectFabCard(Opponent, robTheRichBlue).toBeIn("banished");
    expect(game.getState().players[Nuu.id]!.chiPoints).toBe(0);
    const banishedId = game.findCardInZone(Opponent.id, "banished", robTheRichBlue);
    const hasPlayPermission = game
      .getState()
      .continuousEffectInstances.some(
        (c) =>
          c.controllerId === Nuu.id &&
          c.atoms.some(
            (a) =>
              a.kind === "rule" &&
              a.parameters.kind === "play-card" &&
              a.parameters.costModification === "free",
          ) &&
          c.initialSubjects.some((s) => s.instanceId === banishedId),
      );
    expect(hasPlayPermission).toBe(true);

    // Free-play blue from opponent's banished (cross-owner origin).
    // Drain priority until Nuu can begin-play.
    for (let safety = 0; safety < 8; safety += 1) {
      if (game.getState().priority?.holderPlayerId === Nuu.id) break;
      try {
        Opponent.pass();
      } catch {
        break;
      }
    }
    const banishedInstanceId = game
      .getState()
      .containers.zonesByPlayerId[Opponent.id]!.banished.find(
        (id) => game.getState().objects[id]?.canonicalId === robTheRichBlue.canonicalId,
      );
    expect(banishedInstanceId).toBeDefined();
    const beginPlay = listLegalCommands(game.getRuntime(), Nuu.id).find(
      (cmd) =>
        cmd.move === "begin-play" &&
        cmd.payload.from === "banished" &&
        String(cmd.payload.instanceId) === banishedInstanceId,
    );
    expect(beginPlay).toBeDefined();
    game.exec({
      move: "begin-play",
      actorId: Nuu.id,
      payload: beginPlay!.payload,
    });
    // Free cost: no resources spent (printed cost 1).
    expect(Nuu.resourcePoints()).toBe(0);
    expect(Nuu.zone("stack")).toContain(robTheRichBlue.canonicalId);
    expect(Opponent.zone("banished")).not.toContain(robTheRichBlue.canonicalId);
  });

  it("boundaries: non-blue top card is not banished; free-play still grants for blue already banished", () => {
    // Non-blue remains deck-top after draws. Pre-seed a blue in opponent
    // banished so the free-play grant (all blue in their banished) attaches.
    const game = FabTestEngine.start(
      { hero: nuu, hand: [], deck: 6, resourcePoints: 0, actionPoints: 1, chiPoints: 3 },
      {
        hand: [],
        hero: opponentHero,
        deck: [
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
          snatchRed,
        ],
        banished: [robTheRichBlue],
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Nuu = game.as(nuu);
    const Opponent = game.as(opponentHero);

    resolveNuuChiPeek(game, nuu, { acceptBanish: true });

    // Top snatch stays on deck (not blue).
    expect(Opponent.zone("deck")).toContain(snatchRed.canonicalId);
    // Pre-seeded blue remains banished with free play permission.
    expectFabCard(Opponent, robTheRichBlue).toBeIn("banished");
    const banishedId = game.findCardInZone(Opponent.id, "banished", robTheRichBlue);
    const hasPlayPermission = game
      .getState()
      .continuousEffectInstances.some(
        (c) =>
          c.controllerId === Nuu.id &&
          c.atoms.some((a) => a.kind === "rule" && a.parameters.kind === "play-card") &&
          c.initialSubjects.some((s) => s.instanceId === banishedId),
      );
    expect(hasPlayPermission).toBe(true);
  });

  it("boundaries: ability not legal without 3 chi", () => {
    const game = FabTestEngine.start(
      { hero: nuu, hand: [], deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    const activate = listLegalCommands(game.getRuntime(), game.as(nuu).id).find(
      (cmd) =>
        cmd.move === "activate" &&
        cmd.payload.ability ===
          "prMJkPd8w9KQHQ9BjgMmG:instantChiChiChiLookTopOpposingHerosDeckBlueBanishEndTurnPlayBlueHerosBanishedZoneWithoutPayingResourceCost",
    );
    expect(activate).toBeUndefined();
  });

  it("core mechanic: Adult shares chi Instant peek + free blue from opp banished (parity)", () => {
    const game = FabTestEngine.start(
      {
        hero: nuuAlluringDesire,
        hand: [],
        deck: 6,
        resourcePoints: 0,
        actionPoints: 1,
        chiPoints: 3,
      },
      {
        hand: [],
        hero: opponentHero,
        deck: [robTheRichBlue],
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Nuu = game.as(nuuAlluringDesire);
    const Opponent = game.as(opponentHero);

    resolveNuuChiPeek(game, nuuAlluringDesire, {
      acceptBanish: true,
      abilityId:
        "MghLPDjq8CfBJ8RzNc7Ft:instantChiChiChiLookTopOpposingHerosDeckBlueBanishEndTurnPlayBlueHerosBanishedZoneWithoutPayingResourceCost",
    });

    expectFabCard(Opponent, robTheRichBlue).toBeIn("banished");
    expect(game.getState().players[Nuu.id]!.chiPoints).toBe(0);
  });

  it("core mechanic: stealth attack chain-link-resolve banishes defending action cards", () => {
    // Arrange — Nuu stealth attack (creep) vs hand Action block (nimblism).
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [creepRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: opponentHero,
        hand: [nimblismBlue, snatchRed],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Nuu = game.as(nuu);
    const Opponent = game.as(opponentHero);

    // Act — attack with stealth; opponent defends with an Action from hand; resolve.
    Nuu.attackWith(creepRed);
    const blockId = Opponent.findCardInZone("hand", nimblismBlue);
    Opponent.exec({ move: "defend", payload: { instanceIds: [blockId] } });
    for (let safety = 0; safety < 40; safety += 1) {
      if (game.hasGameEnded()) break;
      const decision = game.getState().decision;
      if (decision) {
        if (game.answerForcedDecision()) continue;
        if (decision.kind === "boolean") {
          game.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: { kind: "boolean", value: false },
            },
          });
          continue;
        }
      }
      if (game.combat()?.open || game.getState().rulesStack.length > 0) {
        try {
          game.passBoth();
        } catch {
          break;
        }
        continue;
      }
      break;
    }

    // Assert — defending Action was banished (not put into GY on chain close).
    expect(Opponent.zone("banished")).toContain(nimblismBlue.canonicalId);
    expect(Opponent.zone("graveyard")).not.toContain(nimblismBlue.canonicalId);
  });

  it("boundaries: non-stealth attack does not banish defending actions on chain-link-resolve", () => {
    const game = FabTestEngine.start(
      {
        hero: nuu,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: opponentHero,
        hand: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Nuu = game.as(nuu);
    const Opponent = game.as(opponentHero);

    Nuu.attackWith(snatchRed);
    const blockId = Opponent.findCardInZone("hand", nimblismBlue);
    Opponent.exec({ move: "defend", payload: { instanceIds: [blockId] } });
    game.helpers.resolveRestOfCombat();

    // Non-stealth: defender goes to GY normally.
    expect(Opponent.zone("graveyard")).toContain(nimblismBlue.canonicalId);
    expect(Opponent.zone("banished")).not.toContain(nimblismBlue.canonicalId);
  });

  it("boundaries: Adult Nuu shares stealth chain-link-resolve banish (parity)", () => {
    const game = FabTestEngine.start(
      {
        hero: nuuAlluringDesire,
        hand: [creepRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: opponentHero,
        hand: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Nuu = game.as(nuuAlluringDesire);
    const Opponent = game.as(opponentHero);

    Nuu.attackWith(creepRed);
    const blockId = Opponent.findCardInZone("hand", nimblismBlue);
    Opponent.exec({ move: "defend", payload: { instanceIds: [blockId] } });
    for (let safety = 0; safety < 40; safety += 1) {
      if (game.hasGameEnded()) break;
      const decision = game.getState().decision;
      if (decision) {
        if (game.answerForcedDecision()) continue;
        if (decision.kind === "boolean") {
          game.exec({
            move: "answer-decision",
            actorId: decision.actorId,
            payload: {
              decisionId: decision.decisionId,
              stateVersion: decision.stateVersion,
              answer: { kind: "boolean", value: false },
            },
          });
          continue;
        }
      }
      if (game.combat()?.open || game.getState().rulesStack.length > 0) {
        try {
          game.passBoth();
        } catch {
          break;
        }
        continue;
      }
      break;
    }

    expect(Opponent.zone("banished")).toContain(nimblismBlue.canonicalId);
  });
});

// ---------------------------------------------------------------------------
// uzuri — OUT002 — 20hp Assassin/Young
// uzuri-switchblade — OUT001 — 40hp Adult
// Printed: once-per-turn attack reaction — banish a hand card face-down, reveal
// it, and if it's a cost<=2 attack action, swap the active stealth attacker to
// the bottom of its owner's deck and put the revealed card onto the chain.
// Status: Engine-ready (face-down banish cost + asAttacking combat-chain swap).
// ---------------------------------------------------------------------------

/** Drain numeric/entity decisions until stack settles or no progress. */
function resolveUzuriActivationDecisions(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let i = 0; i < 32; i += 1) {
    const decision = game.getState().decision;
    if (!decision) {
      if (game.getState().rulesStack.length > 0) {
        try {
          game.passBoth();
        } catch {
          break;
        }
        continue;
      }
      break;
    }
    if (decision.kind === "entity-target") {
      const pick =
        decision.candidates.find((c) => /snatch|creep|back.?stab/i.test(c.label)) ??
        decision.candidates[0];
      if (!pick) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [pick.instanceId] },
        },
      });
      continue;
    }
    if (game.answerForcedDecision()) continue;
    break;
  }
}

describe("uzuri family (OUT001/OUT002)", () => {
  it("boundaries: uzuri defaults to 20 life (Young health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: uzuri, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(uzuri)).toHaveLife(20);
  });

  it("boundaries: uzuri-switchblade defaults to 40 life (Adult health boundary)", () => {
    const game = FabTestEngine.start(
      { hand: [], hero: uzuriSwitchblade, deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
    );
    expectFabPlayer(game.as(uzuriSwitchblade)).toHaveLife(40);
  });

  it("core mechanic: attack reaction swaps stealth attacker for a cost≤2 attack action banished face-down", () => {
    // Arrange — stealth attack on the chain; another cost-0 attack in hand for
    // the face-down banish cost (snatch is Action/Attack cost 0).
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        hand: [creepRed, snatchRed],
        deck: 6,
        actionPoints: 1,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Uzuri = game.as(uzuri);
    const Opponent = game.as(opponentHero);
    const heroId = game.getState().players[Uzuri.id]!.heroCardId!;

    // Act — open combat with stealth creep, advance to reaction, activate Uzuri.
    Uzuri.attackWith(creepRed);
    expectCombat(game).toBeAtStep("defend");
    const creepId = game.combat()!.activeLink!.activeAttack.sourceObjectId;
    expect(game.getState().objects[creepId]?.canonicalId).toBe(creepRed.canonicalId);

    Opponent.defendWith([]);
    Uzuri.pass();
    Opponent.pass();
    expectCombat(game).toBeAtStep("reaction");

    Uzuri.exec({
      move: "activate",
      payload: {
        instanceId: heroId,
        ability:
          "QmqN6fJJMnLDjLHKF7g97:oncePerTurnAttackReactionBanishHandFaceDownTurnBanishedWayFaceUpAttackActionCost2LessPutTargetAttackingStealthActiveChainLinkBottomOwnersDeckThenPutBanishedOntoActiveChainLinkAttacking",
      },
    });
    resolveUzuriActivationDecisions(game);

    // Assert — creep went to bottom of deck; snatch is the active attacker.
    const link = game.combat()?.activeLink;
    expect(link).toBeDefined();
    const attackerId = link!.activeAttack.sourceObjectId;
    expect(game.getState().objects[attackerId]?.canonicalId).toBe(snatchRed.canonicalId);
    expect(Uzuri.zone("deck")[0]).toBe(creepRed.canonicalId);
    expect(Uzuri.zone("hand")).not.toContain(snatchRed.canonicalId);
    expect(Uzuri.zone("banished")).not.toContain(snatchRed.canonicalId);
  });

  it("core interaction: the swap changes what the opponent defends against (attacker identity)", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        hand: [creepRed, snatchRed],
        deck: 6,
        actionPoints: 1,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Uzuri = game.as(uzuri);
    const Opponent = game.as(opponentHero);
    const heroId = game.getState().players[Uzuri.id]!.heroCardId!;

    Uzuri.attackWith(creepRed);
    const beforePower = 3; // creep printed power
    Opponent.defendWith([]);
    Uzuri.pass();
    Opponent.pass();

    Uzuri.exec({
      move: "activate",
      payload: {
        instanceId: heroId,
        ability:
          "QmqN6fJJMnLDjLHKF7g97:oncePerTurnAttackReactionBanishHandFaceDownTurnBanishedWayFaceUpAttackActionCost2LessPutTargetAttackingStealthActiveChainLinkBottomOwnersDeckThenPutBanishedOntoActiveChainLinkAttacking",
      },
    });
    resolveUzuriActivationDecisions(game);

    // Snatch is power 4 — defending faces a different attack after the swap.
    const attackId = game.combat()!.activeLink!.activeAttack.sourceObjectId;
    expectFabCard(Uzuri, snatchRed).toHavePower(4);
    expect(game.getState().objects[attackId]?.canonicalId).toBe(snatchRed.canonicalId);
    expect(beforePower).toBe(3);
  });

  it("boundaries: ability illegal outside reaction; non-qualifying reveal does not swap", () => {
    // Outside combat/reaction — activation is illegal.
    const idle = FabTestEngine.start(
      { hero: uzuri, hand: [snatchRed], deck: 6 },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const U0 = idle.as(uzuri);
    const hero0 = idle.getState().players[U0.id]!.heroCardId!;
    expect(() =>
      U0.exec({
        move: "activate",
        payload: {
          instanceId: hero0,
          ability:
            "QmqN6fJJMnLDjLHKF7g97:oncePerTurnAttackReactionBanishHandFaceDownTurnBanishedWayFaceUpAttackActionCost2LessPutTargetAttackingStealthActiveChainLinkBottomOwnersDeckThenPutBanishedOntoActiveChainLinkAttacking",
        },
      }),
    ).toThrow();

    // Non-attack hand card revealed: turn face-up still happens, but no swap.
    // Use a non-attack (whisper) as the banished card while creep is attacking.
    const game = FabTestEngine.start(
      {
        hero: uzuri,
        hand: [creepRed, nimblismBlue],
        deck: 6,
        actionPoints: 1,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Uzuri = game.as(uzuri);
    const Opponent = game.as(opponentHero);
    const heroId = game.getState().players[Uzuri.id]!.heroCardId!;

    Uzuri.attackWith(creepRed);
    const creepId = game.combat()!.activeLink!.activeAttack.sourceObjectId;
    Opponent.defendWith([]);
    Uzuri.pass();
    Opponent.pass();

    Uzuri.exec({
      move: "activate",
      payload: {
        instanceId: heroId,
        ability:
          "QmqN6fJJMnLDjLHKF7g97:oncePerTurnAttackReactionBanishHandFaceDownTurnBanishedWayFaceUpAttackActionCost2LessPutTargetAttackingStealthActiveChainLinkBottomOwnersDeckThenPutBanishedOntoActiveChainLinkAttacking",
      },
    });
    resolveUzuriActivationDecisions(game);

    // Creep remains the attacker; nimblism is face-up in banished (revealed).
    expect(game.combat()?.activeLink?.activeAttack.sourceObjectId).toBe(creepId);
    expect(Uzuri.zone("banished")).toContain(nimblismBlue.canonicalId);
    expect(Uzuri.zone("deck")[0]).not.toBe(creepRed.canonicalId);
  });

  it("variant: uzuri-switchblade Adult shares the swap mechanic", () => {
    const game = FabTestEngine.start(
      {
        hero: uzuriSwitchblade,
        hand: [creepRed, snatchRed],
        deck: 6,
        actionPoints: 1,
      },
      { hand: [], hero: opponentHero, deck: 6 },
      { autoPassPriority: false },
    );
    const Uzuri = game.as(uzuriSwitchblade);
    const Opponent = game.as(opponentHero);
    const heroId = game.getState().players[Uzuri.id]!.heroCardId!;

    Uzuri.attackWith(creepRed);
    Opponent.defendWith([]);
    Uzuri.pass();
    Opponent.pass();
    Uzuri.exec({
      move: "activate",
      payload: {
        instanceId: heroId,
        ability:
          "rNhtnPWtDDBzBp7mNdQtT:oncePerTurnAttackReactionBanishHandFaceDownTurnBanishedWayFaceUpAttackActionCost2LessPutTargetAttackingStealthActiveChainLinkBottomOwnersDeckThenPutBanishedOntoActiveChainLinkAttacking",
      },
    });
    resolveUzuriActivationDecisions(game);

    expect(
      game.getState().objects[game.combat()!.activeLink!.activeAttack.sourceObjectId]?.canonicalId,
    ).toBe(snatchRed.canonicalId);
  });
});
