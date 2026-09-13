import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { cindra } from "../heroes/cindra.ts";
import { huntToTheEndsOfRatheRed } from "./hunt-to-the-ends-of-rathe.ts";
import { markWithMagmaRed } from "./mark-with-magma.ts";
import { nimblismBlue } from "./nimblism.ts";

describe("Mark with Magma (CIN016) AAA", () => {
  it("happy: after two Draconic links a hit marks the defending hero", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        hand: [huntToTheEndsOfRatheRed, huntToTheEndsOfRatheRed, markWithMagmaRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Cindra = game.as(cindra);
    const Dash = game.as(dash);

    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(markWithMagmaRed);
    game.closeCombat();
    expectFabPlayer(Dash).toBeMarked();
    expectFabPlayer(Cindra).toHaveAP(1);
  });

  it("boundary: a fully defended qualified attack does not mark", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        hand: [huntToTheEndsOfRatheRed, huntToTheEndsOfRatheRed, markWithMagmaRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Cindra = game.as(cindra);
    const Dash = game.as(dash);

    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(huntToTheEndsOfRatheRed);
    game.advanceCombatTo("resolution");
    Cindra.attackWith(markWithMagmaRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([nimblismBlue, nimblismBlue]);
    game.closeCombat();
    expectFabPlayer(Dash).notToBeMarked();
  });

  it("timing: before two Draconic links a hit does not mark", () => {
    const game = FabTestEngine.start(
      {
        hero: cindra,
        hand: [markWithMagmaRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Cindra = game.as(cindra);
    const Dash = game.as(dash);

    Cindra.attackWith(markWithMagmaRed);
    game.closeCombat();
    expectFabPlayer(Dash).notToBeMarked();
  });
});
