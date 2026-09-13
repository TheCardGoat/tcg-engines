import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { bravo } from "../heroes/bravo.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { enclosedFiremind } from "./enclosed-firemind.ts";

describe("Enclosed Firemind (PEN016) AAA", () => {
  it("happy: pay 1 resource to prevent 1 of Voltic Bolt's 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, resourcePoints: 1, head: [enclosedFiremind], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(blazeFiremind).play(volticBoltRed, { target: Bravo.id });
    game.passBoth();
    Bravo.choose("arcane-barrier");

    expectFabPlayer(Bravo).toHaveLife(16);
    expectFabPlayer(Bravo).toHaveResourceCount(0);
    expectFabCard(Bravo, enclosedFiremind).toBeIn("head");
  });

  it("boundary: declining Arcane Barrier takes the full 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, resourcePoints: 1, head: [enclosedFiremind], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(blazeFiremind).play(volticBoltRed, { target: Bravo.id });
    game.passBoth();
    Bravo.expectDecision("option");
    Bravo.chooseOptions();

    expectFabPlayer(Bravo).toHaveLife(15);
    expectFabPlayer(Bravo).toHaveResourceCount(1);
    expectFabCard(Bravo, enclosedFiremind).toBeIn("head");
  });

  it("timing: with 0 resources Arcane Barrier is not offered and the hero takes 5", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: bravo, life: 20, resourcePoints: 0, head: [enclosedFiremind], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(blazeFiremind).play(volticBoltRed, { target: Bravo.id });
    game.passBoth();

    expectFabPlayer(Bravo).toHaveLife(15);
    expectFabCard(Bravo, enclosedFiremind).toBeIn("head");
  });
});
