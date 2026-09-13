import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zyggyStarlight } from "../heroes/zyggy-starlight.ts";
import { blinkOfAnEyeRed } from "../actions/blink-of-an-eye.ts";
import { lightningFlow } from "../tokens/lightning-flow.ts";
import { snatchRed } from "../actions/snatch.ts";
import { auricShardsRed } from "./auric-shards.ts";

describe("Auric Shards family AAA", () => {
  it("happy: entering gives a fragment attack +1 power", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [blinkOfAnEyeRed, auricShardsRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.must.playAttack(blinkOfAnEyeRed);
    game.advanceCombatTo("reaction");
    Zyggy.must.play(auricShardsRed);
    game.passBoth();
    Zyggy.target(blinkOfAnEyeRed);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(8);
    expectFabCard(Zyggy, auricShardsRed).toBeIn("arena");
  });

  it("boundary: a non-fragment attack does not get the +1", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [snatchRed, auricShardsRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.must.playAttack(snatchRed);
    game.advanceCombatTo("reaction");
    Zyggy.must.play(auricShardsRed);
    game.passBoth();
    Zyggy.target();
    game.passBoth();

    expectCombat(game).toHaveAttackPower(4);
  });

  it("timing: a holo counter replaces +1 with +4", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        arena: [lightningFlow, auricShardsRed],
        hand: [blinkOfAnEyeRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);

    Zyggy.must.playAttack(blinkOfAnEyeRed);
    game.advanceCombatTo("reaction");
    Zyggy.activate(zyggyStarlight);
    game.passBoth();
    Zyggy.target(blinkOfAnEyeRed);
    game.passBoth();

    expectFabCard(Zyggy, auricShardsRed).toHaveCounters(1, "holo");
    expectCombat(game).toHaveAttackPower(11);
  });
});
