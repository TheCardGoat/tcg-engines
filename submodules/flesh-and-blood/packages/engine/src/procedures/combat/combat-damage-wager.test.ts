import { describe, expect, it } from "vitest";
import { wageGoldYellow } from "../../../../cards/src/cards/actions/wage-gold.ts";
import { olympiaPrizedFighter } from "../../../../cards/src/cards/heroes/olympia-prized-fighter.ts";
import type { FabMatchState } from "../../state.ts";
import { dash } from "../../rules/fixtures.ts";
import { FabTestEngine } from "../../testing/test-engine.ts";
import type { FabEventTransactionOptions } from "../../kernel/process-runner/index.ts";
import { resolveFabCombatDamage } from "./combat-damage.ts";

const transactionOptions: FabEventTransactionOptions = {
  triggerContext: { evaluateStateCondition: () => true },
  legalTargets: () => [],
  evaluateAmount: (_state, amount) => (typeof amount === "number" ? amount : null),
  randomIndex: () => 0,
};

function advanceWageGoldToReaction(game: FabTestEngine): void {
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
    if (decision && game.answerForcedDecision()) continue;
    if (decision) throw new Error(`Unhandled ${decision.kind} decision ${decision.decisionId}`);
    if (game.combat()?.step === "reaction") return;
    if (game.declareNoDefenseIfPending()) continue;
    game.passBoth();
  }
  throw new Error("Wage Gold did not reach the reaction step.");
}

describe("combat damage wager prizes", () => {
  it("fails atomically when real Wage Gold's Gold prize is absent from the match program", () => {
    const game = FabTestEngine.start(
      {
        hero: olympiaPrizedFighter,
        hand: [wageGoldYellow],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Olympia = game.as(olympiaPrizedFighter);
    const Dash = game.as(dash);

    Olympia.play(wageGoldYellow, { target: Dash.id });
    advanceWageGoldToReaction(game);

    const state = game.getState();
    expect(state.combat?.activeLink?.wagers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          wagerId: expect.stringMatching(/^wager-process-/),
          attackingPlayerId: Olympia.id,
          defendingPlayerId: Dash.id,
          prize: { kind: "create-token", canonicalIds: ["token:gold"] },
        }),
      ]),
    );
    const { ["token:gold"]: omittedGold, ...cardDefinitions } = state.cardDefinitions;
    expect(omittedGold).toBeDefined();
    const malformedState: FabMatchState = { ...state, cardDefinitions };

    // CR 8.5.46b requires the wager winner to create the specified token. The
    // engine must not invent its immutable properties when that definition was
    // excluded from the match program.
    const result = resolveFabCombatDamage(malformedState, transactionOptions);

    expect(result).toMatchObject({
      accepted: false,
      state: malformedState,
      error: "Wager prize token:gold is absent from the immutable match program.",
      errorCode: "match_program_missing_definition",
    });
    expect(result.state).toBe(malformedState);
    expect(result.state.players[Dash.id]?.life).toBe(20);
  });
});
