import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { aetherstormWellingtons } from "./aetherstorm-wellingtons.ts";

describe("Aetherstorm Wellingtons (PEN110) AAA", () => {
  it("happy: pay 2 resources to prevent 2 of Voltic Bolt's 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: oscilio,
        life: 18,
        resourcePoints: 2,
        legs: [aetherstormWellingtons],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Defender = game.as(oscilio);

    game.as(blazeFiremind).play(volticBoltRed, { target: Defender.id });
    game.passBoth();
    const choice = Defender.expectDecision("option");
    Defender.chooseOptions(choice.options[0]!.id);

    expectFabPlayer(Defender).toHaveLife(15);
    expectFabPlayer(Defender).toHaveResourceCount(0);
    expectFabCard(Defender, aetherstormWellingtons).toBeIn("legs");
  });

  it("boundary: declining Arcane Barrier 2 takes the full 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: oscilio,
        life: 18,
        resourcePoints: 2,
        legs: [aetherstormWellingtons],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Defender = game.as(oscilio);

    game.as(blazeFiremind).play(volticBoltRed, { target: Defender.id });
    game.passBoth();
    Defender.expectDecision("option");
    Defender.chooseOptions();

    expectFabPlayer(Defender).toHaveLife(13);
    expectFabPlayer(Defender).toHaveResourceCount(2);
  });
});
