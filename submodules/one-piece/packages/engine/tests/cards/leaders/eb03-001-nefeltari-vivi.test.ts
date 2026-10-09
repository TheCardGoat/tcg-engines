import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Izo002,
  eb01Minochihuahua036,
  eb01MountainGod018,
  eb01Yamato007,
  eb03NefeltariVivi001,
  op07Bluejam011,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-001 Nefeltari Vivi", () => {
  test("rests herself, grants Rush selectively, and modifies the opposing Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: eb03NefeltariVivi001,
        character: [{ card: eb01Yamato007, playedOnTurn: 1 }],
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const ownId = engine.findCardInZone("south", "character", eb01Yamato007);
    const opposingId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.leader.rested).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opposingId)?.power,
    ).toBe(1000);
    expect(() => engine.declareAttack(ownId, engine.leader("north"), "south")).not.toThrow();
    expect(engine.getState().capabilityHistory).toHaveLength(0);
    engine.endTurn("south");
    expect(engine.getView("north").players.north.characters[0]?.power).toBe(eb01Doma005.power);
  });

  test("replaces a cost-4 battle K.O. by trashing a hand card, but not a cost-1 K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: eb01MountainGod018, playedOnTurn: 0 },
          { card: eb01Izo002, playedOnTurn: 0 },
        ],
      },
      {
        leaderCardId: eb03NefeltariVivi001,
        hand: [eb01Yamato007, eb01Yamato007],
        character: [
          { card: eb01Minochihuahua036, rested: true },
          { card: eb01Doma005, rested: true },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const firstAttacker = engine.findCardInZone("south", "character", eb01MountainGod018);
    const secondAttacker = engine.findCardInZone("south", "character", eb01Izo002);
    const protectedId = engine.findCardInZone("north", "character", eb01Minochihuahua036);
    const excludedId = engine.findCardInZone("north", "character", eb01Doma005);
    const replacementId = engine.findCardInZone("north", "hand", eb01Yamato007);

    engine.declareAttack(firstAttacker, protectedId, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("battleKoReplacement", { selectedIds: [replacementId] }, "north");
    expect(
      engine
        .getView("north")
        .players.north.characters.some((card) => card?.instanceId === protectedId),
    ).toBe(true);

    engine.declareAttack(secondAttacker, excludedId, "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      excludedId,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        leaderCardId: eb03NefeltariVivi001,
        character: [{ card: eb01Yamato007, playedOnTurn: 1 }],
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.leader.rested).toBe(false);
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
  test("skipping the debuff still grants Rush, excluding a Character with When Attacking", () => {
    const e = OnePieceTestEngine.create(
      {
        leaderCardId: eb03NefeltariVivi001,
        character: [
          { card: eb01Yamato007, playedOnTurn: 1 },
          { card: op07Bluejam011, playedOnTurn: 1 },
        ],
      },
      { character: [eb01Doma005] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const recipient = e.findCardInZone("south", "character", eb01Yamato007);
    const excluded = e.findCardInZone("south", "character", op07Bluejam011);
    e.activateEffect(e.leader("south"), "activateMain", "south");
    e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");
    const step = e.pendingDecision("effectTargetSelection", "south").steps[0];
    if (step?.kind !== "selectEntity") throw Error("Expected Rush recipient");
    expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([recipient]);
    e.resolveDecision("effectTargetSelection", { selectedIds: [recipient] }, "south");
    expect(e.getView("south").players.north.characters[0]?.power).toBe(eb01Doma005.power);
    expect(
      e.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: excluded,
        targetId: e.leader("north"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");
    e.declareAttack(recipient, e.leader("north"), "south");
    expect(e.getView("south").players.south.characters[0]?.rested).toBe(true);
    expect(e.getView("south").prompts).toHaveLength(0);
  });

  test.each([true, false])(
    "effect K.O. uses base cost; first replacement accepted %s",
    (acceptFirst) => {
      const e = OnePieceTestEngine.create(
        {
          hand: ["OP02-117", "EB01-051", "EB01-051"],
          activeDon: 9,
          deck: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        },
        {
          leaderCardId: eb03NefeltariVivi001,
          character: [eb01Minochihuahua036, eb01Yamato007],
          hand: [eb01Doma005, eb01Yamato007],
        },
        { firstPlayer: "north", activeSeat: "south" },
      );
      const first = e.findCardInZone("north", "character", eb01Minochihuahua036);
      const second = e.findCardInZone("north", "character", eb01Yamato007);
      const payment = e.findCardInZone("north", "hand", eb01Doma005);
      e.playCard("OP02-117", "south");
      e.resolveDecision("effectTargetSelection", { selectedIds: [first] }, "south");
      expect(e.getView("north").players.north.characters[0]?.cost).toBe(0);
      e.playCard("EB01-051", "south");
      e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
      e.resolveDecision("effectTargetSelection", { selectedIds: [first] }, "south");
      e.resolveDecision("effectKoReplacement", { optionId: acceptFirst ? "yes" : "no" }, "north");
      if (acceptFirst) {
        e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [payment] }, "north");
      }
      e.playCard("EB01-051", "south");
      e.resolveDecision("effectOptional", { optionId: "yes" }, "south");
      e.resolveDecision("effectTargetSelection", { selectedIds: [second] }, "south");
      if (!acceptFirst) {
        e.resolveDecision("effectKoReplacement", { optionId: "yes" }, "north");
        e.resolveDecision("effectTrashFromHandSelection", { selectedIds: [payment] }, "north");
      }
      const view = e.getView("north");
      expect(view.players.north.characters.filter(Boolean).map((card) => card?.instanceId)).toEqual(
        [acceptFirst ? first : second],
      );
      expect(view.players.north.trash.map((card) => card.instanceId)).toEqual(
        expect.arrayContaining([payment, acceptFirst ? second : first]),
      );
      expect(view.players.north.handCount).toBe(1);
      expect(view.prompts).toHaveLength(0);
    },
  );
});
