import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { cloudCoverRed } from "../instants/cloud-cover.ts";
import { cometCollisionRed } from "./comet-collision.ts";

describe("Comet Collision (OMN109/110/111) AAA", () => {
  it("happy: deals 3 arcane when no instant entered the graveyard this turn", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [cometCollisionRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(cometCollisionRed, { target: Dash });
    game.passBoth();
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabPlayer(Oscilio).toHaveAP(0);
    expectFabCard(Oscilio, cometCollisionRed).toBeIn("graveyard");
  });

  it("boundary: cannot be played without an action point", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [cometCollisionRed], actionPoints: 0, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    expectFabUnplayable(
      () => Oscilio.play(cometCollisionRed, { target: Dash }),
      /action-point cost cannot be paid/i,
    );

    expectFabCard(Oscilio, cometCollisionRed).toBeIn("hand");
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("boundary: Starfall replaces the damage with 4 after an instant hits the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [cloudCoverRed, cometCollisionRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(cloudCoverRed);
    game.passBoth();
    expectFabCard(Oscilio, cloudCoverRed).toBeIn("graveyard");

    Oscilio.play(cometCollisionRed, { target: Dash });
    game.passBoth();
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Oscilio, cometCollisionRed).toBeIn("graveyard");
  });

  it("timing: an instant already in the graveyard from a prior turn is not Starfall", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [cometCollisionRed],
        graveyard: [cloudCoverRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(cometCollisionRed, { target: Dash });
    game.passBoth();
    game.passBoth();

    expectFabPlayer(Dash).toHaveLife(17);
  });
});
