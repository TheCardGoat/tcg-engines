import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01CaesarClown069,
  op01Smiley072,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-069 Caesar Clown", () => {
  test("when K.O.'d, plays Smiley from its deck and shuffles the remaining cards", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01CaesarClown069, rested: true, playedOnTurn: 0 }],
        deck: [op01Smiley072, eb01Doma005, eb01Fourtricks025],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north", seed: "caesar-clown-shuffle" },
    );
    const caesarId = engine.findCardInZone("south", "character", op01CaesarClown069);
    const smileyId = engine.findCardInZone("south", "deck", op01Smiley072);
    const domaId = engine.findCardInZone("south", "deck", eb01Doma005);
    const fourtricksId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, caesarId, "north");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Caesar Clown's Smiley play.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([smileyId]);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [smileyId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(caesarId);
    expect(view.players.south.characters.some((card) => card?.instanceId === smileyId)).toBe(true);
    expect(engine.getState().players.south.deck).toEqual([domaId, fourtricksId]);
    expect(view.logs.some((entry) => entry.message.includes("shuffles their deck"))).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
