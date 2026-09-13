import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { flickKnives } from "../../../../../../cards/src/cards/equipment/flick-knives.ts";
import { zephyrNeedle } from "../../../../../../cards/src/cards/weapons/zephyr-needle.ts";

function drain(game: ReturnType<typeof FabTestEngine.start>, targetHeroId: string): void {
  for (let safety = 0; safety < 96; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      const dagger = decision.candidates.find(
        (candidate) =>
          game.getState().objects[candidate.instanceId]?.canonicalId === zephyrNeedle.canonicalId,
      );
      const target =
        dagger ?? decision.candidates.find((candidate) => candidate.instanceId === targetHeroId);
      if (!target) throw new Error("expected a legal target");
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: [target.instanceId] },
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
          answer: { kind: "ordering", orderedIds: decision.entries.map((entry) => entry.id) },
        },
      });
      continue;
    }
    if (decision && game.answerForcedDecision()) continue;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const priority = game.getState().priority?.holderPlayerId;
    if (!priority) return;
    game.exec({ move: "pass", actorId: priority, payload: {} });
  }
}

function enterReaction(game: ReturnType<typeof FabTestEngine.start>): void {
  game.as(dash).defendWith([]);
  game.as(bravo).pass();
  game.as(dash).pass();
  expect(game.combat()?.step).toBe("reaction");
}

describe("flick-knives (OUT139)", () => {
  it("Attack Reaction makes an off-chain controlled Dagger deal 1, hit, then destroy itself", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [flickKnives],
        weapon1: [zephyrNeedle],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    enterReaction(game);
    Bravo.activate(flickKnives);
    drain(game, Dash.id);

    expect(Dash.life()).toBe(15);
    expect(Bravo.zone("arms")).toContain(flickKnives.canonicalId);
    expect(Bravo.zone("weapon1")).not.toContain(zephyrNeedle.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(zephyrNeedle.canonicalId);
    expect(
      game
        .committedEvents()
        .some(
          (event) =>
            event.name === "hit" &&
            "object" in event.data &&
            event.data.object.canonicalId === zephyrNeedle.canonicalId,
        ),
    ).toBe(true);
  });

  it("is illegal without an off-chain Dagger and outside the reaction step", () => {
    const withoutDagger = FabTestEngine.start(
      { hero: bravo, arms: [flickKnives], hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    withoutDagger.as(bravo).attackWith(snatchRed);
    enterReaction(withoutDagger);
    expect(
      withoutDagger.as(bravo).expectFailure({
        move: "activate",
        payload: { instanceId: withoutDagger.as(bravo).card(flickKnives) },
      }).accepted,
    ).toBe(false);

    const outsideReaction = FabTestEngine.start(
      { hero: bravo, arms: [flickKnives], weapon1: [zephyrNeedle], deck: 6 },
      { hero: dash, deck: 6 },
      { autoPassPriority: false },
    );
    expect(() => outsideReaction.as(bravo).activate(flickKnives)).toThrow();
  });
});
