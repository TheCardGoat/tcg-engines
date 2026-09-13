import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../../../testing/test-engine.ts";
import { bravo, dash, nimblismBlue, snatchRed } from "../../../fixtures.ts";

import { rampartOfTheRamSHead } from "../../../../../../cards/src/cards/equipment/rampart-of-the-ram-s-head.ts";

function resolveOptional(game: ReturnType<typeof FabTestEngine.start>, accept: boolean): void {
  for (let safety = 0; safety < 32; safety += 1) {
    const decision = game.getState().decision;
    if (decision?.kind === "boolean") {
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: { kind: "boolean", value: accept },
        },
      });
      continue;
    }
    if (decision && game.answerForcedDecision()) continue;
    if (decision || game.getState().rulesStack.length === 0) return;
    game.passBoth();
  }
}

describe("rampart-of-the-ram-s-head (ELE203)", () => {
  it("pays {r} after it defends and gains +1 defense for the combat", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, weapon2: [rampartOfTheRamSHead], resourcePoints: 1, deck: 6 },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);
    const life = Dash.life();

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(rampartOfTheRamSHead);
    resolveOptional(game, true);
    game.helpers.resolveRestOfCombat();

    expect(Dash.resourcePoints()).toBe(0);
    expect(Dash.life()).toBe(life - 3);
    expect(Dash.zone("weapon2")).toContain(rampartOfTheRamSHead.canonicalId);
  });

  it("declining the payment leaves its printed zero defense", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, weapon2: [rampartOfTheRamSHead], resourcePoints: 1, deck: 6 },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);
    const life = Dash.life();

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(rampartOfTheRamSHead);
    resolveOptional(game, false);
    game.helpers.resolveRestOfCombat();

    expect(Dash.resourcePoints()).toBe(1);
    expect(Dash.life()).toBe(life - 4);
  });

  it("does not trigger when another card alone defends", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        weapon2: [rampartOfTheRamSHead],
        hand: [nimblismBlue],
        resourcePoints: 1,
        deck: 6,
      },
      { autoPassPriority: false },
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(nimblismBlue);
    resolveOptional(game, true);
    game.helpers.resolveRestOfCombat();

    expect(Dash.resourcePoints()).toBe(1);
  });
});
