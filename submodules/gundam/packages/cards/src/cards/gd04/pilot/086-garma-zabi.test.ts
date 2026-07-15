import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockResource,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04GarmaZabi086 } from "./086-garma-zabi.ts";

describe("Garma Zabi (GD04-086)", () => {
  it("【Burst】adds this card to hand when its controller accepts the revealed Shield prompt", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1 });
    const engine = GundamTestEngine.create(
      { shieldArea: [gd04GarmaZabi086] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const shieldId = p1.getCardsInZone("shieldArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());
    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: shieldId,
      directiveIndex: -1,
    });
    expectSuccess(p1.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p1.getHand()).toContain(shieldId);
  });

  describe("【During Link】【Destroyed】If you have no EX Resources, place 1 EX Resource.", () => {
    it("places an active EX Resource when the linked Unit is destroyed in battle with no EX Resources", () => {
      const host = createMockUnit({
        name: "Garma Host",
        linkCondition: "[Garma Zabi]",
        ap: 2,
        hp: 2,
      });
      const defender = createMockUnit({ name: "Enemy Defender", ap: 2, hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04GarmaZabi086],
          play: [host],
          resourceArea: activeResources(3),
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p1.getHand()[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const resourcesBefore = p1.getCardsInZone("resourceArea");

      expectSuccess(p1.assignPilot(gd04GarmaZabi086, hostId));
      expectSuccess(p1.enterBattle(hostId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      const resourcesAfter = p1.getCardsInZone("resourceArea");
      const exResourceId = resourcesAfter.find((cardId) => !resourcesBefore.includes(cardId));
      expect(p1.getCardsInZone("trash")).toEqual(expect.arrayContaining([hostId, pilotId]));
      expect(resourcesAfter).toHaveLength(resourcesBefore.length + 1);
      expect(exResourceId).toBeDefined();
      expect(p1.isExhausted(exResourceId!)).toBe(false);
    });

    it("does not place an EX Resource when one already exists", () => {
      const host = createMockUnit({
        name: "Garma Host",
        linkCondition: "[Garma Zabi]",
        ap: 2,
        hp: 2,
      });
      const defender = createMockUnit({ name: "Enemy Defender", ap: 2, hp: 6 });
      const existingExResource = createMockResource({ name: "EX Resource" });
      const engine = GundamTestEngine.create(
        {
          hand: [gd04GarmaZabi086],
          play: [host],
          resourceArea: [...activeResources(3), { card: existingExResource, isToken: true }],
        },
        { play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const resourcesBefore = p1.getCardsInZone("resourceArea");

      expectSuccess(p1.assignPilot(gd04GarmaZabi086, hostId));
      expectSuccess(p1.enterBattle(hostId, defenderId));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getCardsInZone("resourceArea")).toEqual(resourcesBefore);
    });
  });
});
