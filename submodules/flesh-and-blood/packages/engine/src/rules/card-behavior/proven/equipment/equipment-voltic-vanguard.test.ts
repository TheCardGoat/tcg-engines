/**
 * PEN240 Voltic Vanguard — Lightning Head d0.
 *
 * Printed:
 *   Instant - Destroy this: Prevent the next 2 damage that would be dealt to
 *   you this turn. Activate this only if you've played an instant card this
 *   turn.
 *
 * Model:
 *   Instant destroy-self + played-this Instant ≥1 this turn → prevention
 *   fixed 2 this-turn controller.
 *
 * Reasoning (hand-authored):
 * 1. Gate is activation condition (played Instant this turn), not a cost.
 * 2. Happy path: mid-combat defender plays Instant, then activates → destroy
 *    + prevent 2 vs snatch 4 = 2 damage.
 * 3. Boundary: no Instant played this turn → activate illegal.
 * 4. Second activate after destroy illegal.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, sigilOfSolaceRed } from "../../../fixtures.ts";
import { volticVanguard } from "../../../../../../cards/src/cards/equipment/voltic-vanguard.ts";

const LIFE = 20;
const SNATCH = 4;

/** Resolve decisions + priority while a rules stack is open (instant/activate). */
function drainStack(game: ReturnType<typeof FabTestEngine.start>): void {
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
    if (game.getState().rulesStack.length === 0) return;
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

/** Pass once if needed so `playerId` holds priority. */
function ensurePriority(game: ReturnType<typeof FabTestEngine.start>, playerId: string): void {
  if (game.getState().priority?.holderPlayerId === playerId) return;
  game.declareNoDefenseIfPending();
  const prio = game.getPriorityPlayerId();
  if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
}

describe("voltic-vanguard (PEN240)", () => {
  it("core mechanic: Instant after playing Instant → destroy + prevent 2", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [volticVanguard],
        hand: [sigilOfSolaceRed],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);
    const lifeBefore = Defender.life();

    game.as(bravo).attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    ensurePriority(game, Defender.id);

    // Play Instant this turn (condition), resolve only its stack.
    Defender.must.playInstant(sigilOfSolaceRed);
    drainStack(game);
    expect(Defender.life()).toBe(lifeBefore + 3);
    expect(game.combat()).toBeTruthy();

    ensurePriority(game, Defender.id);
    Defender.activate(volticVanguard);
    drainStack(game);
    game.helpers.resolveRestOfCombat();

    // Destroyed; prevent 2 of snatch 4 → net −2 from post-sigil life.
    expect(Defender.zone("head")).not.toContain(volticVanguard.canonicalId);
    expect(Defender.zone("graveyard")).toContain(volticVanguard.canonicalId);
    expect(Defender.life()).toBe(lifeBefore + 3 - (SNATCH - 2));
  });

  it("boundaries: no Instant played → illegal; second activate illegal; model", () => {
    const noInstant = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [volticVanguard],
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    noInstant.as(bravo).attackWith(snatchRed);
    ensurePriority(noInstant, noInstant.as(dash).id);
    expect(() => noInstant.as(dash).activate(volticVanguard)).toThrow();

    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [volticVanguard],
        hand: [sigilOfSolaceRed],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    game.as(bravo).attackWith(snatchRed);
    ensurePriority(game, game.as(dash).id);
    game.as(dash).must.playInstant(sigilOfSolaceRed);
    drainStack(game);
    ensurePriority(game, game.as(dash).id);
    game.as(dash).activate(volticVanguard);
    drainStack(game);
    expect(() => game.as(dash).activate(volticVanguard)).toThrow();

    const a1 = volticVanguard.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
    expect(a1.condition).toMatchObject({
      type: "played-this",
      per: "turn",
      filter: { typeBox: { types: ["Instant"] } },
      comparison: { op: "gte", value: 1 },
    });
    expect(a1.effect).toMatchObject({
      type: "prevention",
      preventionKind: "fixed",
      amount: 2,
      duration: "this-turn",
    });
    expect(volticVanguard.base.numeric.defense).toBe(0);
  });
});
