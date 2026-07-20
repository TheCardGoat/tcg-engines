import { describe, expect, it } from "vitest";
import { getAllCards } from "@tcg/op-cards";
import { onePieceServerAdapter } from "./adapter";

describe("One Piece metadata projection", () => {
  it("uses the Leader as identity and color source", () => {
    const leader = getAllCards().find((card) => card.cardType === "leader")!;
    const projection = onePieceServerAdapter.metadata!.projectDeck([
      { cardId: leader.id, quantity: 1 },
    ]);
    expect(projection.facets.find((facet) => facet.type === "leader")?.key).toBe(
      leader.canonicalId,
    );
    expect(projection.colors).toEqual([...leader.color].sort());
  });

  it("keeps the Leader in templates and excludes it from synergies", () => {
    const leader = getAllCards().find((card) => card.cardType === "leader")!;
    const character = getAllCards().find((card) => card.cardType === "character")!;
    const deck = [
      { cardId: leader.id, quantity: 1 },
      { cardId: character.id, quantity: 4 },
    ];
    expect(onePieceServerAdapter.metadata!.normalizeTemplate(deck)).toContainEqual({
      cardId: leader.id,
      quantity: 1,
    });
    expect(onePieceServerAdapter.metadata!.normalizeSynergy(deck)).toEqual([
      { cardId: character.id, quantity: 1 },
    ]);
  });
});
