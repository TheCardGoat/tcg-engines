import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Izo002,
  eb01Minochihuahua036,
  eb01MountainGod018,
  eb01Yamato007,
  eb03NefeltariVivi001,
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
  });

  test("replaces a cost-4 battle K.O. by trashing a hand card, but not a cost-3 K.O.", () => {
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
    expect(after.activeDon + after.restedDon).toBe(donPoolBefore);
    expect(after.donDeckCount).toBe(donDeckBefore);
    expect(after.hand.length).toBe(handBefore);
    expect(after.lifeCount).toBe(lifeBefore);
    expect(after.deckCount).toBe(deckBefore);
    expect(after.trash.length).toBe(trashBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
