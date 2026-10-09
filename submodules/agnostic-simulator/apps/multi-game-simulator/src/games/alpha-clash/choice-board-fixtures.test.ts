import { describe, it, expect } from "vitest";
import { getPrintedCard } from "@tcg/alpha-clash-cards";
import { boardChoiceCases, variants, buildBoardChoice, choiceBoard } from "./choice-board-fixtures";
import { choiceProblems, placeChoice } from "@tcg/simulator-presentation/choice-drag";
describe("real-card board choice fixtures", () => {
  for (const [kind] of boardChoiceCases)
    for (const variant of variants[kind])
      it(`${kind}: ${variant} has real cards and resolvable candidates`, () => {
        const board = choiceBoard();
        const fixture = buildBoardChoice(kind, variant, board);
        expect(getPrintedCard(fixture.sourceId).printings[0].productId).toBeTruthy();
        expect(new Set(fixture.tokens.map((t) => t.id)).size).toBe(fixture.tokens.length);
        for (const slot of fixture.slots)
          for (const id of slot.accepts) expect(fixture.tokens.some((t) => t.id === id)).toBe(true);
        for (const card of board.cards) {
          if (card.definitionId) expect(card.definitionId).not.toContain("acx");
          if (card.definitionId) expect(getPrintedCard(card.definitionId).name).toBe(card.name);
        }
        expect(
          board.cards.filter(
            (c) => c.controller === "player-two" && (c.zone === "hand" || c.zone === "deck"),
          ),
        ).toSatisfy((cards: typeof board.cards) =>
          cards.every((card) => card.faceDown && card.definitionId === null && card.name === null),
        );
      });
  it("does not allow confirming one resource twice", () => {
    const fixture = buildBoardChoice("resources", "Colored payment", choiceBoard());
    const first = placeChoice(fixture.slots, {}, "white-1", "white");
    const second = placeChoice(fixture.slots, first, "white-1", "any");
    expect(choiceProblems(fixture.slots, second)).not.toEqual([]);
  });
  it("additional cost requires resources as well as the sacrificed accessory", () => {
    const fixture = buildBoardChoice("costs", "Additional", choiceBoard(), "additional");
    expect(fixture.slots.map((s) => s.id)).toEqual(["route", "colored", "generic", "payment"]);
    expect(
      choiceProblems(fixture.slots, { route: ["additional"], payment: ["weapon"] }),
    ).not.toEqual([]);
  });
  it("only reveals the permitted top cards for Foretell", () => {
    const fixture = buildBoardChoice("foretell", "Top / Bottom", choiceBoard());
    expect(fixture.tokens.map((t) => t.id)).toEqual(["look-1", "look-2"]);
    expect(fixture.requiredTotal).toBe(2);
  });
});
