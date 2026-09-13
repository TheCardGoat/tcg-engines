import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dromai } from "../heroes/dromai.ts";
import { aetherAshwing } from "./aether-ashwing.ts";

function allyArcaneBarrierId(player: ReturnType<FabTestEngine["as"]>): string {
  const choice = player.expectDecision("option");
  const ashId = player.findCardInZone("arena", aetherAshwing);
  const barrier = choice.options.find(
    (option) => option.id.includes("arcane-barrier") && option.id.includes(ashId),
  );
  expect(barrier).toBeDefined();
  return barrier!.id;
}

describe("Aether Ashwing (DRO003) AAA", () => {
  it("happy: the ally's Arcane Barrier 1 prevents 1 of Voltic Bolt's 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: dromai,
        life: 20,
        resourcePoints: 1,
        arena: [aetherAshwing],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    game.as(blazeFiremind).play(volticBoltRed, { target: Dromai.id });
    game.passBoth();
    Dromai.chooseOptions(allyArcaneBarrierId(Dromai));

    expectFabPlayer(Dromai).toHaveLife(16);
    expectFabPlayer(Dromai).toHaveResourceCount(0);
    expectFabCard(Dromai, aetherAshwing).toBeIn("arena");
    expectFabCard(Dromai, aetherAshwing).toHaveKeyword("arcane-barrier");
  });

  it("boundary: declining the ally's Arcane Barrier takes the full 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: dromai,
        life: 20,
        resourcePoints: 1,
        arena: [aetherAshwing],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    game.as(blazeFiremind).play(volticBoltRed, { target: Dromai.id });
    game.passBoth();
    expect(allyArcaneBarrierId(Dromai)).toContain("arcane-barrier");
    Dromai.chooseOptions();

    expectFabPlayer(Dromai).toHaveLife(15);
    expectFabPlayer(Dromai).toHaveResourceCount(1);
    expectFabCard(Dromai, aetherAshwing).toBeIn("arena");
  });

  it("timing: with 0 resources the ally cannot pay and the hero takes 5", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      {
        hero: dromai,
        life: 20,
        resourcePoints: 0,
        arena: [aetherAshwing],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dromai = game.as(dromai);

    game.as(blazeFiremind).play(volticBoltRed, { target: Dromai.id });
    game.passBoth();

    expectFabPlayer(Dromai).toHaveLife(15);
    expectFabCard(Dromai, aetherAshwing).toBeIn("arena");
  });
});
