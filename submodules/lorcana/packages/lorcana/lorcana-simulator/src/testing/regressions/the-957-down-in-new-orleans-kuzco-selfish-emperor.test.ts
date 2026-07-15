import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockItem } from "@tcg/lorcana-engine/testing";
import { downInNewOrleans } from "@tcg/lorcana-cards/cards/008";
import { kuzcoSelfishEmperor } from "@tcg/lorcana-cards/cards/005";

const opponentItem = createMockItem({
  id: "the-957-opponent-item",
  name: "THE-957 Opponent Item",
  cost: 2,
});

const fillerA = createMockItem({
  id: "the-957-filler-a",
  name: "THE-957 Filler A",
  cost: 1,
});

const fillerB = createMockItem({
  id: "the-957-filler-b",
  name: "THE-957 Filler B",
  cost: 1,
});

/**
 * THE-957:
 * Playing Kuzco from Down in New Orleans must still count as "played",
 * so Kuzco's OUTPLACEMENT trigger enters the bag and can put an item/location
 * into its player's inkwell facedown and exerted.
 */
describe("THE-957 — Down in New Orleans into Kuzco - Selfish Emperor", () => {
  it("triggers OUTPLACEMENT after Kuzco is played for free from scry destination", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [downInNewOrleans],
        inkwell: downInNewOrleans.cost,
        deck: [fillerA, fillerB, kuzcoSelfishEmperor],
      },
      {
        play: [opponentItem],
      },
    );

    expect(
      testEngine
        .asPlayerOne()
        .playCardWithDestinations(
          downInNewOrleans,
          { zone: "play", cards: kuzcoSelfishEmperor },
          { zone: "deck-bottom", cards: [fillerA, fillerB] },
        ),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerOne().getBagCount()).toBe(1);

    const [bagEffect] = testEngine.asPlayerOne().getBagEffects();
    expect(
      testEngine.asPlayerOne().resolvePendingByCard(bagEffect!.sourceId, {
        resolveOptional: true,
        targets: [opponentItem],
      }),
    ).toBeSuccessfulCommand();

    expect(testEngine.asPlayerTwo().getCardZone(opponentItem)).toBe("inkwell");
    expect(testEngine.isExerted(opponentItem)).toBe(true);
  });
});
