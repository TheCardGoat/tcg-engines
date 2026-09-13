/**
 * LSS008 Diamond Hands — Merchant Arms d1 Blade Break (Ruu'di Specialization).
 *
 * Printed:
 *   Ruu'di Specialization
 *   At the beginning of your end phase, if you have 4 or more cards in hand,
 *   create a Diamond token.
 *   Blade Break
 *
 * Reasoning (hand-authored; case-by-case; frontline end-phase family):
 * 1. Prior bare end-phase would fire on opponent end phase too — remodel
 *    actor:controller.
 * 2. Happy: 4+ hand at your end phase → Diamond token in arena.
 * 3. Boundary: 3-card hand → no Diamond.
 * 4. Boundary: opponent ends turn → no Diamond.
 * 5. Blade Break d1 defend → destroy.
 * 6. Specialization is meta (registration only) — ability tested on Bravo.
 *
 * Status: ✅ end-phase 4+ hand → Diamond; <4 / opp end no fire; BB d1; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { diamondHands } from "../../../../../../cards/src/cards/equipment/diamond-hands.ts";

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
    if (game.getState().rulesStack.length === 0 && !game.combat()) return;
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

function hasDiamond(game: ReturnType<typeof FabTestEngine.start>, playerId: string): boolean {
  const state = game.getState();
  const arena = state.containers.zonesByPlayerId[playerId]?.arena ?? [];
  return arena.some((id) => {
    const obj = state.objects[id];
    if (!obj) return false;
    const def = state.cardDefinitions[obj.canonicalId];
    const slug = def?.slug ?? obj.canonicalId;
    return /diamond/i.test(slug) || /token:diamond/i.test(obj.canonicalId);
  });
}

describe("diamond-hands (LSS008)", () => {
  it("core mechanic: your end phase with 4+ hand → create Diamond token", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [diamondHands],
        hand: [snatchRed, snatchRed, nimblismBlue, nimblismBlue],
        deck: 6,
        life: LIFE,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("arms")).toContain(diamondHands.canonicalId);
    expect(Bravo.zone("hand").length).toBe(4);
    expect(hasDiamond(game, Bravo.id)).toBe(false);

    Bravo.endTurn();
    drain(game);

    expect(hasDiamond(game, Bravo.id)).toBe(true);
    expect(Bravo.zone("arms")).toContain(diamondHands.canonicalId);
  });

  it("boundaries: hand <4 no Diamond; opponent end phase no Diamond; BB d1; model", () => {
    // 3-card hand at end phase → no create.
    const short = FabTestEngine.start(
      {
        hero: bravo,
        arms: [diamondHands],
        hand: [snatchRed, snatchRed, nimblismBlue],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    short.as(bravo).endTurn();
    drain(short);
    expect(hasDiamond(short, short.as(bravo).id)).toBe(false);

    // Opponent ends turn — controller's end phase has not begun.
    const opp = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed, snatchRed, snatchRed, snatchRed],
        deck: 6,
        actionPoints: 1,
      },
      {
        hero: bravo,
        arms: [diamondHands],
        hand: [snatchRed, snatchRed, snatchRed, snatchRed],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    opp.as(dash).endTurn();
    drain(opp);
    expect(hasDiamond(opp, opp.as(bravo).id)).toBe(false);

    // Blade Break d1.
    const bw = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        arms: [diamondHands],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Def = bw.as(bravo);
    bw.as(dash).attackWith(snatchRed);
    Def.defendWith(diamondHands);
    bw.helpers.resolveRestOfCombat();
    expect(Def.life()).toBe(LIFE - (SNATCH - 1));
    expect(Def.zone("graveyard")).toContain(diamondHands.canonicalId);
    expect(Def.zone("arms")).not.toContain(diamondHands.canonicalId);

    const a1 = diamondHands.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || !a1.effect) return;
    expect(a1.staticKind).toBe("triggered");
    expect(a1.trigger).toMatchObject({
      event: { name: "end-phase", actor: "controller" },
    });
    expect(a1.condition).toMatchObject({
      type: "zone-count",
      zone: "hand",
      player: "controller",
      comparison: { op: "gte", value: 4 },
    });
    expect(a1.effect).toMatchObject({
      type: "create-token",
      token: "diamond",
      controller: "controller",
    });
    expect(diamondHands.base.keywords).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "blade-break" }),
        expect.objectContaining({ name: "specialization", hero: "Ruu'di" }),
      ]),
    );
  });
});
