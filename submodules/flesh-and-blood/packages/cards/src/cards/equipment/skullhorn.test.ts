import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { snatchRed } from "../actions/snatch.ts";
import { skullhorn } from "./skullhorn.ts";

describe("Skullhorn (CRU006) AAA", () => {
  it("happy: pay 2 resources to prevent 2 of Voltic Bolt's 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: rhinar, life: 20, resourcePoints: 2, head: [skullhorn], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Defender = game.as(rhinar);

    expectFabCard(Defender, skullhorn).toHaveKeyword("arcane-barrier");

    game.as(blazeFiremind).play(volticBoltRed, { target: Defender.id });
    game.passBoth();
    const choice = Defender.expectDecision("option");
    Defender.chooseOptions(choice.options[0]!.id);

    expectFabPlayer(Defender).toHaveLife(17);
    expectFabPlayer(Defender).toHaveResourceCount(0);
    expectFabCard(Defender, skullhorn).toBeIn("head");
  });

  it("boundary: declining Arcane Barrier 2 takes the full 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: rhinar, life: 20, resourcePoints: 2, head: [skullhorn], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Defender = game.as(rhinar);

    game.as(blazeFiremind).play(volticBoltRed, { target: Defender.id });
    game.passBoth();
    Defender.expectDecision("option");
    Defender.chooseOptions();

    expectFabPlayer(Defender).toHaveLife(15);
    expectFabPlayer(Defender).toHaveResourceCount(2);
  });

  it("happy: Action destroy this draws, discards random, and go again", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        head: [skullhorn],
        hand: [snatchRed],
        actionPoints: 1,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { hero: dash, deck: 6 },
    );
    const Rhinar = game.as(rhinar);

    Rhinar.must.activate(skullhorn);

    expectFabCard(Rhinar, skullhorn).toBeIn("graveyard");
    expectFabPlayer(Rhinar).toHaveHandCount(1);
    expectFabPlayer(Rhinar).toHaveAP(1);
  });
});
