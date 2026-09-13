import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { embodimentOfLightning } from "../tokens/embodiment-of-lightning.ts";
import { oscilio } from "../heroes/oscilio.ts";
import { highVoltageBlue } from "../instants/high-voltage.ts";
import { snatchRed } from "../actions/snatch.ts";
import { sigilOfLightningBlue } from "../instants/sigil-of-lightning.ts";
import { flashOfBrilliance } from "./flash-of-brilliance.ts";

describe("Flash of Brilliance (AUA003) AAA", () => {
  it("happy: defending, discarding a Lightning card, returns an aura you control to hand", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: oscilio,
        head: [flashOfBrilliance],
        hand: [highVoltageBlue],
        arena: [sigilOfLightningBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Oscilio.defendWith(flashOfBrilliance);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Oscilio, highVoltageBlue).toBeIn("graveyard");
    expectFabCard(Oscilio, sigilOfLightningBlue).toBeIn("hand");
    expect(Oscilio.zone("arena")).toContain("token:embodiment-of-lightning");
    expectFabCard(Oscilio, flashOfBrilliance).toBeIn("graveyard");
    expectFabPlayer(Oscilio).toHaveLife(17);
  });

  it("boundary: declining the Lightning discard leaves the aura in the arena", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: oscilio,
        head: [flashOfBrilliance],
        hand: [highVoltageBlue],
        arena: [sigilOfLightningBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Oscilio.defendWith(flashOfBrilliance);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Oscilio, highVoltageBlue).toBeIn("hand");
    expectFabCard(Oscilio, sigilOfLightningBlue).toBeIn("arena");
    expect(Oscilio.zone("arena")).not.toContain("token:embodiment-of-lightning");
    expectFabCard(Oscilio, flashOfBrilliance).toBeIn("graveyard");
  });

  it("timing: returning a token aura to hand ceases it instead of putting it in hand", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: oscilio,
        head: [flashOfBrilliance],
        hand: [highVoltageBlue],
        arena: [embodimentOfLightning],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Oscilio.defendWith(flashOfBrilliance);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Oscilio, highVoltageBlue).toBeIn("graveyard");
    expect(Oscilio.zone("arena")).not.toContain("token:embodiment-of-lightning");
    expect(Oscilio.zone("hand")).not.toContain("token:embodiment-of-lightning");
    expectFabCard(Oscilio, flashOfBrilliance).toBeIn("graveyard");
  });
});
