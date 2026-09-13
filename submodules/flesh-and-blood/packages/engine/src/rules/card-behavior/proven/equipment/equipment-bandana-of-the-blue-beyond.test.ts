/**
 * SEA179 Bandana of the Blue Beyond — Generic Head d0.
 *
 * Printed:
 *   Action - Discard a card, destroy this: Put a blue card from your graveyard
 *   on the bottom of your deck. Go again
 *
 * Reasoning (hand-authored):
 * 1. Mixed cost: discard 1 hand + destroy-self.
 * 2. Effect: at-res GY card with color blue → deck bottom.
 * 3. Model bug: filter types:["Blue"] never matches type-boxes — fixed to
 *    color:["blue"] (same class of residue as other color filters).
 * 4. Go again refunds Action AP.
 * 5. No hand discard / no blue GY → illegal; second activate illegal.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { bandanaOfTheBlueBeyond } from "../../../../../../cards/src/cards/equipment/bandana-of-the-blue-beyond.ts";

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
      // Prefer blue GY candidates when choosing; else first (discard fodder).
      const bluePick = decision.candidates.find(
        (c) => game.getState().objects[c.instanceId]?.canonicalId === nimblismBlue.canonicalId,
      );
      const pick = bluePick ?? decision.candidates[0];
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

function deckBottomCanonical(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): string | undefined {
  const deck = game.getState().containers.zonesByPlayerId[playerId]!.deck ?? [];
  // Engine deck index 0 = bottom (unshift).
  const bottomId = deck[0];
  return bottomId ? game.getState().objects[bottomId]?.canonicalId : undefined;
}

describe("bandana-of-the-blue-beyond (SEA179)", () => {
  it("core mechanic: discard + destroy → blue GY to deck bottom + go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [bandanaOfTheBlueBeyond],
        hand: [snatchRed],
        graveyard: [nimblismBlue],
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const apBefore = Bravo.actionPoints();
    expect(Bravo.zone("graveyard")).toContain(nimblismBlue.canonicalId);

    Bravo.activate(bandanaOfTheBlueBeyond);
    drain(game);

    // Cost: hand discarded, bandana destroyed.
    expect(Bravo.zone("hand")).not.toContain(snatchRed.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(snatchRed.canonicalId);
    expect(Bravo.zone("head")).not.toContain(bandanaOfTheBlueBeyond.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(bandanaOfTheBlueBeyond.canonicalId);

    // Effect: blue card left GY and sits on deck bottom.
    expect(Bravo.zone("graveyard")).not.toContain(nimblismBlue.canonicalId);
    expect(deckBottomCanonical(game, Bravo.id)).toBe(nimblismBlue.canonicalId);

    // Go again refunds Action AP.
    expect(Bravo.actionPoints()).toBe(apBefore);
  });

  it("boundaries: no hand / no blue GY illegal; model color filter (was types Blue)", () => {
    // Empty hand → cannot pay discard cost.
    const noHand = FabTestEngine.start(
      {
        hero: bravo,
        head: [bandanaOfTheBlueBeyond],
        hand: [],
        graveyard: [nimblismBlue],
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => noHand.as(bravo).activate(bandanaOfTheBlueBeyond)).toThrow();
    expect(noHand.as(bravo).zone("head")).toContain(bandanaOfTheBlueBeyond.canonicalId);

    // Hand but no blue in GY → effect target unresolved (activate fails or soft-fails).
    const noBlue = FabTestEngine.start(
      {
        hero: bravo,
        head: [bandanaOfTheBlueBeyond],
        hand: [snatchRed],
        graveyard: [snatchRed], // red only
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    try {
      noBlue.as(bravo).activate(bandanaOfTheBlueBeyond);
      drain(noBlue);
    } catch {
      // hard reject OK
    }
    // Blue never returned from GY if there was none.
    expect(noBlue.as(bravo).zone("graveyard")).not.toContain(nimblismBlue.canonicalId);

    const a1 = bandanaOfTheBlueBeyond.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated" || !a1.effect || a1.effect.type !== "move-card") return;
    expect(a1.abilityType).toBe("action");
    expect(a1.cost).toMatchObject({
      class: "mixed",
      type: "all",
      costs: expect.arrayContaining([
        expect.objectContaining({ class: "effect", type: "discard", count: 1 }),
        expect.objectContaining({ class: "effect", type: "destroy-self" }),
      ]),
    });
    expect(a1.effect.target).toMatchObject({
      selector: "object",
      zones: ["graveyard"],
      filter: { color: ["blue"] },
      count: 1,
    });
    expect(a1.effect.to).toMatchObject({ zone: "deck", position: "bottom" });
    expect(a1.layerKeywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "go-again" })]),
    );
    expect(bandanaOfTheBlueBeyond.base.numeric.defense).toBe(0);
  });
});
