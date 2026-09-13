/**
 * MST006 Arousing Wave — Mystic Assassin Arms d1 Battleworn.
 *
 * Printed:
 *   Attack Reaction - {r}, destroy this: Create a Fang Strike in your hand.
 *   Battleworn
 *
 * Reasoning (hand-authored; case-by-case — no batch script):
 * 1. AR only legal in combat reaction step (not open action phase).
 * 2. Mixed cost 1{r} + destroy-self; not an Action (no AP spend).
 * 3. create-token fang-strike → hand uses the create-token leaf with
 *    to.zone hand. Fang Strike is a non-Token Attack Reaction (MST023), so
 *    the harness must register it under token:fang-strike (same pattern as
 *    crouching-tiger) or the shell is a bare Token without AR text.
 * 4. Happy: open Snatch → reaction step → activate with 1{r} → arms to GY,
 *    hand gains token:fang-strike, Snatch still deals base 4 (equipment does
 *    not buff the attack itself).
 * 5. Integration: play the created Fang Strike same window → target AAC
 *    +1{p} → Snatch 5. Proves registry carries MST023 resolution ability.
 * 6. Boundaries: out of AR illegal; 0{r} insufficient (arms stay seated).
 * 7. Battleworn d1: defend contributes 1, −1 counter, remains seated.
 *
 * Status: ✅ AR create Fang Strike hand; play +1{p}; 0{r}/out-of-AR; BW d1.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { arousingWave } from "../../../../../../cards/src/cards/equipment/arousing-wave.ts";
import { fangStrike } from "../../../../../../cards/src/cards/attack-reactions/fang-strike.ts";

const LIFE = 40;
const SNATCH = 4;
const DEF = 1;
const FANG_TOKEN = "token:fang-strike";

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
        (c) => game.getState().objects[c.instanceId]?.canonicalId === snatchRed.canonicalId,
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

function toReaction(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 24; safety += 1) {
    if (game.combat()?.step === "reaction") return;
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
    if (game.declareNoDefenseIfPending()) continue;
    const prio = game.getPriorityPlayerId();
    if (!prio) return;
    game.exec({ move: "pass", actorId: prio, payload: {} });
  }
}

describe("arousing-wave (MST006)", () => {
  it("core mechanic: AR {r}+destroy → create Fang Strike in hand", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [arousingWave],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    expect(Bravo.zone("arms")).toContain(arousingWave.canonicalId);

    Bravo.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Opponent.defendWith([]);
    Bravo.pass();
    Opponent.pass();
    expect(game.combat()?.step).toBe("reaction");
    // Snatch is on the chain — hand empty before the AR.
    expect(Bravo.zone("hand")).toEqual([]);

    Bravo.activate(arousingWave);
    // Resolve only the activated layer; stay in the reaction step.
    for (let safety = 0; safety < 24; safety += 1) {
      if (game.getState().decision) break;
      if (game.getState().rulesStack.length === 0) break;
      if (game.declareNoDefenseIfPending()) continue;
      const prio = game.getPriorityPlayerId();
      if (!prio) break;
      game.exec({ move: "pass", actorId: prio, payload: {} });
    }

    // Destroy-self cost; 1{r} spent; Fang Strike token shell in hand.
    expect(Bravo.zone("arms")).not.toContain(arousingWave.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(arousingWave.canonicalId);
    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.zone("hand")).toEqual([FANG_TOKEN]);
    expect(game.combat()?.step).toBe("reaction");

    finishCombat(game);
    // Equipment itself does not buff Snatch — base 4 unblocked.
    expect(Opponent.life()).toBe(LIFE - SNATCH);
  });

  it("core mechanic: created Fang Strike AR → target AAC +1{p}", () => {
    // Proves token-registry carries MST023 resolution (not a bare Token shell).
    // Catalog canonicalId ≠ token:fang-strike — play by instance id.
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [arousingWave],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Opponent = game.as(dash);

    Bravo.attackWith(snatchRed);
    toReaction(game);
    expect(game.combat()?.step).toBe("reaction");

    Bravo.activate(arousingWave);
    for (let safety = 0; safety < 24; safety += 1) {
      if (game.getState().decision) break;
      if (game.getState().rulesStack.length === 0) break;
      if (game.declareNoDefenseIfPending()) continue;
      const prio = game.getPriorityPlayerId();
      if (!prio) break;
      game.exec({ move: "pass", actorId: prio, payload: {} });
    }
    expect(Bravo.zone("hand")).toEqual([FANG_TOKEN]);
    expect(game.combat()?.step).toBe("reaction");

    const fangInstanceId = game.getState().containers.zonesByPlayerId[Bravo.id]!.hand[0]!;
    game.exec({
      move: "begin-play",
      actorId: Bravo.id,
      payload: { instanceId: fangInstanceId },
    });
    finishCombat(game);

    // Snatch base 4 + Fang Strike +1{p} = 5.
    expect(Opponent.life()).toBe(LIFE - (SNATCH + 1));
    // Ephemeral Fang Strike should not linger in hand after resolve.
    expect(Bravo.zone("hand")).not.toContain(FANG_TOKEN);
  });

  it("boundaries: out of AR illegal; 0{r} insufficient; model; BW d1", () => {
    // Out of combat: AR illegal.
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        arms: [arousingWave],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => bare.as(bravo).activate(arousingWave)).toThrow();
    expect(bare.as(bravo).zone("arms")).toContain(arousingWave.canonicalId);

    // 0{r} insufficient for 1{r} cost.
    const short = FabTestEngine.start(
      {
        hero: bravo,
        arms: [arousingWave],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    short.as(bravo).attackWith(snatchRed);
    short.as(dash).defendWith([]);
    short.as(bravo).pass();
    short.as(dash).pass();
    expect(short.combat()?.step).toBe("reaction");
    const reject = short.as(bravo).expectFailure({
      move: "activate",
      payload: { instanceId: short.as(bravo).card(arousingWave) },
    });
    expect(reject.accepted).toBe(false);
    expect(short.as(bravo).zone("arms")).toContain(arousingWave.canonicalId);
    expect(short.as(bravo).zone("hand")).not.toContain(FANG_TOKEN);

    // Battleworn d1: defend contributes 1, remains seated (not blade-break).
    const bw = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        arms: [arousingWave],
        deck: 6,
      },
      { autoPassPriority: false },
    );
    bw.as(dash).attackWith(snatchRed);
    expect(bw.combat()?.step).toBe("defend");
    bw.as(bravo).defendWith(arousingWave);
    finishCombat(bw);
    expect(bw.as(bravo).life()).toBe(LIFE - (SNATCH - DEF));
    expect(bw.as(bravo).zone("arms")).toContain(arousingWave.canonicalId);
    expect(bw.as(bravo).zone("graveyard")).not.toContain(arousingWave.canonicalId);

    // Model matches printed AR create-to-hand + battleworn.
    const a1 = arousingWave.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("attack-reaction");
      expect(a1.cost).toMatchObject({
        class: "mixed",
        type: "all",
        costs: [
          { class: "asset", type: "resources", amount: 1 },
          { class: "effect", type: "destroy-self" },
        ],
      });
      expect(a1.effect).toMatchObject({
        type: "create-token",
        token: "fang-strike",
        controller: "controller",
        to: { zone: "hand" },
      });
    }
    expect(arousingWave.base.numeric.defense).toBe(1);
    expect(arousingWave.base.keywords?.some((k) => k.name === "battleworn")).toBe(true);

    // Fang Strike shell must carry the resolution ability (registry proof).
    const fangA1 = fangStrike.base.abilities?.[0];
    expect(fangA1?.kind).toBe("resolution");
    if (fangA1?.kind === "resolution") {
      expect(fangA1.effect).toMatchObject({
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: {
            typeBox: {
              types: ["Action"],
              subtypes: ["Attack"],
            },
          },
        },
      });
    }
  });
});
