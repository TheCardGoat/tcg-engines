import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blinkBlue } from "../instants/blink.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { flowstateEmbodimentRed } from "./flowstate-embodiment.ts";

describe("Flowstate Embodiment (OMN146) AAA", () => {
  it("happy: playing an instant this chain link creates Embodiment of Lightning or Lightning Flow", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [flowstateEmbodimentRed, blinkBlue], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.attackWith(flowstateEmbodimentRed);
    game.advanceCombatTo("reaction");
    Oscilio.must.playInstant(blinkBlue);
    game.helpers.resolveUntilIdle({
      optionalOptions: "all",
      effectResolution: "lightning-flow",
    });

    const arena = Oscilio.zone("arena");
    expect(
      arena.includes("token:lightning-flow") || arena.includes("token:embodiment-of-lightning"),
    ).toBe(true);
  });

  it("boundary: without an instant this chain link, creates no Lightning token", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [flowstateEmbodimentRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.attackWith(flowstateEmbodimentRed);
    game.helpers.resolveRestOfCombat();

    expect(Oscilio.zone("arena")).not.toContain("token:lightning-flow");
    expect(Oscilio.zone("arena")).not.toContain("token:embodiment-of-lightning");
    expectFabCard(Oscilio, flowstateEmbodimentRed).toBeIn("graveyard");
  });

  it("timing: an instant played before this attacks does not create the token", () => {
    const game = FabTestEngine.start(
      { hero: oscilio, hand: [flowstateEmbodimentRed, blinkBlue], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.must.playInstant(blinkBlue);
    game.helpers.resolveUntilIdle();
    Oscilio.attackWith(flowstateEmbodimentRed);
    game.helpers.resolveRestOfCombat();

    expect(Oscilio.zone("arena")).not.toContain("token:lightning-flow");
    expect(Oscilio.zone("arena")).not.toContain("token:embodiment-of-lightning");
  });
});
