import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { bootsToTheBoards } from "../../../../../../cards/src/cards/equipment/boots-to-the-boards.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>, acceptPayment: boolean): void {
  for (let safety = 0; safety < 96; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: acceptPayment },
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
          answer: { kind: "payment", instanceIds: acceptPayment && pick ? [pick.instanceId] : [] },
        },
      });
      continue;
    }
    if (decision?.kind === "numeric") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "numeric",
            value: acceptPayment ? decision.max : decision.min,
          },
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
    if (decision) break;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const actorId = game.getState().priority?.holderPlayerId;
    if (!actorId) return;
    try {
      game.exec({ move: "pass", actorId, payload: {} });
    } catch {
      return;
    }
  }
}

describe("boots-to-the-boards (APS007)", () => {
  it("AAA: defending pays three resource points and creates three Toughness tokens", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, legs: [bootsToTheBoards], resourcePoints: 3, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.attackWith(snatchRed);
    Dash.defend(bootsToTheBoards);
    game.passBoth();
    drain(game, true);
    expect(Dash.zone("arena").filter((id) => id === "token:toughness")).toHaveLength(3);
    expect(Dash.resourcePoints()).toBe(0);
  });

  it("boundary: declining the optional payment creates no Toughness tokens", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], deck: 6 },
      { hero: dash, legs: [bootsToTheBoards], resourcePoints: 3, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.attackWith(snatchRed);
    Dash.defend(bootsToTheBoards);
    game.passBoth();
    drain(game, false);
    expect(Dash.zone("arena").filter((id) => id === "token:toughness")).toHaveLength(0);
    expect(Dash.resourcePoints()).toBe(3);
  });
});
