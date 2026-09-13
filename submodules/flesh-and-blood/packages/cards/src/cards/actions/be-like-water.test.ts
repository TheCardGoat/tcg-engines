import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { benjiThePiercingWind } from "../heroes/benji-the-piercing-wind.ts";
import { iraCrimsonHaze } from "../heroes/ira-crimson-haze.ts";
import { dash } from "../heroes/dash.ts";
import { descendentGustwaveRed } from "./descendent-gustwave.ts";
import { beLikeWaterRed } from "./be-like-water.ts";

/**
 * Action behavior acceptance test — Be Like Water, Red (KAT014).
 */

describe("Be Like Water, Red (KAT014) AAA", () => {
  it("happy: base play — costs 0{r}, deals 3 damage, go again", () => {
    const game = FabTestEngine.start(
      {
        hero: benjiThePiercingWind,
        hand: [beLikeWaterRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Benji = game.as(benjiThePiercingWind);

    Benji.play(beLikeWaterRed);
    game.untilIdle({ optionals: "decline", ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(17);
    expectFabPlayer(Benji).toHaveAP(1);
  });

  it("boundary: on hit with no resources — cannot pay to choose name", () => {
    const game = FabTestEngine.start(
      {
        hero: benjiThePiercingWind,
        hand: [beLikeWaterRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Benji = game.as(benjiThePiercingWind);

    Benji.play(beLikeWaterRed);
    game.untilIdle({ optionals: "accept", ordering: "listed" });

    expectFabPlayer(game.as(dash)).toHaveLife(17);
  });

  // Deferred from intent-verb migration: asserts mid-combat Combo state and
  // uses advanceCombatTo("resolution"); the intent API has no resolution-step
  // stop, so the legacy step advance is retained here. (happy/boundary migrated.)
  it("timing: paying {r} and choosing Surging Strike grants that name for Combo", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        hand: [beLikeWaterRed, descendentGustwaveRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);

    Ira.play(beLikeWaterRed);
    game.advanceToDecision(Ira, "boolean");
    Ira.chooseBoolean(true);
    expect(Ira.expectDecision("effect-resolution").options.map((option) => option.id)).toEqual([
      "Head Jab",
      "Surging Strike",
      "Twin Twisters",
    ]);
    game.answerDecision(Ira.id, { kind: "effect-resolution", optionId: "Surging Strike" });
    game.advanceCombatTo("resolution");

    expectFabCard(Ira, beLikeWaterRed).toHaveName("Be Like Water").toHaveName("Surging Strike");
    game.helpers.expectLog("flesh-and-blood.gain-name", {
      cardName: "Be Like Water",
      gainedName: "Surging Strike",
    });

    Ira.play(descendentGustwaveRed);
    game.passBoth();

    // Combo +2 and Ira's second-attack +1 on printed 3.
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
  });
});
