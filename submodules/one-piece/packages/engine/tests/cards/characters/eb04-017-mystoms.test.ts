import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op08Carrot021,
  op08Nekomamushi028,
  op08Wanda034,
  op14eb04Mystoms017,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB04-017 Mystoms", () => {
  test("plays an included Minks Character and gives opposing Characters +1 cost only on your turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: op08Carrot021,
        hand: [op14eb04Mystoms017, op08Nekomamushi028],
        character: [op08Wanda034],
        activeDon: op14eb04Mystoms017.cost,
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const playableId = engine.findCardInZone("south", "hand", op08Nekomamushi028);
    const opponentId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op14eb04Mystoms017, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Mystoms's Minks selection.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([playableId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [playableId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === playableId)).toBe(
      true,
    );
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opponentId)?.cost,
    ).toBe(eb01Doma005.cost + 1);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opponentId)?.cost,
    ).toBe(eb01Doma005.cost);
  });
});
