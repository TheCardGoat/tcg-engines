import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op01PageOne112 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP01-112 Page One", () => {
  test("pays DON!! once per turn to attack active Characters only during that turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01PageOne112, playedOnTurn: 0 }],
        activeDon: 2,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const pageOneId = engine.findCardInZone("south", "character", op01PageOne112);
    const activeTargetId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const donDeckBefore = engine.getView("south").players.south.donDeckCount;

    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: pageOneId,
        targetId: activeTargetId,
      }).accepted,
    ).toBe(false);

    engine.activateEffect(pageOneId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 1,
      donDeckCount: donDeckBefore + 1,
    });

    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: pageOneId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);

    engine.declareAttack(pageOneId, activeTargetId, "south");
    expect(
      engine
        .getView("south")
        .players.north.characters.some((card) => card?.instanceId === activeTargetId),
    ).toBe(true);

    engine.endTurn("south");
    engine.endTurn("north");
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: pageOneId,
        targetId: activeTargetId,
      }).accepted,
    ).toBe(false);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op01PageOne112, playedOnTurn: 0 }],
        activeDon: 2,
      },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const pageOneId = engine.findCardInZone("south", "character", op01PageOne112);
    engine.activateEffect(pageOneId, "activateMain", "south");

    const before = engine.getView("south").players.south;
    const donPoolBefore = before.activeDon + before.restedDon;
    const donDeckBefore = before.donDeckCount;
    const handBefore = before.hand.length;
    const lifeBefore = before.lifeCount;
    const deckBefore = before.deckCount;
    const trashBefore = before.trash.length;
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");
    const after = engine.getView("south").players.south;
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
