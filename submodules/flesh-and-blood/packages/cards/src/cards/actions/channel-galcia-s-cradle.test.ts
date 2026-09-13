import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { jarlVetreiI } from "../heroes/jarl-vetrei-i.ts";
import { dash } from "../heroes/dash.ts";
import { nullruneHood } from "../equipment/nullrune-hood.ts";
import { frostbite } from "../tokens/frostbite.ts";
import { channelGalciaSCradleBlue } from "./channel-galcia-s-cradle.ts";

describe("Channel Galcia's Cradle (PEN230) AAA", () => {
  it("happy: entering the arena freezes target equipment while this is in the arena", () => {
    const game = FabTestEngine.start(
      { hero: jarlVetreiI, hand: [channelGalciaSCradleBlue], actionPoints: 1, deck: 6 },
      { hero: dash, head: [nullruneHood], arena: [frostbite], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Jarl = game.as(jarlVetreiI);
    const Dash = game.as(dash);

    Jarl.play(channelGalciaSCradleBlue);
    game.untilIdle({ entityTargets: "pause" });
    Jarl.target(frostbite);
    game.untilIdle();

    expectFabCard(Jarl, channelGalciaSCradleBlue).toBeIn("arena");
    expectFabCard(Dash, frostbite).toBeFrozen();
    expectFabCard(Dash, nullruneHood).notToBeFrozen();
  });

  it("boundary: a non-permanent in arsenal is not a legal freeze subject", () => {
    const game = FabTestEngine.start(
      { hero: jarlVetreiI, hand: [channelGalciaSCradleBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Jarl = game.as(jarlVetreiI);

    Jarl.play(channelGalciaSCradleBlue);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabCard(Jarl, channelGalciaSCradleBlue).toBeIn("arena");
  });

  it("timing: Channel Ice destroys this at end phase with no Ice in pitch", () => {
    const game = FabTestEngine.start(
      { hero: jarlVetreiI, hand: [channelGalciaSCradleBlue], actionPoints: 1, deck: 6 },
      { hero: dash, head: [nullruneHood], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Jarl = game.as(jarlVetreiI);
    const Dash = game.as(dash);

    Jarl.play(channelGalciaSCradleBlue);
    game.untilIdle({ entityTargets: "pause" });
    Jarl.target(nullruneHood);
    game.untilIdle();
    expectFabCard(Dash, nullruneHood).toBeFrozen();
    Jarl.endTurn();
    game.untilIdle({ optionals: "decline" });

    expectFabCard(Jarl, channelGalciaSCradleBlue).toBeIn("graveyard");
    expectFabCard(Dash, nullruneHood).notToBeFrozen();
  });
});
