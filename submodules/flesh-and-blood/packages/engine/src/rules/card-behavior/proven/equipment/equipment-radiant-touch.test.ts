/**
 * DTD077 Radiant Touch — Light Arms (no printed defense).
 *
 * Printed:
 *   Instant - Banish this and a card from your hero's soul: Prevent the next
 *   2 damage that would be dealt to your hero this turn.
 *
 * Reasoning (hand-authored; DTD075 Radiant View / DTD076 Raiment sibling):
 * 1. Prior model: banish from:arena count 1 — wrong for "Banish this".
 *    Remodel: banish-self + banish soul 1 (mixed all).
 * 2. Instant on defend step → prevent next 2 combat damage this turn.
 * 3. Happy: Snatch 4 − prevent 2 = 2 damage; arms + soul card in banished.
 * 4. Boundary: empty soul → activate illegal; arms stays.
 * 5. Model: Instant mixed banish-self + soul → prevention fixed 2.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { radiantTouch } from "../../../../../../cards/src/cards/equipment/radiant-touch.ts";

const SNATCH = 4;
const LIFE = 20;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 40; safety += 1) {
    const decision = game.getState().decision;
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
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: true },
        },
      });
      continue;
    }
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "ordering",
            orderedIds: decision.entries.map((e) => e.id),
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

describe("radiant-touch (DTD077)", () => {
  it("core mechanic: banish-self + soul → prevent next 2 damage this turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        arms: [radiantTouch],
        soul: [nimblismBlue],
        hand: [],
        deck: 6,
        life: LIFE,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith([]);
    game.as(dash).pass();
    Bravo.activate(radiantTouch);
    drain(game);

    expect(Bravo.zone("arms")).not.toContain(radiantTouch.canonicalId);
    expect(Bravo.zone("banished")).toContain(radiantTouch.canonicalId);
    expect(Bravo.zone("banished")).toContain(nimblismBlue.canonicalId);
    expect(Bravo.zone("soul")).not.toContain(nimblismBlue.canonicalId);
    expect(game.committedEvents().some((e) => e.name === "register-replacement")).toBe(true);

    game.helpers.resolveRestOfCombat();

    // Snatch 4 − prevent 2 = 2 damage.
    expect(Bravo.life()).toBe(LIFE - (SNATCH - 2));
  });

  it("boundaries: empty soul illegal; model banish-self + soul prevent 2", () => {
    const empty = FabTestEngine.start(
      {
        hero: bravo,
        arms: [radiantTouch],
        soul: [],
        hand: [],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => empty.as(bravo).activate(radiantTouch)).toThrow();
    expect(empty.as(bravo).zone("arms")).toContain(radiantTouch.canonicalId);

    const a1 = radiantTouch.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("instant");
      expect(a1.cost).toMatchObject({
        class: "mixed",
        type: "all",
        costs: [{ type: "banish-self" }, { type: "banish", from: "soul", count: 1 }],
      });
      // Guard against arena-permanent "banish this" residue.
      expect(a1.cost).not.toMatchObject({
        costs: expect.arrayContaining([{ type: "banish", from: "arena" }]),
      });
      expect(a1.effect).toMatchObject({
        type: "prevention",
        preventionKind: "fixed",
        amount: 2,
        shielded: { selector: "controller" },
        duration: "this-turn",
      });
    }
  });
});
