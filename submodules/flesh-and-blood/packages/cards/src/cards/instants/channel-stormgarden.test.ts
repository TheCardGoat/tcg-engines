import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
  expectFabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { zyggy } from "../heroes/zyggy.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { auricShardsRed } from "./auric-shards.ts";
import { channelStormgardenYellow } from "./channel-stormgarden.ts";

describe("Channel Stormgarden (IAR) AAA", () => {
  it("happy: entry creates a Lightning Flow and its destruction amps the next arcane damage", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggy,
        hand: [channelStormgardenYellow, volticBoltRed],
        arena: [auricShardsRed],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggy);
    const Dash = game.as(dash);

    Zyggy.play(channelStormgardenYellow);
    game.untilIdle();
    expectFabToken(game, "lightning-flow").toHaveCount(1);

    Zyggy.activate(zyggy);
    game.untilIdle({ entityTargets: "minimum" });
    expectFabToken(game, "lightning-flow").toHaveCount(0);

    Zyggy.play(volticBoltRed, { target: Dash.id });
    game.untilIdle();
    expectFabPlayer(Dash).toHaveLife(14);
  });

  it("boundary: without a destroyed Flow, Voltic Bolt deals its printed 5 arcane", () => {
    const game = FabTestEngine.start(
      { hero: zyggy, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggy);
    const Dash = game.as(dash);
    Zyggy.play(volticBoltRed, { target: Dash.id });
    game.untilIdle();
    expectFabPlayer(Dash).toHaveLife(15);
  });
});
