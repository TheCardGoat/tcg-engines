import { describe, expect, test } from "vite-plus/test";
import { getAllCards, op16PrisonerOfImpelDown042, validateDeckForFormat } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP16-042 Prisoner of Impel Down", () => {
  test("any number of copies may be included in a standard deck", () => {
    // OP16-022 is blue/green; fill the remaining slots with blue/green cards
    // at legal copy limits so the only over-limit card is Prisoner itself.
    const fillers = Object.values(getAllCards())
      .filter(
        (card) =>
          card.setId === "OP16" &&
          card.id !== op16PrisonerOfImpelDown042.id &&
          (card.cardType === "character" || card.cardType === "event") &&
          (card.color.includes("blue") || card.color.includes("green")),
      )
      .slice(0, 20);
    const deck = [
      { cardId: "OP16-022", quantity: 1 },
      { cardId: op16PrisonerOfImpelDown042.id, quantity: 8 },
    ];
    let mainDeck = 8;
    for (const filler of fillers) {
      if (mainDeck >= 50) break;
      const quantity = Math.min(4, 50 - mainDeck);
      deck.push({ cardId: filler.id, quantity });
      mainDeck += quantity;
    }

    const result = validateDeckForFormat("standard", deck);
    expect(result.valid).toBe(true);
  });

  test("registers its unlimited-copies deck-building rule", () => {
    expect(op16PrisonerOfImpelDown042.effects?.deckBuildingRules).toContainEqual({
      rule: "unlimitedCopies",
    });
  });

  test("plays as an ordinary Character", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op16PrisonerOfImpelDown042], activeDon: op16PrisonerOfImpelDown042.cost },
      {},
    );

    engine.playCard(op16PrisonerOfImpelDown042, "south");

    expect(engine.getView("south").players.south.characters.map((card) => card?.cardId)).toContain(
      op16PrisonerOfImpelDown042.id,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
