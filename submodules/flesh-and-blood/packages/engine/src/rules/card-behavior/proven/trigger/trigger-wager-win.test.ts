/**
 * AAA test for trigger:wager-win.
 * Representative card: Olympia, Prized Fighter (HVY092).
 * First time each of your attacks wins a wager, create a Gold token.
 *
 * Wage Gold (HVY217) wagers on attack; a hit while wagered emits wager-win.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { dash, snatchRed, unmovableRed } from "../../../fixtures.ts";
import { olympiaPrizedFighter } from "../../../../../../cards/src/cards/heroes/olympia-prized-fighter.ts";
import { wageGoldYellow } from "../../../../../../cards/src/cards/actions/wage-gold.ts";
import { gold } from "../../../../../../cards/src/cards/tokens/gold.ts";

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

describe("trigger: wager-win", () => {
  it("AAA: Olympia creates a Gold token when Wage Gold hits after wagering (HVY092)", () => {
    const game = FabTestEngine.start(
      {
        hero: olympiaPrizedFighter,
        hand: [wageGoldYellow],
        arena: [gold],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Olympia = game.as(olympiaPrizedFighter);
    const Dash = game.as(dash);
    const goldBefore = Olympia.zone("arena").filter((id) => /token:gold/i.test(String(id))).length;

    Olympia.play(wageGoldYellow, { target: Dash.id });
    acceptOptionalsAndResolve(game);

    // Hit for 6 awards the wagered Gold prize and Olympia's wager-win Gold.
    expect(Dash.life()).toBe(14);
    expect(Olympia.zone("arena").filter((id) => /token:gold/i.test(String(id))).length).toBe(
      goldBefore + 2,
    );
  });

  it("AAA boundary: non-wager attack creates no Gold", () => {
    const game = FabTestEngine.start(
      { hero: olympiaPrizedFighter, hand: [snatchRed], deck: 4 },
      { hero: dash, life: 20, deck: 4 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Olympia = game.as(olympiaPrizedFighter);
    Olympia.attackWith(snatchRed);
    game.helpers.resolveRestOfCombat();
    expect(Olympia.zone("arena").some((id) => /token:gold/i.test(String(id)))).toBe(false);
  });

  it("AAA: a defended Wage Gold awards its Gold prize to the defending hero", () => {
    const game = FabTestEngine.start(
      {
        hero: olympiaPrizedFighter,
        hand: [wageGoldYellow],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [unmovableRed], life: 20, resourcePoints: 3, deck: 6 },
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Olympia = game.as(olympiaPrizedFighter);
    const Dash = game.as(dash);
    Olympia.play(wageGoldYellow, { target: Dash.id });

    let defended = false;
    for (let safety = 0; safety < 64; safety += 1) {
      if (game.hasGameEnded()) break;
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
      if (!defended && game.combat()?.step === "reaction") {
        if (game.getState().priority?.holderPlayerId !== Dash.id) {
          game.helpers.passPriorityTo(Dash);
        } else {
          Dash.play(unmovableRed);
          defended = true;
        }
        continue;
      }
      if (!game.combat()?.open && game.getState().rulesStack.length === 0) break;
      game.passBoth();
    }

    expect(defended).toBe(true);
    expect(Olympia.zone("arena")).not.toContain("token:gold");
    expect(Dash.zone("arena")).toContain("token:gold");
  });
});
