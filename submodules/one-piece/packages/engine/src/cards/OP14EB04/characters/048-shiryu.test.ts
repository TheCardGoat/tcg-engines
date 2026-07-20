import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04Shiryu048 } from "../../../../../cards/src/cards/OP14EB04/characters/048-shiryu.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-048 Shiryu", () => {
  test("on play returns one selected opposing Character then trashes every remaining own hand card", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04Shiryu048, eb01Doma005, eb01Fourtricks025],
        activeDon: op14eb04Shiryu048.cost,
      },
      { character: [eb01MountainGod018] },
    );
    const firstTrashId = engine.findCardInZone("south", "hand", eb01Doma005);
    const secondTrashId = engine.findCardInZone("south", "hand", eb01Fourtricks025);
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op14eb04Shiryu048, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Shiryu's return target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(targetId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const ownerView = engine.getView("north");
    expect(ownerView.players.north.hand.map((card) => card.instanceId)).toContain(targetId);
    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(targetId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([firstTrashId, secondTrashId]),
    );
    expect(view.players.south.hand).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });

  test("may return no opponent while still trashing every remaining own hand card", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04Shiryu048, eb01Doma005],
        activeDon: op14eb04Shiryu048.cost,
      },
      { character: [eb01MountainGod018] },
    );
    const trashedId = engine.findCardInZone("south", "hand", eb01Doma005);
    const untouchedId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.playCard(op14eb04Shiryu048, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(untouchedId);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(trashedId);
    expect(view.players.south.hand).toHaveLength(0);
    expect(view.prompts).toHaveLength(0);
  });
});
