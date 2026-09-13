import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { malice } from "../heroes/malice.ts";
import { restlessShieldmaidenRed } from "./restless-shieldmaiden.ts";

describe("Restless Shieldmaiden AAA", () => {
  it("happy: Decay puts a −1{h} counter at the end of your turn", () => {
    const game = FabTestEngine.start(
      { hero: malice, hand: [], arena: [restlessShieldmaidenRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const player = game.as(malice);

    player.endTurn();
    expectFabCard(player, restlessShieldmaidenRed).toBeIn("arena").toHaveCounters(1);
  });

  it("boundary: Decay does not put a counter during the opponent's end phase", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      { hero: malice, hand: [], arena: [restlessShieldmaidenRed], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Malice = game.as(malice);

    Dash.endTurn();
    expectFabCard(Malice, restlessShieldmaidenRed).toBeIn("arena").toHaveCounters(0);
  });
});
