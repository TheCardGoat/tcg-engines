import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { shamanicShinbones } from "./shamanic-shinbones.ts";

describe("Shamanic Shinbones (PEN005) AAA", () => {
  it("happy: pay 1 resource to prevent 1 of Voltic Bolt's 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: rhinar, life: 20, resourcePoints: 1, legs: [shamanicShinbones], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    game.as(blazeFiremind).play(volticBoltRed, { target: Rhinar.id });
    game.passBoth();
    Rhinar.choose("arcane-barrier");

    expectFabPlayer(Rhinar).toHaveLife(16);
    expectFabPlayer(Rhinar).toHaveResourceCount(0);
    expectFabCard(Rhinar, shamanicShinbones).toBeIn("legs");
  });

  it("boundary: declining Arcane Barrier takes the full 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: rhinar, life: 20, resourcePoints: 1, legs: [shamanicShinbones], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    game.as(blazeFiremind).play(volticBoltRed, { target: Rhinar.id });
    game.passBoth();
    Rhinar.expectDecision("option");
    Rhinar.chooseOptions();

    expectFabPlayer(Rhinar).toHaveLife(15);
    expectFabPlayer(Rhinar).toHaveResourceCount(1);
    expectFabCard(Rhinar, shamanicShinbones).toBeIn("legs");
  });

  it("timing: with 0 resources Arcane Barrier is not offered and the hero takes 5", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: rhinar, life: 20, resourcePoints: 0, legs: [shamanicShinbones], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    game.as(blazeFiremind).play(volticBoltRed, { target: Rhinar.id });
    game.passBoth();

    expectFabPlayer(Rhinar).toHaveLife(15);
    expectFabCard(Rhinar, shamanicShinbones).toBeIn("legs");
  });
});
