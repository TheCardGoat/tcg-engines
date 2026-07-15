import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd04Zeong017 } from "./017-zeong.ts";

describe("Zeong (GD04-017)", () => {
  describe("【When Paired･(Newtype) Pilot】Deploy 2 [Wire-Guided Arm]((Zeon)･AP2･HP1・This Unit can't be paired with a Pilot) Unit tokens.", () => {
    it("deploys two active Wire-Guided Arm tokens when paired with a Newtype Pilot", () => {
      const newtypePilot = createMockPilot({
        name: "Char Aznable",
        traits: ["newtype"],
        level: 6,
        cost: 1,
      });
      const engine = GundamTestEngine.create({
        hand: [newtypePilot],
        play: [gd04Zeong017],
        resourceArea: activeResources(7),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const battleAreaBefore = p1.getCardsInZone("battleArea");
      const pilotId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(newtypePilot, gd04Zeong017));

      const tokenIds = p1
        .getCardsInZone("battleArea")
        .filter((cardId) => !battleAreaBefore.includes(cardId) && cardId !== pilotId);
      expect(tokenIds).toHaveLength(2);
      for (const tokenId of tokenIds) {
        expect(p1.isExhausted(tokenId)).toBe(false);
        expect(p1.getVisibleCard(tokenId)).toMatchObject({ effectiveAp: 2, effectiveHp: 1 });
      }
    });

    it("does not deploy tokens when the paired Pilot lacks the Newtype trait", () => {
      const plainPilot = createMockPilot({
        name: "Char Aznable",
        traits: [],
        level: 6,
        cost: 1,
      });
      const engine = GundamTestEngine.create({
        hand: [plainPilot],
        play: [gd04Zeong017],
        resourceArea: activeResources(7),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const battleAreaBefore = p1.getCardsInZone("battleArea");
      const pilotId = p1.getHand()[0]!;

      expectSuccess(p1.assignPilot(plainPilot, gd04Zeong017));

      expect(
        p1
          .getCardsInZone("battleArea")
          .filter((cardId) => !battleAreaBefore.includes(cardId) && cardId !== pilotId),
      ).toHaveLength(0);
    });
  });

  describe("【Destroyed】Deploy 1 rested [Zeong (Head)]((Zeon)･AP3･HP1) Unit token.", () => {
    it("deploys a rested Zeong Head token after Zeong is destroyed in battle", () => {
      const attacker = createMockUnit({ name: "Enemy Attacker", ap: 3, hp: 8 });
      const engine = GundamTestEngine.create(
        { play: [{ card: gd04Zeong017, exhausted: true }] },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const zeongId = p1.getCardsInZone("battleArea")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, zeongId));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());

      const zeongHeadId = p1.getCardsInZone("battleArea")[0]!;
      expect(p1.getCardsInZone("trash")).toContain(zeongId);
      expect(zeongHeadId).not.toBe(zeongId);
      expect(p1.isExhausted(zeongHeadId)).toBe(true);
      expect(p1.getVisibleCard(zeongHeadId)).toMatchObject({ effectiveAp: 3, effectiveHp: 1 });
    });
  });
});
