import { describe, expect, it } from "vitest";

import { exudeConfidenceRed } from "../../../../../cards/src/cards/actions/exude-confidence.ts";
import { snatchRed } from "../../../../../cards/src/cards/actions/snatch.ts";
import { azalea } from "../../../../../cards/src/cards/heroes/azalea.ts";
import { dash } from "../../../../../cards/src/cards/heroes/dash.ts";
import { buildFabRulesView } from "../../state-rules-view.ts";
import { dependencyStages } from "../../continuous/compiler/dependencies.ts";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "../../../testing/index.ts";

describe("combat-chain-attack-count", () => {
  it("depends on stage 8 current power evaluation", () => {
    expect(
      dependencyStages({
        condition: {
          type: "combat-chain-attack-count",
          player: "controller",
          power: "greater-than-base",
          comparison: { op: "gte", value: 1 },
        },
      }),
    ).toEqual({ ok: true, stages: [8] });
  });

  it("captures above-base power after the Damage Step priority window", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [exudeConfidenceRed, snatchRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: azalea, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.playAttack(exudeConfidenceRed);
    game.toReaction("attacker");
    game.passBoth();
    Dash.activate(exudeConfidenceRed);
    game.passBoth();
    game.advanceCombatTo("resolution");
    Dash.playAttack(snatchRed);

    const view = buildFabRulesView(game.getState());
    expect(
      view.evaluateCondition(
        {
          type: "combat-chain-attack-count",
          player: "controller",
          power: "greater-than-base",
          comparison: { op: "gte", value: 1 },
        },
        {
          controllerId: Dash.id,
          source: null,
          bindings: { objects: {}, numbers: {}, strings: {} },
        },
      ),
    ).toBe(true);
  });
});
