import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { briar } from "../shared/test-recipients.ts";
import { dash } from "../heroes/dash.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { snatchRed } from "./snatch.ts";
import { fellingOfTheCrownRed } from "./felling-of-the-crown.ts";

describe("Felling of the Crown (ROS031) AAA", () => {
  it("happy: 4 Earth cards in banished give this +4 power", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [fellingOfTheCrownRed],
        banished: [autumnSTouchBlue, autumnSTouchBlue, autumnSTouchBlue, autumnSTouchBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(fellingOfTheCrownRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(8);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(12);
    expectFabCard(Briar, fellingOfTheCrownRed).toBeIn("graveyard");
  });

  it("boundary: fewer than 4 Earth cards in banished stay at printed 4 power", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [fellingOfTheCrownRed],
        banished: [autumnSTouchBlue, autumnSTouchBlue, autumnSTouchBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(fellingOfTheCrownRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("timing: declining decompose leaves both hands untouched", () => {
    const game = FabTestEngine.start(
      {
        hero: briar,
        hand: [fellingOfTheCrownRed, snatchRed],
        graveyard: [autumnSTouchBlue, autumnSTouchBlue, autumnSTouchBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Briar = game.as(briar);

    Briar.attackWith(fellingOfTheCrownRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Briar.zone("graveyard")).toHaveLength(4);
    expectFabPlayer(Briar).toHaveHandCount(1);
    expectFabPlayer(game.as(dash)).toHaveHandCount(1);
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });
});
