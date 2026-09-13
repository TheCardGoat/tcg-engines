/**
 * SEA080 Dead Threads — Necromancer Chest d1 Blade Break.
 *
 * Printed:
 *   Instant - {t}: Gain {r}. Activate this only if an ally has been put into
 *   your graveyard this turn.
 *   Blade Break
 *
 * Reasoning (case-by-case):
 * 1. Instant tap-self → gain 1{r} when activation condition holds.
 * 2. Condition is event window (zone-count graveyard per:turn Ally LKI), not
 *    current GY occupancy — pre-seeded Ally in GY must not unlock activate.
 * 3. MODEL: types:["Ally"] never matches type-boxes — Ally is FAB_SUBTYPES;
 *    remodel subtypes:["Ally"] (mournful-casket sibling).
 * 4. Non-token Ally (Limpit) destroyed to GY this turn → condition true.
 * 5. Already tapped / no ally-GY this turn → illegal. BB d1 on defend.
 *
 * Status: ✅ Instant tap + ally-GY gate → +1{r}; pre-seeded/no gate illegal; BB.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { deadThreads } from "../../../../../../cards/src/cards/equipment/dead-threads.ts";
import { limpitHopALongYellow } from "../../../../../../cards/src/cards/actions/limpit-hop-a-long.ts";

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

describe("dead-threads (SEA080)", () => {
  it("core mechanic: ally to GY this turn → Instant {t} gains 1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: bravo,
        life: LIFE,
        chest: [deadThreads],
        arena: [limpitHopALongYellow],
        resourcePoints: 0,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Defender = game.as(bravo);

    // Gate closed before any ally dies.
    expect(() => Defender.activate(deadThreads)).toThrow();

    // Destroy non-token Ally → GY this turn (token allies cease, no GY).
    const allyId = Defender.findCardInZone("arena", limpitHopALongYellow);
    game.as(dash).play(snatchRed, { target: allyId });
    game.helpers.resolveRestOfCombat();
    drain(game);

    expect(Defender.zone("graveyard")).toContain(limpitHopALongYellow.canonicalId);
    expect(Defender.resourcePoints()).toBe(0);

    // Instant activate on defender priority after combat.
    if (game.getState().priority?.holderPlayerId !== Defender.id) {
      game.declareNoDefenseIfPending();
      const prio = game.getPriorityPlayerId();
      if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
    }
    const result = Defender.activate(deadThreads);
    expect(result.accepted).toBe(true);
    drain(game);

    expect(Defender.resourcePoints()).toBe(1);
    expect(Defender.zone("chest")).toContain(deadThreads.canonicalId);
    const chestId = Defender.findCardInZone("chest", deadThreads);
    expect(game.getState().objects[chestId]?.markers.some((m) => m.kind === "tapped")).toBe(true);

    // Second activate while tapped is illegal.
    expect(() => Defender.activate(deadThreads)).toThrow();
  });

  it("boundaries: pre-seeded GY Ally no gate; BB d1; model subtypes Ally per:turn", () => {
    const preSeeded = FabTestEngine.start(
      {
        hero: bravo,
        chest: [deadThreads],
        graveyard: [limpitHopALongYellow],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(preSeeded.as(bravo).zone("graveyard")).toContain(limpitHopALongYellow.canonicalId);
    expect(() => preSeeded.as(bravo).activate(deadThreads)).toThrow();

    const bb = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        chest: [deadThreads],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    bb.as(dash).attackWith(snatchRed);
    bb.as(bravo).defendWith(deadThreads);
    bb.helpers.resolveRestOfCombat();
    // Blade Break d1: snatch 4 − 1 = 3; equipment destroyed.
    expect(bb.as(bravo).life()).toBe(LIFE - (SNATCH - DEF));
    expect(bb.as(bravo).zone("graveyard")).toContain(deadThreads.canonicalId);
    expect(bb.as(bravo).zone("chest")).not.toContain(deadThreads.canonicalId);

    const a1 = deadThreads.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind !== "activated") return;
    expect(a1.abilityType).toBe("instant");
    expect(a1.cost).toMatchObject({ class: "effect", type: "tap-self" });
    expect(a1.condition).toMatchObject({
      type: "zone-count",
      zone: "graveyard",
      player: "controller",
      filter: { typeBox: { subtypes: ["Ally"] } },
      comparison: { op: "gte", value: 1 },
      per: "turn",
    });
    expect(a1.effect).toMatchObject({ type: "gain-resources", amount: 1 });
    expect(deadThreads.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);
    expect(deadThreads.base.numeric.defense).toBe(1);
  });
});
