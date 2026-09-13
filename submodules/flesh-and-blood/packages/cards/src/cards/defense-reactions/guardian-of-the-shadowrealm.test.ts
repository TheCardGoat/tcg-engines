import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { levia } from "../heroes/levia.ts";
import { guardianOfTheShadowrealmRed } from "./guardian-of-the-shadowrealm.ts";

describe("Guardian of the Shadowrealm (MON192) AAA", () => {
  it("happy: Action {r}{r} from banished returns this to hand", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        banished: [guardianOfTheShadowrealmRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
        life: 20,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    expectFabCard(Levia, guardianOfTheShadowrealmRed).toBeBanished();
    Levia.activate(guardianOfTheShadowrealmRed);
    game.passBoth();

    expectFabCard(Levia, guardianOfTheShadowrealmRed).toBeIn("hand");
    expectFabPlayer(Levia).toHaveResourceCount(0);
    expectFabPlayer(Levia).toHaveAP(0);
  });

  it("boundary: cannot activate this from hand", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        hand: [guardianOfTheShadowrealmRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(levia).expectActivationRejected(guardianOfTheShadowrealmRed);
    expectFabCard(game.as(levia), guardianOfTheShadowrealmRed).toBeIn("hand");
  });

  it("timing: Blood Debt loses 1{h} at the end phase while this is banished", () => {
    const game = FabTestEngine.start(
      {
        hero: levia,
        banished: [guardianOfTheShadowrealmRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Levia = game.as(levia);

    expectFabCard(Levia, guardianOfTheShadowrealmRed).toBeBanished();
    Levia.endTurn();

    expectFabPlayer(Levia).toHaveLife(19);
    expectFabCard(Levia, guardianOfTheShadowrealmRed).toBeBanished();
  });
});
