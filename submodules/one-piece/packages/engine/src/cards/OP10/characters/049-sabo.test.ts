import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import { eb01Doma005, eb01OffWhite019 } from "@tcg/op-cards";
import { op10Sabo049 } from "../../../../../cards/src/cards/OP10/characters/049-sabo.ts";
import { registerCards } from "../../../../../cards/src/runtime-catalog.ts";

import { OnePieceTestEngine } from "../../../index.ts";

const koCharacter: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-OP10-049-KO",
  canonicalId: "TEST-OP10-049-KO",
  name: "Sabo K.O. Review",
  cost: 0,
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "ko",
            target: { player: "opponent", zones: ["character"], count: { amount: 1, upTo: true } },
          },
        ],
      },
    ],
  },
};
registerCards([koCharacter]);

describe("OP10-049 Sabo", () => {
  test("returns itself instead of an opponent effect removing an eligible non-Sabo ally", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op10Sabo049, eb01Doma005] },
      { hand: [koCharacter] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const saboId = engine.findCardInZone("south", "character", op10Sabo049);
    const allyId = engine.findCardInZone("south", "character", eb01Doma005);
    engine.playCard(koCharacter, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [allyId] }, "north");
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(allyId);
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(saboId);
  });
});
