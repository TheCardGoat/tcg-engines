import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  createMockCharacter,
  createMockAction,
  PLAYER_ONE,
  PLAYER_TWO,
} from "../../../testing";

// CR 6.1.2–6.1.3: interpret the full target group, including its owner constraint.
describe("chosen cards sharing one owner", () => {
  it("rejects mixed-owner inline action targets without payment or movement, then accepts a legal retry", () => {
    const action = createMockAction({
      id: "same-owner-action",
      name: "Same Owner Action",
      cost: 1,
      abilities: [
        {
          type: "action",
          effect: {
            type: "put-on-bottom",
            target: {
              selector: "chosen",
              owner: "any",
              zones: ["discard"],
              cardTypes: ["card"],
              count: { upTo: 2 },
              requireSameOwner: true,
            },
          },
        },
      ],
    });
    const own = createMockCharacter({ id: "same-owner-inline-own", name: "Own", cost: 1 });
    const otherOwn = createMockCharacter({
      id: "same-owner-inline-other",
      name: "Other Own",
      cost: 1,
    });
    const opposing = createMockCharacter({
      id: "same-owner-inline-opposing",
      name: "Opposing",
      cost: 1,
    });
    const engine = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [action], inkwell: 1, discard: [own, otherOwn], deck: [] },
      { discard: [opposing], deck: [] },
    );
    const ownId = engine.findCardInstanceId(own, "discard", PLAYER_ONE);
    const otherId = engine.findCardInstanceId(otherOwn, "discard", PLAYER_ONE);
    const opposingId = engine.findCardInstanceId(opposing, "discard", PLAYER_TWO);
    expect(
      engine.asPlayerOne().playCard(action, { targets: [ownId, opposingId] }),
    ).not.toBeSuccessfulCommand();
    expect(engine.asServer().getCardZone(action)).toBe("hand");
    expect(engine.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(engine.asPlayerOne()).toHaveZoneCounts({ discard: 2, deck: 0 });
    expect(engine.asPlayerTwo()).toHaveZoneCounts({ discard: 1, deck: 0 });
    expect(
      engine.asPlayerOne().playCard(action, { targets: [ownId, otherId] }),
    ).toBeSuccessfulCommand();
    expect(engine.asServer().getCardZone(own)).toBe("deck");
    expect(engine.asServer().getCardZone(otherOwn)).toBe("deck");
    expect(engine.asServer().getCardZone(opposing)).toBe("discard");
  });
  for (const constrained of [false, true]) {
    it(`${constrained ? "rejects" : "allows"} mixed owners ${constrained ? "with" : "without"} the constraint`, () => {
      const source = createMockCharacter({
        id: "same-owner-source",
        name: "Same Owner Source",
        cost: 1,
        abilities: [
          {
            type: "triggered",
            trigger: { event: "play", on: "SELF", timing: "when" },
            effect: {
              type: "put-on-bottom",
              target: {
                selector: "chosen",
                owner: "any",
                zones: ["discard"],
                cardTypes: ["card"],
                count: { upTo: 2 },
                ...(constrained ? { requireSameOwner: true } : {}),
              },
            },
          },
        ],
      });
      const own = createMockCharacter({ id: "same-owner-own", name: "Own Card", cost: 1 });
      const opponent = createMockCharacter({
        id: "same-owner-opponent",
        name: "Opponent Card",
        cost: 1,
      });
      const engine = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [source], inkwell: 1, discard: [own], deck: 5 },
        { discard: [opponent], deck: 5 },
      );
      const ownId = engine.findCardInstanceId(own, "discard", PLAYER_ONE);
      const opponentId = engine.findCardInstanceId(opponent, "discard", PLAYER_TWO);
      expect(engine.asPlayerOne().playCard(source)).toBeSuccessfulCommand();
      const result = engine
        .asPlayerOne()
        .resolvePendingByCard(source, { targets: [ownId, opponentId] });
      if (constrained) expect(result).not.toBeSuccessfulCommand();
      else expect(result).toBeSuccessfulCommand();
      expect(engine.asServer().getCardZone(own)).toBe(constrained ? "discard" : "deck");
      expect(engine.asServer().getCardZone(opponent)).toBe(constrained ? "discard" : "deck");
    });
  }
});
