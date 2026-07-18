import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op02ArabesqueBrickFist067,
  op12DonquixoteRosinante048,
  op12Fullbody052,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP12-048 Donquixote Rosinante", () => {
  test("on the opponent's turn rests itself and trashes a card instead of an opponent effect removing a blue Navy Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op12DonquixoteRosinante048, op12Fullbody052],
        hand: [eb01Doma005, eb01Fourtricks025],
      },
      {
        hand: [op02ArabesqueBrickFist067],
        activeDon: op02ArabesqueBrickFist067.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const rosinanteId = engine.findCardInZone("south", "character", op12DonquixoteRosinante048);
    const protectedId = engine.findCardInZone("south", "character", op12Fullbody052);
    const paidId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.playCard(op02ArabesqueBrickFist067, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [protectedId] }, "north");
    engine.resolveDecision("effectRemovalReplacement", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTrashFromHandSelection", { selectedIds: [paidId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(protectedId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === rosinanteId)?.rested,
    ).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(paidId);
    expect(view.prompts).toHaveLength(0);
  });
});
