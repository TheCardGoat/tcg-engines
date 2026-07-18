import { describe, expect, test } from "vite-plus/test";
import type { EventCard } from "@tcg/op-types";
import { eb01OffWhite019, prb02ShachiPenguinPirateFoil008 } from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";

const playCharacter: EventCard = {
  ...eb01OffWhite019,
  id: "TEST-ST10-008-PLAY",
  canonicalId: "TEST-ST10-008-PLAY",
  name: "Shachi & Penguin Play Fixture",
  cost: 0,
  effects: {
    effects: [
      {
        trigger: "main",
        actions: [
          {
            action: "play",
            source: { player: "self", zone: "hand" },
            count: { amount: 1 },
            filters: [{ filter: "cardCategory", value: "character" }],
          },
        ],
      },
    ],
  },
};

registerCards([playCharacter, prb02ShachiPenguinPirateFoil008]);

describe("ST10-008 Shachi & Penguin", () => {
  test("when played with 3 or less field DON!! adds up to 2 rested DON!!", () => {
    const engine = OnePieceTestEngine.create({
      hand: [playCharacter, prb02ShachiPenguinPirateFoil008],
      donDeckCount: 2,
    });
    const shachiId = engine.findCardInZone("south", "hand", prb02ShachiPenguinPirateFoil008);

    engine.playCard(playCharacter, "south");

    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon).toMatchObject({ kind: "chooseOption" });
    if (addDon?.kind !== "chooseOption") throw new Error("Expected add-DON!! choice.");
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1", "2"]);
    engine.resolveDecision("effectAddDon", { optionId: "2" }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 2, donDeckCount: 0 });
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(shachiId);
    expect(view.prompts).toHaveLength(0);
  });
});
