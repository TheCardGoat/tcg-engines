/**
 * PEN152 Carrion Crown — Necromancer Head d2 Blade Break.
 *
 * Printed:
 *   Action - Discard an ally, destroy this: Draw a card. Go again
 *   Blade Break
 *
 * Reasoning (hand-authored):
 * 1. Action mixed cost: discard 1 hand Ally + destroy-self.
 * 2. Effect draw 1; layerKeywords goAgain refunds the Action AP.
 * 3. No Ally in hand → activation illegal (discard cost gate).
 * 4. After destroy, second activate illegal; bladeBreak keyword present.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { carrionCrown } from "../../../../../../cards/src/cards/equipment/carrion-crown.ts";
import { limpitHopALongYellow } from "../../../../../../cards/src/cards/actions/limpit-hop-a-long.ts";

const SNATCH = 4;
const LIFE = 20;

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
      // Prefer Ally candidate when discarding for cost.
      const allyPick =
        decision.candidates.find(
          (c) =>
            game.getState().objects[c.instanceId]?.canonicalId === limpitHopALongYellow.canonicalId,
        ) ?? decision.candidates[0];
      if (!allyPick && (decision.min ?? 1) > 0) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "entity-target",
            instanceIds: allyPick ? [allyPick.instanceId] : [],
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

describe("carrion-crown (PEN152)", () => {
  it("core mechanic: Action discard Ally + destroy → draw + go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        life: LIFE,
        head: [carrionCrown],
        hand: [limpitHopALongYellow],
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const handBefore = Bravo.zone("hand").length;
    const deckBefore = Bravo.zone("deck").length;
    const apBefore = game.getState().players[Bravo.id]!.actionPoints;

    Bravo.activate(carrionCrown);
    drain(game);

    // Cost: Ally discarded, crown destroyed.
    expect(Bravo.zone("hand")).not.toContain(limpitHopALongYellow.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(limpitHopALongYellow.canonicalId);
    expect(Bravo.zone("head")).not.toContain(carrionCrown.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(carrionCrown.canonicalId);

    // Effect: draw 1. Net hand: −1 ally +1 draw = same as handBefore if deck had cards.
    // Start hand 1, discard 1, draw 1 → hand length 1.
    expect(Bravo.zone("hand").length).toBe(handBefore); // 1 − 1 + 1
    expect(Bravo.zone("deck").length).toBe(deckBefore - 1);

    // Go again refunds the Action AP.
    expect(game.getState().players[Bravo.id]!.actionPoints).toBe(apBefore);
  });

  it("boundaries: no Ally illegal; second activate illegal; model + bladeBreak", () => {
    const noAlly = FabTestEngine.start(
      {
        hero: bravo,
        head: [carrionCrown],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => noAlly.as(bravo).activate(carrionCrown)).toThrow();

    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [carrionCrown],
        hand: [limpitHopALongYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    game.as(bravo).activate(carrionCrown);
    drain(game);
    expect(() => game.as(bravo).activate(carrionCrown)).toThrow();

    // Blade Break d2 lifecycle.
    const bb = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: LIFE, head: [carrionCrown], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    bb.as(bravo).attackWith(snatchRed);
    bb.as(dash).defendWith(carrionCrown);
    bb.helpers.resolveRestOfCombat();
    expect(bb.as(dash).life()).toBe(LIFE - (SNATCH - 2));
    expect(bb.as(dash).zone("head")).not.toContain(carrionCrown.canonicalId);
    expect(bb.as(dash).zone("graveyard")).toContain(carrionCrown.canonicalId);

    const a1 = carrionCrown.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("action");
    expect(a1.cost).toMatchObject({
      class: "mixed",
      type: "all",
      costs: [
        { type: "discard", count: 1, filter: { typeBox: { subtypes: ["Ally"] } } },
        { type: "destroy-self" },
      ],
    });
    expect(a1.effect).toMatchObject({ type: "draw", count: 1 });
    expect(a1.layerKeywords?.some((k) => k.name === "go-again")).toBe(true);
    expect(carrionCrown.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);
    expect(carrionCrown.base.numeric.defense).toBe(2);
  });
});
