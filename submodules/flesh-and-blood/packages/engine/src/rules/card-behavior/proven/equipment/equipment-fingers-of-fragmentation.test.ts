/**
 * OMN039 Fingers of Fragmentation — Illusionist Arms d0.
 *
 * Printed:
 *   Instant - {r}{r}, destroy this: Target attack action card that has
 *   fragmented gets +2{p}.
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. Instant mixed 2{r} + destroy-self (no AP).
 * 2. Target must be combat-chain Action Attack with hasStatus fragmented
 *    (stamped by fragment keyword when blocked for ≥2{d}).
 * 3. Happy: Fraying Lifeforce (p7, fragment) blocked by Nimblism d2 →
 *    fragments to p5; Instant +2 → p7; resolve → 7 damage (block already
 *    applied as fragment reduction).
 * 4. Boundary: unfragmented Snatch on chain → no legal target / activate
 *    fails; empty combat Instant illegal; 1{r} insufficient.
 * 5. Model: Instant + hasStatus fragmented filter + no BB/BW (d0).
 *
 * Status: ✅ Instant +2 fragmented AAC; unfragmented illegal; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed, nimblismBlue, frayingLifeforceRed } from "../../../fixtures.ts";
import { fingersOfFragmentation } from "../../../../../../cards/src/cards/equipment/fingers-of-fragmentation.ts";

const LIFE = 40;
const FRAYING = 7;
const BLOCK = 2;
const BUFF = 2;

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
      const attack = decision.candidates.find(
        (c) =>
          game.getState().objects[c.instanceId]?.canonicalId === frayingLifeforceRed.canonicalId,
      );
      const pick = attack ?? decision.candidates[0];
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

function finishCombat(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 80; safety += 1) {
    drain(game);
    if (!game.combat() && game.getState().rulesStack.length === 0 && !game.getState().decision) {
      return;
    }
    const prio = game.getState().priority?.holderPlayerId;
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

describe("fingers-of-fragmentation (OMN039)", () => {
  it("core mechanic: Instant 2{r}+destroy → fragmented AAC +2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [fingersOfFragmentation],
        hand: [frayingLifeforceRed, nimblismBlue],
        actionPoints: 1,
        // Opening resources plus this pitch pay Fraying and leave 2{r} for
        // the Instant without mutating the live player state.
        resourcePoints: 4,
        life: LIFE,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        hand: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Attacker = game.as(bravo);
    const Defender = game.as(dash);

    Attacker.play(frayingLifeforceRed, {
      target: Defender.id,
      pitch: [nimblismBlue],
    });
    // Walk announce → defend (same path as fragment trigger AAA).
    game.passBoth();
    game.passBoth();
    expect(game.combat()?.step).toBe("defend");
    Defender.blockWith(nimblismBlue);
    // Fragment: p7 − d2 = 5 (power reduced by block defense).
    expect(game.combat()?.activeLink?.attackPower).toBe(FRAYING - BLOCK);
    // Resolve fragment triggered layer only (gain 1 life) — stay in combat.
    game.passBoth();
    expect(game.combat()?.open).toBe(true);
    expect(Attacker.life()).toBe(LIFE + 1);

    expect(Attacker.resourcePoints()).toBe(2);

    // Instant while combat open: +2 to the fragmented AAC.
    Attacker.activate(fingersOfFragmentation);
    for (let safety = 0; safety < 24; safety += 1) {
      const decision = game.getState().decision;
      if (decision?.kind === "entity-target") {
        const attack = decision.candidates.find(
          (c) =>
            game.getState().objects[c.instanceId]?.canonicalId === frayingLifeforceRed.canonicalId,
        );
        const pick = attack ?? decision.candidates[0];
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
      if (game.getState().rulesStack.length === 0) break;
      const prio = game.getState().priority?.holderPlayerId;
      if (!prio) break;
      game.exec({ move: "pass", actorId: prio, payload: {} });
    }

    expect(Attacker.zone("arms")).not.toContain(fingersOfFragmentation.canonicalId);
    expect(Attacker.zone("graveyard")).toContain(fingersOfFragmentation.canonicalId);
    expect(Attacker.resourcePoints()).toBe(0);

    // Mid-resolve proof: Instant applied +2 on top of fragment p5.
    expect(game.combat()?.activeLink?.attackPower).toBe(FRAYING - BLOCK + BUFF);

    finishCombat(game);
    // Damage = current power − remaining block defense:
    // (fragment p5 + Instant +2) − d2 = 5. (Fragment reduces power by block;
    // the defending card still contributes defense against the reduced total.)
    expect(Defender.life()).toBe(LIFE - (FRAYING - BLOCK + BUFF - BLOCK));
  });

  it("boundaries: unfragmented AAC illegal; out of combat; 1{r}; model", () => {
    // Unfragmented Snatch on chain — no legal fragmented target.
    const noFrag = FabTestEngine.start(
      {
        hero: bravo,
        arms: [fingersOfFragmentation],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    noFrag.as(bravo).attackWith(snatchRed);
    expect(noFrag.combat()?.step).toBe("defend");
    // Instant during defend window with unfragmented attack.
    const reject = noFrag.as(bravo).expectFailure({
      move: "activate",
      payload: { instanceId: noFrag.as(bravo).card(fingersOfFragmentation) },
    });
    expect(reject.accepted).toBe(false);
    expect(noFrag.as(bravo).zone("arms")).toContain(fingersOfFragmentation.canonicalId);

    // Out of combat: Instant needs a fragmented AAC on chain.
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        arms: [fingersOfFragmentation],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => bare.as(bravo).activate(fingersOfFragmentation)).toThrow();

    // 1{r} insufficient for 2{r}.
    const short = FabTestEngine.start(
      {
        hero: bravo,
        arms: [fingersOfFragmentation],
        hand: [frayingLifeforceRed, nimblismBlue],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: LIFE,
        hand: [nimblismBlue],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    short.as(bravo).play(frayingLifeforceRed, {
      target: short.as(dash).id,
      pitch: [nimblismBlue],
    });
    for (let i = 0; i < 8 && short.combat()?.step !== "defend"; i += 1) {
      try {
        short.passBoth();
      } catch {
        break;
      }
    }
    short.as(dash).blockWith(nimblismBlue);
    drain(short);
    expect(() => short.as(bravo).activate(fingersOfFragmentation)).toThrow();
    expect(short.as(bravo).zone("arms")).toContain(fingersOfFragmentation.canonicalId);

    const a1 = fingersOfFragmentation.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("instant");
      expect(a1.cost).toMatchObject({
        class: "mixed",
        type: "all",
        costs: [
          { class: "asset", type: "resources", amount: 2 },
          { class: "effect", type: "destroy-self" },
        ],
      });
      expect(a1.effect).toMatchObject({
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 2,
        target: {
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              types: ["Action"],
              subtypes: ["Attack"],
            },
            hasStatus: "fragmented",
          },
        },
        duration: "this-turn",
      });
    }
    expect(fingersOfFragmentation.base.numeric.defense).toBe(0);
  });
});
