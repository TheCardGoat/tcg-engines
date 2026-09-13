/**
 * AAZ006 Sharp Shooters — Ranger Arms d1 Battleworn.
 *
 * Printed:
 *   Action - Destroy this: Put an arrow from your hand face-up into your
 *   arsenal with an aim counter. Go again
 *   Battleworn
 *
 * Reasoning (hand-authored; hidden-agenda / target-totalizer family):
 * 1. Action destroy-self + go again AP refund.
 * 2. Move Arrow from hand → arsenal face-up, then add named aim counter on
 *    the moved card (outputBinding it). Arrow is FAB_SUBTYPES; filter
 *    subtypes:["Arrow"] matches type-box after normalize.
 * 3. Arrow choice declared on-stack (was at-resolution — activation quote
 *    never gated empty hand / non-Arrow; destroy-self still paid). Remodel
 *    makes empty hand / only non-Arrow illegal at quote.
 * 4. Battleworn d1 defend leaves seat at d0 (not Blade Break destroy).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, longShotRed } from "../../../fixtures.ts";
import { sharpShooters } from "../../../../../../cards/src/cards/equipment/sharp-shooters.ts";

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
      // Prefer the arrow when choosing from hand.
      const arrow = decision.candidates.find(
        (c) => game.getState().objects[c.instanceId]?.canonicalId === longShotRed.canonicalId,
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
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const prio = game.getState().priority?.holderPlayerId;
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

function aimCount(game: ReturnType<typeof FabTestEngine.start>, instanceId: string): number {
  return (game.getState().objects[instanceId]?.counters ?? [])
    .filter((c) => c.kind === "named" && c.name === "aim")
    .reduce((sum, c) => sum + c.count, 0);
}

describe("sharp-shooters (AAZ006)", () => {
  it("core mechanic: destroy-self → hand Arrow face-up arsenal with aim; go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [sharpShooters],
        hand: [longShotRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("hand")).toContain(longShotRed.canonicalId);
    expect(Bravo.zone("arsenal")).not.toContain(longShotRed.canonicalId);

    const apBefore = Bravo.actionPoints();
    Bravo.activate(sharpShooters);
    drain(game);

    // Destroy-self cost + go again refunds Action AP.
    expect(Bravo.zone("arms")).not.toContain(sharpShooters.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(sharpShooters.canonicalId);
    expect(Bravo.actionPoints()).toBe(apBefore);

    // Arrow left hand for face-up arsenal with aim.
    expect(Bravo.zone("hand")).not.toContain(longShotRed.canonicalId);
    expect(Bravo.zone("arsenal")).toContain(longShotRed.canonicalId);
    const arrowId = Bravo.findCardInZone("arsenal", longShotRed);
    expect(aimCount(game, arrowId)).toBe(1);
    // Face-up: no face-down marker.
    expect(game.getState().objects[arrowId]?.markers.some((m) => m.kind === "face-down")).toBe(
      false,
    );
  });

  it("boundaries: empty hand / non-Arrow illegal; battleworn d1; model", () => {
    // Empty hand: activation must be illegal (cannot choose an Arrow).
    const empty = FabTestEngine.start(
      {
        hero: bravo,
        arms: [sharpShooters],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const emptyReject = empty.as(bravo).expectFailure({
      move: "activate",
      payload: { instanceId: empty.as(bravo).card(sharpShooters) },
    });
    expect(emptyReject.accepted).toBe(false);
    expect(empty.as(bravo).zone("arms")).toContain(sharpShooters.canonicalId);

    // Only non-Arrow (Snatch) in hand.
    const nonArrow = FabTestEngine.start(
      {
        hero: bravo,
        arms: [sharpShooters],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const nonReject = nonArrow.as(bravo).expectFailure({
      move: "activate",
      payload: { instanceId: nonArrow.as(bravo).card(sharpShooters) },
    });
    expect(nonReject.accepted).toBe(false);
    expect(nonArrow.as(bravo).zone("arms")).toContain(sharpShooters.canonicalId);
    expect(nonArrow.as(bravo).zone("hand")).toContain(snatchRed.canonicalId);

    // Battleworn d1: defend contributes 1 then −1 counter; seat remains at d0.
    const bw = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        arms: [sharpShooters],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    bw.as(dash).attackWith(snatchRed);
    bw.as(bravo).defendWith(sharpShooters);
    drain(bw);
    bw.helpers.resolveRestOfCombat();
    drain(bw);
    expect(bw.as(bravo).zone("arms")).toContain(sharpShooters.canonicalId);
    expect(bw.as(bravo).life()).toBe(LIFE - (SNATCH - 1));

    const a1 = sharpShooters.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("action");
      expect(a1.cost).toMatchObject({ type: "destroy-self" });
      expect(a1.layerKeywords).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: "go-again" })]),
      );
      expect(a1.effect).toMatchObject({
        type: "sequence",
        steps: [
          {
            type: "move-card",
            target: {
              zones: ["hand"],
              declared: "on-stack",
              filter: { typeBox: { subtypes: ["Arrow"] } },
              count: 1,
            },
            to: { zone: "arsenal", visibility: "face-up" },
            outputBinding: "it",
          },
          {
            type: "add-counter",
            counter: { kind: "named", name: "aim" },
            count: 1,
            target: { selector: "binding", binding: "it" },
          },
        ],
      });
    }
    expect(sharpShooters.base.numeric.defense).toBe(1);
    expect(sharpShooters.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "battleworn" })]),
    );
  });
});
