import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { cosmicFlareRed } from "./cosmic-flare.ts";
import { blinkBlue } from "./blink.ts";

describe("Blink (ELE176) AAA", () => {
  it("happy: playing Blink grants 1 action point and spends none", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [blinkBlue], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.play(blinkBlue);
    game.passBoth();

    expectFabPlayer(Oscilio).toHaveAP(2);
    expectFabCard(Oscilio, blinkBlue).toBeIn("graveyard");
  });

  it("boundary: a resource instant does not grant an action point", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [cosmicFlareRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.play(cosmicFlareRed);
    game.passBoth();

    expectFabPlayer(Oscilio).toHaveAP(1);
    expectFabPlayer(Oscilio).toHaveResourceCount(3);
  });
});
