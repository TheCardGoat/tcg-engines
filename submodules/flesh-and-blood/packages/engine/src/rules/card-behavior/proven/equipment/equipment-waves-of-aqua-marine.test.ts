/**
 * MST069 Waves of Aqua Marine — Mystic Arms d1 Cloaked.
 *
 * Printed:
 *   Cloaked
 *   Attack Reaction - {r}, turn this face-up: Target attack gets +1{p}.
 *   At the start of your turn, destroy this.
 *
 * Reasoning (hand-authored; case-by-case — sibling of MST067 Aqua Seeing Shell):
 * 1. Cloaked seats face-down; AR only legal in combat reaction step.
 * 2. Mixed cost 1{r} + turn-face-up self (not destroy-self). Already face-up
 *    makes the turn-face-up cost illegal.
 * 3. Effect: on-stack combat-chain Attack +1{p} UEoT (Snatch 4 → 5).
 * 4. Start-phase destroy is turn-player gated (controller's start only —
 *    same path as aqua-seeing-shell). Opponent start does not destroy.
 * 5. Boundaries: out of AR; 0{r}; already face-up; model.
 *
 * Status: ✅ cloaked AR +1{p}; face-up; start destroy; out-of-AR/0{r}/face-up.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { wavesOfAquaMarine } from "../../../../../../cards/src/cards/equipment/waves-of-aqua-marine.ts";

const LIFE = 40;
const SNATCH = 4;

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

function endTurnDrain(game: ReturnType<typeof FabTestEngine.start>, hero: typeof bravo): void {
  game.as(hero).endTurn();
  for (let safety = 0; safety < 40; safety += 1) {
    const d = game.getState().decision;
    if (d) {
      if (d.kind === "boolean") {
        game.exec({
          move: "answer-decision",
          actorId: d.actorId,
          payload: {
            decisionId: d.decisionId,
            stateVersion: d.stateVersion,
            answer: { kind: "boolean", value: false },
          },
        });
        continue;
      }
      if (game.answerForcedDecision()) continue;
      break;
    }
    if (game.getState().rulesStack.length > 0 || game.getState().rulesProcess) {
      try {
        game.passBoth();
      } catch {
        break;
      }
      continue;
    }
    break;
  }
}

describe("waves-of-aqua-marine (MST069)", () => {
  it("core mechanic: cloaked AR {r}+face-up → attack +1{p}; your start destroys", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [wavesOfAquaMarine],
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
    const armsId = game.getState().containers.zonesByPlayerId[Bravo.id]!.arms[0]!;

    // Cloaked seats face-down.
    expect(game.objectState(armsId)?.faceDown).toBe(true);

    Bravo.attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Opponent.defendWith([]);
    Bravo.pass();
    Opponent.pass();
    expect(game.combat()?.step).toBe("reaction");

    Bravo.activate(wavesOfAquaMarine);
    finishCombat(game);

    // Turn face-up as cost; 1{r} spent; still equipped (not destroy-self).
    expect(game.objectState(armsId)?.faceDown).not.toBe(true);
    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.zone("arms")).toContain(wavesOfAquaMarine.canonicalId);

    // Snatch base 4 + AR +1{p} = 5 unblocked.
    expect(Opponent.life()).toBe(LIFE - (SNATCH + 1));

    // Bravo ends → Dash start (no destroy) → Dash ends → Bravo start destroys.
    endTurnDrain(game, bravo);
    expect(Bravo.zone("arms")).toContain(wavesOfAquaMarine.canonicalId);
    endTurnDrain(game, dash);
    expect(Bravo.zone("graveyard")).toContain(wavesOfAquaMarine.canonicalId);
    expect(Bravo.zone("arms")).not.toContain(wavesOfAquaMarine.canonicalId);
  });

  it("boundaries: out of AR; face-up; 0{r}; model", () => {
    // Out of combat: AR illegal; stays face-down.
    const bare = FabTestEngine.start(
      {
        hero: bravo,
        arms: [wavesOfAquaMarine],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const bareId = bare.getState().containers.zonesByPlayerId[bare.as(bravo).id]!.arms[0]!;
    expect(bare.objectState(bareId)?.faceDown).toBe(true);
    expect(() => bare.as(bravo).activate(wavesOfAquaMarine)).toThrow();
    expect(bare.objectState(bareId)?.faceDown).toBe(true);

    // Already face-up → turn-face-up cost illegal.
    const faceUp = FabTestEngine.start(
      {
        hero: bravo,
        arms: [{ card: wavesOfAquaMarine, state: { faceDown: false } }],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    faceUp.as(bravo).attackWith(snatchRed);
    faceUp.as(dash).defendWith([]);
    faceUp.as(bravo).pass();
    faceUp.as(dash).pass();
    expect(faceUp.combat()?.step).toBe("reaction");
    expect(() => faceUp.as(bravo).activate(wavesOfAquaMarine)).toThrow();
    expect(faceUp.as(bravo).zone("arms")).toContain(wavesOfAquaMarine.canonicalId);

    // 0{r} insufficient.
    const short = FabTestEngine.start(
      {
        hero: bravo,
        arms: [wavesOfAquaMarine],
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
      payload: { instanceId: short.as(bravo).card(wavesOfAquaMarine) },
    });
    expect(reject.accepted).toBe(false);
    const shortId = short.getState().containers.zonesByPlayerId[short.as(bravo).id]!.arms[0]!;
    expect(short.objectState(shortId)?.faceDown).toBe(true);

    // Without AR buff: plain Snatch deals 4; arms stay face-down cloaked.
    const plain = FabTestEngine.start(
      {
        hero: bravo,
        arms: [wavesOfAquaMarine],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: LIFE, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    plain.as(bravo).attackWith(snatchRed);
    finishCombat(plain);
    expect(plain.as(dash).life()).toBe(LIFE - SNATCH);
    const plainId = plain.getState().containers.zonesByPlayerId[plain.as(bravo).id]!.arms[0]!;
    expect(plain.objectState(plainId)?.faceDown).toBe(true);

    const a1 = wavesOfAquaMarine.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("attack-reaction");
      expect(a1.cost).toMatchObject({
        class: "mixed",
        type: "all",
        costs: [
          { class: "asset", type: "resources", amount: 1 },
          { class: "effect", type: "turn-face-up", target: { selector: "self" } },
        ],
      });
      expect(a1.effect).toMatchObject({
        type: "modify-numeric",
        property: "power",
        op: "add",
        amount: 1,
        target: {
          declared: "on-stack",
          zones: ["combat-chain"],
          filter: { typeBox: { subtypes: ["Attack"] } },
        },
        duration: "this-turn",
      });
    }
    const a2 = wavesOfAquaMarine.base.abilities?.[1];
    expect(a2?.kind).toBe("static");
    if (a2?.kind === "static" && a2.trigger) {
      expect(a2.trigger).toMatchObject({
        kind: "event",
        event: {
          name: "start-phase",
          actor: {
            kind: "player",
            player: "ability-controller",
          },
          observes: {
            kind: "none",
          },
        },
      });
      expect(a2.resolution?.effect).toMatchObject({
        type: "destroy",
        target: { selector: "self" },
      });
    }
    expect(wavesOfAquaMarine.base.keywords?.some((k) => k.name === "cloaked")).toBe(true);
    expect(wavesOfAquaMarine.base.numeric.defense).toBe(1);
  });
});
