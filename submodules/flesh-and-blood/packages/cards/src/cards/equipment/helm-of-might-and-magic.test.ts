import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { helmOfMightAndMagic } from "./helm-of-might-and-magic.ts";

describe("Helm of Might and Magic (PEN093) AAA", () => {
  it("happy: Spellvoid 1 destroys this to prevent 1 of Voltic Bolt's 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: viserai, life: 20, head: [helmOfMightAndMagic], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    expectFabCard(Viserai, helmOfMightAndMagic).toHaveKeyword("spellvoid");
    expectFabCard(Viserai, helmOfMightAndMagic).toHaveKeyword("blade-break");

    game.as(blazeFiremind).play(volticBoltRed, { target: Viserai.id });
    game.passBoth();
    const choice = Viserai.expectDecision("option");
    Viserai.chooseOptions(choice.options[0]!.id);

    expectFabPlayer(Viserai).toHaveLife(16);
    expectFabCard(Viserai, helmOfMightAndMagic).toBeIn("graveyard");
  });

  it("boundary: declining Spellvoid takes the full 5 arcane and the helm stays", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: viserai, life: 20, head: [helmOfMightAndMagic], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    game.as(blazeFiremind).play(volticBoltRed, { target: Viserai.id });
    game.passBoth();
    Viserai.expectDecision("option");
    Viserai.chooseOptions();

    expectFabPlayer(Viserai).toHaveLife(15);
    expectFabCard(Viserai, helmOfMightAndMagic).toBeIn("head");
  });

  it("keyword: Blade Break destroys the helm after it defends", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, head: [helmOfMightAndMagic], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(helmOfMightAndMagic);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Dash, helmOfMightAndMagic).toBeIn("graveyard");
  });
});
