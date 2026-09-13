import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { oscilio } from "../heroes/oscilio.ts";
import { dash } from "../heroes/dash.ts";
import { nucleusAetherboltRed } from "./nucleus-aetherbolt.ts";

describe("Nucleus Aetherbolt (OMN135) AAA", () => {
  it("happy: deals 3 arcane to the opposing hero", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [nucleusAetherboltRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6, hand: [] },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(nucleusAetherboltRed, { target: Dash.id });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Oscilio, nucleusAetherboltRed).toBeIn("graveyard");
  });

  it("boundary: declining the optional tap deals only the printed 3 arcane", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [nucleusAetherboltRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6, hand: [] },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(nucleusAetherboltRed, { target: Dash.id });
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Oscilio, oscilio).toBeReady();
  });

  it("timing: accepting the tap makes the hero deal 1 more arcane", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [nucleusAetherboltRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6, hand: [] },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);
    const Dash = game.as(dash);

    Oscilio.play(nucleusAetherboltRed, { target: Dash.id });
    game.helpers.resolveUntilIdle({
      optionalBoolean: true,
      entityTargetCanonicalId: dash.canonicalId,
    });

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Oscilio, oscilio).toBeTapped();
  });
});
