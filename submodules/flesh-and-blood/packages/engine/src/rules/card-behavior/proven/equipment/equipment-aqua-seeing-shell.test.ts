/**
 * MST067 Aqua Seeing Shell — Mystic Head d1 Cloaked.
 *
 * Printed:
 *   Cloaked
 *   Instant - {r}{r}{r}, turn this face-up: Draw a card.
 *   At the start of your turn, destroy this.
 *
 * Reasoning (hand-authored):
 * 1. Cloaked seats face-down; Instant 3{r}+turn-face-up draws 1.
 * 2. Already face-up / insufficient RP → illegal Instant.
 * 3. After face-up, controller's next start-phase destroys the shell.
 * 4. Opponent start-phase does not destroy (start-phase is turn-player-gated).
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { aquaSeeingShell } from "../../../../../../cards/src/cards/equipment/aqua-seeing-shell.ts";

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
      game.exec({ move: "pass", actorId: prio, payload: {} });
      continue;
    }
    return;
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

describe("aqua-seeing-shell (MST067)", () => {
  it("core mechanic: cloaked Instant 3{r} turn face-up → draw; start of your turn destroy", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [aquaSeeingShell],
        hand: [],
        resourcePoints: 3,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const headId = game.getState().containers.zonesByPlayerId[Bravo.id]!.head[0]!;

    expect(game.objectState(headId)?.faceDown).toBe(true);
    const handBefore = Bravo.zone("hand").length;

    Bravo.activate(aquaSeeingShell);
    drain(game);

    expect(game.objectState(headId)?.faceDown).not.toBe(true);
    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.zone("hand").length).toBe(handBefore + 1);
    expect(Bravo.zone("head")).toContain(aquaSeeingShell.canonicalId);

    // Bravo (turn player) ends → Dash's start (no destroy) → Dash ends →
    // Bravo's start-phase destroys the face-up shell.
    endTurnDrain(game, bravo);
    expect(Bravo.zone("head")).toContain(aquaSeeingShell.canonicalId);
    endTurnDrain(game, dash);
    expect(Bravo.zone("graveyard")).toContain(aquaSeeingShell.canonicalId);
    expect(Bravo.zone("head")).not.toContain(aquaSeeingShell.canonicalId);
  });

  it("boundaries: face-up Instant illegal; 0 RP illegal; model Instant + start destroy", () => {
    const faceUp = FabTestEngine.start(
      {
        hero: bravo,
        head: [{ card: aquaSeeingShell, state: { faceDown: false } }],
        hand: [],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const id = faceUp.getState().containers.zonesByPlayerId[faceUp.as(bravo).id]!.head[0]!;
    // Explicitly seat it face-up so the turn-face-up cost is illegal.
    expect(faceUp.objectState(id)?.faceDown).toBe(false);
    expect(() => faceUp.as(bravo).activate(aquaSeeingShell)).toThrow();

    const poor = FabTestEngine.start(
      {
        hero: bravo,
        head: [aquaSeeingShell],
        hand: [],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => poor.as(bravo).activate(aquaSeeingShell)).toThrow();

    const a1 = aquaSeeingShell.base.abilities?.[0];
    expect(a1?.kind).toBe("activated");
    if (a1?.kind === "activated") {
      expect(a1.abilityType).toBe("instant");
      expect(a1.cost).toMatchObject({
        class: "mixed",
        type: "all",
        costs: [
          { class: "asset", type: "resources", amount: 3 },
          { class: "effect", type: "turn-face-up", target: { selector: "self" } },
        ],
      });
      expect(a1.effect).toMatchObject({ type: "draw", count: 1 });
    }
    const a2 = aquaSeeingShell.base.abilities?.[1];
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
    }
    expect(aquaSeeingShell.base.keywords?.some((k) => k.name === "cloaked")).toBe(true);
  });
});
