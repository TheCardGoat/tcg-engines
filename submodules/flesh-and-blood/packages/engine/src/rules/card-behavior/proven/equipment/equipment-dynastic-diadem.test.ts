/**
 * PEN252 Dynastic Diadem — Draconic Head d1 Temper.
 *
 * Printed:
 *   Fealty tokens you control can't be destroyed by opponents' effects.
 *   If you control 3 or more Fealty tokens, this gets +1{d}.
 *   Temper
 *
 * Reasoning (hand-authored):
 * 1. Continuous +1{d} while 3+ Fealty: duration must be permanent (while-
 *    condition), not this-turn — same fix as helm-of-lignum-vitae.
 * 2. Seed arena Fealty tokens; zone-count permanent + name Fealty + Token.
 * 3. be-destroyed restrict + opponents-effects: opponent destroy skips Fealty
 *    (wired in proposeCardMovementEffect).
 * 4. Temper alone (d1, no +1): defend → −1 → destroy.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { dynasticDiadem } from "../../../../../../cards/src/cards/equipment/dynastic-diadem.ts";
import { fealty } from "../../../../../../cards/src/cards/tokens/fealty.ts";
import { cutThroughTheFacadeRed } from "../../../../../../cards/src/cards/actions/cut-through-the-facade.ts";

const LIFE = 20;
const SNATCH = 4;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      // Prefer accepting optional destroy so protection can be tested.
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
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (prio) {
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
  }
}

function headDefense(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): number | undefined {
  const state = game.getState();
  const instanceId = state.containers.zonesByPlayerId[playerId]?.head.find(
    (id) => state.objects[id]?.canonicalId === dynasticDiadem.canonicalId,
  );
  if (!instanceId) return undefined;
  const view = buildFabRulesView(state);
  return view.object({
    instanceId,
    incarnation: state.objects[instanceId]!.incarnation,
  })?.current.numeric.defense;
}

function fealtyCount(game: ReturnType<typeof FabTestEngine.start>, playerId: string): number {
  const arena = game.getState().containers.zonesByPlayerId[playerId]!.arena ?? [];
  return arena.filter((id) => {
    const can = game.getState().objects[id]?.canonicalId ?? "";
    return can === fealty.canonicalId || can === "token:fealty" || /fealty/i.test(can);
  }).length;
}

describe("dynastic-diadem (PEN252)", () => {
  it("core mechanic: 3 Fealty → +1{d} (blocks for 2); Temper leaves seat when d≥1 after −1", () => {
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
        head: [dynasticDiadem],
        arena: [fealty, fealty, fealty],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = game.as(dash);
    expect(fealtyCount(game, Defender.id)).toBe(3);
    expect(headDefense(game, Defender.id)).toBe(2);

    game.as(bravo).attackWith(snatchRed);
    Defender.defendWith(dynasticDiadem);
    // Continuous must apply on combat chain while defending.
    const defendingId = game
      .getState()
      .containers.zonesByPlayerId[Defender.id]!.combatChain.find(
        (id) => game.getState().objects[id]?.canonicalId === dynasticDiadem.canonicalId,
      );
    expect(defendingId).toBeDefined();
    const defRec = game.getState().objects[defendingId!]!;
    expect(
      buildFabRulesView(game.getState()).object({
        instanceId: defRec.instanceId,
        incarnation: defRec.incarnation,
      })?.current.numeric.defense,
    ).toBe(2);

    drain(game);
    game.helpers.resolveRestOfCombat();

    // snatch 4 − d2 = 2; Temper −1 on effective d2 → still d1 seated.
    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
    expect(Defender.zone("head")).toContain(dynasticDiadem.canonicalId);
  });

  it("boundaries: fewer than 3 Fealty → base d1 + Temper destroy; opponent can't destroy Fealty", () => {
    // <3 Fealty: base d1 only.
    const low = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [dynasticDiadem],
        arena: [fealty, fealty],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    expect(headDefense(low, low.as(dash).id)).toBe(1);
    low.as(bravo).attackWith(snatchRed);
    low.as(dash).defendWith(dynasticDiadem);
    drain(low);
    low.helpers.resolveRestOfCombat();
    // Temper −1 on d1 → destroy.
    expect(low.as(dash).life()).toBe(LIFE - (SNATCH - 1));
    expect(low.as(dash).zone("graveyard")).toContain(dynasticDiadem.canonicalId);

    // be-destroyed: opponent hit-optional destroy cannot remove Fealty.
    const protectedGame = FabTestEngine.start(
      {
        hero: bravo,
        // cut-through cost 3 / power 7 — pitch blues.
        hand: [cutThroughTheFacadeRed, nimblismBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        head: [dynasticDiadem],
        arena: [fealty],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    expect(fealtyCount(protectedGame, protectedGame.as(dash).id)).toBe(1);
    protectedGame.as(bravo).play(cutThroughTheFacadeRed, {
      pitch: [nimblismBlue, nimblismBlue, nimblismBlue],
    });
    drain(protectedGame);
    protectedGame.helpers.resolveRestOfCombat();
    drain(protectedGame);
    // Hit (life drop) + optional destroy should not remove Fealty under diadem.
    expect(fealtyCount(protectedGame, protectedGame.as(dash).id)).toBe(1);

    // Self-destroy of Fealty Instant still legal (not opponents' effects).
    const selfDestroy = FabTestEngine.start(
      {
        hero: dash,
        head: [dynasticDiadem],
        arena: [fealty],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, deck: 6 },
      { autoPassPriority: false },
    );
    expect(fealtyCount(selfDestroy, selfDestroy.as(dash).id)).toBe(1);
    selfDestroy.as(dash).activate(fealty);
    drain(selfDestroy);
    expect(fealtyCount(selfDestroy, selfDestroy.as(dash).id)).toBe(0);

    const a1 = dynasticDiadem.base.abilities?.[0];
    const a2 = dynasticDiadem.base.abilities?.[1];
    expect(a1?.kind).toBe("static");
    if (a1?.kind === "static") {
      expect(a1.staticKind).toBe("continuous");
      expect(a1.effect).toMatchObject({
        type: "rule-modification",
        mode: "restrict",
        action: "be-destroyed",
        source: "opponents-effects",
        duration: "while-in-arena",
      });
    }
    expect(a2?.kind).toBe("static");
    if (a2?.kind === "static") {
      expect(a2.staticKind).toBe("continuous");
      expect(a2.condition).toMatchObject({
        type: "zone-count",
        zone: "permanent",
        comparison: { op: "gte", value: 3 },
      });
      expect(a2.effect).toMatchObject({
        type: "modify-numeric",
        property: "defense",
        amount: 1,
        duration: "permanent",
      });
    }
    expect(dynasticDiadem.base.keywords?.some((k) => k.name === "temper")).toBe(true);
    expect(dynasticDiadem.base.numeric.defense).toBe(1);
  });
});
