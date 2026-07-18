import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op11Camie102 } from "@tcg/op-cards";
import { op11Pappag109 } from "../../../../../cards/src/cards/OP11/characters/109-pappag.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-109 Pappag", () => {
  test("with Camie draws two cards then trashes exactly two chosen cards", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op11Pappag109, eb01MountainGod018],
      character: [op11Camie102],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      activeDon: op11Pappag109.cost,
    });
    const heldId = engine.findCardInZone("south", "hand", eb01MountainGod018);
    const drawnId = engine.findCardInZone("south", "deck", eb01Doma005);

    engine.playCard(op11Pappag109, "south");
    const discard = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(discard).toMatchObject({ kind: "selectEntity", min: 2, max: 2 });
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [heldId, drawnId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual(
      expect.arrayContaining([heldId, drawnId]),
    );
    expect(view.players.south.handCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });
});
