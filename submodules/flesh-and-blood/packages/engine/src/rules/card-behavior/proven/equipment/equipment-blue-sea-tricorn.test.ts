/**
 * SEA126 Blue Sea Tricorn — Pirate Head d1 Blade Break.
 *
 * Printed:
 *   Action - {r}{r}{r}, destroy this: Draw a card. Go again
 *   Blade Break
 *
 * Reasoning (hand-authored):
 * 1. Action mixed cost: 3 resources + destroy-self.
 * 2. Draw 1; go again refunds the Action AP.
 * 3. Insufficient RP illegal; second activate after destroy illegal.
 * 4. Blade Break defend d1 → GY.
 *
 * Note: a thin activate path also lives in equipment-blade-break-sea-sup-…;
 * this file is the full AAA production bar.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { blueSeaTricorn } from "../../../../../../cards/src/cards/equipment/blue-sea-tricorn.ts";

const LIFE = 20;
const SNATCH = 4;
const HELM_D = 1;

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

describe("blue-sea-tricorn (SEA126)", () => {
  it("core mechanic: Action 3{r} destroy → draw + go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [blueSeaTricorn],
        hand: [],
        actionPoints: 1,
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const apBefore = Bravo.actionPoints();
    const handBefore = Bravo.zone("hand").length;

    Bravo.activate(blueSeaTricorn);
    drain(game);

    expect(Bravo.zone("head")).not.toContain(blueSeaTricorn.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(blueSeaTricorn.canonicalId);
    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.zone("hand").length).toBe(handBefore + 1);
    // Go again refunds the Action AP.
    expect(Bravo.actionPoints()).toBe(apBefore);
  });

  it("boundaries: low RP illegal; BB d1; model Action 3{r} destroy draw", () => {
    const poor = FabTestEngine.start(
      {
        hero: bravo,
        head: [blueSeaTricorn],
        hand: [],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => poor.as(bravo).activate(blueSeaTricorn)).toThrow();
    expect(poor.as(bravo).zone("head")).toContain(blueSeaTricorn.canonicalId);

    const bw = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [blueSeaTricorn],
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    bw.as(bravo).attackWith(snatchRed);
    bw.as(dash).defendWith(blueSeaTricorn);
    drain(bw);
    bw.helpers.resolveRestOfCombat();
    expect(bw.as(dash).zone("graveyard")).toContain(blueSeaTricorn.canonicalId);
    expect(bw.as(dash).zone("head")).not.toContain(blueSeaTricorn.canonicalId);
    expect(bw.as(dash).life()).toBe(LIFE - (SNATCH - HELM_D));

    const a1 = blueSeaTricorn.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("action");
    expect(a1.cost).toMatchObject({
      class: "mixed",
      type: "all",
      costs: expect.arrayContaining([
        expect.objectContaining({ class: "asset", type: "resources", amount: 3 }),
        expect.objectContaining({ class: "effect", type: "destroy-self" }),
      ]),
    });
    expect(a1.effect).toMatchObject({ type: "draw", count: 1, player: "controller" });
    expect(a1.layerKeywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "go-again" })]),
    );
  });
});
