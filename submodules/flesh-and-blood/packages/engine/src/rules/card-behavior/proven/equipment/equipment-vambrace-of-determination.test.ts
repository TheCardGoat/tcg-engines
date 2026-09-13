import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { blessingOfSerenityRed, bravo, dash, snatchRed } from "../../../fixtures.ts";
import { vambraceOfDetermination } from "../../../../../../cards/src/cards/equipment/vambrace-of-determination.ts";

function answerOptional(game: ReturnType<typeof FabTestEngine.start>, value: boolean): void {
  for (let safety = 0; safety < 32; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value },
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
    if (decision || (!game.combat() && game.getState().rulesStack.length === 0)) return;
    const priority = game.getState().priority?.holderPlayerId;
    if (!priority) return;
    game.exec({ move: "pass", actorId: priority, payload: {} });
  }
}

function toReaction(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 16 && game.combat()?.step !== "reaction"; safety += 1) {
    if (game.declareNoDefenseIfPending()) continue;
    const priority = game.getPriorityPlayerId();
    if (!priority) return;
    game.exec({ move: "pass", actorId: priority, payload: {} });
  }
}

describe("vambrace-of-determination (OUT174)", () => {
  it("Attack Reaction makes the next physical prevention prevent one less", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [vambraceOfDetermination],
        hand: [snatchRed],
        actionPoints: 1,
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [blessingOfSerenityRed], deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.attackWith(snatchRed);
    toReaction(game);
    expect(game.combat()?.step).toBe("reaction");
    Bravo.activate(vambraceOfDetermination);
    game.passBoth();
    const priority = game.getState().priority?.holderPlayerId;
    if (!priority) throw new Error("expected priority after Vambrace resolves");
    game.exec({ move: "pass", actorId: priority, payload: {} });
    Dash.play(blessingOfSerenityRed);
    game.passBoth();
    answerOptional(game, true);
    game.helpers.resolveRestOfCombat();

    expect(Bravo.resourcePoints()).toBe(0);
    expect(Dash.life()).toBe(18);
  });

  it("self-defend paid trigger grants +1 defense and blade break", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, arms: [vambraceOfDetermination], resourcePoints: 1, deck: 6 },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(vambraceOfDetermination);
    answerOptional(game, true);
    game.helpers.resolveRestOfCombat();

    expect(Dash.resourcePoints()).toBe(0);
    expect(Dash.life()).toBe(17);
    expect(Dash.zone("arms")).not.toContain(vambraceOfDetermination.canonicalId);
    expect(Dash.zone("graveyard")).toContain(vambraceOfDetermination.canonicalId);
  });

  it("declining the defend payment leaves zero defense and keeps the vambrace equipped", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, arms: [vambraceOfDetermination], resourcePoints: 1, deck: 6 },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(vambraceOfDetermination);
    answerOptional(game, false);
    game.helpers.resolveRestOfCombat();

    expect(Dash.resourcePoints()).toBe(1);
    expect(Dash.life()).toBe(16);
    expect(Dash.zone("arms")).toContain(vambraceOfDetermination.canonicalId);
    expect(Dash.zone("graveyard")).not.toContain(vambraceOfDetermination.canonicalId);
  });
});
