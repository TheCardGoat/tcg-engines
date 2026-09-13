import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { invertExistenceBlue } from "../instants/invert-existence.ts";
import { nimblismBlue } from "./nimblism.ts";
import { shadowOfBlasmophetRed } from "./shadow-of-blasmophet.ts";
import { dimenxxionalGatewayRed } from "./dimenxxional-gateway.ts";
import { dimenxxionalGatewayBlue } from "./dimenxxional-gateway.ts";
import { seepingShadowsRed } from "./seeping-shadows.ts";

describe("Dimenxxional Gateway (MON162) AAA", () => {
  it("happy: Opt 3 then revealing a Runeblade deals 1 arcane to the opposing hero", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [dimenxxionalGatewayRed],
        resourcePoints: 1,
        actionPoints: 1,
        deckTop: [nimblismBlue, nimblismBlue, nimblismBlue, invertExistenceBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(dimenxxionalGatewayRed, { optBottom: 3 });
    game.helpers.resolveUntilIdle({
      optionalBoolean: false,
      entityTargets: "minimum",
    });

    expectFabCard(Chane, dimenxxionalGatewayRed).toBeIn("graveyard");
    expectFabPlayer(Chane).toHaveAP(1);
    expectFabPlayer(Dash).toHaveLife(19);
    expect(Chane.cardsIn("deck", invertExistenceBlue)).toHaveLength(1);
  });

  it("boundary: revealing a non-Runeblade, non-Shadow card deals no damage and does not banish", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [dimenxxionalGatewayRed],
        resourcePoints: 1,
        actionPoints: 1,
        deckTop: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(dimenxxionalGatewayRed, { optBottom: 3 });
    game.helpers.resolveUntilIdle({
      optionalBoolean: false,
      entityTargets: "minimum",
    });

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Chane.cardsIn("deck", nimblismBlue)).toHaveLength(4);
    expect(Chane.zone("banished")).toHaveLength(0);
  });

  it("timing: revealing a Shadow card may banish it; declining leaves it on top", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [dimenxxionalGatewayRed],
        resourcePoints: 1,
        actionPoints: 1,
        deckTop: [nimblismBlue, nimblismBlue, nimblismBlue, shadowOfBlasmophetRed],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(dimenxxionalGatewayRed, { optBottom: 3 });
    game.helpers.resolveUntilIdle({
      optionalBoolean: false,
      entityTargets: "minimum",
    });

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Chane.cardsIn("deck", shadowOfBlasmophetRed)).toHaveLength(1);
  });

  it("happy: revealing a Shadow Runeblade deals 1 arcane and may banish it", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [dimenxxionalGatewayBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deckTop: [nimblismBlue, seepingShadowsRed],
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(dimenxxionalGatewayBlue);
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargets: "minimum",
    });

    expectFabPlayer(Dash).toHaveLife(19);
    expect(Chane.cardsIn("banished", seepingShadowsRed)).toHaveLength(1);
    expectFabCard(Chane, dimenxxionalGatewayBlue).toBeIn("graveyard");
    expectFabPlayer(Chane).toHaveAP(1);
  });
});
