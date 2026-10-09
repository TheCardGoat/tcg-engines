import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockAction,
  createMockCharacter,
} from "../../testing";

const weak = createMockCharacter({ id: "banish-log-weak", name: "Weak", cost: 1, strength: 2 });
const strong = createMockCharacter({
  id: "banish-log-strong",
  name: "Strong",
  cost: 1,
  strength: 3,
});
const ward = createMockCharacter({
  id: "banish-log-ward",
  name: "Ward",
  cost: 1,
  strength: 1,
  abilities: [{ type: "keyword", keyword: "Ward" }],
});
const action = createMockAction({
  id: "chosen-banish-log",
  name: "Chosen Banish",
  cost: 2,
  abilities: [
    {
      type: "action",
      effect: {
        type: "banish",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [{ type: "strength-comparison", comparison: "less-or-equal", value: 2 }],
        },
      },
    },
  ],
});

describe("mandatory chosen banishment action logs", () => {
  it("explains player two's no-target completion without a false banishment", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { play: [strong, ward], deck: 3 },
      { hand: [action], inkwell: 2, deck: 3 },
    );
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    const actionId = g.findCardInstanceId(action, "hand", PLAYER_TWO);
    expect(g.asPlayerTwo().playCard(action)).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(actionId)).toBe("discard");
    expect(g.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    expect(g.asPlayerTwo()).toHavePendingEffectCount(0);
    expect(g.asPlayerOne().getCardZone(strong)).toBe("play");
    expect(g.asPlayerOne().getCardZone(ward)).toBe("play");
    const messages = g
      .asServer()
      .getMoveLogHistory()
      .filter((log) => log.moveType === "playCard")
      .flatMap((log) => log.public ?? []);
    expect(messages).toContainEqual({
      key: "lorcana.effect.cancelled",
      values: { playerId: PLAYER_TWO, sourceCardId: actionId, cause: "no-valid-targets" },
    });
    expect(messages.filter((message) => message.key === "lorcana.effect.cancelled")).toHaveLength(
      1,
    );
    expect(
      messages.filter((message) => message.key === "lorcana.outcome.cardBanished"),
    ).toHaveLength(0);
  });
  for (const deferred of [false, true])
    it(`does not cancel a successful ${deferred ? "deferred" : "immediate"} banishment`, () => {
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [action], inkwell: 2, deck: 3 },
        { play: [weak], deck: 3 },
      );
      expect(
        g.asPlayerOne().playCard(action, deferred ? undefined : { targets: [weak] }),
      ).toBeSuccessfulCommand();
      if (deferred)
        expect(g.asPlayerOne().resolveNextPending({ targets: [weak] })).toBeSuccessfulCommand();
      expect(g.asPlayerTwo().getCardZone(weak)).toBe("discard");
      const messages = g
        .asServer()
        .getMoveLogHistory()
        .flatMap((log) => log.public ?? []);
      expect(messages.filter((message) => message.key === "lorcana.effect.cancelled")).toHaveLength(
        0,
      );
    });
});
