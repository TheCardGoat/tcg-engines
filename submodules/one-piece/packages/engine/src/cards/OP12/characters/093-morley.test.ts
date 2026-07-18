import { describe, expect, test } from "vite-plus/test";
import { op12Koala081 } from "@tcg/op-cards";
import { op12Morley093 } from "../../../../../cards/src/cards/OP12/characters/093-morley.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-093 Morley", () => {
  test("gains four cost only with an included Revolutionary Army Leader", () => {
    const matching = OnePieceTestEngine.create({
      leaderCardId: op12Koala081,
      hand: [op12Morley093],
      activeDon: op12Morley093.cost,
    });
    matching.playCard(op12Morley093, "south");
    const matchingId = matching.findCardInZone("south", "character", op12Morley093);
    expect(
      matching
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === matchingId)?.cost,
    ).toBe(op12Morley093.cost + 4);

    const inert = OnePieceTestEngine.create({
      hand: [op12Morley093],
      activeDon: op12Morley093.cost,
    });
    inert.playCard(op12Morley093, "south");
    const inertId = inert.findCardInZone("south", "character", op12Morley093);
    expect(
      inert.getView("south").players.south.characters.find((card) => card?.instanceId === inertId)
        ?.cost,
    ).toBe(op12Morley093.cost);
  });
});
