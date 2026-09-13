import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../../fixtures.ts";
import { seerstone } from "../../../../../../cards/src/cards/weapons/seerstone.ts";

function resolve(game: ReturnType<typeof FabTestEngine.start>, acceptBottom: boolean): void {
  for (let safety = 0; safety < 32; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: acceptBottom },
        },
      });
      continue;
    }
    if (decision && game.answerForcedDecision()) continue;
    if (decision) throw new Error(`unexpected decision ${decision.kind}`);
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const priority = game.getState().priority?.holderPlayerId;
    if (!priority) return;
    game.exec({ move: "pass", actorId: priority, payload: {} });
  }
  throw new Error("Seerstone did not resolve");
}

function start(resources: number) {
  return FabTestEngine.start(
    {
      hero: bravo,
      weapon1: [seerstone],
      hand: [],
      deck: [snatchRed, nimblismBlue],
      resourcePoints: resources,
      actionPoints: 1,
    },
    { hero: dash, hand: [], deck: 6 },
    { autoPassPriority: false },
  );
}

describe("seerstone (DYN193)", () => {
  it("a1: pays 3, puts the looked top card on bottom, and creates Ponder", () => {
    const game = start(3);
    const Bravo = game.as(bravo);
    Bravo.activate(seerstone);
    resolve(game, true);
    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.zone("deck")).toEqual([nimblismBlue.canonicalId, snatchRed.canonicalId]);
    expect(Bravo.zone("arena")).toContain("token:ponder");
  });

  it("a1 boundary: declining leaves the looked card on top; insufficient resources is illegal", () => {
    const game = start(3);
    const Bravo = game.as(bravo);
    Bravo.activate(seerstone);
    resolve(game, false);
    expect(Bravo.zone("deck")).toEqual([snatchRed.canonicalId, nimblismBlue.canonicalId]);
    expect(Bravo.zone("arena")).toContain("token:ponder");
    const poor = start(2);
    expect(() => poor.as(bravo).activate(seerstone)).toThrow();
  });
});
