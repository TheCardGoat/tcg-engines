import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { vynnset } from "../heroes/vynnset.ts";
import { bravo } from "../heroes/bravo.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { snatchRed } from "../actions/snatch.ts";
import { dyadicCarapace } from "./dyadic-carapace.ts";

describe("Dyadic Carapace (DTD211) AAA", () => {
  it("happy: pay 2 resources to prevent 2 of Voltic Bolt's 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: vynnset,
        life: 20,
        resourcePoints: 2,
        chest: [dyadicCarapace],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    game.as(blazeFiremind).play(volticBoltRed, { target: Vynnset.id });
    game.passBoth();
    const choice = Vynnset.expectDecision("option");
    Vynnset.chooseOptions(choice.options[0]!.id);

    expectFabPlayer(Vynnset).toHaveLife(17);
    expectFabPlayer(Vynnset).toHaveResourceCount(0);
    expectFabCard(Vynnset, dyadicCarapace).toBeIn("chest");
  });

  it("boundary: Temper d2 — first defend stays seated with a −1{d} counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: vynnset, life: 20, chest: [dyadicCarapace], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    game.as(bravo).attackWith(snatchRed);
    Vynnset.defendWith(dyadicCarapace);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Vynnset, dyadicCarapace).toBeIn("chest");
    expectFabCard(Vynnset, dyadicCarapace).toHaveDefenseCounters(-1);
    expectFabCard(Vynnset, dyadicCarapace).toHaveKeyword("temper");
    expectFabPlayer(Vynnset).toHaveLife(18);
  });
});
