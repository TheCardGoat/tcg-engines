import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { dash } from "../heroes/dash.ts";
import { whisperOfTheOracleRed } from "./whisper-of-the-oracle.ts";

describe("Whisper of the Oracle (ARC215) AAA", () => {
  it("happy: Opt 4 looks at four cards and go again refunds the action point", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [whisperOfTheOracleRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(whisperOfTheOracleRed, { optBottom: 4 });
    game.helpers.resolveUntilIdle();

    expectFabCard(Blaze, whisperOfTheOracleRed).toBeIn("graveyard");
    expectFabPlayer(Blaze).toHaveAP(1);
  });

  it("boundary: Opt 4 does not look at a fifth card", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [whisperOfTheOracleRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(whisperOfTheOracleRed, { optBottom: 4 });
    game.helpers.resolveUntilIdle();
    expectFabCard(Blaze, blazeFiremind).toHaveCounters(4, "energy");
  });

  it("synergy: Blaze, Firemind gains 4 energy counters for the Opt 4 look", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [whisperOfTheOracleRed], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Blaze = game.as(blazeFiremind);

    Blaze.play(whisperOfTheOracleRed, { optBottom: 4 });
    game.helpers.resolveUntilIdle();
    expectFabCard(Blaze, blazeFiremind).toHaveCounters(4, "energy");
  });
});
