import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { hala } from "../heroes/hala.ts";
import { dash } from "../heroes/dash.ts";
import { halaBladesaintOfTheVow } from "../heroes/hala-bladesaint-of-the-vow.ts";
import { zenithBlade } from "../weapons/zenith-blade.ts";
import { snatchRed } from "../actions/snatch.ts";
import { cashOutBlue } from "../actions/cash-out.ts";
import { edgeLadenPlate } from "./edge-laden-plate.ts";

// Card Vault MPW014; CR 8.5.58a distinguishes player and card history.
describe("Edge Laden Plate", () => {
  function setup() {
    const game = FabTestEngine.start(
      {
        hero: halaBladesaintOfTheVow,
        chest: [edgeLadenPlate],
        weapon1: [zenithBlade],
        hand: [cashOutBlue],
        resourcePoints: 5,
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      {
        hero: dash,
        hand: [],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: halaBladesaintOfTheVow },
    );
    return { game, Hala: game.as(halaBladesaintOfTheVow), Dash: game.as(dash) };
  }

  it("gains exactly one resource after its player sharpens a sword", () => {
    const { game, Hala } = setup();
    Hala.activate(halaBladesaintOfTheVow);
    Hala.target(zenithBlade);
    game.untilIdle();
    Hala.activate(edgeLadenPlate);
    expectFabCard(Hala, edgeLadenPlate).toBeIn("graveyard");
    expectFabPlayer(Hala).toHaveResourceCount(2);
    game.untilIdle();
    expectFabCard(Hala, edgeLadenPlate).toBeIn("graveyard");
    expectFabPlayer(Hala).toHaveResourceCount(3).toHaveAP(1);
  });

  it("rejects activation before sharpening without destroying the plate", () => {
    const { Hala } = setup();
    expectFabUnplayable(() => Hala.activate(edgeLadenPlate), /condition/i);
    expectFabCard(Hala, edgeLadenPlate).toBeIn("chest");
    expectFabPlayer(Hala).toHaveResourceCount(5);
  });

  it("remembers sharpening after Cash Out destroys the sword", () => {
    const { game, Hala } = setup();
    Hala.activate(halaBladesaintOfTheVow);
    Hala.target(zenithBlade);
    game.untilIdle();
    game.playInstance(Hala.id, Hala.cardIn("hand", cashOutBlue).instanceId, {}, "explicit");
    Hala.accept();
    Hala.target(zenithBlade);
    game.untilIdle();
    expectFabCard(Hala, zenithBlade).toBeIn("graveyard");
    Hala.activate(edgeLadenPlate);
    expectFabCard(Hala, edgeLadenPlate).toBeIn("graveyard");
    expectFabPlayer(Hala).toHaveResourceCount(2);
    game.untilIdle();
    expectFabCard(Hala, edgeLadenPlate).toBeIn("graveyard");
    expectFabPlayer(Hala).toHaveResourceCount(3).toHaveTokenCount("silver", 1).toHaveAP(1);
  });

  it("does not carry its player's sharpening into the next turn", () => {
    const { game, Hala, Dash } = setup();
    Hala.activate(halaBladesaintOfTheVow);
    Hala.target(zenithBlade);
    game.untilIdle();
    Hala.endTurn();
    Dash.endTurn();
    expectFabUnplayable(() => Hala.activate(edgeLadenPlate), /condition/i);
    expectFabCard(Hala, edgeLadenPlate).toBeIn("chest");
    expectFabPlayer(Hala).toHaveResourceCount(0);
  });

  it("does not count the opponent sharpening a sword", () => {
    const game = FabTestEngine.start(
      {
        hero: hala,
        weapon1: [zenithBlade],
        resourcePoints: 4,
        hand: [],
        deck: [snatchRed, snatchRed],
      },
      {
        hero: halaBladesaintOfTheVow,
        chest: [edgeLadenPlate],
        weapon1: [zenithBlade],
        resourcePoints: 0,
        hand: [],
        deck: [snatchRed, snatchRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: hala },
    );
    const Opponent = game.as(hala);
    const Controller = game.as(halaBladesaintOfTheVow);
    Opponent.activate(hala);
    Opponent.target(zenithBlade);
    game.untilIdle();
    Opponent.activateAttack(zenithBlade);
    Controller.defendWith();
    game.toReaction("defender");
    expectFabUnplayable(() => Controller.activate(edgeLadenPlate), /condition/i);
    expectFabCard(Controller, edgeLadenPlate).toBeIn("chest");
    expectFabPlayer(Controller).toHaveResourceCount(0);
  });

  it.each([true, false])("Battleworn after chain closure: plate defended = %s", (defended) => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: [cashOutBlue, snatchRed] },
      {
        hero: halaBladesaintOfTheVow,
        life: 20,
        chest: [edgeLadenPlate],
        hand: [],
        deck: [snatchRed, snatchRed],
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Hala = game.as(halaBladesaintOfTheVow);
    Dash.playAttack(snatchRed);
    if (defended) Hala.defendWith(edgeLadenPlate);
    else Hala.defendWith();
    game.toReaction("attacker");
    expectFabCard(Hala, edgeLadenPlate).toHaveDefenseCounters(0);
    game.closeCombat();
    expectFabPlayer(Hala).toHaveLife(defended ? 17 : 16);
    expectFabCard(Hala, edgeLadenPlate)
      .toBeIn("chest")
      .toHaveDefenseCounters(defended ? -1 : 0)
      .toHaveDefense(defended ? 0 : 1);
  });
});
