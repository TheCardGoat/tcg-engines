import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockItem,
  createMockCharacter,
  PLAYER_ONE,
} from "./index";
const item = createMockItem({
  id: "reveal-cost-item",
  name: "Reveal Cost Item",
  cost: 2,
  abilities: [
    {
      type: "activated",
      name: "Reveal Pair",
      cost: { exert: true, revealCards: 2, revealSameName: true },
      effect: { type: "gain-lore", amount: 1, target: "CONTROLLER" },
    },
  ],
});
const first = createMockCharacter({ id: "reveal-cost-first", name: "Pair", cost: 3 });
const second = createMockCharacter({ id: "reveal-cost-second", name: "Pair", cost: 3 });
const other = createMockCharacter({ id: "reveal-cost-other", name: "Other", cost: 3 });
const foreign = createMockCharacter({ id: "reveal-cost-foreign", name: "Pair", cost: 3 });
const inPlay = createMockCharacter({ id: "reveal-cost-in-play", name: "Pair", cost: 3 });

describe("revealed hand cards as an activation cost", () => {
  for (const scenario of [
    "missing",
    "single",
    "duplicate",
    "different-name",
    "foreign-hand",
    "in-play",
    "too-many",
  ] as const) {
    it(`rejects ${scenario} before exerting or granting the effect`, () => {
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [first, second, other], play: [item, inPlay] },
        { hand: [foreign] },
      );
      const cards =
        scenario === "missing"
          ? []
          : scenario === "single"
            ? [first]
            : scenario === "duplicate"
              ? [first, first]
              : scenario === "different-name"
                ? [first, other]
                : scenario === "foreign-hand"
                  ? [first, foreign]
                  : scenario === "in-play"
                    ? [first, inPlay]
                    : [first, second, other];
      expect(
        engine.asPlayerOne().activateAbility(item, { costs: { revealCards: cards } }),
      ).not.toBeSuccessfulCommand();
      expect(engine.asPlayerOne().isExerted(item)).toBe(false);
      expect(engine.getLore(PLAYER_ONE)).toBe(0);
      expect(
        engine.asPlayerOne().activateAbility(item, { costs: { revealCards: [first, second] } }),
      ).toBeSuccessfulCommand();
      expect(engine.asPlayerOne().isExerted(item)).toBe(true);
      expect(engine.getLore(PLAYER_ONE)).toBe(1);
      expect(engine.asPlayerOne().getCardZone(first)).toBe("hand");
      expect(engine.asPlayerOne().getCardZone(second)).toBe("hand");
    });
  }
  it("does not offer an activation without a complete same-name pair", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [first, other],
      play: [item],
    });
    expect(
      engine
        .asPlayerOne()
        .getAvailableMoves()
        .find((move) => move.moveId === "activateAbility"),
    ).toBeUndefined();
  });
  it("offers a reveal-cost choice when a complete pair exists", () => {
    const engine = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [first, second, other],
      play: [item],
    });
    const move = engine
      .asPlayerOne()
      .getAvailableMoves()
      .find((entry) => entry.moveId === "activateAbility");
    expect(move?.selectableCardIds.length).toBe(1);
    if (!move?.selectableCardIds[0]) throw new Error("Expected reveal-cost item to be available");
    const options = engine
      .asPlayerOne()
      .getMoveOptions("activateAbility", move.selectableCardIds[0]);
    if (options[0]?.kind !== "ability") throw new Error("Expected ability option");
    expect(options[0].selectableCosts?.[0]?.candidateCardIds.length).toBe(2);
    expect(options[0].selectableCosts?.[0]?.candidateGroups?.[0]?.length).toBe(2);
    expect(options[0]).toMatchObject({
      kind: "ability",
      selectableCosts: [
        {
          kind: "revealCards",
          count: 2,
          candidateCardIds: expect.any(Array),
          candidateGroups: expect.any(Array),
        },
      ],
    });
    expect(
      engine.asPlayerOne().activateAbility(item, { costs: { revealCards: [first, second] } }),
    ).toBeSuccessfulCommand();
    const reveals = engine
      .getServerEngine()
      .getRuntime()
      .getMoveLogHistory()
      .flatMap((entry) => entry.public)
      .filter((message) => message.key === "lorcana.outcome.revealedCard");
    expect(reveals).toHaveLength(2);
    expect(new Set(reveals.map((message) => message.values.revealedCardId))).toEqual(
      new Set([
        engine.findCardInstanceId(first, "hand", "p1"),
        engine.findCardInstanceId(second, "hand", "p1"),
      ]),
    );
  });
});
