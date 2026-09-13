import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { beckoningHaunt } from "../../../../../../cards/src/cards/equipment/beckoning-haunt.ts";
import { sigilOfGravespawningBlue } from "../../../../../../cards/src/cards/actions/sigil-of-gravespawning.ts";

function resolve(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 32; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      const candidate = decision.candidates[0];
      if (!candidate) throw new Error("Expected Beckoning Haunt target.");
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [candidate.instanceId] },
        },
      });
      continue;
    }
    if (decision) return;
    if (game.getState().rulesStack.length === 0) return;
    const priority = game.getState().priority?.holderPlayerId;
    if (!priority) return;
    game.exec({ move: "pass", actorId: priority, payload: {} });
  }
}

describe("beckoning-haunt (PEN095)", () => {
  it("declares X=1, pays 2X+1, destroys itself, and returns a cost-1 Aura from graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [beckoningHaunt],
        graveyard: [sigilOfGravespawningBlue],
        hand: [],
        actionPoints: 1,
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const hauntId = Bravo.findCardInZone("arms", beckoningHaunt);
    game.exec({ move: "activate", actorId: Bravo.id, payload: { instanceId: hauntId } });
    const x = game.getState().decision;
    expect(x).toMatchObject({ kind: "numeric", min: 0, max: 1 });
    if (x?.kind !== "numeric") throw new Error("Expected X declaration.");
    game.exec({
      move: "answer-decision",
      actorId: Bravo.id,
      payload: {
        decisionId: x.decisionId,
        stateVersion: x.stateVersion,
        answer: { kind: "numeric", value: 1 },
      },
    });
    resolve(game);
    expect(Bravo.resourcePoints()).toBe(0);
    expect(Bravo.zone("arms")).not.toContain(beckoningHaunt.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(beckoningHaunt.canonicalId);
    expect(Bravo.zone("hand")).toContain(sigilOfGravespawningBlue.canonicalId);
  });

  it("rejects an X larger than the available 2X+1 payment", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [beckoningHaunt],
        graveyard: [sigilOfGravespawningBlue],
        hand: [],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const hauntId = Bravo.findCardInZone("arms", beckoningHaunt);
    game.exec({ move: "activate", actorId: Bravo.id, payload: { instanceId: hauntId } });
    const x = game.getState().decision;
    expect(x).toMatchObject({ kind: "numeric", max: 0 });
    if (x?.kind !== "numeric") throw new Error("Expected X declaration.");
    expect(() =>
      game.exec({
        move: "answer-decision",
        actorId: Bravo.id,
        payload: {
          decisionId: x.decisionId,
          stateVersion: x.stateVersion,
          answer: { kind: "numeric", value: 1 },
        },
      }),
    ).toThrow("within the legal range");
  });
});
