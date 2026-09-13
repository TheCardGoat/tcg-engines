import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { nimbleStrikeRed } from "../actions/nimble-strike.ts";
import { arknightShardBlue } from "./arknight-shard.ts";

describe("Arknight Shard (CRU000) AAA", () => {
  it("happy: pitching this creates a Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [nimbleStrikeRed, arknightShardBlue],
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(nimbleStrikeRed, { pitch: [arknightShardBlue] });
    game.passBoth();

    expectFabCard(Viserai, arknightShardBlue).toBeIn("pitch");
    expect(Viserai.zone("arena")).toContain("token:runechant");
  });

  it("boundary: cannot be played", () => {
    const game = FabTestEngine.start(
      { hero: viserai, hand: [arknightShardBlue], deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(viserai).play(arknightShardBlue)).toThrow();
    expectFabCard(game.as(viserai), arknightShardBlue).toBeIn("hand");
  });

  it("timing: pitching a different card does not create this gem's Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        hand: [nimbleStrikeRed],
        resourcePoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.play(nimbleStrikeRed);
    game.passBoth();

    expect(Viserai.zone("arena")).not.toContain("token:runechant");
  });
});
