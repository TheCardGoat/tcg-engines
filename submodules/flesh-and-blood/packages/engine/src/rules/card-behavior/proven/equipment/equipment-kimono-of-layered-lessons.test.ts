/**
 * PEN266 Kimono of Layered Lessons — Mystic Chest d1 Cloaked.
 *
 * Printed:
 *   Cloaked
 *   Instant - {c}{c}{c}, turn this face-up: Put a +1{d} counter on this.
 *   At the start of your turn, destroy this.
 *
 * Reasoning (case-by-case; twin of MST067 aqua-seeing-shell):
 * 1. Cloaked seats face-down; Instant 3{c} + turn-face-up → +1{d} counter.
 * 2. Already face-up / insufficient chi → illegal Instant.
 * 3. After face-up, controller's next start-phase destroys the kimono.
 * 4. Opponent start-phase does not destroy (start-phase turn-player-gated).
 *
 * Status: ✅ cloaked Instant 3{c} face-up +1{d}; start destroy; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { kimonoOfLayeredLessons } from "../../../../../../cards/src/cards/equipment/kimono-of-layered-lessons.ts";

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

function endTurnDrain(game: ReturnType<typeof FabTestEngine.start>, hero: typeof bravo): void {
  game.as(hero).endTurn();
  for (let safety = 0; safety < 40; safety += 1) {
    const d = game.getState().decision;
    if (d) {
      if (d.kind === "boolean") {
        game.exec({
          move: "answer-decision",
          actorId: d.actorId,
          payload: {
            decisionId: d.decisionId,
            stateVersion: d.stateVersion,
            answer: { kind: "boolean", value: false },
          },
        });
        continue;
      }
      if (game.answerForcedDecision()) continue;
      break;
    }
    if (game.getState().rulesStack.length > 0 || game.getState().rulesProcess) {
      try {
        game.passBoth();
      } catch {
        break;
      }
      continue;
    }
    break;
  }
}

describe("kimono-of-layered-lessons (PEN266)", () => {
  it("core mechanic: cloaked Instant 3{c} turn face-up → +1{d} counter; start destroy", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [kimonoOfLayeredLessons],
        hand: [],
        deck: 6,
        chiPoints: 3,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const chestId = game.getState().containers.zonesByPlayerId[Bravo.id]!.chest[0]!;

    expect(game.objectState(chestId)?.faceDown).toBe(true);
    expect(game.objectState(chestId)?.defenseCounterTotal ?? 0).toBe(0);

    Bravo.activate(kimonoOfLayeredLessons);
    drain(game);

    expect(game.objectState(chestId)?.faceDown).not.toBe(true);
    expect(game.getState().players[Bravo.id]!.chiPoints).toBe(0);
    expect(game.objectState(chestId)?.defenseCounterTotal).toBe(1);
    expect(Bravo.zone("chest")).toContain(kimonoOfLayeredLessons.canonicalId);

    // Bravo ends → Dash start (no destroy) → Dash ends → Bravo start destroys.
    endTurnDrain(game, bravo);
    expect(Bravo.zone("chest")).toContain(kimonoOfLayeredLessons.canonicalId);
    endTurnDrain(game, dash);
    expect(Bravo.zone("graveyard")).toContain(kimonoOfLayeredLessons.canonicalId);
    expect(Bravo.zone("chest")).not.toContain(kimonoOfLayeredLessons.canonicalId);
  });

  it("boundaries: face-up Instant illegal; 0 chi illegal; model Instant + start destroy", () => {
    const faceUp = FabTestEngine.start(
      {
        hero: bravo,
        chest: [{ card: kimonoOfLayeredLessons, state: { faceDown: false } }],
        deck: 6,
        chiPoints: 3,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => faceUp.as(bravo).activate(kimonoOfLayeredLessons)).toThrow();

    const poor = FabTestEngine.start(
      {
        hero: bravo,
        chest: [kimonoOfLayeredLessons],
        deck: 6,
        chiPoints: 2,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => poor.as(bravo).activate(kimonoOfLayeredLessons)).toThrow();

    const a1 = kimonoOfLayeredLessons.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("instant");
      expect(a1.cost).toMatchObject({
        class: "mixed",
        type: "all",
        costs: [
          { class: "asset", type: "chi", amount: 3 },
          { class: "effect", type: "turn-face-up", target: { selector: "self" } },
        ],
      });
      expect(a1.effect).toMatchObject({
        type: "add-counter",
        counter: { kind: "numeric", value: 1, property: "defense" },
        count: 1,
        target: { selector: "self" },
      });
    }
    const a2 = kimonoOfLayeredLessons.base.abilities?.[1];
    expect(a2?.kind).toBe("static");
    if (a2?.kind === "static" && a2.trigger) {
      expect(a2.trigger).toMatchObject({
        kind: "event",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      });
      expect(a2.resolution?.effect).toMatchObject({
        type: "destroy",
        target: { selector: "self" },
      });
    }
    expect(kimonoOfLayeredLessons.base.keywords?.some((k) => k.name === "cloaked")).toBe(true);
    expect(kimonoOfLayeredLessons.base.numeric.defense).toBe(1);
  });
});
