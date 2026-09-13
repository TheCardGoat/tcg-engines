import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { vynnset } from "../heroes/vynnset.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { tomeOfTormentRed } from "./tome-of-torment.ts";
import { tearThroughThePortalRed } from "./tear-through-the-portal.ts";

describe("Tear Through the Portal (DTD190) AAA", () => {
  it("happy: the chosen banished red action gets go again on a later play this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [tearThroughThePortalRed],
        banished: [tomeOfTormentRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);

    Vynnset.play(tearThroughThePortalRed);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: tomeOfTormentRed.canonicalId,
      optionalBoolean: false,
    });
    expectFabCard(Vynnset, tearThroughThePortalRed).toBeIn("graveyard");
    expectFabPlayer(Vynnset).toHaveAP(1);

    Vynnset.play(tomeOfTormentRed, { from: "banished" });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabCard(Vynnset, tomeOfTormentRed).toBeIn("graveyard");
    expectFabPlayer(Vynnset).toHaveAP(1);
  });

  it("boundary: without a banished red action the play is rejected", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [tearThroughThePortalRed],
        banished: [nimblismBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);
    const rejected = Vynnset.expectFailure({
      move: "begin-play",
      payload: { instanceId: Vynnset.findCardInZone("hand", tearThroughThePortalRed) },
    });
    expect(rejected.errorCode).toBeDefined();
    expectFabCard(Vynnset, tearThroughThePortalRed).toBeIn("hand");
  });

  it("timing: the go-again grant does not survive into the next turn", () => {
    const game = FabTestEngine.start(
      {
        hero: vynnset,
        hand: [tearThroughThePortalRed],
        banished: [tomeOfTormentRed],
        actionPoints: 1,
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Vynnset = game.as(vynnset);
    const Dash = game.as(dash);

    Vynnset.play(tearThroughThePortalRed);
    game.helpers.resolveUntilIdle({
      entityTargetCanonicalId: tomeOfTormentRed.canonicalId,
      optionalBoolean: false,
    });
    Vynnset.endTurn();
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    Dash.endTurn();
    game.helpers.resolveUntilIdle({
      optionalBoolean: false,
      entityTargetCanonicalId: nimblismBlue.canonicalId,
    });

    Vynnset.play(tomeOfTormentRed, { from: "banished" });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });
    expectFabCard(Vynnset, tomeOfTormentRed).toBeIn("graveyard");
    expectFabPlayer(Vynnset).toHaveAP(0);
  });
});
