import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import { op11CharlotteMontDOr072 } from "../../../../../cards/src/cards/OP11/characters/072-charlotte-mont-d-or.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-072 Charlotte Mont-d'or", () => {
  test("returns DON!!, lets the opponent choose and order two trash cards, then takes top Life", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op11CharlotteMontDOr072],
        life: [eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018],
        activeDon: 1,
      },
      {
        trash: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        deck: [eb01Doma005, eb01Fourtricks025],
      },
    );
    const montDOrId = engine.findCardInZone("south", "character", op11CharlotteMontDOr072);
    const lifeId = engine.findCardInZone("south", "life", eb01Doma005);
    const domaId = engine.findCardInZone("north", "trash", eb01Doma005);
    const fourtricksId = engine.findCardInZone("north", "trash", eb01Fourtricks025);
    const mountainGodId = engine.findCardInZone("north", "trash", eb01MountainGod018);
    const northDeckBefore = engine.getView("north").players.north.deckCount;
    const southDonDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.activateEffect(montDOrId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(engine.getView("south").players.south.donDeckCount).toBe(southDonDeckBefore + 1);

    const selection = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(selection).toMatchObject({ kind: "selectEntity", min: 2, max: 2 });
    if (selection?.kind !== "selectEntity") {
      throw new Error("Expected the opponent's trash selection.");
    }
    expect(selection.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([domaId, fourtricksId, mountainGodId]),
    );
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [domaId, fourtricksId] },
      "north",
    );

    const order = engine.pendingDecision("effectReturnToDeckOwnerOrder", "north").steps[0];
    expect(order).toMatchObject({ kind: "orderItems", min: 2, max: 2 });
    engine.resolveDecision(
      "effectReturnToDeckOwnerOrder",
      { selectedIds: [fourtricksId, domaId] },
      "north",
    );

    const southView = engine.getView("south");
    const northView = engine.getView("north");
    expect(southView.players.south).toMatchObject({
      lifeCount: 0,
      donDeckCount: southDonDeckBefore + 1,
    });
    expect(southView.players.south.hand.map((card) => card.instanceId)).toContain(lifeId);
    expect(northView.players.north.trash.map((card) => card.instanceId)).toEqual([mountainGodId]);
    expect(northView.players.north.deckCount).toBe(northDeckBefore + 2);
    expect(southView.prompts).toHaveLength(0);
  });
});
