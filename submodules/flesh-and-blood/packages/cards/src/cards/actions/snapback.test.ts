import { snapbackBlue } from "./snapback.ts";
import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { oscilio } from "../heroes/oscilio.ts";
import { dash } from "../heroes/dash.ts";
import { volticBoltRed } from "./voltic-bolt.ts";
import { snatchRed } from "./snatch.ts";
import { snapbackRed } from "./snapback.ts";

describe("Snapback (CRU174) AAA", () => {
  it("happy: deals 3 arcane damage to the opposing hero", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [snapbackRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(snapbackRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Oscilio, snapbackRed).toBeIn("graveyard");
  });

  it("boundary: cannot be played as an instant before another Wizard non-attack", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [snapbackRed], resourcePoints: 1, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.attackWith(snatchRed);
    const rejected = Dash.expectFailure({
      move: "begin-play",
      payload: { instanceId: Dash.findCardInZone("hand", snapbackRed) },
    });
    expect(rejected.errorCode).toBeDefined();
    expectFabCard(Dash, snapbackRed).toBeIn("hand");
  });

  it("timing: after another Wizard non-attack this turn a second Snapback still deals 3", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [volticBoltRed, snapbackRed],
        resourcePoints: 3,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(volticBoltRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();
    Oscilio.play(snapbackRed, { target: Dash.id });
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Dash).toHaveLife(12);
  });

  it("happy: deals 1 arcane damage to the opposing hero", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [snapbackBlue],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(snapbackBlue, { target: Dash.id });
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Dash).toHaveLife(19);
    expectFabCard(Oscilio, snapbackBlue).toBeIn("graveyard");
  });
});
