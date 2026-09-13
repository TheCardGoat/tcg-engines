import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion, proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { jinUndyingResolve } from "./jin-undying-resolve.ts";

function lethalDealer() {
  const champion = lineageTestChampion("Dealer", 0);
  if (champion.layout.kind !== "single-faced") throw new Error("Expected champion");
  return {
    ...champion,
    layout: {
      kind: "single-faced" as const,
      face: { ...champion.layout.face, stats: { level: 0, life: 20, power: 30 } },
    },
  };
}

/** @covers c4yrrtv7o1-a1 */
describe("Jin, Undying Resolve — Lineage", () => {
  proveChampionLineage({
    card: jinUndyingResolve,
    lineageName: "Jin",
    level: 3,
    memoryCost: 3,
  });
});

/** @covers c4yrrtv7o1-a2 */
describe("Jin, Undying Resolve — immortality", () => {
  it("survives lethal damage outside the end phase", () => {
    const starter = lineageTestChampion("Jin", 0);
    const dealer = lethalDealer();
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion: starter,
        lineage: [lineageTestChampion("Jin", 1), lineageTestChampion("Jin", 2), jinUndyingResolve],
      },
      playerTwo: { champion: dealer },
    });
    const jin = game.player("player-one").card(starter, { zone: "field" });
    game.player("player-two").declareAttack(dealer, jin);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[jin.objectId]!.zone).toBe("field");
    expect(game.state.objects[jin.objectId]!.damage).toBeGreaterThan(20);
  });
});
