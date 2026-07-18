import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, prb01HelmeppoFullArt010 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST06-010 Helmeppo", () => {
  test("on play gives an opponent Character minus 3 cost for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [prb01HelmeppoFullArt010], activeDon: prb01HelmeppoFullArt010.cost },
      { character: [eb01MountainGod018] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(prb01HelmeppoFullArt010, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(2);

    engine.endTurn("south");
    expect(
      engine.getView("south").players.north.characters.find((card) => card?.instanceId === targetId)
        ?.cost,
    ).toBe(eb01MountainGod018.cost);
  });
});
