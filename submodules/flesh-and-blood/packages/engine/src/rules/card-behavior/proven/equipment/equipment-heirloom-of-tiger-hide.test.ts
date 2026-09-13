/**
 * MST049 Heirloom of Tiger Hide — Mystic Ninja Chest d3 Cloaked + Blade Break.
 *
 * Printed:
 *   Cloaked
 *   While this is equipped face-down, at the start of your turn, if you have
 *   exactly 1{h}, you may turn this face-up.
 *   Blade Break
 *
 * Reasoning (case-by-case; snake-hide / rabbit-hide family twin):
 * 1. Cloaked seats face-down on equip — same as MST005 snake-hide.
 * 2. Start-phase turn-player gated; condition equipped-face-down + life eq 1.
 * 3. Optional turn-face-up: accept → face-up still equipped; decline → face-down.
 * 4. Boundaries: life ≠ 1 no flip (full turn cycle still face-down).
 * 5. Differentiator vs snake-hide: Blade Break d3 (not battleworn). Face-up
 *    defend contributes 3 then destroys to GY at chain close.
 *
 * Status: ✅ cloaked life1 flip; decline; life≠1; BB d3; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { heirloomOfTigerHide } from "../../../../../../cards/src/cards/equipment/heirloom-of-tiger-hide.ts";

const SNATCH = 4;
const LIFE = 20;

function drain(
  game: ReturnType<typeof FabTestEngine.start>,
  opts?: { acceptBoolean?: boolean },
): void {
  const accept = opts?.acceptBoolean ?? true;
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: accept },
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
    if (decision) {
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

function endTurnDrain(
  game: ReturnType<typeof FabTestEngine.start>,
  hero: typeof bravo,
  acceptBoolean = true,
): void {
  game.as(hero).endTurn();
  drain(game, { acceptBoolean });
}

describe("heirloom-of-tiger-hide (MST049)", () => {
  it("core mechanic: cloaked + life 1 → start of your turn may turn face-up", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [heirloomOfTigerHide],
        life: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const plateId = game.getState().containers.zonesByPlayerId[Bravo.id]!.chest[0]!;

    expect(game.objectState(plateId)?.faceDown).toBe(true);

    // Full turn cycle: Bravo ends → Dash turn → Dash ends → Bravo start-phase.
    endTurnDrain(game, bravo, true);
    expect(game.objectState(plateId)?.faceDown).toBe(true);
    endTurnDrain(game, dash, true);

    // Accepted optional turn-face-up.
    expect(game.objectState(plateId)?.faceDown).not.toBe(true);
    expect(Bravo.zone("chest")).toContain(heirloomOfTigerHide.canonicalId);
  });

  it("boundaries: decline keeps face-down; life ≠ 1 no flip; model", () => {
    const decline = FabTestEngine.start(
      {
        hero: bravo,
        chest: [heirloomOfTigerHide],
        life: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const plateId = decline.getState().containers.zonesByPlayerId[decline.as(bravo).id]!.chest[0]!;
    endTurnDrain(decline, bravo, false);
    endTurnDrain(decline, dash, false);
    expect(decline.objectState(plateId)?.faceDown).toBe(true);

    const healthy = FabTestEngine.start(
      {
        hero: bravo,
        chest: [heirloomOfTigerHide],
        life: 20,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    const hId = healthy.getState().containers.zonesByPlayerId[healthy.as(bravo).id]!.chest[0]!;
    endTurnDrain(healthy, bravo, true);
    endTurnDrain(healthy, dash, true);
    expect(healthy.objectState(hId)?.faceDown).toBe(true);

    const a1 = heirloomOfTigerHide.base.abilities?.[0];
    expect(a1?.kind).toBe("static");
    if (a1?.kind !== "static" || a1.staticKind !== "triggered") return;
    expect(a1.trigger).toMatchObject({
      kind: "event-and-state",
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
    expect(a1.trigger.kind === "event-and-state" ? a1.trigger.state : undefined).toMatchObject({
      type: "and",
      conditions: [
        { type: "has-status", status: "equipped-face-down" },
        { type: "life-comparison", player: "self", vs: "fixed", op: "eq", value: 1 },
      ],
    });
    expect(a1.resolution.kind === "effect" ? a1.resolution.effect : undefined).toMatchObject({
      type: "optional",
      effect: { type: "turn-face-up", target: { selector: "self" } },
    });
    expect(heirloomOfTigerHide.base.keywords?.some((k) => k.name === "cloaked")).toBe(true);
    expect(heirloomOfTigerHide.base.keywords?.some((k) => k.name === "blade-break")).toBe(true);
    expect(heirloomOfTigerHide.base.keywords?.some((k) => k.name === "battleworn")).toBe(false);
    expect(heirloomOfTigerHide.base.numeric.defense).toBe(3);
  });

  it("core mechanic: face-up Blade Break d3 — defend then destroy to GY", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        chest: [{ card: heirloomOfTigerHide, state: { faceDown: false } }],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Defender = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    expect(game.combat()?.step).toBe("defend");
    Defender.defendWith(heirloomOfTigerHide);
    game.helpers.resolveRestOfCombat();

    // snatch 4 − d3 = 1 damage; blade-break destroys.
    expect(Defender.life()).toBe(LIFE - (SNATCH - 3));
    expect(Defender.zone("chest")).not.toContain(heirloomOfTigerHide.canonicalId);
    expect(Defender.zone("graveyard")).toContain(heirloomOfTigerHide.canonicalId);
  });
});
