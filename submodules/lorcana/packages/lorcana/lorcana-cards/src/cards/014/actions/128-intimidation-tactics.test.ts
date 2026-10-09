// CR 2.2.0: 6.1.3.1 (choice limiter), 1.7.7 (no legal choice),
// 5.4.2–5.4.3 (action resolution), 8.15.1 (Ward), 6.7.3 (current values).
import { describe, expect, it } from "bun:test";
import {
  LorcanaMultiplayerTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCharacter,
  createMockAction,
  createMockItem,
  createMockLocation,
} from "@tcg/lorcana-engine/testing";
import { intimidationTactics as tactics } from "./128-intimidation-tactics";
const weak = createMockCharacter({
  cost: 1,
  id: "tactics-weak",
  name: "Weak",
  strength: 2,
  willpower: 9,
});
const strong = createMockCharacter({
  cost: 1,
  id: "tactics-strong",
  name: "Strong",
  strength: 3,
  willpower: 9,
});
const ward = createMockCharacter({
  cost: 1,
  id: "tactics-ward",
  name: "Ward",
  strength: 1,
  abilities: [{ type: "keyword", keyword: "Ward" }],
});
const resistant = createMockCharacter({
  cost: 1,
  id: "tactics-resist",
  name: "Resistant",
  strength: 2,
  abilities: [{ type: "keyword", keyword: "Resist", value: 9 }],
});
const item = createMockItem({ cost: 1, id: "tactics-item", name: "Item" });
const location = createMockLocation({ cost: 1, id: "tactics-location", name: "Location" });
const buff = createMockAction({
  id: "tactics-buff",
  name: "Buff",
  cost: 0,
  abilities: [
    {
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 1,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    },
  ],
});
const debuff = createMockAction({
  id: "tactics-debuff",
  name: "Debuff",
  cost: 0,
  abilities: [
    {
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
    },
  ],
});

describe("Intimidation Tactics", () => {
  it("player two chooses only legal current characters, bypasses Resist and finishes without targets", () => {
    const zero = createMockCharacter({ cost: 1, id: "tactics-p2-zero", name: "Zero", strength: 0 });
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      {
        play: [zero, resistant, weak, strong, ward, item, location],
        hand: [zero],
        discard: [zero],
        inkwell: [zero],
        deck: [zero, strong, strong],
      },
      { play: [ward], hand: [buff, tactics, tactics, tactics, tactics], inkwell: 8, deck: 6 },
    );
    const zeroId = g.findCardInstanceId(zero, "play", PLAYER_ONE);
    const resistId = g.findCardInstanceId(resistant, "play", PLAYER_ONE);
    const ownWardId = g.findCardInstanceId(ward, "play", PLAYER_TWO);
    expect(g.asPlayerOne().passTurn()).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().playCard(buff, { targets: [weak] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardStrength(weak)).toBe(3);
    const before = g.getCardInstanceIdsInZone("deck", PLAYER_TWO);
    expect(g.asPlayerTwo().playCard(tactics, { targets: [weak] })).not.toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(8);
    expect(g.asPlayerTwo().playCard(tactics)).toBeSuccessfulCommand();
    const [pending] = g.asPlayerTwo().getPendingEffects();
    if (pending?.selectionContext?.kind !== "target-selection") throw new Error("Expected choice");
    expect(pending.selectionContext.cardCandidateIds.slice().sort()).toEqual(
      [zeroId, resistId, ownWardId].sort(),
    );
    expect(g.asPlayerOne().resolveNextPending({ targets: [resistId] })).not.toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(resistId)).toBe("play");
    expect(g.asPlayerTwo().resolveNextPending({ targets: [resistId] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(resistId)).toBe("discard");
    expect(g.asPlayerTwo().playCard(tactics, { targets: [zeroId] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(zeroId)).toBe("discard");
    expect(g.asPlayerTwo().playCard(tactics, { targets: [ownWardId] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(ownWardId)).toBe("discard");
    const noTargetActionId = g.findCardInstanceId(tactics, "hand", PLAYER_TWO);
    expect(g.asPlayerTwo().playCard(tactics)).toBeSuccessfulCommand();
    const noTargetLog = g.asServer().getMoveLogHistory().at(-1)?.public ?? [];
    expect(noTargetLog).toContainEqual({
      key: "lorcana.effect.cancelled",
      values: { playerId: PLAYER_TWO, sourceCardId: noTargetActionId, cause: "no-valid-targets" },
    });
    expect(
      noTargetLog.filter((message) => message.key === "lorcana.outcome.cardBanished"),
    ).toHaveLength(0);
    expect(g.asPlayerTwo()).toHavePendingEffectCount(0);
    expect(g.asPlayerTwo().getAvailableInk(PLAYER_TWO)).toBe(0);
    for (const card of [weak, strong, ward, item, location])
      expect(g.asPlayerOne().getCardZone(card)).toBe("play");
    expect(g.getCardInstanceIdsInZone("deck", PLAYER_TWO)).toEqual(before);
    expect(g.getCardInstanceIdsInZone("hand", PLAYER_ONE)).toHaveLength(1);
    expect(g.getCardInstanceIdsInZone("inkwell", PLAYER_ONE)).toHaveLength(1);
    expect(g.getCardInstanceIdsInZone("discard", PLAYER_TWO)).toHaveLength(6);
  });
  for (const strength of [0, 1, 2])
    it("banishes exactly the chosen opposing character at Strength " + strength, () => {
      const target = createMockCharacter({
        cost: 1,
        id: "tactics-boundary-" + strength,
        name: "Boundary",
        strength,
        willpower: 9,
      });
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [tactics], inkwell: 2 },
        { play: [target, strong] },
      );
      expect(g.asPlayerOne().playCard(tactics, { targets: [target] })).toBeSuccessfulCommand();
      expect(g.asPlayerTwo().getCardZone(target)).toBe("discard");
      expect(g.asPlayerTwo().getCardZone(strong)).toBe("play");
      expect(g.asPlayerOne().getCardZone(tactics)).toBe("discard");
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    });
  it("can banish its controller's own Ward character", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({
      hand: [tactics],
      play: [ward],
      inkwell: 2,
    });
    expect(g.asPlayerOne().playCard(tactics, { targets: [ward] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(ward)).toBe("discard");
  });
  it("ignores Resist because banishment does not deal damage", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [tactics], inkwell: 2 },
      { play: [resistant] },
    );
    expect(g.asPlayerOne().playCard(tactics, { targets: [resistant] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(resistant)).toBe("discard");
  });
  it("uses reduced current Strength, not printed Strength", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [debuff, tactics], inkwell: 2 },
      { play: [strong] },
    );
    expect(g.asPlayerOne().playCard(debuff, { targets: [strong] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(strong)).toBe(2);
    expect(g.asPlayerOne().playCard(tactics, { targets: [strong] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(strong)).toBe("discard");
  });
  it("rejects a printed Strength 2 character boosted to 3 without spending ink", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [buff, tactics], inkwell: 2 },
      { play: [weak] },
    );
    expect(g.asPlayerOne().playCard(buff, { targets: [weak] })).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardStrength(weak)).toBe(3);
    expect(g.asPlayerOne().playCard(tactics, { targets: [weak] }).success).toBe(false);
    expect(g.asPlayerTwo().getCardZone(weak)).toBe("play");
    expect(g.asPlayerOne().getCardZone(tactics)).toBe("hand");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
  });
  it("projects only legal current targets and requires one before resolving", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [tactics], play: [ward, item, location], inkwell: 2 },
      { play: [weak, strong, ward] },
    );
    const ownId = g.findCardInstanceId(ward, "play", "player_one");
    const weakId = g.findCardInstanceId(weak, "play", "player_two");
    expect(g.asPlayerOne().playCard(tactics)).toBeSuccessfulCommand();
    const [pending] = g.asPlayerOne().getPendingEffects();
    if (pending?.selectionContext?.kind !== "target-selection")
      throw new Error("Expected target selection");
    expect(pending.selectionContext.cardCandidateIds.slice().sort()).toEqual(
      [ownId, weakId].sort(),
    );
    expect(g.asPlayerOne().resolveNextPending({ targets: [] }).success).toBe(false);
    expect(g.asPlayerOne().resolveNextPending({ targets: [weakId] })).toBeSuccessfulCommand();
    expect(g.asPlayerTwo().getCardZone(weak)).toBe("discard");
    expect(g.asPlayerOne().getCardZone(ward)).toBe("play");
  });
  for (const invalid of ["strong", "ward", "item", "location", "hand", "discard", "multiple"])
    it("rejects " + invalid + " targets and permits a legal retry", () => {
      const hidden = createMockCharacter({
        cost: 1,
        id: "tactics-hidden-" + invalid,
        name: "Hidden",
        strength: 1,
      });
      const g = LorcanaMultiplayerTestEngine.createWithFixture(
        { hand: [tactics], inkwell: 2 },
        { play: [weak, strong, ward, item, location], hand: [hidden], discard: [resistant] },
      );
      const targets =
        invalid === "strong"
          ? [strong]
          : invalid === "ward"
            ? [ward]
            : invalid === "item"
              ? [item]
              : invalid === "location"
                ? [location]
                : invalid === "hand"
                  ? [hidden]
                  : invalid === "discard"
                    ? [resistant]
                    : [weak, strong];
      expect(g.asPlayerOne().playCard(tactics, { targets }).success).toBe(false);
      expect(g.asPlayerOne().getCardZone(tactics)).toBe("hand");
      expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(2);
      expect(g.asPlayerTwo().getCardZone(weak)).toBe("play");
      expect(g.asPlayerOne().playCard(tactics, { targets: [weak] })).toBeSuccessfulCommand();
      expect(g.asPlayerTwo().getCardZone(weak)).toBe("discard");
    });
  it("can be played with no legal targets and resolves without banishment", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [tactics], inkwell: 2 },
      { play: [strong, ward, item, location] },
    );
    expect(g.asPlayerOne().playCard(tactics)).toBeSuccessfulCommand();
    expect(g.asPlayerOne().getCardZone(tactics)).toBe("discard");
    expect(g.asPlayerOne()).toHavePendingEffectCount(0);
    for (const card of [strong, ward, item, location])
      expect(g.asPlayerTwo().getCardZone(card)).toBe("play");
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
  });
  it("cannot be played with only one ink", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [tactics], inkwell: 1 },
      { play: [weak] },
    );
    expect(g.asPlayerOne().playCard(tactics, { targets: [weak] }).success).toBe(false);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(1);
    expect(g.asPlayerTwo().getCardZone(weak)).toBe("play");
  });
  it("can pay exactly two with one ink and one claimed ink drop", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture(
      { hand: [tactics], inkwell: 1, inkDrops: 1 },
      { play: [weak] },
    );
    expect(
      g.asPlayerOne().playCard(tactics, { targets: [weak], inkDrops: 1 }),
    ).toBeSuccessfulCommand();
    expect(g.getInkDrops(PLAYER_ONE)).toBe(0);
    expect(g.asServer().getAvailableInk(PLAYER_ONE)).toBe(0);
    expect(g.asPlayerTwo().getCardZone(weak)).toBe("discard");
  });
  it("cannot be put into the inkwell", () => {
    const g = LorcanaMultiplayerTestEngine.createWithFixture({ hand: [tactics] });
    expect(g.asPlayerOne().putIntoInkwell(PLAYER_ONE, tactics).success).toBe(false);
    expect(g.asPlayerOne().getCardZone(tactics)).toBe("hand");
  });
});
