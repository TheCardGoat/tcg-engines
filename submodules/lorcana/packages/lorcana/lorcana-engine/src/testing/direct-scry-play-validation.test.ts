import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  createMockAction,
  createMockItem,
} from "./index";
const top = createMockItem({ id: "direct-scry-top", name: "Top", cost: 1 });
const source = createMockAction({
  id: "direct-scry-action",
  name: "Ordered Scry",
  cost: 1,
  abilities: [
    {
      type: "action",
      effect: {
        type: "scry",
        amount: 1,
        target: "CONTROLLER",
        destinations: [
          { zone: "inkwell", min: 1, max: 1, facedown: true, exerted: true },
          { zone: "deck-top", max: 1 },
        ],
      },
    },
  ],
});
describe("direct scry play validation", () => {
  for (const spendDrop of [false, true]) {
    it(`validates the active nested conditional branch before payment (${spendDrop ? "spent drop" : "held drop"})`, () => {
      const below = createMockItem({ id: "conditional-scry-below", name: "Below", cost: 1 });
      const scry = (amount: number) => ({
        type: "scry" as const,
        amount,
        target: "CONTROLLER" as const,
        destinations: [
          { zone: "hand" as const, min: 1, max: 1 },
          { zone: "deck-bottom" as const, remainder: true },
        ],
      });
      const conditionalSource = createMockAction({
        id: "conditional-scry-action",
        name: "Conditional Scry",
        cost: 1,
        abilities: [
          {
            type: "action",
            effect: {
              type: "conditional",
              condition: { type: "play-context", context: "paid-with-ink-drop" },
              then: {
                type: "conditional",
                condition: { type: "play-context", context: "paid-with-ink-drop" },
                then: scry(2),
              },
              else: scry(1),
            },
          },
        ],
      });
      const g = LorcanaMultiplayerTestEngine.createWithFixture({
        hand: [conditionalSource],
        inkwell: 1,
        inkDrops: 1,
        deck: [below, top],
      });
      const looked = spendDrop ? [below, top] : [top];
      expect(
        g.asPlayerOne().playCard(conditionalSource, {
          inkDrops: spendDrop ? 1 : 0,
          destinations: [
            { zone: "hand", cards: [] },
            { zone: "deck-bottom", cards: looked },
          ],
        }),
      ).not.toBeSuccessfulCommand();
      expect(g.asPlayerOne().getCardZone(conditionalSource)).toBe("hand");
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
      expect(g.getInkDrops(PLAYER_ONE)).toBe(1);
      expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([below.id, top.id]);
      expect(g.asPlayerOne().getPendingEffects()).toHaveLength(0);
      expect(
        g.asPlayerOne().playCard(conditionalSource, {
          inkDrops: spendDrop ? 1 : 0,
          destinations: [
            { zone: "hand", cards: [spendDrop ? below : top] },
            { zone: "deck-bottom", cards: spendDrop ? [top] : [] },
          ],
        }),
      ).toBeSuccessfulCommand();
      expect(g.asPlayerOne().getCardZone(spendDrop ? below : top)).toBe("hand");
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(spendDrop ? 1 : 0);
      expect(g.getInkDrops(PLAYER_ONE)).toBe(spendDrop ? 0 : 1);
    });
  }

  it("accepts a valid direct ink assignment and pays once", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [source],
      inkwell: 1,
      deck: [top],
    });
    expect(
      g.asPlayerOne().playCard(source, {
        destinations: [
          { zone: "inkwell", cards: [top] },
          { zone: "deck-top", cards: [] },
        ],
      }),
    ).toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerOne().getCardZone(top)).toBe("inkwell");
    expect(g.isExerted(top)).toBe(true);
    expect(g.isCardFaceDown(top, "inkwell", PLAYER_ONE)).toBe(true);
  });
  it("rejects a card outside the looked-at set and permits a valid retry", () => {
    const below = createMockItem({ id: "direct-scry-below", name: "Below", cost: 1 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [source],
      inkwell: 1,
      deck: [below, top],
    });
    expect(
      g.asPlayerOne().playCard(source, {
        destinations: [
          { zone: "inkwell", cards: [below] },
          { zone: "deck-top", cards: [] },
        ],
      }),
    ).not.toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.getCardDefinitionIdsInZone("deck", PLAYER_ONE)).toEqual([below.id, top.id]);
    expect(
      g.asPlayerOne().playCard(source, {
        destinations: [
          { zone: "inkwell", cards: [top] },
          { zone: "deck-top", cards: [] },
        ],
      }),
    ).toBeSuccessfulCommand();
  });

  it("rejects skipping mandatory ink before payment", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [source],
      inkwell: 1,
      deck: [top],
    });
    expect(
      g.asPlayerOne().playCard(source, {
        destinations: [
          { zone: "inkwell", cards: [] },
          { zone: "deck-top", cards: [top] },
        ],
      }),
    ).not.toBeSuccessfulCommand();
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerOne().getCardZone(source)).toBe("hand");
    expect(g.asPlayerOne().getCardZone(top)).toBe("deck");
  });
});
