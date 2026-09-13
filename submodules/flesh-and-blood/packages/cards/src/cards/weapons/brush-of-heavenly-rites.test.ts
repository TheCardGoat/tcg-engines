import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { proclamationOfAbundance } from "../equipment/proclamation-of-abundance.ts";
import { brushOfHeavenlyRites } from "./brush-of-heavenly-rites.ts";

describe("Brush of Heavenly Rites (JDG030) AAA", () => {
  it("happy: pay 2 to equip a Proclamation off-hand from inventory", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [brushOfHeavenlyRites],
        inventory: [proclamationOfAbundance],
        hand: [],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(brushOfHeavenlyRites);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabCard(Bravo, proclamationOfAbundance).toBeIn("weapon2");
  });

  it("boundary: empty inventory still spends the Action", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon1: [brushOfHeavenlyRites],
        inventory: [],
        hand: [],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(brushOfHeavenlyRites);
    game.untilIdle({ entityTargets: "minimum" });
    expectFabCard(Bravo, brushOfHeavenlyRites).toBeIn("weapon1");
  });
});
