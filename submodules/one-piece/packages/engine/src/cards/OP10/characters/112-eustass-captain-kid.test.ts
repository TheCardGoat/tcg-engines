import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01Fourtricks025, eb01MountainGod018 } from "@tcg/op-cards";
import { op10EustassCaptainKid112 } from "../../../../../cards/src/cards/OP10/characters/112-eustass-captain-kid.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe('OP10-112 Eustass"Captain"Kid', () => {
  test("rests itself to trash the top opposing Life card", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op10EustassCaptainKid112], activeDon: op10EustassCaptainKid112.cost },
      { life: [eb01Doma005, eb01Fourtricks025] },
    );
    const topLifeId = engine.findCardInZone("north", "life", eb01Doma005);

    engine.playCard(op10EustassCaptainKid112, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectRemoveFromLifeCount", { optionId: "1" }, "south");

    const kidId = engine.findCardInZone("south", "character", op10EustassCaptainKid112);
    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === kidId)?.rested).toBe(
      true,
    );
    expect(view.players.north.lifeCount).toBe(1);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(topLifeId);
    expect(view.prompts).toHaveLength(0);
  });

  test("at turn end with two opposing Life draws then trashes one chosen hand card", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [op10EustassCaptainKid112],
        hand: [eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018],
      },
      { life: [eb01Doma005, eb01Fourtricks025] },
    );
    const originalHandId = engine.findCardInZone("south", "hand", eb01Doma005);
    const deckBefore = engine.getView("south").players.south.deckCount;

    engine.endTurn("south");
    const trash = engine.pendingDecision("effectTrashFromHandSelection", "south").steps[0];
    expect(trash?.kind).toBe("selectEntity");
    if (trash?.kind !== "selectEntity") throw new Error("Expected Kid's end-turn discard.");
    expect(trash).toMatchObject({ min: 1, max: 1 });
    engine.resolveDecision(
      "effectTrashFromHandSelection",
      { selectedIds: [originalHandId] },
      "south",
    );

    const view = engine.getView("south");
    expect(view.players.south.deckCount).toBe(deckBefore - 1);
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(originalHandId);
    expect(view.players.south.hand).toHaveLength(1);
    expect(view.prompts).toHaveLength(0);
  });
});
