/**
 * UPR167 Spellfire Cloak — Wizard Chest d0 Arcane Barrier 1.
 *
 * Printed:
 *   Instant - Destroy Spellfire Cloak: Gain {r}. Activate this ability only
 *   during an opponent's turn.
 *   Arcane Barrier 1
 *
 * Reasoning (hand-authored):
 * 1. Instant destroy-self → +1{r}, gated by has-status not-your-turn
 *    (facts.activePlayerId ≠ controller). Already wired.
 * 2. Core: seat cloak on non-turn player; Instant activates and gains RP.
 * 3. Boundary: same ability illegal on your own turn.
 * 4. Arcane Barrier 1 is keyword-only (proven on AB family); model asserts.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { spellfireCloak } from "../../../../../../cards/src/cards/equipment/spellfire-cloak.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 32; safety += 1) {
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
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("spellfire-cloak (UPR167)", () => {
  it("core mechanic: Instant destroy on opponent's turn → +1{r}", () => {
    // Dash is turn player; attack opens defend priority for Bravo (cloak).
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        chest: [spellfireCloak],
        resourcePoints: 0,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(dash);
    const Bravo = game.as(bravo);
    expect(game.getState().activePlayerId).toBe(Attacker.id);
    expect(Bravo.resourcePoints()).toBe(0);

    Attacker.attackWith(snatchRed);
    Bravo.defendWith([]);
    Attacker.pass();
    expect(game.getState().priority?.holderPlayerId).toBe(Bravo.id);

    Bravo.activate(spellfireCloak);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);

    expect(Bravo.zone("chest")).not.toContain(spellfireCloak.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(spellfireCloak.canonicalId);
    expect(Bravo.resourcePoints()).toBe(1);
  });

  it("boundaries: illegal on your own turn; model not-your-turn + AB1", () => {
    const ownTurn = FabTestEngine.start(
      {
        hero: bravo,
        chest: [spellfireCloak],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(ownTurn.getState().activePlayerId).toBe(ownTurn.as(bravo).id);
    expect(() => ownTurn.as(bravo).activate(spellfireCloak)).toThrow();
    expect(ownTurn.as(bravo).zone("chest")).toContain(spellfireCloak.canonicalId);
    expect(ownTurn.as(bravo).resourcePoints()).toBe(0);

    const a1 = spellfireCloak.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("instant");
      expect(a1.cost).toMatchObject({ type: "destroy-self" });
      expect(a1.condition).toMatchObject({
        type: "has-status",
        status: "not-your-turn",
      });
      expect(a1.effect).toMatchObject({ type: "gain-resources", amount: 1 });
    }
    expect(spellfireCloak.base.numeric.defense).toBe(0);
    expect(
      spellfireCloak.base.keywords?.some(
        (k) => k.name === "arcane-barrier" && (k as { value?: number }).value === 1,
      ),
    ).toBe(true);
  });
});
