import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockUnit,
  expectFailure,
  expectSuccess,
  restedResources,
} from "@tcg/gundam-engine";
import { st02PeacefulTimbre013 } from "./013-peaceful-timbre.ts";

describe("Peaceful Timbre (ST02-013)", () => {
  describe("【Action】During this battle, your shield area cards can't receive damage from enemy Units that are Lv.4 or lower.", () => {
    it("prevents an enemy Lv.4 Unit from dealing battle damage to the controller's Base", () => {
      const attacker = createMockUnit({ level: 4, ap: 3, hp: 5 });
      const base = createMockBase({ hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st02PeacefulTimbre013],
          baseSection: [base],
          resourceArea: activeResources(4),
          deck: 3,
        },
        { play: [attacker], deck: 3 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandId = p1.getHand()[0]!;
      const baseId = p1.getCardsInZone("baseSection")[0]!;
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p2.enterBattle(attackerId, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.playCommand(commandId));
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getDamage(baseId)).toBe(0);
      expect(p1.getCardZone(baseId)).toBe(`baseSection:${PLAYER_ONE}`);
      expect(p1.getCardZone(commandId)).toBe(`trash:${PLAYER_ONE}`);
    });

    it("prevents an enemy Lv.4 Unit from destroying the controller's Shield", () => {
      const attacker = createMockUnit({ level: 4, ap: 4, hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st02PeacefulTimbre013],
          shieldArea: [createMockUnit({ name: "Shield" })],
          resourceArea: activeResources(4),
          deck: 3,
        },
        { play: [attacker], deck: 3 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const shieldsBefore = p1.getBoardView().players[PLAYER_ONE]!.shieldCount;

      expectSuccess(p2.enterBattle(p2.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.playCommand(st02PeacefulTimbre013));
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getBoardView().players[PLAYER_ONE]!.shieldCount).toBe(shieldsBefore);
      expect(p1.getCardsInZone("trash")).toHaveLength(1);
    });

    it("does not prevent battle damage from an enemy Lv.5 Unit", () => {
      const attacker = createMockUnit({ level: 5, ap: 3, hp: 5 });
      const base = createMockBase({ hp: 5 });
      const engine = GundamTestEngine.create(
        {
          hand: [st02PeacefulTimbre013],
          baseSection: [base],
          resourceArea: activeResources(4),
          deck: 3,
        },
        { play: [attacker], deck: 3 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const baseId = p1.getCardsInZone("baseSection")[0]!;

      expectSuccess(p2.enterBattle(p2.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.playCommand(st02PeacefulTimbre013));
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());

      expect(p1.getDamage(baseId)).toBe(3);
    });

    it("expires after that battle and does not protect the Base in a later battle", () => {
      const firstAttacker = createMockUnit({ name: "First Attacker", level: 4, ap: 2, hp: 5 });
      const secondAttacker = createMockUnit({ name: "Second Attacker", level: 4, ap: 2, hp: 5 });
      const base = createMockBase({ hp: 6 });
      const engine = GundamTestEngine.create(
        {
          hand: [st02PeacefulTimbre013],
          baseSection: [base],
          resourceArea: activeResources(4),
          deck: 3,
        },
        { play: [firstAttacker, secondAttacker], deck: 3 },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const baseId = p1.getCardsInZone("baseSection")[0]!;
      const [firstId, secondId] = p2.getCardsInZone("battleArea");

      expectSuccess(p2.enterBattle(firstId!, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.playCommand(st02PeacefulTimbre013));
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      expect(p1.getDamage(baseId)).toBe(0);

      expectSuccess(p2.enterBattle(secondId!, "direct"));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());

      expect(p1.getDamage(baseId)).toBe(2);
    });

    it("cannot be played during the Main Phase", () => {
      const engine = GundamTestEngine.create({
        hand: [st02PeacefulTimbre013],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.playCommand(st02PeacefulTimbre013), "WRONG_TIMING");
      expect(p1.getCardZone(st02PeacefulTimbre013)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot be played below its printed Lv.4 requirement", () => {
      const attacker = createMockUnit({ level: 4, ap: 2, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [st02PeacefulTimbre013],
          baseSection: [createMockBase({ hp: 5 })],
          resourceArea: activeResources(3),
        },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p2.enterBattle(p2.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p1.passBlock());
      expectFailure(p1.playCommand(st02PeacefulTimbre013), "INSUFFICIENT_RESOURCE_LEVEL");

      expect(p1.getCardZone(st02PeacefulTimbre013)).toBe(`hand:${PLAYER_ONE}`);
    });

    it("cannot pay its printed cost without an active Resource", () => {
      const attacker = createMockUnit({ level: 4, ap: 2, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [st02PeacefulTimbre013],
          baseSection: [createMockBase({ hp: 5 })],
          resourceArea: restedResources(4),
        },
        { play: [attacker] },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      expectSuccess(p2.enterBattle(p2.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p1.passBlock());
      expectFailure(p1.playCommand(st02PeacefulTimbre013), "INSUFFICIENT_RESOURCES");

      expect(p1.getCardZone(st02PeacefulTimbre013)).toBe(`hand:${PLAYER_ONE}`);
    });
  });

  describe("【Pilot】[Quatre Raberba Winner]", () => {
    it("pairs as Quatre Raberba Winner and applies AP+1 and HP+1 to the host Unit", () => {
      const host = createMockUnit({ ap: 2, hp: 3, linkCondition: "[Quatre Raberba Winner]" });
      const engine = GundamTestEngine.create({
        hand: [st02PeacefulTimbre013],
        play: [host],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const commandId = p1.getHand()[0]!;

      expectSuccess(p1.playCommandAsPilot(commandId, hostId));

      expect(p1.getPilotId(hostId)).toBe(commandId);
      expect(p1.getCardZone(commandId)).toBe(`battleArea:${PLAYER_ONE}`);
      expect(p1.getVisibleCard(hostId)).toMatchObject({ effectiveAp: 3, effectiveHp: 4 });
    });
  });
});
