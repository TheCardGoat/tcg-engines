/**
 * AKO005 Hide Tanner — Brute Arms d1 Battleworn.
 *
 * Printed:
 *   When you discard a random card with 6 or more {p}, you may destroy this.
 *   If you do, create 2 Might tokens.
 *   Battleworn
 *
 * Reasoning (hand-authored; case-by-case):
 * 1. Trigger is discard by controller of a card with base/evaluated power ≥6.
 * 2. Printed "random" is load-bearing: pattern.random must be true so chosen
 *    discards of 6+{p} cards do not fire. Prior model omitted random:true.
 * 3. Optional destroy self; if taken, create 2 Might under controller.
 * 4. Driver: Wrecker Romp additional-cost random discard (random:true cost).
 *    Sole remaining hand card is Brutal Assault (p6) so the random pick is
 *    deterministically the p6 card without seed hunting.
 * 5. Boundary: random discard Snatch (p4) → no trigger, arms stay.
 * 6. Boundary: decline optional → arms stay, no Might.
 * 7. Battleworn d1: first defend → −1{d} counter, seat remains.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { hideTanner } from "../../../../../../cards/src/cards/equipment/hide-tanner.ts";
import { wreckerRompRed } from "../../../../../../cards/src/cards/actions/wrecker-romp.ts";
import { brutalAssaultRed } from "../../../../../../cards/src/cards/actions/brutal-assault.ts";

const LIFE = 20;
const SNATCH = 4;
const ARMS_D = 1;

function countMight(game: ReturnType<typeof FabTestEngine.start>, playerId: string): number {
  const state = game.getState();
  let n = 0;
  for (const zone of ["arena", "head", "chest", "arms", "legs"] as const) {
    for (const id of state.containers.zonesByPlayerId[playerId]?.[zone] ?? []) {
      const c = state.objects[id]?.canonicalId ?? id;
      if (/might/i.test(String(c))) n += 1;
    }
  }
  return n;
}

function drain(
  game: ReturnType<typeof FabTestEngine.start>,
  opts: { acceptOptional?: boolean } = {},
): void {
  const acceptOptional = opts.acceptOptional ?? true;
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: acceptOptional },
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
          answer: { kind: "entity-target", instanceIds: pick ? [pick.instanceId] : [] },
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

describe("hide-tanner (AKO005)", () => {
  it("core mechanic: random discard 6+{p} → optional destroy → 2 Might", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [hideTanner],
        // Additional-cost random discard; sole other card is Brutal Assault p6.
        hand: [wreckerRompRed, brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);

    expect(Bravo.zone("arms")).toContain(hideTanner.canonicalId);
    expect(countMight(game, Bravo.id)).toBe(0);

    Bravo.play(wreckerRompRed);
    drain(game, { acceptOptional: true });

    const discards = game.committedEvents().filter((e) => e.name === "discard");
    expect(discards).toHaveLength(1);
    expect(discards[0]!.name === "discard" && discards[0]!.data.random).toBe(true);
    expect(discards[0]!.name === "discard" && discards[0]!.data.object.canonicalId).toBe(
      brutalAssaultRed.canonicalId,
    );

    // Arms destroyed; 2 Might under controller.
    expect(Bravo.zone("arms")).not.toContain(hideTanner.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(hideTanner.canonicalId);
    expect(countMight(game, Bravo.id)).toBe(2);
  });

  it("boundaries: p4 random no fire; decline optional; Battleworn; model", () => {
    // Random discard Snatch p4 → no trigger.
    const low = FabTestEngine.start(
      {
        hero: bravo,
        arms: [hideTanner],
        hand: [wreckerRompRed, snatchRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    low.as(bravo).play(wreckerRompRed);
    drain(low, { acceptOptional: true });
    expect(low.as(bravo).zone("arms")).toContain(hideTanner.canonicalId);
    expect(countMight(low, low.as(bravo).id)).toBe(0);

    // Decline optional destroy → arms stay, no Might.
    const decline = FabTestEngine.start(
      {
        hero: bravo,
        arms: [hideTanner],
        hand: [wreckerRompRed, brutalAssaultRed],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    decline.as(bravo).play(wreckerRompRed);
    drain(decline, { acceptOptional: false });
    expect(decline.as(bravo).zone("arms")).toContain(hideTanner.canonicalId);
    expect(countMight(decline, decline.as(bravo).id)).toBe(0);
    // p6 still discarded as the romp cost.
    expect(decline.as(bravo).zone("graveyard")).toContain(brutalAssaultRed.canonicalId);

    // Battleworn d1: first defend → −1 counter, remains equipped.
    const bw = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        life: LIFE,
        arms: [hideTanner],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Defender = bw.as(dash);
    const armsId = bw
      .getState()
      .containers.zonesByPlayerId[Defender.id]!.arms.find(
        (id) => bw.getState().objects[id]?.canonicalId === hideTanner.canonicalId,
      )!;
    bw.as(bravo).attackWith(snatchRed);
    Defender.defend(hideTanner);
    drain(bw);
    bw.helpers.resolveRestOfCombat();
    expect(bw.objectState(armsId)?.defenseCounterTotal).toBe(-1);
    expect(Defender.zone("arms")).toContain(hideTanner.canonicalId);
    expect(Defender.life()).toBe(LIFE - (SNATCH - ARMS_D));

    // Model: discard random + power≥6 + optional destroy then 2 Might.
    const ability = hideTanner.base.abilities?.[0];
    expect(ability?.kind).toBe("static");
    if (ability?.kind === "static" && ability.staticKind === "triggered") {
      expect(ability.trigger).toMatchObject({
        kind: "event",
        event: {
          name: "discard",
          actor: { kind: "player", player: "ability-controller" },
          random: true,
          observes: { kind: "event-object" },
        },
      });
      expect(ability.resolution).toMatchObject({ kind: "effect", effect: { type: "optional" } });
      if (ability.resolution.kind === "effect" && ability.resolution.effect.type === "optional") {
        expect(ability.resolution.effect.then).toMatchObject({
          type: "create-token",
          token: "might",
          count: 2,
        });
      }
    }
    expect(hideTanner.base.keywords?.some((k) => k.name === "battleworn")).toBe(true);
  });
});
