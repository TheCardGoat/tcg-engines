import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01CaesarClown069,
  op01Smiley072,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

/**
 * OP01-069 Caesar Clown: [On K.O.] Play up to 1 [Smiley] from deck, then shuffle.
 * Subject is op01CaesarClown069 — KO path is battle damage via a public attack.
 */
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
    // "up to 1" allows empty selection; happy path takes the only Smiley.
    expect(play.min).toBe(0);
    expect(play.max).toBe(1);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [smileyId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(caesarId);
    expect(view.players.south.characters.some((card) => card?.instanceId === smileyId)).toBe(true);
    // Shuffle order is seeded from eventSequence (sensitive to battle timing /
    // fixture turn defaults). Assert membership and length, not absolute order.
    expect(engine.getState().players.south.deck).toHaveLength(2);
    expect(engine.getState().players.south.deck).toEqual(
      expect.arrayContaining([fourtricksId, domaId]),
    );
    expect(view.logs.some((entry) => entry.message.includes("shuffles their deck"))).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("when K.O.'d with no Smiley in deck, still K.O.s and shuffles without playing", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01CaesarClown069, rested: true, playedOnTurn: 0 }],
        // Non-Smiley deck: name filter must not invent a play candidate.
        deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north", seed: "caesar-clown-no-smiley" },
    );
    const caesarId = engine.findCardInZone("south", "character", op01CaesarClown069);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const deckBefore = [...engine.getState().players.south.deck];

    engine.declareAttack(attackerId, caesarId, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(caesarId);
    // No Smiley → no play; only non-Smiley cards remain and deck is shuffled.
    expect(view.players.south.characters.some((card) => card?.cardId === op01Smiley072.id)).toBe(
      false,
    );
    expect(engine.getState().players.south.deck).toHaveLength(deckBefore.length);
    expect(engine.getState().players.south.deck).toEqual(expect.arrayContaining(deckBefore));
    expect(view.logs.some((entry) => entry.message.includes("shuffles their deck"))).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline up-to Smiley play so Smiley stays in deck and Caesar stays trashed", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01CaesarClown069, rested: true, playedOnTurn: 0 }],
        deck: [op01Smiley072, eb01Doma005, eb01Fourtricks025],
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north", seed: "caesar-clown-decline-smiley" },
    );
    const caesarId = engine.findCardInZone("south", "character", op01CaesarClown069);
    const smileyId = engine.findCardInZone("south", "deck", op01Smiley072);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, caesarId, "north");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    if (play?.kind !== "selectEntity") throw new Error("Expected Caesar Clown's Smiley play.");
    // Decline the "up to 1" selection.
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(caesarId);
    expect(view.players.south.characters.some((card) => card?.instanceId === smileyId)).toBe(false);
    expect(engine.getState().players.south.deck).toContain(smileyId);
    expect(view.logs.some((entry) => entry.message.includes("shuffles their deck"))).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
