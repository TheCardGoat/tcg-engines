import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { heroicPoseBlue } from "../../../../../../cards/src/cards/actions/heroic-pose.ts";
import { comebackKicks } from "../../../../../../cards/src/cards/equipment/comeback-kicks.ts";

function acceptOptional(game: ReturnType<typeof FabTestEngine.start>): void {
  const decision = game.getState().decision;
  if (decision?.kind !== "boolean")
    throw new Error(`expected optional decision, got ${decision?.kind ?? "none"}`);
  game.exec({
    move: "answer-decision",
    actorId: decision.actorId,
    payload: {
      decisionId: decision.decisionId,
      stateVersion: decision.stateVersion,
      answer: { kind: "boolean", value: true },
    },
  });
}

describe("comeback-kicks (PEN288)", () => {
  it("AAA: crowd cheers below the opposing hero may destroy this and gains an action point", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [comebackKicks],
        hand: [heroicPoseBlue],
        life: 19,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    Bravo.play(heroicPoseBlue);
    game.passBoth();
    game.passBoth();
    acceptOptional(game);
    game.passBoth();

    expect(Bravo.zone("graveyard")).toContain(comebackKicks.canonicalId);
    expect(Bravo.actionPoints()).toBe(2);
  });

  it("boundary: equal life does not fire the crowd-cheers trigger", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        legs: [comebackKicks],
        hand: [heroicPoseBlue],
        life: 20,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    Bravo.play(heroicPoseBlue);
    game.passBoth();
    game.passBoth();

    expect(Bravo.zone("legs")).toContain(comebackKicks.canonicalId);
    expect(Bravo.actionPoints()).toBe(1);
  });
});
