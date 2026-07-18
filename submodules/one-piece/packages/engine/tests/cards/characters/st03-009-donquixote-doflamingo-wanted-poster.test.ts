import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op03DonquixoteDoflamingoWantedPoster009,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("ST03-009 Donquixote Doflamingo (Wanted Poster)", () => {
  test("may return either player's cost-7-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op03DonquixoteDoflamingoWantedPoster009],
        character: [eb01Doma005],
        activeDon: op03DonquixoteDoflamingoWantedPoster009.cost,
      },
      { character: [eb01Fourtricks025] },
    );
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.playCard(op03DonquixoteDoflamingoWantedPoster009, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Doflamingo's return choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual(
      expect.arrayContaining([ownId, opposingId]),
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownId] }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      ownId,
    );
    expect(
      engine
        .getView("south")
        .players.north.characters.some((card) => card?.instanceId === opposingId),
    ).toBe(true);
  });
});
