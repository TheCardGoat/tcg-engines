/**
 * AAA test for trigger:wager.
 * Representative card: Betsy (BET001) — Guardian Young Hero.
 * Whenever an attack you control wagers, you may pay {r}{r} for +1{p} and overpower.
 * Wage Gold optional wager marks combatChain.wagered when accepted.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { dash, snatchRed } from "../../../fixtures.ts";
import { betsy } from "../../../../../../cards/src/cards/heroes/betsy.ts";
import { wageGoldYellow } from "../../../../../../cards/src/cards/actions/wage-gold.ts";
import { gold } from "../../../../../../cards/src/cards/tokens/gold.ts";
import { bigSlickRed } from "../../../../../../cards/src/cards/actions/big-slick.ts";
import { goldenGrail } from "../../../../../../cards/src/cards/weapons/golden-grail.ts";
import { bravo } from "../../../../../../cards/src/cards/heroes/bravo.ts";

/** Accept optional effects (wager) with the required decision envelope. */
function acceptOptionalsAndResolve(game: FabTestEngine): void {
  for (let safety = 0; safety < 48; safety += 1) {
    if (game.hasGameEnded()) return;
    const decision = game.getState().decision;
    if (decision) {
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
      if (game.answerForcedDecision()) continue;
      throw new Error(`Unhandled ${decision.kind} decision ${decision.decisionId}`);
    }
    if (game.combat()?.open || game.getState().rulesStack.length > 0) {
      try {
        game.passBoth();
      } catch {
        return;
      }
      continue;
    }
    return;
  }
}

describe("trigger: wager", () => {
  it("AAA: accepting Wage Gold's optional wager sets combatChain.wagered (BET001)", () => {
    const game = FabTestEngine.start(
      {
        hero: betsy,
        hand: [wageGoldYellow],
        arena: [gold],
        resourcePoints: 5,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Betsy = game.as(betsy);
    let sawWagered = false;

    Betsy.play(wageGoldYellow, { target: game.as(dash).id });
    for (let i = 0; i < 40; i += 1) {
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
        if (game.getState().players[Betsy.id]!.history.combatChain.wagered) {
          sawWagered = true;
        }
        continue;
      }
      if (decision) {
        acceptOptionalsAndResolve(game);
        break;
      }
      if (game.combat()?.open || game.getState().rulesStack.length > 0) {
        try {
          game.passBoth();
        } catch {
          break;
        }
        continue;
      }
      break;
    }
    acceptOptionalsAndResolve(game);

    // Wagered is reset on chain close — assert it was set while the chain was open.
    expect(sawWagered).toBe(true);
  });

  it("AAA boundary: plain attack without wager text does not set wagered", () => {
    const game = FabTestEngine.start(
      { hero: betsy, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    game.as(betsy).attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(game.getState().players[game.as(betsy).id]!.history.combatChain.wagered).toBe(false);
  });

  it("AAA cleanup: closing combat removes wagered from a reusable weapon source", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [goldenGrail],
        hand: [bigSlickRed],
        resourcePoints: 5,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    const grail = Bravo.cardIn("weapon1", goldenGrail);

    Bravo.play(bigSlickRed);
    game.helpers.resolveUntilIdle();
    Bravo.activateAttack(goldenGrail);

    expect(
      game
        .getState()
        .objects[grail.instanceId]?.markers.some((marker) => marker.kind === "wagered"),
    ).toBe(true);

    Dash.defendWith();
    game.closeCombat();

    expect(
      game
        .getState()
        .objects[grail.instanceId]?.markers.some((marker) => marker.kind === "wagered"),
    ).toBe(false);
  });
});
