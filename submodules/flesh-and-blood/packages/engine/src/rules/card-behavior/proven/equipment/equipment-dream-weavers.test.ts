/**
 * MON090 Dream Weavers — Illusionist Arms d0 Spellvoid 1.
 *
 * Printed:
 *   Action - Destroy Dream Weavers: The next Illusionist attack action card you
 *   play this turn loses and can't gain phantasm. Go again
 *   Spellvoid 1
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. Action destroy-self + go again arms floating strip phantasm on next
 *    Illusionist AAC (remove-property + restrict gain-keyword).
 * 2. Happy: after activate, Spears of Surreality (phantasm) blocked by
 *    Regurgitating Slog p6 does NOT phantasm-destroy (keyword stripped).
 * 3. Control: without Dream Weavers, same block phantasm-destroys.
 * 4. Model + spellvoid(1) keyword present.
 *
 * Status: ✅ destroy → next Illusionist AAC loses phantasm; control pop; GA; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { dash, regurgitatingSlogRed } from "../../../fixtures.ts";
import { dreamWeavers } from "../../../../../../cards/src/cards/equipment/dream-weavers.ts";
import { prism } from "../../../../../../cards/src/cards/heroes/prism.ts";
import { spearsOfSurrealityBlue } from "../../../../../../cards/src/cards/actions/spears-of-surreality.ts";

const LIFE = 20;
const SPEARS = 3;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 64; safety += 1) {
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
      try {
        game.exec({ move: "pass", actorId: prio, payload: {} });
      } catch {
        return;
      }
      continue;
    }
    return;
  }
}

describe("dream-weavers (MON090)", () => {
  it("core mechanic: destroy → next Illusionist AAC loses phantasm (slog does not pop)", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        arms: [dreamWeavers],
        hand: [spearsOfSurrealityBlue],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        hand: [regurgitatingSlogRed],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Prism = game.as(prism);
    const Opponent = game.as(dash);
    const apBefore = game.getState().players[Prism.id]!.actionPoints;

    Prism.activate(dreamWeavers);
    drain(game);

    // Cost: destroy-self; go again refunds Action AP.
    expect(Prism.zone("arms")).not.toContain(dreamWeavers.canonicalId);
    expect(Prism.zone("graveyard")).toContain(dreamWeavers.canonicalId);
    expect(game.getState().players[Prism.id]!.actionPoints).toBe(apBefore);

    Prism.attackWith(spearsOfSurrealityBlue);
    Opponent.blockWith(regurgitatingSlogRed);

    // Phantasm stripped → p6 defender does not destroy the attack.
    expect(game.combat()?.activeLink?.keywords).not.toContain("phantasm-destroyed");
    expect(game.combat()?.activeLink?.attackPower).toBeGreaterThan(0);

    game.helpers.resolveRestOfCombat();
    // Spears p3 − slog d2 = 1 damage (phantasm would have zeroed power → 0 dmg).
    expect(Opponent.life()).toBe(LIFE - (SPEARS - 2));
  });

  it("boundaries: without Dream Weavers, p6 block phantasm-destroys; model shape", () => {
    const control = FabTestEngine.start(
      {
        hero: prism,
        hand: [spearsOfSurrealityBlue],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        hand: [regurgitatingSlogRed],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    control.as(prism).attackWith(spearsOfSurrealityBlue);
    control.as(dash).blockWith(regurgitatingSlogRed);
    expect(control.combat()?.activeLink?.keywords).toContain("phantasm");
    expect(control.combat()?.activeLink?.attackPower).toBeGreaterThan(0);
    control.passBoth();
    control.helpers.resolveUntilIdle();
    expect(control.as(prism).zone("graveyard")).toContain(spearsOfSurrealityBlue.canonicalId);
    expect(control.combat()).toBeNull();
    expect(control.as(dash).life()).toBe(LIFE);

    const a1 = dreamWeavers.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("action");
    expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
    expect(a1.layerKeywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "go-again" })]),
    );
    expect(a1.effect).toMatchObject({
      type: "sequence",
      steps: [
        {
          type: "remove-property",
          property: { kind: "keyword" },
          appliesTo: {
            next: {
              typeBox: {
                types: ["Action"],
                subtypes: ["Attack"],
                supertypes: ["Illusionist"],
              },
            },
            ordinal: 1,
          },
        },
        {
          type: "rule-modification",
          mode: "restrict",
          action: "gain-keyword",
          appliesTo: {
            next: {
              typeBox: {
                types: ["Action"],
                subtypes: ["Attack"],
                supertypes: ["Illusionist"],
              },
            },
            ordinal: 1,
          },
        },
      ],
    });
    expect(dreamWeavers.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "spellvoid", value: 1 })]),
    );
    expect(dreamWeavers.base.numeric.defense).toBe(0);
  });
});
