/**
 * PEN227 Crown of Frozen Thoughts — Ice Head d2 Blade Break.
 *
 * Printed:
 *   When this defends, freeze the attacking hero until the start of their next
 *   turn. (Abilities of a frozen hero can't be activated.)
 *   Blade Break
 *
 * Model:
 *   defend trigger → freeze attacking-hero duration until-end-of-next-turn
 *   (1v1 turn-count matches start of their next turn) + bladeBreak.
 *
 * Reasoning (hand-authored):
 * 1. CR 8.5.34 Freeze is continuous: frozen object can't be activated.
 * 2. Continuous freeze must latch the hero object at resolution. Re-resolving
 *    `attacking-hero` after combat closes (facts.combat null) left empty
 *    subjects and the freeze stopped applying — fixed in continuous-rule-
 *    effects hero-seat initialSubjects locking.
 * 3. Core: defend with crown → attacker's hero activate is restricted.
 * 4. Boundary: co-defender alone does not freeze; BB d2 destroys crown.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { crownOfFrozenThoughts } from "../../../../../../cards/src/cards/equipment/crown-of-frozen-thoughts.ts";

const LIFE = 20;
const SNATCH = 4;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
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
    if (decision?.kind === "entity-target") {
      const pick = decision.candidates[0];
      if (!pick && (decision.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "entity-target",
            instanceIds: pick ? [pick.instanceId] : [],
          },
        },
      });
      continue;
    }
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

function freezeLatchedToHero(
  game: ReturnType<typeof FabTestEngine.start>,
  heroInstanceId: string,
): boolean {
  return game.getState().continuousEffectInstances.some((instance) => {
    if (instance.expiresAt.kind !== "turn") return false;
    const hasFreeze = instance.atoms.some(
      (atom) =>
        atom.kind === "rule" && atom.mode === "restrict" && atom.parameters.kind === "freeze",
    );
    if (!hasFreeze) return false;
    return instance.initialSubjects.some((s) => s.instanceId === heroInstanceId);
  });
}

describe("crown-of-frozen-thoughts (PEN227)", () => {
  it("core mechanic: defend freezes attacking hero (activate blocked after combat)", () => {
    // AP 2: spend 1 on snatch, keep 1 for hero Action so freeze (not AP) is the gate.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 2,
        resourcePoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [crownOfFrozenThoughts],
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const bravoHeroId = game.getState().containers.zonesByPlayerId[Bravo.id]!.heroZone[0]!;

    game.as(bravo).attackWith(snatchRed);
    game.as(dash).defendWith(crownOfFrozenThoughts);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    // Continuous freeze latched the attacking hero (not re-resolved via combat).
    expect(freezeLatchedToHero(game, bravoHeroId)).toBe(true);

    // Blade Break destroyed the crown.
    expect(game.as(dash).zone("head")).not.toContain(crownOfFrozenThoughts.canonicalId);
    expect(game.as(dash).zone("graveyard")).toContain(crownOfFrozenThoughts.canonicalId);
    // snatch 4 − d2 = 2.
    expect(game.as(dash).life()).toBe(LIFE - (SNATCH - 2));

    // Frozen hero: Bravo Action activate is illegal (CR 8.5.34).
    expect(() => Bravo.activate(bravo)).toThrow(/frozen/i);
  });

  it("boundaries: no crown defend → no freeze; model defend→freeze + BB", () => {
    // Hand-only block: no freeze continuous.
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 2,
        resourcePoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        hand: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const BravoBare = bare.as(bravo);
    const bravoHeroId = bare.getState().containers.zonesByPlayerId[BravoBare.id]!.heroZone[0]!;

    bare.as(bravo).attackWith(snatchRed);
    bare.as(dash).defendWith(nimblismBlue);
    drain(bare);
    bare.helpers.resolveRestOfCombat();
    drain(bare);

    expect(freezeLatchedToHero(bare, bravoHeroId)).toBe(false);
    // Hero activate still legal without freeze (AP + RP remain).
    expect(() => BravoBare.activate(bravo)).not.toThrow();

    const a1 = crownOfFrozenThoughts.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static") return;
    expect(a1.staticKind).toBe("triggered");
    expect(a1.trigger).toMatchObject({
      kind: "event",
      event: {
        name: "defend",
        actor: {
          kind: "player",
          player: "ability-controller",
        },
        observes: {
          kind: "source",
          selector: "defender",
        },
      },
    });
    expect(a1.resolution?.effect).toMatchObject({
      type: "freeze",
      target: { selector: "attacking-hero" },
    });
    expect(a1.label).toMatchObject({ name: "freeze" });
    expect(crownOfFrozenThoughts.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);
    expect(crownOfFrozenThoughts.base.numeric.defense).toBe(2);
  });
});
