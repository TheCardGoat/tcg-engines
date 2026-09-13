/**
 * DTD076 Radiant Raiment — Light Chest (no printed defense).
 *
 * Printed:
 *   Instant - Banish this and a card from your hero's soul: Prevent the next
 *   2 damage that would be dealt to your hero this turn.
 *
 * Reasoning (hand-authored, sibling of DTD075 Radiant View):
 * 1. Prior model used banish from:arena count 1 — "Banish this" is banish-self.
 * 2. Soul card is a separate banish cost (entity-target).
 * 3. Instant during defend priority arms prevention before combat damage.
 * 4. Snatch 4 − prevent 2 → life −2; both piece and soul card banished.
 * 5. Empty soul → Instant illegal (cost unavailable).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { radiantRaiment } from "../../../../../../cards/src/cards/equipment/radiant-raiment.ts";

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
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("radiant-raiment (DTD076)", () => {
  it("core mechanic: banish-self + soul → prevent next 2 damage this turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        chest: [radiantRaiment],
        soul: [nimblismBlue],
        hand: [],
        deck: 6,
        life: LIFE,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    // Instant on defend step — arm prevention before damage.
    Bravo.defendWith([]);
    game.as(dash).pass();
    Bravo.activate(radiantRaiment);
    drain(game);

    expect(Bravo.zone("chest")).not.toContain(radiantRaiment.canonicalId);
    expect(Bravo.zone("banished")).toContain(radiantRaiment.canonicalId);
    expect(Bravo.zone("banished")).toContain(nimblismBlue.canonicalId);
    expect(Bravo.zone("soul")).not.toContain(nimblismBlue.canonicalId);
    expect(game.committedEvents().some((e) => e.name === "register-replacement")).toBe(true);

    game.helpers.resolveRestOfCombat();

    // Snatch 4 − prevent 2 = 2 damage.
    expect(Bravo.life()).toBe(LIFE - (SNATCH - 2));
  });

  it("boundaries: empty soul cannot pay Instant cost; model banish-self", () => {
    const empty = FabTestEngine.start(
      {
        hero: bravo,
        chest: [radiantRaiment],
        soul: [],
        hand: [],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => empty.as(bravo).activate(radiantRaiment)).toThrow();
    expect(empty.as(bravo).zone("chest")).toContain(radiantRaiment.canonicalId);

    const a1 = radiantRaiment.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({
      class: "mixed",
      type: "all",
      costs: [
        { class: "effect", type: "banish-self" },
        { class: "effect", type: "banish", from: "soul", count: 1 },
      ],
    });
    expect(a1.effect).toMatchObject({
      type: "prevention",
      preventionKind: "fixed",
      amount: 2,
      shielded: { selector: "controller" },
      duration: "this-turn",
    });
    expect(radiantRaiment.base.numeric.defense).toBeUndefined();
  });
});
