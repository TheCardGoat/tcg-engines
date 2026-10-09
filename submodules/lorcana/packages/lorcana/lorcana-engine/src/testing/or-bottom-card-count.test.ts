import { describe, expect, it } from "bun:test";
import { LorcanaMultiplayerTestEngine, createMockCharacter, PLAYER_ONE } from "./index";

const source = createMockCharacter({
  id: "or-bottom-three",
  name: "Return Three Or Banish",
  cost: 1,
  abilities: [
    {
      type: "triggered",
      trigger: { event: "play", on: "SELF", timing: "when" },
      effect: {
        type: "or",
        options: [
          {
            type: "put-on-bottom",
            ordering: "player-choice",
            target: {
              cardTypes: ["card"],
              count: 3,
              owner: "you",
              selector: "chosen",
              zones: ["discard"],
            },
          },
          { type: "banish", target: "SELF" },
        ],
      },
    },
  ],
});
const filler = createMockCharacter({ id: "bottom-filler", name: "Filler", cost: 1 });

describe("or requires complete bottom-deck payment (CR 6.1.5.2)", () => {
  for (const count of [0, 1, 2]) {
    it(`forces banish with ${count} own discard cards even when return is requested`, () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        {
          hand: [source],
          inkwell: 1,
          discard: Array.from({ length: count }, () => filler),
          deck: 2,
        },
        { discard: [filler, filler, filler], deck: [] },
      );
      expect(engine.asPlayerOne().playCard(source)).toBeSuccessfulCommand();
      const targets = engine.getCardInstanceIdsInZone("discard", PLAYER_ONE);
      expect(engine.asPlayerOne().getBagEffects()[0]?.selectionContext).toMatchObject({
        kind: "choice-selection",
        options: [
          { index: 0, legal: false },
          { index: 1, legal: true },
        ],
      });
      expect(
        engine.asPlayerOne().resolvePendingByCard(source, { choiceIndex: 0, targets }),
      ).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().getCardZone(source)).toBe("discard");
      expect(engine.asPlayerOne().getZonesCardCount().deck).toBe(2);
    });
  }
});
