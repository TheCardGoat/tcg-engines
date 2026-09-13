import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { blinkBlue } from "./blink.ts";
import { cosmicFlareRed } from "./cosmic-flare.ts";

describe("Cosmic Flare (OMN187) AAA", () => {
  it("happy: playing Cosmic Flare gains {r}{r}{r}", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [cosmicFlareRed], deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.play(cosmicFlareRed);
    game.passBoth();

    expectFabPlayer(Oscilio).toHaveResourceCount(3);
    expectFabCard(Oscilio, cosmicFlareRed).toBeIn("graveyard");
  });

  it("boundary: Blink grants AP instead of resources", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [blinkBlue], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.play(blinkBlue);
    game.passBoth();

    expectFabPlayer(Oscilio).toHaveResourceCount(0);
    expectFabPlayer(Oscilio).toHaveAP(2);
  });
});
