/**
 * OMN140 Third Eye of the Sphinx — Illusionist/Wizard Head d1 Spellvoid 1 BB.
 *
 * Printed:
 *   Instant - {r}, {t}, destroy a Ponder token you control: Draw a card.
 *   Spellvoid 1
 *   Blade Break
 *
 * Reasoning (hand-authored):
 * 1. Instant mixed cost: 1{r} + tap-self + destroy controller Ponder in arena.
 * 2. Filter name was "Ponder Token" (never matched catalog "Ponder") — fixed.
 * 3. Resolve → draw 1; source stays equipped but tapped; Ponder to GY.
 * 4. No Ponder / 0 RP / already tapped → illegal.
 * 5. Blade Break d1 lifecycle.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { thirdEyeOfTheSphinx } from "../../../../../../cards/src/cards/equipment/third-eye-of-the-sphinx.ts";
import { ponder } from "../../../../../../cards/src/cards/tokens/ponder.ts";

const SNATCH = 4;
const LIFE = 20;
const DEF = 1;

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
    if (decision?.kind === "payment") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "payment", instanceIds: [] },
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

describe("third-eye-of-the-sphinx (OMN140)", () => {
  it("core mechanic: Instant {r}+tap+destroy Ponder → draw", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [thirdEyeOfTheSphinx],
        arena: [ponder],
        hand: [],
        resourcePoints: 1,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const headId = game.getState().containers.zonesByPlayerId[Bravo.id]!.head[0]!;
    const handBefore = Bravo.zone("hand").length;

    expect(Bravo.zone("arena")).toContain(ponder.canonicalId);

    Bravo.activate(thirdEyeOfTheSphinx);
    drain(game);

    expect(Bravo.resourcePoints()).toBe(0);
    // CR 8.1.8a: destroyed tokens cease to exist (do not enter GY).
    expect(Bravo.zone("arena")).not.toContain(ponder.canonicalId);
    expect(Bravo.zone("graveyard")).not.toContain(ponder.canonicalId);
    expect(Bravo.zone("hand").length).toBe(handBefore + 1);
    expect(Bravo.zone("head")).toContain(thirdEyeOfTheSphinx.canonicalId);
    expect(game.objectState(headId)?.tapped).toBe(true);
  });

  it("boundaries: no Ponder illegal; 0 RP illegal; BB d1; model costs", () => {
    const noPonder = FabTestEngine.start(
      {
        hero: bravo,
        head: [thirdEyeOfTheSphinx],
        arena: [],
        resourcePoints: 1,
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => noPonder.as(bravo).activate(thirdEyeOfTheSphinx)).toThrow();

    const poor = FabTestEngine.start(
      {
        hero: bravo,
        head: [thirdEyeOfTheSphinx],
        arena: [ponder],
        resourcePoints: 0,
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => poor.as(bravo).activate(thirdEyeOfTheSphinx)).toThrow();

    const bb = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [thirdEyeOfTheSphinx],
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    bb.as(bravo).attackWith(snatchRed);
    bb.as(dash).defendWith(thirdEyeOfTheSphinx);
    drain(bb);
    bb.helpers.resolveRestOfCombat();
    expect(bb.as(dash).life()).toBe(LIFE - (SNATCH - DEF));
    expect(bb.as(dash).zone("graveyard")).toContain(thirdEyeOfTheSphinx.canonicalId);

    const a1 = thirdEyeOfTheSphinx.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({
      class: "mixed",
      type: "all",
      costs: [
        { class: "asset", type: "resources", amount: 1 },
        { class: "effect", type: "tap-self" },
        { class: "effect", type: "destroy", filter: { name: "Ponder" }, count: 1 },
      ],
    });
    expect(a1.effect).toMatchObject({ type: "draw", count: 1 });
    expect(
      thirdEyeOfTheSphinx.base.keywords?.some(
        (k) => k.name === "spellvoid" && (k as { value?: number }).value === 1,
      ),
    ).toBe(true);
  });
});
