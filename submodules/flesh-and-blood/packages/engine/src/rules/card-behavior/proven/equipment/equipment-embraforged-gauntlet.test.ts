/**
 * PEN192 Embraforged Gauntlet — Shadow Arms d2.
 *
 * Printed a1: "If this would be put into your graveyard from anywhere,
 * instead banish it."
 *
 * CR 6.4.1: a replacement effect replaces an event with a modified event;
 * CR 6.4.6: the original event does not occur when its replacement occurs.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { embraforgedGauntlet } from "../../../../../../cards/src/cards/equipment/embraforged-gauntlet.ts";
import { mangleRed as mangle } from "../../../../../../cards/src/cards/actions/mangle.ts";

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
          answer: { kind: "boolean", value: true },
        },
      });
      continue;
    }
    if (decision?.kind === "entity-target") {
      const picks = decision.candidates
        .slice(0, decision.min ?? 1)
        .map((candidate) => candidate.instanceId);
      if (picks.length < (decision.min ?? 1)) return;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "entity-target", instanceIds: picks },
        },
      });
      continue;
    }
    if (decision) return;
    if (!game.combat() && game.getState().rulesStack.length === 0) return;
    const priorityPlayerId = game.getState().priority?.holderPlayerId;
    if (!priorityPlayerId) return;
    game.exec({ move: "pass", actorId: priorityPlayerId, payload: {} });
  }
}

describe("embraforged-gauntlet (PEN192)", () => {
  it("a1: Mangle destroys its -1{d} countered source, which is banished instead of put into graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed, mangle],
        resourcePoints: 8,
        actionPoints: 2,
        deck: 6,
      },
      {
        hero: dash,
        arms: [embraforgedGauntlet],
        life: 20,
        deck: 6,
      },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const gauntletId = Dash.findCardInZone("arms", embraforgedGauntlet);

    // Temper makes the Gauntlet a legal Mangle target through a real defend.
    Bravo.attackWith(snatchRed);
    Dash.defendWith(embraforgedGauntlet);
    drain(game);
    game.helpers.resolveRestOfCombat();
    expect(game.objectState(gauntletId)?.defenseCounterTotal).toBe(-1);
    expect(Dash.zone("arms")).toContain(embraforgedGauntlet.canonicalId);

    // Mangle deals 4+ and destroys the countered equipment. PEN192 replaces
    // that graveyard destination with banishment while preserving destruction.
    Bravo.attackWith(mangle);
    drain(game);
    game.helpers.resolveRestOfCombat();

    expect(Dash.zone("arms")).not.toContain(embraforgedGauntlet.canonicalId);
    expect(Dash.zone("graveyard")).not.toContain(embraforgedGauntlet.canonicalId);
    expect(Dash.zone("banished")).toContain(embraforgedGauntlet.canonicalId);
  });

  it("boundary: without a -1{d} counter, Mangle cannot destroy the Gauntlet", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [mangle],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, arms: [embraforgedGauntlet], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );

    game.as(bravo).attackWith(mangle);
    drain(game);
    game.helpers.resolveRestOfCombat();

    expect(game.as(dash).zone("arms")).toContain(embraforgedGauntlet.canonicalId);
    expect(game.as(dash).zone("graveyard")).not.toContain(embraforgedGauntlet.canonicalId);
    expect(game.as(dash).zone("banished")).not.toContain(embraforgedGauntlet.canonicalId);
  });
});
