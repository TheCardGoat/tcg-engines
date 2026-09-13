/**
 * AAC006 Rage Baiters — Assassin Arms d1 Blade Break.
 *
 * Printed:
 *   Attack Reaction - {r}, {t}: Target attack with stealth gets
 *   "When this hits a hero, mark them."
 *   Blade Break
 *
 * Reasoning (hand-authored; prey-spotters AR window + nightcowl stealth):
 * 1. AR only legal during combat reaction step (not out of combat).
 * 2. Mixed cost 1{r} + tap-self; target stealth attack on chain.
 * 3. Grant on-hit mark fires when stealth attack hits sole opponent.
 * 4. Non-stealth attack is not a legal target (Snatch alone).
 * 5. Blade Break d1 defend destroys.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { rageBaiters } from "../../../../../../cards/src/cards/equipment/rage-baiters.ts";
import { infectRed } from "../../../../../../cards/src/cards/actions/infect.ts";

const LIFE = 40;
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
      // Prefer the stealth attack (infect) over other candidates.
      const infect = decision.candidates.find(
        (c) => game.getState().objects[c.instanceId]?.canonicalId === infectRed.canonicalId,
      );
      const pick = infect ?? decision.candidates[0];
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

describe("rage-baiters (AAC006)", () => {
  it("core mechanic: AR {r}{t} on stealth attack → hit marks opponent", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [rageBaiters],
        hand: [infectRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    expect(game.getState().players[Opponent.id]!.marked).toBe(false);

    Bravo.attackWith(infectRed);
    expect(game.combat()?.step).toBe("defend");
    Opponent.defendWith([]);
    Bravo.pass();
    Opponent.pass();
    expect(game.combat()?.step).toBe("reaction");

    Bravo.activate(rageBaiters);
    drain(game);

    // Arms tapped, 1{r} spent; equipment remains (not destroy cost).
    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.zone("arms")).toContain(rageBaiters.canonicalId);

    // Resolve reaction → hit → mark (ordering for simultaneous hit triggers).
    for (let safety = 0; safety < 64; safety += 1) {
      drain(game);
      if (!game.combat() && game.getState().rulesStack.length === 0) break;
      if (game.declareNoDefenseIfPending()) continue;
      const prio = game.getPriorityPlayerId();
      if (prio) game.exec({ move: "pass", actorId: prio, payload: {} });
      else break;
    }

    expect(game.getState().players[Opponent.id]!.marked).toBe(true);
  });

  it("boundaries: illegal out of reaction; non-stealth not targetable; BB d1; model", () => {
    // Out of combat illegal.
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        arms: [rageBaiters],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => bare.as(bravo).activate(rageBaiters)).toThrow();
    expect(bare.as(bravo).zone("arms")).toContain(rageBaiters.canonicalId);

    // Non-stealth Snatch: AR can activate but has no legal stealth target.
    const noStealth = FabTestEngine.start(
      {
        hero: bravo,
        arms: [rageBaiters],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, deck: 6 },
      { autoPassPriority: false },
    );
    noStealth.as(bravo).attackWith(snatchRed);
    noStealth.as(dash).defendWith([]);
    noStealth.as(bravo).pass();
    noStealth.as(dash).pass();
    expect(noStealth.combat()?.step).toBe("reaction");
    // Either activate rejects or fails closed for lack of stealth candidates.
    const rejected = noStealth.as(bravo).expectFailure({
      move: "activate",
      payload: { instanceId: noStealth.as(bravo).card(rageBaiters) },
    });
    expect(rejected.accepted).toBe(false);
    expect(noStealth.as(bravo).zone("arms")).toContain(rageBaiters.canonicalId);
    expect(noStealth.getState().players[noStealth.as(dash).id]!.marked).toBe(false);

    // Blade Break d1: defend destroys.
    const bb = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: 20,
        arms: [rageBaiters],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    bb.as(dash).attackWith(snatchRed);
    bb.as(bravo).defendWith(rageBaiters);
    drain(bb);
    bb.helpers.resolveRestOfCombat();
    drain(bb);
    expect(bb.as(bravo).zone("arms")).not.toContain(rageBaiters.canonicalId);
    expect(bb.as(bravo).zone("graveyard")).toContain(rageBaiters.canonicalId);
    expect(bb.as(bravo).life()).toBe(20 - (SNATCH - 1));

    const a1 = rageBaiters.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("attack-reaction");
      expect(a1.cost).toMatchObject({
        class: "mixed",
        type: "all",
      });
      expect(a1.effect).toMatchObject({
        type: "grant-property",
        property: {
          kind: "ability",
          ability: {
            kind: "static",
            staticKind: "triggered",
            resolution: { kind: "effect", effect: { type: "mark" } },
          },
        },
        target: {
          selector: "object",
          zones: ["combat-chain"],
          filter: { hasKeyword: "stealth" },
        },
        duration: "this-turn",
      });
    }
    expect(rageBaiters.base.numeric.defense).toBe(1);
    expect(rageBaiters.base.keywords).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "blade-break" })]),
    );
  });
});
