import { describe, it } from "vitest";
import {
  FabTestEngine,
  FAB_MANUAL_HARNESS,
  expectFabCard,
  expectFabPlayer,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { restlessOutlawRed } from "./restless-outlaw.ts";
import { corruptedCorpse } from "./corrupted-corpse.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
describe("Restless Outlaw preview behavior", () => {
  it("dying to an attack creates a Corrupted Corpse in its controller's banished zone", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [brutalAssaultBlue], resourcePoints: 2, deck: 6 },
      { hero: gravyBones, hand: [], arena: [restlessOutlawRed], deck: [corruptedCorpse] },
      FAB_MANUAL_HARNESS,
    );
    game.as(dash).playAttack(brutalAssaultBlue, {
      target: game.as(gravyBones).findCardInZone("arena", restlessOutlawRed),
    });
    game.closeCombat({ ordering: "listed" });
    expectFabCard(game.as(gravyBones), restlessOutlawRed).toBeIn("graveyard");
    expectFabCard(game.as(gravyBones), corruptedCorpse).toBeBanished();
  });
  it("staying alive through one Decay does not create the corpse", () => {
    const game = FabTestEngine.start(
      { hero: gravyBones, hand: [], arena: [restlessOutlawRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const player = game.as(gravyBones);
    player.endTurn();
    expectFabCard(player, restlessOutlawRed).toBeIn("arena").toHaveCounters(1);
    expectFabPlayer(player).toHaveTokenCount("corrupted-corpse", 0);
  });
});
