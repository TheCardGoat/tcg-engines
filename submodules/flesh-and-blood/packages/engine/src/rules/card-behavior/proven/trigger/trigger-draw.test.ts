/**
 * AAA test for trigger:draw.
 * Representative card: Brainstorm Blue (DYN196) — Wizard Instant.
 * Grants hero: whenever you draw this action phase, deal 1 arcane.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { brainstormBlue } from "../../../../../../cards/src/cards/instants/brainstorm.ts";
import { gold } from "../../../../../../cards/src/cards/tokens/gold.ts";

function resolveDecisions(game: FabTestEngine): void {
  for (let safety = 0; safety < 40; safety += 1) {
    const decision = game.getState().decision;
    if (!decision) {
      if (game.getState().rulesStack.length > 0 || game.combat()?.open) {
        try {
          game.passBoth();
        } catch {
          return;
        }
        continue;
      }
      return;
    }
    if (decision.kind === "boolean") {
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
    if (decision.kind === "entity-target") {
      const pick =
        decision.candidates.find((c) => c.instanceId.includes("player-2")) ??
        decision.candidates[0];
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
    if (game.answerForcedDecision()) continue;
    return;
  }
}

describe("trigger: draw", () => {
  it("AAA: after Brainstorm, drawing via Gold deals 1 arcane (DYN196)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [brainstormBlue],
        arena: [gold],
        resourcePoints: 5,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.play(brainstormBlue);
    resolveDecisions(game);
    expect(Bravo.zone("graveyard")).toContain(brainstormBlue.canonicalId);
    // Wizard instant: printed arcane 1 resolves to any target (Dash).
    expect(Dash.life()).toBe(19);

    // Gold: pay {r}{r}, destroy, draw — fires the granted draw trigger.
    const handBefore = Bravo.zone("hand").length;
    Bravo.activate(gold);
    resolveDecisions(game);
    game.helpers.resolveUntilIdle();

    expect(Bravo.zone("hand").length).toBe(handBefore + 1);
    expect(Bravo.life()).toBe(20);
    expect(Dash.life()).toBe(18);
  });

  it("AAA boundary: without Brainstorm, end-turn draw does not deal arcane", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const lifeBefore = game.as(dash).life();
    game.as(bravo).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.as(dash).life()).toBe(lifeBefore - 4);
  });
});
