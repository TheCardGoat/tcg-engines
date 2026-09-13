/**
 * MST005 Heirloom of Snake Hide — Mystic Assassin Chest d2 Cloaked + Battleworn.
 *
 * Printed:
 *   Cloaked
 *   While this is equipped face-down, at the start of your turn, if you have
 *   exactly 1{h}, you may turn this face-up.
 *   Battleworn
 *
 * Reasoning (case-by-case; rabbit-hide family):
 * 1. Cloaked seats face-down on equip.
 * 2. Start-phase turn-player gated; condition equipped-face-down + life eq 1.
 * 3. Optional turn-face-up: accept → face-up still equipped; decline → stays face-down.
 * 4. Boundaries: life ≠ 1 no flip.
 * 5. Face-up battleworn: defend d2 then −1{d} stays at d1.
 *
 * Status: ✅ cloaked life1 flip; decline; life≠1; battleworn; model.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { heirloomOfSnakeHide } from "../../../../../../cards/src/cards/equipment/heirloom-of-snake-hide.ts";
import { buildFabRulesView } from "../../../state-rules-view.ts";

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

function chestDefense(
  game: ReturnType<typeof FabTestEngine.start>,
  playerId: string,
): number | undefined {
  const state = game.getState();
  const instanceId = state.containers.zonesByPlayerId[playerId]?.chest.find(
    (id) => state.objects[id]?.canonicalId === heirloomOfSnakeHide.canonicalId,
  );
  if (!instanceId) return undefined;
  const view = buildFabRulesView(state);
  return view.object({
    instanceId,
    incarnation: state.objects[instanceId]!.incarnation,
  })?.current.numeric.defense;
}

describe("heirloom-of-snake-hide (MST005)", () => {
  it("core mechanic: cloaked + life 1 → start of your turn may turn face-up", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [heirloomOfSnakeHide],
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
    expect(Bravo.zone("chest")).toContain(heirloomOfSnakeHide.canonicalId);
  });

  it("boundaries: decline keeps face-down; life ≠ 1 no flip; model", () => {
    const decline = FabTestEngine.start(
      {
        hero: bravo,
        chest: [heirloomOfSnakeHide],
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
        chest: [heirloomOfSnakeHide],
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

    const a1 = heirloomOfSnakeHide.base.abilities?.[0];
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
    expect(heirloomOfSnakeHide.base.keywords?.some((k) => k.name === "cloaked")).toBe(true);
    expect(heirloomOfSnakeHide.base.keywords?.some((k) => k.name === "battleworn")).toBe(true);
    expect(heirloomOfSnakeHide.base.numeric.defense).toBe(2);
  });

  it("proven: face-up battleworn d2 — defend contributes 2 then −1{d}", () => {
    // This boundary starts face-up so the equipment can defend immediately.
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: LIFE,
        chest: [{ card: heirloomOfSnakeHide, state: { faceDown: false } }],
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Defender = game.as(bravo);
    expect(chestDefense(game, Defender.id)).toBe(2);

    game.as(dash).attackWith(snatchRed);
    Defender.defendWith(heirloomOfSnakeHide);
    game.helpers.resolveRestOfCombat();

    expect(Defender.life()).toBe(LIFE - (SNATCH - 2));
    expect(Defender.zone("chest")).toContain(heirloomOfSnakeHide.canonicalId);
    expect(chestDefense(game, Defender.id)).toBe(1);
  });
});
