/**
 * AAC004 Prey Spotters — Assassin Head d1 Battleworn.
 *
 * Printed: Attack Reaction - Destroy this: Mark target opposing hero.
 *
 * The public AAA proves the mark is applied during the reaction window, the
 * destroy-self cost moves the head to graveyard, and activation is rejected
 * outside an active attack-reaction window. Battleworn is checked separately
 * as a lifecycle boundary.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { preySpotters } from "../../../../../../cards/src/cards/equipment/prey-spotters.ts";

const LIFE = 20;

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
      const candidate = decision.candidates[0];
      if (!candidate && (decision.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: candidate ? [candidate.instanceId] : [] },
        },
      });
      continue;
    }
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const priority = game.getState().priority?.holderPlayerId;
    if (!priority) return;
    try {
      game.exec({ move: "pass", actorId: priority, payload: {} });
    } catch {
      return;
    }
  }
}

describe("prey-spotters (AAC004)", () => {
  it("a1: attack reaction destroys Prey Spotters and marks the opposing hero", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [preySpotters],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    game.passBoth();
    if (game.getState().priority?.holderPlayerId === Defender.id) {
      game.exec({ move: "pass", actorId: Defender.id, payload: {} });
    }

    Attacker.activate(preySpotters);
    // Resolve the activation while combat is still in the reaction step. Mark
    // is observable here; the following opposing hit removes it as part of
    // that hit event (CR 9.3.3).
    game.passBoth();

    expect(Attacker.zone("head")).not.toContain(preySpotters.canonicalId);
    expect(Attacker.zone("graveyard")).toContain(preySpotters.canonicalId);
    expect(game.getState().players[Defender.id]?.marked).toBe(true);

    drain(game);

    expect(game.getState().players[Defender.id]?.marked).toBe(false);
  });

  it("boundaries: out of reaction is illegal; battleworn d1 defends normally", () => {
    const bare = FabTestEngine.start(
      { hero: bravo, head: [preySpotters], resourcePoints: 0, deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => bare.as(bravo).activate(preySpotters)).toThrow();

    const lifecycle = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, life: LIFE, head: [preySpotters], deck: 6 },
      { autoPassPriority: false },
    );
    lifecycle.as(dash).attackWith(snatchRed);
    lifecycle.as(bravo).defendWith(preySpotters);
    drain(lifecycle);
    lifecycle.helpers.resolveRestOfCombat();
    drain(lifecycle);
    expect(lifecycle.as(bravo).zone("head")).toContain(preySpotters.canonicalId);
    expect(lifecycle.as(bravo).life()).toBe(LIFE - 3);
  });
});
