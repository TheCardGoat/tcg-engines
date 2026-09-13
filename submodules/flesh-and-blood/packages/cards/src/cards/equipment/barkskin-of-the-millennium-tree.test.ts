import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { briar } from "../heroes/briar.ts";
import { autumnSTouchBlue } from "../actions/autumn-s-touch.ts";
import { snatchRed } from "../actions/snatch.ts";
import { barkskinOfTheMillenniumTree } from "./barkskin-of-the-millennium-tree.ts";

const fourEarth = [autumnSTouchBlue, autumnSTouchBlue, autumnSTouchBlue, autumnSTouchBlue] as const;

describe("Barkskin of the Millennium Tree (ROS028) AAA", () => {
  it("happy: defending with 4 Earth cards banished creates Embodiment of Earth", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: briar,
        chest: [barkskinOfTheMillenniumTree],
        banished: [...fourEarth],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Briar = game.as(briar);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Briar.defendWith(barkskinOfTheMillenniumTree);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-earth", 1).toHaveLife(18);
    expectFabCard(Briar, barkskinOfTheMillenniumTree).toBeIn("chest");
  });

  it("boundary: fewer than 4 Earth cards banished creates no token", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: briar,
        chest: [barkskinOfTheMillenniumTree],
        banished: [autumnSTouchBlue, autumnSTouchBlue, autumnSTouchBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Briar = game.as(briar);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Briar.defendWith(barkskinOfTheMillenniumTree);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-earth", 0).toHaveLife(18);
    expectFabCard(Briar, barkskinOfTheMillenniumTree).toBeIn("chest");
  });

  it("timing: Embodiment of Earth is created for the defending hero, not the attacker", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: briar,
        chest: [barkskinOfTheMillenniumTree],
        banished: [...fourEarth],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Briar = game.as(briar);

    Dash.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Briar.defendWith(barkskinOfTheMillenniumTree);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Briar).toHaveTokenCount("embodiment-of-earth", 1);
    expectFabPlayer(Dash).toHaveTokenCount("embodiment-of-earth", 0);
  });
});
