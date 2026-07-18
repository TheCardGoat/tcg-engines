import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op06GeckoMoria080,
  op06JigoroOfTheWind084,
  op06ThrillerBark098,
  op13Shanks028,
} from "@tcg/op-cards";

import { getLegalCommands, OnePieceTestEngine } from "../../../src/index.ts";

describe("OP13-028 Shanks", () => {
  test("blocks hand plays but still allows an effect to play from trash", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op06GeckoMoria080,
      hand: [op13Shanks028, eb01Doma005],
      stage: op06ThrillerBark098,
      trash: [op06JigoroOfTheWind084],
      activeDon: 10,
    });
    const stageId = engine.findCardInZone("south", "stage", op06ThrillerBark098);
    const trashCharacterId = engine.findCardInZone("south", "trash", op06JigoroOfTheWind084);
    const handCharacterId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op13Shanks028);
    expect(
      getLegalCommands(engine.getState(), "south").some(
        (command) => command.type === "playCard" && command.sourceId === handCharacterId,
      ),
    ).toBe(false);
    expect(
      engine.expectFailure({
        type: "playCard",
        seat: "south",
        instanceId: handCharacterId,
      }).reason,
    ).toBe("A card effect prevents this card from being played.");

    engine.activateEffect(stageId, "activateMain");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected a trash play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([trashCharacterId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [trashCharacterId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.some((card) => card?.instanceId === trashCharacterId),
    ).toBe(true);
  });
});
