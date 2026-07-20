import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { prb01NamiP053FullArt053 } from "../../../../../cards/src/cards/PRB01/characters/053-nami-p-053-full-art.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("P-053 Nami", () => {
  test("after playing to three hand cards may return an opposing cost-3 Character to its owner's hand", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [prb01NamiP053FullArt053, eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        activeDon: prb01NamiP053FullArt053.cost,
      },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const highCostId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(prb01NamiP053FullArt053, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Nami's return target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const northView = engine.getView("north");
    expect(northView.players.north.hand.map((card) => card.instanceId)).toContain(eligibleId);
    expect(northView.players.north.characters.map((card) => card?.instanceId)).not.toContain(
      eligibleId,
    );
    expect(northView.prompts).toHaveLength(0);
  });

  test("after playing to four hand cards does not offer the return", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [
          prb01NamiP053FullArt053,
          eb01Doma005,
          eb01Doma005,
          eb01Fourtricks025,
          eb01MountainGod018,
        ],
        activeDon: prb01NamiP053FullArt053.cost,
      },
      { character: [eb01Doma005] },
    );
    const targetId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(prb01NamiP053FullArt053, "south");

    expect(
      engine.getView("south").players.north.characters.map((card) => card?.instanceId),
    ).toContain(targetId);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
