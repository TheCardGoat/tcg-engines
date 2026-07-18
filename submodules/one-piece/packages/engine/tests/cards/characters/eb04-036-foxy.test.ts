import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op07Foxy059,
  op14eb04Foxy036,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB04-036 Foxy", () => {
  test("pays DON!! -1, draws and trashes with the Leader gate, rests a target, then adds rested DON!! once", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op07Foxy059,
        hand: [op14eb04Foxy036],
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
        activeDon: 9,
        donDeckCount: 2,
      },
      { character: [eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const firstDrawnId = engine.findCardInZone("south", "deck", eb01Doma005);
    const secondDrawnId = engine.findCardInZone("south", "deck", eb01Fourtricks025);

    engine.playCard(op14eb04Foxy036, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    const discard = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(discard?.kind).toBe("selectEntity");
    if (discard?.kind !== "selectEntity") throw new Error("Expected Foxy's hand discard.");
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [firstDrawnId] },
      "south",
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const foxyId = engine.findCardInZone("south", "character", op14eb04Foxy036);
    engine.activateEffect(foxyId, "activateMain", "south");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(firstDrawnId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(secondDrawnId);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(true);
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 9, donDeckCount: 2 });
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: foxyId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });

  test("still pays DON!! -1 and rests a target without the Leader gate, but does not draw or trash", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op14eb04Foxy036, eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018],
        activeDon: 9,
      },
      { character: [eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const keptHandId = engine.findCardInZone("south", "hand", eb01Doma005);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.playCard(op14eb04Foxy036, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectCostReturnDon", { selectedIds: ["active-don:0"] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([keptHandId]);
    expect(view.players.south.deckCount).toBe(deckBefore);
    expect(view.players.south.trash).toHaveLength(0);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline DON!! -1 without drawing, trashing, or resting a target", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op07Foxy059,
        hand: [op14eb04Foxy036, eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018],
        activeDon: 9,
      },
      { character: [eb01MountainGod018] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const keptHandId = engine.findCardInZone("south", "hand", eb01Doma005);
    const deckBefore = engine.getView("south").players.south.deckCount;
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    engine.playCard(op14eb04Foxy036, "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toEqual([keptHandId]);
    expect(view.players.south).toMatchObject({
      activeDon: 1,
      deckCount: deckBefore,
      donDeckCount: donDeckBefore,
    });
    expect(view.players.south.trash).toHaveLength(0);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === targetId)?.rested,
    ).toBe(false);
    expect(view.prompts).toHaveLength(0);
  });
});
