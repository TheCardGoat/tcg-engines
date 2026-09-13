/**
 * AAZ005 Hidden Agenda — Ranger Chest, Arcane Barrier 1 (no printed defense).
 *
 * Printed:
 *   Instant - Turn a face-down arrow in your arsenal face-up: Gain {r}. At the
 *   beginning of the end phase, destroy this.
 *   Arcane Barrier 1
 *
 * Reasoning (hand-authored):
 * 1. Instant turn-face-up cost on face-down arsenal Arrow → gain 1{r}.
 * 2. Arrow is types:["Arrow"] (was subtypes Arrow — never matches type-box).
 * 3. delayed-trigger end-phase destroys Hidden Agenda.
 * 4. No face-down arrow / non-Arrow face-down / face-up only → illegal.
 * 5. Arcane Barrier 1 is keyword metadata (not re-exercised here).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue } from "../../../fixtures.ts";
import { hiddenAgenda } from "../../../../../../cards/src/cards/equipment/hidden-agenda.ts";
import { endlessArrowRed } from "../../../../../../cards/src/cards/actions/endless-arrow.ts";

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
      // Prefer the endless arrow when choosing turn-face-up cost targets.
      const arrow = decision.candidates.find(
        (c) => game.getState().objects[c.instanceId]?.canonicalId === endlessArrowRed.canonicalId,
      );
      const pick = arrow ?? decision.candidates[0];
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
    if (game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("hidden-agenda (AAZ005)", () => {
  it("core mechanic: Instant turn face-down arsenal Arrow face-up → +1{r}; end phase destroys", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [hiddenAgenda],
        arsenal: [{ card: endlessArrowRed, state: { faceDown: true } }],
        hand: [],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 4 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const arrowId = Bravo.findCardInZone("arsenal", endlessArrowRed);
    expect(game.getState().objects[arrowId]?.markers.some((m) => m.kind === "face-down")).toBe(
      true,
    );

    Bravo.activate(hiddenAgenda);
    drain(game);

    // Cost turned the arrow face-up; gained 1 resource.
    expect(game.getState().objects[arrowId]?.markers.some((m) => m.kind === "face-down")).toBe(
      false,
    );
    expect(Bravo.resourcePoints()).toBe(1);
    // Still equipped until end phase.
    expect(Bravo.zone("chest")).toContain(hiddenAgenda.canonicalId);

    // End phase delayed-trigger destroys Hidden Agenda.
    Bravo.endTurn();
    drain(game);
    expect(Bravo.zone("chest")).not.toContain(hiddenAgenda.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(hiddenAgenda.canonicalId);
  });

  it("boundaries: no face-down arrow illegal; face-up only illegal; non-Arrow face-down illegal; model", () => {
    // Empty arsenal.
    const empty = FabTestEngine.start(
      {
        hero: bravo,
        chest: [hiddenAgenda],
        arsenal: [],
        hand: [],
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      { autoPassPriority: false },
    );
    expect(() => empty.as(bravo).activate(hiddenAgenda)).toThrow();
    expect(empty.as(bravo).zone("chest")).toContain(hiddenAgenda.canonicalId);

    // Face-up arrow only.
    const faceUp = FabTestEngine.start(
      {
        hero: bravo,
        chest: [hiddenAgenda],
        arsenal: [{ card: endlessArrowRed, state: { faceDown: false } }],
        hand: [],
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      { autoPassPriority: false },
    );
    expect(() => faceUp.as(bravo).activate(hiddenAgenda)).toThrow();

    // Face-down non-Arrow (nimblism) cannot pay the cost.
    const nonArrow = FabTestEngine.start(
      {
        hero: bravo,
        chest: [hiddenAgenda],
        arsenal: [{ card: nimblismBlue, state: { faceDown: true } }],
        hand: [],
        deck: 4,
      },
      { hero: dash, hand: [], deck: 4 },
      { autoPassPriority: false },
    );
    expect(() => nonArrow.as(bravo).activate(hiddenAgenda)).toThrow();
    expect(nonArrow.as(bravo).zone("chest")).toContain(hiddenAgenda.canonicalId);

    const a1 = hiddenAgenda.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({
      class: "effect",
      type: "turn-face-up",
      target: {
        zones: ["arsenal"],
        filter: {
          hasStatus: "face-down",
          typeBox: {
            subtypes: ["Arrow"],
          },
        },
        count: 1,
      },
    });
    expect(a1.effect).toMatchObject({
      type: "sequence",
      steps: [
        { type: "gain-resources", amount: 1 },
        {
          type: "delayed-trigger",
          trigger: {
            kind: "event",
            event: {
              name: "end-phase",
              actor: {
                kind: "any",
              },
              observes: {
                kind: "none",
              },
            },
          },
          policy: {
            kind: "windowed",
            duration: "this-turn",
            matching: "first",
          },
          resolution: {
            kind: "effect",
            effect: { type: "destroy", target: { selector: "self" } },
          },
        },
      ],
    });
    expect(hiddenAgenda.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "arcane-barrier", value: 1 })]),
    );
  });
});
