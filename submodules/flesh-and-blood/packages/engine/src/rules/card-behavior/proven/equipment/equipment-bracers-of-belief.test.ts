/**
 * ARC153 Bracers of Belief — Generic Arms d0.
 *
 * Printed:
 *   Action - Destroy Bracers of Belief: Reveal the top card of your deck. If
 *   you do, the next attack action card you play this turn, gains +X{p},
 *   where X is 3 minus the pitch value of the card revealed this way. Go again
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. Action destroy-self + go again AP refund.
 * 2. Reveal deck top (last fixture entry) → bind pitch → floating next AAC
 *    +X where X = 3 − pitch (red +2, blue +0).
 * 3. Happy: deck-top red → next Snatch deals 4+2=6.
 * 4. Boundary: deck-top blue → X=0 → Snatch deals base 4.
 * 5. Boundary: bare Snatch without activate deals 4 (no floating grant).
 * 6. Model: reveal.then + difference pitch; d0 no BW/BB.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../../fixtures.ts";
import { bracersOfBelief } from "../../../../../../cards/src/cards/equipment/bracers-of-belief.ts";

const LIFE = 40;
const SNATCH = 4;

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

describe("bracers-of-belief (ARC153)", () => {
  it("core mechanic: destroy → reveal red (pitch 1) → next AAC +2{p}; go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [bracersOfBelief],
        hand: [snatchRed],
        // Top = last: red pitch 1 → X = 3−1 = 2.
        deck: [nimblismBlue, nimblismBlue, snatchRed],
        actionPoints: 2,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    const apBefore = Bravo.actionPoints();
    Bravo.activate(bracersOfBelief);
    drain(game);

    expect(Bravo.zone("arms")).not.toContain(bracersOfBelief.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(bracersOfBelief.canonicalId);
    expect(Bravo.actionPoints()).toBe(apBefore);
    expect(game.committedEvents().some((e) => e.name === "reveal")).toBe(true);

    const lifeBefore = Opponent.life();
    Bravo.attackWith(snatchRed);
    drain(game);
    game.helpers.resolveRestOfCombat();
    drain(game);
    expect(Opponent.life()).toBe(lifeBefore - (SNATCH + 2));
  });

  it("boundaries: blue reveal +0; bare Snatch no grant; model", () => {
    // Blue pitch 3 → X = 0 → Snatch deals base 4.
    const blue = FabTestEngine.start(
      {
        hero: bravo,
        arms: [bracersOfBelief],
        hand: [snatchRed],
        deck: [snatchRed, snatchRed, nimblismBlue],
        actionPoints: 2,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    blue.as(bravo).activate(bracersOfBelief);
    drain(blue);
    const blueLife = blue.as(dash).life();
    blue.as(bravo).attackWith(snatchRed);
    drain(blue);
    blue.helpers.resolveRestOfCombat();
    drain(blue);
    expect(blue.as(dash).life()).toBe(blueLife - SNATCH);

    // Without activate, Snatch is base 4.
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        arms: [bracersOfBelief],
        hand: [snatchRed],
        deck: [snatchRed],
        actionPoints: 1,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const bareLife = bare.as(dash).life();
    bare.as(bravo).attackWith(snatchRed);
    drain(bare);
    bare.helpers.resolveRestOfCombat();
    drain(bare);
    expect(bare.as(dash).life()).toBe(bareLife - SNATCH);
    expect(bare.as(bravo).zone("arms")).toContain(bracersOfBelief.canonicalId);

    const a1 = bracersOfBelief.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("action");
      expect(a1.cost).toMatchObject({ type: "destroy-self" });
      expect(a1.layerKeywords).toEqual(
        expect.arrayContaining([expect.objectContaining({ name: "go-again" })]),
      );
      expect(a1.effect).toMatchObject({
        type: "if-you-do",
        effect: {
          type: "reveal",
          target: { zones: ["deck"], position: "top", count: 1 },
          outputBinding: "it",
        },
        then: {
          type: "modify-numeric",
          property: "power",
          op: "add",
          amount: {
            type: "difference",
            operands: [3, { type: "reference", binding: "it", property: "pitch" }],
          },
          appliesTo: { next: { typeBox: { types: ["Action"], subtypes: ["Attack"] } } },
        },
      });
    }
    expect(bracersOfBelief.base.numeric.defense).toBe(0);
  });
});
