import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { viserai } from "../heroes/viserai.ts";
import { dash } from "../heroes/dash.ts";
import { runicDisposition } from "./runic-disposition.ts";

describe("Runic Disposition preview behavior", () => {
  for (const [color, card] of Object.entries(runicDisposition.cards)) {
    it(`${color}: discarding from hand creates one Runechant without spending an action point`, () => {
      const game = FabTestEngine.start(
        { hero: viserai, hand: [card], deck: 6 },
        { hero: dash, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const player = game.as(viserai);
      player.activate(card);
      game.untilIdle();
      expectFabCard(player, card).toBeIn("graveyard");
      expectFabPlayer(player).toHaveTokenCount("runechant", 1).toHaveAP(1);
      expectFabPlayer(game.as(dash)).toHaveTokenCount("runechant", 0);
    });
    it(`${color}: the discarded card cannot be activated again`, () => {
      const game = FabTestEngine.start(
        { hero: viserai, hand: [card], deck: 6 },
        { hero: dash, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const player = game.as(viserai);
      player.activate(card);
      game.untilIdle();
      player.expectActivationRejected(card);
      expectFabPlayer(player).toHaveTokenCount("runechant", 1);
    });
    it(`${color}: the instant ability is unavailable in banishment`, () => {
      const game = FabTestEngine.start(
        { hero: viserai, hand: [], banished: [card], deck: 6 },
        { hero: dash, hand: [], deck: 6 },
        FAB_MANUAL_HARNESS,
      );
      const player = game.as(viserai);
      player.expectActivationRejected(card);
      expectFabCard(player, card).toBeBanished();
      expectFabPlayer(player).toHaveTokenCount("runechant", 0);
    });
  }
});
