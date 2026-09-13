import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op02EdwardNewgate001,
  op02Seaquake021,
  op08WeWouldNeverSellAComradeToAnEnemy038,
} from "@tcg/op-cards";
import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-038 We Would Never Sell a Comrade to an Enemy!!!", () => {
  test("Main rest cost protects Characters from the opponent's effect but not a later battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op08WeWouldNeverSellAComradeToAnEnemy038],
        character: [{ card: eb01Doma005, playedOnTurn: 0 }, eb01Fourtricks025],
        activeDon: 1,
      },
      {
        leaderCardId: op02EdwardNewgate001,
        hand: [op02Seaquake021],
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        activeDon: 1,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const protectedId = engine.findCardInZone("south", "character", eb01Doma005);
    engine.playCard(op08WeWouldNeverSellAComradeToAnEnemy038);
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.endTurn("south");
    engine.playCard(op02Seaquake021);
    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 0, candidates: [] });
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "north");
    expect(
      engine.getView("south").players.south.characters.some((c) => c?.instanceId === protectedId),
    ).toBe(true);
    const attacker = engine.findCardInZone("north", "character", eb01MountainGod018);
    engine.declareAttack(attacker, protectedId, "north");
    expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(
      protectedId,
    );
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may decline optional so paid effect does not apply", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op08WeWouldNeverSellAComradeToAnEnemy038],
        character: [{ card: eb01Doma005, playedOnTurn: 0 }, eb01Fourtricks025],
        activeDon: 1,
      },
      {
        leaderCardId: op02EdwardNewgate001,
        hand: [op02Seaquake021],
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        activeDon: 1,
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    engine.playCard(op08WeWouldNeverSellAComradeToAnEnemy038, "south");
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
