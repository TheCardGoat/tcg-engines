/**
 * SUP126 Overbearing Presence — Brute Chest d1 Blade Break.
 *
 * Printed:
 *   Action - {r}{r}{r}, destroy this: Create 3 Vigor tokens. Activate this only
 *   if there is a card with 6 or more {p} in your pitch zone. Go again
 *   Blade Break
 *
 * Reasoning (case-by-case):
 * 1. Action mixed cost 3{r} + destroy-self → create 3 Vigor + go again.
 * 2. Activation condition pitch-zone-has power ≥ 6 (wired evaluator).
 * 3. Empty pitch / only low-power pitch → illegal; p6+ in pitch unlocks.
 * 4. Blade Break d1 on defend.
 * 5. Model already correct: pitch-zone-has + create-token vigor count 3.
 *
 * Status: ✅ 3{r}+destroy with p6 pitch → 3 Vigor+GA; no-pitch illegal; BB d1.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue } from "../../../fixtures.ts";
import { overbearingPresence } from "../../../../../../cards/src/cards/equipment/overbearing-presence.ts";
import { brutalAssaultRed } from "../../../../../../cards/src/cards/actions/brutal-assault.ts";
import { vigor } from "../../../../../../cards/src/cards/tokens/vigor.ts";

const LIFE = 20;
const SNATCH = 4;
const DEF = 1;

function drain(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 48; safety += 1) {
    if (game.answerForcedDecision()) continue;
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

function vigorCount(game: ReturnType<typeof FabTestEngine.start>, playerId: string): number {
  const arena = game.getState().containers.zonesByPlayerId[playerId]!.arena ?? [];
  return arena.filter((id) => {
    const canonical = game.getState().objects[id]?.canonicalId ?? "";
    return (
      canonical === vigor.canonicalId || canonical === "token:vigor" || /vigor/i.test(canonical)
    );
  }).length;
}

describe("overbearing-presence (SUP126)", () => {
  it("core mechanic: Action 3{r}+destroy with p6+ in pitch → 3 Vigor + go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [overbearingPresence],
        // Brutal Assault is power 6 — satisfies pitch-zone-has gate.
        pitch: [brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 3,
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    expect(Bravo.zone("pitch")).toContain(brutalAssaultRed.canonicalId);
    expect(vigorCount(game, Bravo.id)).toBe(0);

    const apBefore = Bravo.actionPoints();
    const result = Bravo.activate(overbearingPresence);
    expect(result.accepted).toBe(true);
    drain(game);

    expect(Bravo.zone("chest")).not.toContain(overbearingPresence.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(overbearingPresence.canonicalId);
    expect(Bravo.resourcePoints()).toBe(0);
    expect(vigorCount(game, Bravo.id)).toBe(3);
    // Go again refunds Action AP.
    expect(Bravo.actionPoints()).toBe(apBefore);
  });

  it("boundaries: no p6 pitch / low-power pitch illegal; BB d1; model", () => {
    // Empty pitch.
    const empty = FabTestEngine.start(
      {
        hero: bravo,
        chest: [overbearingPresence],
        actionPoints: 1,
        resourcePoints: 3,
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => empty.as(bravo).activate(overbearingPresence)).toThrow();

    // Only low-power pitch (nimblism is not p6+).
    const low = FabTestEngine.start(
      {
        hero: bravo,
        chest: [overbearingPresence],
        pitch: [nimblismBlue],
        actionPoints: 1,
        resourcePoints: 3,
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => low.as(bravo).activate(overbearingPresence)).toThrow();

    // Insufficient RP with legal pitch gate.
    const poor = FabTestEngine.start(
      {
        hero: bravo,
        chest: [overbearingPresence],
        pitch: [brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 2,
        hand: [],
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => poor.as(bravo).activate(overbearingPresence)).toThrow();

    const bb = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        chest: [overbearingPresence],
        hand: [],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    bb.as(dash).attackWith(snatchRed);
    bb.as(bravo).defendWith(overbearingPresence);
    bb.helpers.resolveRestOfCombat();
    expect(bb.as(bravo).life()).toBe(LIFE - (SNATCH - DEF));
    expect(bb.as(bravo).zone("graveyard")).toContain(overbearingPresence.canonicalId);

    const a1 = overbearingPresence.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("action");
    expect(a1.cost).toMatchObject({
      class: "mixed",
      type: "all",
      costs: [
        { class: "asset", type: "resources", amount: 3 },
        { class: "effect", type: "destroy-self" },
      ],
    });
    expect(a1.condition).toMatchObject({
      type: "pitch-zone-has",
      filter: { power: { op: "gte", value: 6 } },
    });
    expect(a1.effect).toMatchObject({
      type: "create-token",
      token: "vigor",
      controller: "controller",
      count: 3,
    });
    expect(a1.layerKeywords?.some((k) => k.name === "go-again")).toBe(true);
    expect(overbearingPresence.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);
    expect(overbearingPresence.base.numeric.defense).toBe(1);
  });
});
