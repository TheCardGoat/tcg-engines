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
import { fryRed } from "../actions/fry.ts";
import { cloudCoverRed } from "./cloud-cover.ts";
import { electrostaticDischargeRed } from "./electrostatic-discharge.ts";
import { astralBridgeRed } from "./astral-bridge.ts";

describe("Astral Bridge (OMN098) AAA", () => {
  it("happy: mills the top card of your deck", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [astralBridgeRed], deck: [fryRed] },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.play(astralBridgeRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Oscilio, fryRed).toBeIn("graveyard");
    expectFabCard(Oscilio, astralBridgeRed).toBeIn("graveyard");
  });

  it("boundary: milling a non-instant does not enable Starfall", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [astralBridgeRed], deck: [fryRed] },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(astralBridgeRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("Starfall deals 1 arcane after milling an instant", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [astralBridgeRed], deck: [cloudCoverRed] },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(astralBridgeRed, { target: Dash });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Oscilio, cloudCoverRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveLife(19);
    expectFabCard(Oscilio, astralBridgeRed).toBeIn("graveyard");
  });
});

// CR 3.0.9: returning to the graveyard creates a new object, so the
// permission for the milled instant must not authorize a second play.
describe("Astral Bridge graveyard permission lifetime", () => {
  it("allows the milled instant once but not its new graveyard incarnation", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [astralBridgeRed], deck: [electrostaticDischargeRed] },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);
    Oscilio.play(astralBridgeRed, { target: Dash });
    game.untilIdle({ optionals: "accept", entityTargets: "minimum", ordering: "listed" });
    Oscilio.play(electrostaticDischargeRed, { from: "graveyard" });
    game.untilIdle({ optionals: "accept", entityTargets: "minimum", ordering: "listed" });
    expectFabCard(Oscilio, electrostaticDischargeRed).toBeIn("graveyard");
    expectFabUnplayable(
      () => Oscilio.play(electrostaticDischargeRed, { from: "graveyard" }),
      /Playing from the graveyard requires.*permission effect/i,
    );
  });
});
