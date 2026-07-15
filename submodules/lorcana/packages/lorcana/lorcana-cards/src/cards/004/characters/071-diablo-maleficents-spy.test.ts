import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_TWO,
  createMockCharacter,
} from "@tcg/lorcana-engine/testing";
import { diabloMaleficentsSpy } from "./071-diablo-maleficents-spy";

const opponentCard1 = createMockCharacter({
  id: "diablo-ms-opp-card-1",
  name: "Opponent Card 1",
  cost: 2,
  strength: 2,
  willpower: 2,
});

const opponentCard2 = createMockCharacter({
  id: "diablo-ms-opp-card-2",
  name: "Opponent Card 2",
  cost: 3,
  strength: 3,
  willpower: 3,
});

describe("Diablo - Maleficent's Spy", () => {
  it("reveals each opponent's hand when played", () => {
    const testEngine = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        hand: [diabloMaleficentsSpy],
        inkwell: diabloMaleficentsSpy.cost,
      },
      {
        hand: [opponentCard1, opponentCard2],
      },
    );

    const opponentCard1Id = testEngine.findCardInstanceId(opponentCard1, "hand", PLAYER_TWO);
    const opponentCard2Id = testEngine.findCardInstanceId(opponentCard2, "hand", PLAYER_TWO);

    expect(testEngine.asPlayerOne().playCard(diabloMaleficentsSpy)).toBeSuccessfulCommand();
    expect(
      testEngine.asPlayerOne().resolveOnlyBag({ resolveOptional: true }),
    ).toBeSuccessfulCommand();
    expect(testEngine.asPlayerOne().getCardZone(diabloMaleficentsSpy)).toBe("play");

    const cardMeta = testEngine.getAuthoritativeState().ctx.zones.private.cardMeta;
    expect(cardMeta[opponentCard1Id]?.revealed).toBe(true);
    expect(cardMeta[opponentCard2Id]?.revealed).toBe(true);
  });
});
