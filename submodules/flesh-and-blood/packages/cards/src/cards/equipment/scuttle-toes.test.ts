import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { scuttleToes } from "./scuttle-toes.ts";

describe("Scuttle Toes (PEN155) AAA", () => {
  it("happy: pay 1 resource to prevent 1 of Voltic Bolt's 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: gravyBones, life: 20, resourcePoints: 1, legs: [scuttleToes], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Defender = game.as(gravyBones);

    expectFabCard(Defender, scuttleToes).toHaveKeyword("arcane-barrier");

    game.as(blazeFiremind).play(volticBoltRed, { target: Defender.id });
    game.passBoth();
    const choice = Defender.expectDecision("option");
    Defender.chooseOptions(choice.options[0]!.id);

    expectFabPlayer(Defender).toHaveLife(16);
    expectFabPlayer(Defender).toHaveResourceCount(0);
    expectFabCard(Defender, scuttleToes).toBeIn("legs");
  });

  it("boundary: declining Arcane Barrier takes the full 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: gravyBones, life: 20, resourcePoints: 1, legs: [scuttleToes], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Defender = game.as(gravyBones);

    game.as(blazeFiremind).play(volticBoltRed, { target: Defender.id });
    game.passBoth();
    Defender.expectDecision("option");
    Defender.chooseOptions();

    expectFabPlayer(Defender).toHaveLife(15);
    expectFabPlayer(Defender).toHaveResourceCount(1);
  });
});
