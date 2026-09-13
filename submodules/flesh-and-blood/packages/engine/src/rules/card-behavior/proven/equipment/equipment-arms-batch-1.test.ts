/**
 * Hand-authored AAA for Arms equipment with printed abilities.
 *
 * TER006 hard-knuckle — Generic Arms d0
 * "When you play an attack action card, you may destroy this. If you do, the
 * attack gets +1{p}."
 *
 * Reasoning:
 * - Triggered static on play event (Action+Attack). Optional destroy gates the
 *   power buff ("If you do").
 * - Happy: play Snatch (p4) → optional fires → accept → arms→GY, attack p5.
 * - Decline: arms stays, attack p4 unchanged.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, snatchRed } from "../../../fixtures.ts";
import { hardKnuckle } from "../../../../../../cards/src/cards/equipment/hard-knuckle.ts";

/** Walk combat/stack answering the first boolean with `accept`, then pass. */
function resolveWithOptional(game: ReturnType<typeof FabTestEngine.start>, accept: boolean): void {
  let answered = false;
  for (let safety = 0; safety < 64; safety += 1) {
    const decision = game.getState().decision;
    if (!answered && decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: accept },
        },
      });
      answered = true;
      continue;
    }
    if (decision?.kind === "ordering") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "ordering" as const,
            orderedIds: decision.entries.map((entry) => entry.id),
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

describe("hard-knuckle (TER006)", () => {
  it("core mechanic: play AAC → optional destroy → attack gets +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [hardKnuckle],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    const lifeBefore = Dash.life();
    // Use play (not attackWith) so the play-event trigger fires cleanly.
    Bravo.play(snatchRed);
    // The play-trigger optional fires. Accept to destroy arms and buff attack.
    resolveWithOptional(game, true);
    game.helpers.resolveRestOfCombat();

    expect(Bravo.zone("arms")).not.toContain(hardKnuckle.canonicalId);
    expect(Bravo.zone("graveyard")).toContain(hardKnuckle.canonicalId);
    // Snatch base power 4 + 1 from hard-knuckle = 5 damage (undefended).
    expect(Dash.life()).toBe(lifeBefore - 5);
  });

  it("boundaries: decline optional keeps arms and attack stays base power", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arms: [hardKnuckle],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 40, deck: 6 },
      { autoPassPriority: false },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    const lifeBefore = Dash.life();
    Bravo.play(snatchRed);
    resolveWithOptional(game, false);
    game.helpers.resolveRestOfCombat();

    expect(Bravo.zone("arms")).toContain(hardKnuckle.canonicalId);
    // Snatch base power 4, no buff from hard-knuckle.
    expect(Dash.life()).toBe(lifeBefore - 4);
  });
});
