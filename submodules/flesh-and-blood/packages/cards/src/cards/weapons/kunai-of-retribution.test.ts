import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { benjiThePiercingWind } from "../heroes/benji-the-piercing-wind.ts";
import { kunaiOfRetribution } from "./kunai-of-retribution.ts";

describe("Kunai of Retribution (CIN002) AAA", () => {
  it("happy: the attack hits, then the kunai is destroyed when the chain closes", () => {
    const game = FabTestEngine.start(
      {
        hero: benjiThePiercingWind,
        weapon1: [kunaiOfRetribution],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Benji = game.as(benjiThePiercingWind);

    Benji.activate(kunaiOfRetribution);
    game.passBoth();
    game.advanceCombatTo("defend");

    expect(game.combat()?.activeLink?.attackPower).toBe(1);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");

    game.helpers.resolveRestOfCombat();

    expectFabCard(Benji, kunaiOfRetribution).toBeIn("graveyard");
    expect(Benji.actionPoints()).toBe(1);
  });

  it("boundary: the attack is still 1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: benjiThePiercingWind,
        weapon1: [kunaiOfRetribution],
        hand: [],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(benjiThePiercingWind).activate(kunaiOfRetribution);
    game.passBoth();
    game.advanceCombatTo("defend");

    expect(game.combat()?.activeLink?.attackPower).toBe(1);
  });

  it("timing: once per turn — a second activation is rejected while the chain is closed", () => {
    const game = FabTestEngine.start(
      {
        hero: benjiThePiercingWind,
        weapon1: [kunaiOfRetribution],
        resourcePoints: 2,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Benji = game.as(benjiThePiercingWind);

    Benji.activate(kunaiOfRetribution);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Benji, kunaiOfRetribution).toBeIn("graveyard");
    Benji.expectActivationRejected(kunaiOfRetribution);
  });
});
