import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockCharacter,
  createMockItem,
} from "./index";

const top = createMockItem({ id: "short-scry-top", name: "Top", cost: 1 });
const other = createMockItem({ id: "short-scry-other", name: "Other", cost: 1 });
const source = createMockCharacter({
  id: "short-scry-source",
  name: "Scout",
  cost: 1,
  abilities: [
    {
      type: "triggered",
      trigger: { event: "play", on: "SELF", timing: "when" },
      effect: {
        type: "scry",
        amount: 2,
        target: "CONTROLLER",
        destinations: [
          { zone: "deck-top", max: 1 },
          {
            zone: "inkwell",
            min: 1,
            max: 1,
            requiresLookedAtLeast: 2,
            exerted: true,
            facedown: true,
          },
        ],
      },
    },
  ],
});

describe("scry destinations that require a full looked-at pair", () => {
  it("disables ink in the pending prompt and rejects short-deck ink assignment", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [source],
      inkwell: 1,
      deck: [top],
    });
    expect(g.asPlayerOne().playCard(source)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolvePendingByCard(source)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getPendingEffects()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          payload: expect.objectContaining({
            effect: expect.objectContaining({
              destinations: expect.arrayContaining([
                expect.objectContaining({ zone: "inkwell", min: 0, max: 0 }),
              ]),
            }),
          }),
        }),
      ]),
    );
    expect(
      g.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [] },
          { zone: "inkwell", cards: [top] },
        ],
      }),
    ).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [top] },
          { zone: "inkwell", cards: [] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([top.id]);
  });

  it("preserves required ink and the split when both cards exist", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [source],
      inkwell: 1,
      deck: [other, top],
    });
    expect(g.asPlayerOne().playCard(source)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().resolvePendingByCard(source)).toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [top, other] },
          { zone: "inkwell", cards: [] },
        ],
      }),
    ).not.toBeSuccessfulCommand();
    expect(
      g.asPlayerOne().resolveNextPending({
        destinations: [
          { zone: "deck-top", cards: [top] },
          { zone: "inkwell", cards: [other] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(other)).toBe("inkwell");
    expect(g.asPlayerOne().isExerted(other)).toBe(true);
  });
});
