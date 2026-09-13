import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { goodNaturedBrutalityYellow } from "./good-natured-brutality.ts";

describe("Good Natured Brutality (SUP004) AAA", () => {
  it("happy: when this defends with no cards in hand, it gets +6{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: tuffnut, hand: [goodNaturedBrutalityYellow], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Tuffnut = game.as(tuffnut);

    Dash.attackWith(brutalAssaultBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.advanceCombatTo("defend");
    Tuffnut.defendWith(goodNaturedBrutalityYellow);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Tuffnut).toHaveLife(20);
    expectFabCard(Tuffnut, goodNaturedBrutalityYellow).toBeIn("graveyard");
  });

  it("boundary: when this defends with a card still in hand, it stays at printed 0{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: tuffnut, hand: [goodNaturedBrutalityYellow, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Tuffnut = game.as(tuffnut);

    Dash.attackWith(brutalAssaultBlue);
    game.advanceCombatTo("defend");
    Tuffnut.defendWith(goodNaturedBrutalityYellow);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Tuffnut).toHaveLife(16);
    expectFabCard(Tuffnut, nimblismBlue).toBeIn("hand");
  });
});
