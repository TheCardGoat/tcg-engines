/**
 * ELE116 Plume of Evergrowth — Earth Head d0.
 *
 * Printed:
 *   Instant - {r}{r}{r}, destroy Plume of Evergrowth: Return target Earth
 *   action card or Earth instant card from your graveyard to your hand.
 *
 * Model:
 *   Instant mixed 3RP + destroy-self → move-card on-stack GY Earth Action|Instant → hand
 *
 * Reasoning:
 * 1. On-stack target declared at activate (Earth action in GY).
 * 2. Non-Earth GY card is not a legal target.
 * 3. 0 RP / empty GY Earth → illegal.
 * 4. Destroy-self leaves head to GY; returned card goes to hand.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { plumeOfEvergrowth } from "../../../../../../cards/src/cards/equipment/plume-of-evergrowth.ts";
import { autumnSTouchYellow } from "../../../../../../cards/src/cards/actions/autumn-s-touch.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>, targetCanonicalId?: string): void {
  for (let safety = 0; safety < 40; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      const pick =
        (targetCanonicalId
          ? decision.candidates.find(
              (c) => game.getState().objects[c.instanceId]?.canonicalId === targetCanonicalId,
            )
          : undefined) ?? decision.candidates[0];
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
    if (game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

describe("plume-of-evergrowth (ELE116)", () => {
  it("core mechanic: pay 3{r} + destroy → Earth action from GY to hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [plumeOfEvergrowth],
        graveyard: [autumnSTouchYellow, nimblismBlue],
        hand: [],
        deck: 4,
        resourcePoints: 3,
        actionPoints: 1,
        life: 20,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(plumeOfEvergrowth);
    drain(game, autumnSTouchYellow.canonicalId);

    expect(Bravo.zone("head")).not.toContain(plumeOfEvergrowth.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(plumeOfEvergrowth.canonicalId);
    expect(Bravo.zone("hand")).toContain(autumnSTouchYellow.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(autumnSTouchYellow.canonicalId);
    // Non-Earth stays in GY.
    expect(Bravo.zone("graveyard")).toContain(nimblismBlue.canonicalId);
    expect(Bravo.resourcePoints()).toBe(0);
  });

  it("boundaries: only non-Earth in GY → activate illegal (no legal target)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [plumeOfEvergrowth],
        graveyard: [snatchRed, nimblismBlue],
        hand: [],
        deck: 4,
        resourcePoints: 3,
        actionPoints: 1,
        life: 20,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(() => game.as(bravo).activate(plumeOfEvergrowth)).toThrow();
  });

  it("boundaries: 0 RP illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [plumeOfEvergrowth],
        graveyard: [autumnSTouchYellow],
        hand: [],
        deck: 4,
        resourcePoints: 0,
        actionPoints: 1,
        life: 20,
      },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(() => game.as(bravo).activate(plumeOfEvergrowth)).toThrow();
  });
});
