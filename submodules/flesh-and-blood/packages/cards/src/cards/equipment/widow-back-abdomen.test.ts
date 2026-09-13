import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { uzuri } from "../heroes/uzuri.ts";
import { widowBackAbdomen } from "./widow-back-abdomen.ts";

describe("Widow Back Abdomen (ROS240) AAA", () => {
  it("happy: pay 1 resource to prevent 1 of Voltic Bolt's arcane damage", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: uzuri,
        life: 20,
        resourcePoints: 1,
        chest: [widowBackAbdomen],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);

    game.as(blazeFiremind).play(volticBoltRed, { target: Uzuri.id });
    game.passBoth();
    const choice = Uzuri.expectDecision("option");
    const barrier = choice.options.find((option) => option.id.includes("arcane-barrier"));
    Uzuri.chooseOptions(barrier?.id ?? choice.options[0]!.id);

    expectFabPlayer(Uzuri).toHaveLife(16);
    expectFabPlayer(Uzuri).toHaveResourceCount(0);
    expectFabCard(Uzuri, widowBackAbdomen).toBeIn("chest");
  });

  it("boundary: Spellvoid destroys the abdomen and prevents 1 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: uzuri,
        life: 20,
        resourcePoints: 1,
        chest: [widowBackAbdomen],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);

    game.as(blazeFiremind).play(volticBoltRed, { target: Uzuri.id });
    game.passBoth();
    const choice = Uzuri.expectDecision("option");
    const spellvoid = choice.options.find((option) => option.id.includes("spellvoid"));
    Uzuri.chooseOptions(spellvoid?.id ?? choice.options[0]!.id);

    expectFabPlayer(Uzuri).toHaveLife(16);
    expectFabCard(Uzuri, widowBackAbdomen).toBeIn("graveyard");
  });

  it("timing: declining both preventions takes the full 5 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: blazeFiremind,
        hand: [volticBoltRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: uzuri,
        life: 20,
        resourcePoints: 1,
        chest: [widowBackAbdomen],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Uzuri = game.as(uzuri);

    game.as(blazeFiremind).play(volticBoltRed, { target: Uzuri.id });
    game.passBoth();
    Uzuri.expectDecision("option");
    Uzuri.chooseOptions();

    expectFabPlayer(Uzuri).toHaveLife(15);
    expectFabCard(Uzuri, widowBackAbdomen).toHaveKeyword("arcane-barrier");
    expectFabCard(Uzuri, widowBackAbdomen).toHaveKeyword("spellvoid");
  });
});
