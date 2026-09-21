import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import { op09MarshallDTeach092 } from "../../../../../cards/src/cards/characters/op09-092-marshall-d-teach.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP09-092 Marshall.D.Teach", () => {
  test("at a three-card hand deficit, draws two before trashing one", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op09MarshallDTeach092],
        hand: [eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018],
      },
      { hand: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005] },
    );
    const teachId = engine.findCardInZone("south", "character", op09MarshallDTeach092);

    engine.activateEffect(teachId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const discard = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    if (discard?.kind !== "selectEntity") throw new Error("Expected Teach's hand discard.");
    expect(discard).toMatchObject({ min: 1, max: 1 });
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [discard.candidates[0]!.ref.id] },
      "south",
    );

    expect(engine.getView("south").players.south.hand).toHaveLength(2);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op09MarshallDTeach092],
        hand: [eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018],
      },
      { hand: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, eb01Doma005] },
    );
    const teachId = engine.findCardInZone("south", "character", op09MarshallDTeach092);
    engine.activateEffect(teachId, "activateMain", "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
