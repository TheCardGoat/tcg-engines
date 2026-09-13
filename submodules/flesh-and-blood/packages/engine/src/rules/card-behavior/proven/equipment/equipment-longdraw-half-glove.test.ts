/**
 * MST232 Longdraw Half-glove — Ranger Arms d1 Battleworn.
 *
 * Printed:
 *   Instant - Destroy this, put 2 cards from your hand and/or arsenal on the
 *   bottom of your deck: Your next arrow attack this turn gets +4{p}.
 *   Battleworn
 *
 * Reasoning (hand-authored; case-by-case — found real activation gap):
 * 1. Instant mixed cost: destroy-self + put 2 cards hand/arsenal → deck bottom.
 * 2. Engine activation move-to-deck was hard-capped at count===1 (Mask path);
 *    Longdraw needs multi-pick count 2. Wired count≥1 + min/max multi declare
 *    + pay all declared ids (same pattern as multi-banish costs).
 * 3. Happy: activate with 2 hand fodder → arms GY, both fodder deck bottom,
 *    next Endless Arrow (base 4) deals 8.
 * 4. Boundary: <2 cards in hand+arsenal illegal; Snatch (non-Arrow) unbuffed;
 *    battleworn d1.
 *
 * Status: ✅ Instant destroy+2 bottom → next Arrow +4; ENGINE multi move-to-deck;
 * BW d1.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import {
  azalea,
  dash,
  deathDealer,
  snatchRed,
  nimblismBlue,
  endlessArrowRed,
} from "../../../fixtures.ts";
import { longdrawHalfGlove } from "../../../../../../cards/src/cards/equipment/longdraw-half-glove.ts";

const LIFE = 40;
const ARROW = 4;
const BUFF = 4;
const SNATCH = 4;
const DEF = 1;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 80; safety += 1) {
    const decision = game.getState().decision;
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
    if (decision?.kind === "entity-target") {
      // Prefer nimblism fodder for move-to-deck costs so Arrow/Snatch stay in hand.
      const max = decision.max ?? 1;
      const preferred = decision.candidates.filter(
        (c) => game.getState().objects[c.instanceId]?.canonicalId === nimblismBlue.canonicalId,
      );
      const rest = decision.candidates.filter(
        (c) => game.getState().objects[c.instanceId]?.canonicalId !== nimblismBlue.canonicalId,
      );
      const picks = [...preferred, ...rest].slice(0, max).map((c) => c.instanceId);
      if (picks.length < (decision.min ?? 1)) break;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: picks },
        },
      });
      continue;
    }
    if (decision?.kind === "payment") {
      const pick = decision.candidates[0];
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "payment", instanceIds: pick ? [pick.instanceId] : [] },
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

function finishCombat(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 80; safety += 1) {
    drain(game);
    if (!game.combat() && game.getState().rulesStack.length === 0 && !game.getState().decision) {
      return;
    }
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio && !game.getState().decision) {
      try {
        game.exec({ move: "pass", actorId: prio, payload: {} });
      } catch {
        return;
      }
      continue;
    }
    if (!game.getState().decision && !prio) return;
  }
}

describe("longdraw-half-glove (MST232)", () => {
  it("core mechanic: Instant destroy + 2 hand/arsenal bottom → next Arrow +4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arms: [longdrawHalfGlove],
        hand: [nimblismBlue, nimblismBlue],
        arsenal: [endlessArrowRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Azalea = game.as(azalea);
    const Opponent = game.as(dash);

    const deckBefore = Azalea.zone("deck").length;
    Azalea.activate(longdrawHalfGlove);
    drain(game);

    // Destroy-self + both fodder to deck bottom.
    expect(Azalea.zone("arms")).not.toContain(longdrawHalfGlove.canonicalId);
    expect(Azalea.zone("graveyard")).toContain(longdrawHalfGlove.canonicalId);
    expect(Azalea.zone("hand")).toEqual([]);
    expect(Azalea.zone("arsenal")).toEqual([endlessArrowRed.canonicalId]);
    expect(Azalea.zone("deck").length).toBe(deckBefore + 2);
    expect(Azalea.zone("deck")).toContain(nimblismBlue.canonicalId);

    // Next Arrow attack gets +4 (base 4 → 8).
    Azalea.attackWith(endlessArrowRed, { from: "arsenal" });
    finishCombat(game);
    expect(Opponent.life()).toBe(LIFE - (ARROW + BUFF));
  });

  it("boundaries: <2 cards illegal; non-Arrow unbuffed; BW d1; model", () => {
    // Only 1 hand card → cannot pay move-to-deck ×2.
    const short = FabTestEngine.start(
      {
        hero: azalea,
        arms: [longdrawHalfGlove],
        hand: [nimblismBlue],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => short.as(azalea).activate(longdrawHalfGlove)).toThrow();
    expect(short.as(azalea).zone("arms")).toContain(longdrawHalfGlove.canonicalId);

    // After activate, Snatch (not Arrow) is unbuffed at base 4.
    const plain = FabTestEngine.start(
      {
        hero: azalea,
        arms: [longdrawHalfGlove],
        hand: [snatchRed, nimblismBlue, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    plain.as(azalea).activate(longdrawHalfGlove);
    drain(plain);
    plain.as(azalea).attackWith(snatchRed);
    finishCombat(plain);
    expect(plain.as(dash).life()).toBe(LIFE - SNATCH);

    // Battleworn d1: defend contributes 1, remains seated.
    const bw = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: azalea,
        life: LIFE,
        arms: [longdrawHalfGlove],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    bw.as(dash).attackWith(snatchRed);
    bw.as(azalea).defendWith(longdrawHalfGlove);
    finishCombat(bw);
    expect(bw.as(azalea).life()).toBe(LIFE - (SNATCH - DEF));
    expect(bw.as(azalea).zone("arms")).toContain(longdrawHalfGlove.canonicalId);

    const a1 = longdrawHalfGlove.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("instant");
      expect(a1.cost).toMatchObject({
        class: "mixed",
        type: "all",
        costs: [
          { class: "effect", type: "destroy-self" },
          {
            class: "effect",
            type: "move-to-deck",
            from: "hand-and-arsenal",
            position: "bottom",
            count: 2,
          },
        ],
      });
      expect(a1.effect).toMatchObject({
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 4,
        appliesTo: { next: { typeBox: { subtypes: ["Arrow"] } } },
        duration: "this-turn",
      });
    }
    expect(longdrawHalfGlove.base.keywords?.some((k) => k.name === "battleworn")).toBe(true);
    expect(longdrawHalfGlove.base.numeric.defense).toBe(1);
  });
});
