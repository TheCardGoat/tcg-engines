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
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    engine.resolveDecision("effectTargetSelection", { selectedIds: [protectedId] }, "north");
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
  test("protection does not prevent the controller's own effect KO", () => {
    const e = OnePieceTestEngine.create({
      leaderCardId: "ST01-001",
      hand: ["OP08-038"],
      activeDon: 1,
      character: ["OP04-079", "ST02-002"],
    });
    const id = e.findCardInZone("south", "character", "OP04-079");
    e.asSouth().play("OP08-038");
    e.asSouth().acceptOptional();
    e.asSouth().activateMain(id);
    expect(e.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(id);
    expect(e.getView("south").players.south.deckCount).toBe(8);
  });

  test("Life Trigger rests one eligible opposing Character without Main payment", () => {
    const e = OnePieceTestEngine.create(
      { leaderCardId: "ST01-001", character: ["EB01-005", "EB01-018"] },
      { leaderCardId: "ST01-001", life: ["OP08-038"] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const eligible = e.findCardInZone("south", "character", "EB01-005"),
      excluded = e.findCardInZone("south", "character", "EB01-018");
    e.declareAttack(e.leader("south"), e.leader("north"), "south");
    e.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    const choice = e.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(choice).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (choice?.kind !== "selectEntity") throw new Error("Expected Trigger rest target");
    expect(choice.candidates.map((c) => c.ref.id)).toContain(eligible);
    expect(choice.candidates.map((c) => c.ref.id)).not.toContain(excluded);
    e.resolveDecision("effectTargetSelection", { selectedIds: [eligible] }, "north");
    expect(
      e.getView("north").players.south.characters.find((c) => c?.instanceId === eligible)?.rested,
    ).toBe(true);
    expect(
      e.getView("north").players.south.characters.find((c) => c?.instanceId === excluded)?.rested,
    ).toBe(false);
    expect(e.getView("north").prompts).toHaveLength(0);
  });
});
