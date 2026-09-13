/**
 * PEN003 Predatory Plating — Brute Chest d2 Guardwell.
 *
 * Printed:
 *   Instant - Destroy this: Gain {r}. Activate this only if you control a card
 *   with 6 or more {p}.
 *   Guardwell
 *
 * Reasoning (case-by-case):
 * 1. Gate is control-object power ≥ 6 — prior model used supertypes residue
 *    "Card with 6 or more {p}" which never matches.
 * 2. Instant destroy-self with a controlled p6+ card (Brutal Assault on chain
 *    or in zones with power) → +1{r}.
 * 3. Without a p6 object, activate illegal.
 * 4. Guardwell: defend d2 places −2 defense counters, stays equipped.
 *
 * Status: ✅ p6 gate destroy→{r}; bare illegal; guardwell −2; model remodel.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { predatoryPlating } from "../../../../../../cards/src/cards/equipment/predatory-plating.ts";
import { brutalAssaultRed } from "../../../../../../cards/src/cards/actions/brutal-assault.ts";

const LIFE = 40;
const SNATCH = 4;

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

describe("predatory-plating (PEN003)", () => {
  it("core mechanic: control p6+ card → Instant destroy → gain {r}", () => {
    // Brutal Assault p6 on the combat chain is controlled while attacking.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [predatoryPlating],
        hand: [brutalAssaultRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    Bravo.attackWith(brutalAssaultRed);
    expect(game.combat()?.step).toBe("defend");
    // Pass defend so attacker has reaction priority with p6 attack still controlled.
    Opponent.defendWith([]);
    expect(game.getState().priority?.holderPlayerId).toBe(Bravo.id);

    expect(Bravo.resourcePoints()).toBe(0);
    Bravo.activate(predatoryPlating);
    drain(game);

    expect(Bravo.zone("graveyard")).toContain(predatoryPlating.canonicalId);
    expect(Bravo.zone("chest")).not.toContain(predatoryPlating.canonicalId);
    expect(Bravo.resourcePoints()).toBe(1);

    drain(game);
    game.helpers.resolveRestOfCombat();
  });

  it("boundaries: no p6 object illegal; guardwell d2→−2 counters; model", () => {
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        chest: [predatoryPlating],
        hand: [snatchRed], // p4 — not enough
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    // Snatch alone does not open the gate (p4).
    bare.as(bravo).attackWith(snatchRed);
    bare.as(dash).defendWith([]);
    expect(() => bare.as(bravo).activate(predatoryPlating)).toThrow();
    expect(bare.as(bravo).zone("chest")).toContain(predatoryPlating.canonicalId);
    bare.helpers.resolveRestOfCombat();

    // Empty board: illegal.
    const empty = FabTestEngine.start(
      {
        hero: bravo,
        chest: [predatoryPlating],
        hand: [],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => empty.as(bravo).activate(predatoryPlating)).toThrow();

    // Guardwell: defend d2 → −2 defense counters, stay equipped.
    const gw = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        chest: [predatoryPlating],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = gw.as(dash);
    const plateId = Defender.findCardInZone("chest", predatoryPlating);
    gw.as(bravo).attackWith(snatchRed);
    Defender.defendWith(predatoryPlating);
    gw.helpers.resolveRestOfCombat();
    expect(Defender.zone("chest")).toContain(predatoryPlating.canonicalId);
    expect(gw.objectState(plateId)?.defenseCounterTotal).toBe(-2);
    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));

    const a1 = predatoryPlating.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("instant");
      expect(a1.cost).toMatchObject({ class: "effect", type: "destroy-self" });
      expect(a1.condition).toMatchObject({
        type: "control-object",
        filter: { power: { op: "gte", value: 6 } },
      });
      expect(a1.effect).toMatchObject({ type: "gain-resources", amount: 1 });
    }
    expect(predatoryPlating.base.keywords?.some((k) => k.name === "guardwell")).toBe(true);
    expect(predatoryPlating.base.numeric.defense).toBe(2);
  });

  it("control boundary: a 6{p} card in hand does not unlock the Instant", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [predatoryPlating],
        hand: [brutalAssaultRed],
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    expect(() => Bravo.activate(predatoryPlating)).toThrow();
    expect(Bravo.zone("chest")).toContain(predatoryPlating.canonicalId);
    expect(Bravo.zone("hand")).toContain(brutalAssaultRed.canonicalId);
  });
});
