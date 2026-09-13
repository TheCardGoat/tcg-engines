import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { malice } from "../heroes/malice.ts";
import { hellboundAssaultRed } from "./hellbound-assault.ts";
import { malignantMigrationRed } from "./malignant-migration.ts";
import { restlessClericRed } from "./restless-cleric.ts";

describe("Malignant Migration AAA", () => {
  it("happy: discarding a zombie puts a banished card into the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [malignantMigrationRed, restlessClericRed],
        banished: [hellboundAssaultRed],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const player = game.as(malice);

    player.play(malignantMigrationRed);
    game.advanceUntil({
      stopAt: "defend",
      optionals: "accept",
      entityTargets: "maximum",
    });
    expectFabCard(player, restlessClericRed).toBeIn("graveyard");
    expectFabCard(player, hellboundAssaultRed).toBeIn("graveyard");
    game.closeCombat();
    expectFabPlayer(player).toHaveAP(1);
  });

  it("boundary: declining the discard leaves the banished card where it is", () => {
    const game = FabTestEngine.start(
      {
        hero: malice,
        hand: [malignantMigrationRed, restlessClericRed],
        banished: [hellboundAssaultRed],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const player = game.as(malice);

    player.play(malignantMigrationRed);
    game.advanceUntil({ stopAt: "defend", optionals: "decline" });
    expectFabCard(player, restlessClericRed).toBeIn("hand");
    expectFabCard(player, hellboundAssaultRed).toBeBanished();
    game.closeCombat();
    expectFabPlayer(player).toHaveAP(1);
  });
});
