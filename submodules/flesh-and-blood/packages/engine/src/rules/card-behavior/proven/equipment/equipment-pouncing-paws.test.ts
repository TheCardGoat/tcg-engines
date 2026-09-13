/** TCC082 Pouncing Paws — Instant Crouching Tiger creation/play. */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash } from "../../../fixtures.ts";
import { pouncingPaws } from "../../../../../../cards/src/cards/equipment/pouncing-paws.ts";
import { createFabLoopGuard } from "@tcg/flesh-and-blood-types";

function declineOptionalAndPass(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 64; safety += 1) {
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
    if (decision && game.answerForcedDecision()) continue;
    if (decision) return;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const priority = game.getState().priority?.holderPlayerId;
    if (!priority) return;
    game.exec({ move: "pass", actorId: priority, payload: {} });
  }
}

function acceptOptionalUntilAttack(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 64; safety += 1) {
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
    if (decision && game.answerForcedDecision()) continue;
    if (decision) return;
    if (game.combat()?.activeLink) return;
    // CR 1.11.4a: passing with an empty stack and no open combat chain can
    // complete a full pass cycle and end the action phase, which would expire
    // the "play this turn" permission. Stop once nothing is pending instead
    // of cycling priority.
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const priority = game.getState().priority?.holderPlayerId;
    if (!priority) return;
    game.exec({ move: "pass", actorId: priority, payload: {} });
  }
}

describe("pouncing-paws (TCC082)", () => {
  it("core: destroys itself and creates a banished Crouching Tiger", () => {
    const game = FabTestEngine.start(
      { hero: bravo, legs: [pouncingPaws], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    Bravo.activate(pouncingPaws);
    declineOptionalAndPass(game);

    expect(Bravo.zone("legs")).not.toContain(pouncingPaws.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(pouncingPaws.canonicalId);
    expect(Bravo.zone("banished")).toContain("token:crouching-tiger");
    expect(game.as(dash).life()).toBe(20);
    expect(Bravo.actionPoints()).toBe(1);
  });

  it("accepting the optional choice plays the exact created Crouching Tiger this turn", () => {
    const game = FabTestEngine.start(
      { hero: bravo, legs: [pouncingPaws], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);

    Bravo.activate(pouncingPaws);
    acceptOptionalUntilAttack(game);
    expect(Bravo.zone("banished")).toContain("token:crouching-tiger");

    // The optional effect grants a player-facing permission; playing the
    // created card remains a normal player move rather than an auto-play.
    const tigerInstanceId = game
      .getState()
      .containers.zonesByPlayerId[Bravo.id]!.banished.find(
        (instanceId) =>
          game.getState().objects[instanceId]?.canonicalId === "token:crouching-tiger",
      );
    expect(tigerInstanceId).toBeDefined();
    const priorityGuard = createFabLoopGuard({ label: "pouncing-paws: pass to Bravo" });
    while (game.getState().priority?.holderPlayerId !== Bravo.id) {
      priorityGuard.tick();
      const priority = game.getState().priority?.holderPlayerId;
      expect(priority).toBeDefined();
      game.exec({ move: "pass", actorId: priority!, payload: {} });
    }
    Bravo.playInstance(tigerInstanceId!, { from: "banished" });
    acceptOptionalUntilAttack(game);

    const attackInstanceId = game.combat()?.activeLink?.activeAttack.sourceObjectId;
    expect(attackInstanceId).toBeDefined();
    expect(game.getState().objects[attackInstanceId!]?.canonicalId).toBe("token:crouching-tiger");
    expect(Bravo.zone("banished")).not.toContain("token:crouching-tiger");
    expect(Bravo.zone("graveyard")).toContain(pouncingPaws.canonicalId);
  });

  it("boundary: the Instant is illegal outside the equipped zone", () => {
    const game = FabTestEngine.start(
      { hero: bravo, resourcePoints: 0, deck: 6 },
      { hero: dash, deck: 6 },
    );
    expect(() => game.as(bravo).activate(pouncingPaws)).toThrow();
  });
});
