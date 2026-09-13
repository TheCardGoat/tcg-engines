import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zyggyStarlight } from "../heroes/zyggy-starlight.ts";
import { nimblismBlue } from "./nimblism.ts";
import { frayingLifeforceRed } from "./fraying-lifeforce.ts";

describe("Fraying Lifeforce (OMN007) AAA", () => {
  it("happy: whenever this fragments, gain 1{h}", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [frayingLifeforceRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.attackWith(frayingLifeforceRed);
    game.advanceCombatTo("defend");
    game.as(dash).defendWith(nimblismBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Zyggy).toHaveLife(21);
  });

  it("boundary: without a qualifying block this does not fragment and deals 7", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [frayingLifeforceRed],
        resourcePoints: 2,
        actionPoints: 1,
        life: 20,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(zyggyStarlight).attackWith(frayingLifeforceRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabPlayer(game.as(zyggyStarlight)).toHaveLife(20);
    expectFabCard(game.as(zyggyStarlight), frayingLifeforceRed).toBeIn("graveyard");
  });
});
