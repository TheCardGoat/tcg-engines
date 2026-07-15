import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { gd03Nyaan092 } from "./092-nyaan.ts";

describe("Nyaan (GD03-092)", () => {
  it("【Burst】 adds this card to hand", () => {
    const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 3 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { shieldArea: [gd03Nyaan092] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, "direct"));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());
    expect(p2.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      directiveIndex: -1,
    });
    expectSuccess(p2.resolveEffect({ optionalAnswers: { [-1]: true } }));

    expect(p2.getCardZone(gd03Nyaan092)).toBe(`hand:${PLAYER_TWO}`);
  });

  describe("【When Linked】Place the top card of your deck into your trash. If you placed a (Zeon)/(Clan) card with this effect, choose 1 enemy Unit. Deal 1 damage to it.", () => {
    it("mills the top Zeon card and deals 1 damage to a chosen enemy Unit", () => {
      const host = createMockUnit({
        name: "Nyaan Host",
        ap: 2,
        hp: 4,
        level: 4,
        cost: 2,
        linkCondition: "[Nyaan]",
      });
      const zeonCard = createMockUnit({ name: "Zeon Mill", traits: ["zeon"] });
      const bottomSentinel = createMockUnit({ name: "Bottom Sentinel" });
      const enemy = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03Nyaan092],
          play: [host],
          deck: [bottomSentinel, zeonCard],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p1.getHand()[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilotId, hostId));
      expect(p1.getCardZone(zeonCard)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("deck")).toHaveLength(1);
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: pilotId,
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p2.getDamage(enemyId)).toBe(1);
    });

    it("mills the top Clan card and deals 1 damage to a chosen enemy Unit", () => {
      const host = createMockUnit({
        name: "Nyaan Host",
        ap: 2,
        hp: 4,
        level: 4,
        cost: 2,
        linkCondition: "[Nyaan]",
      });
      const clanCard = createMockUnit({ name: "Clan Mill", traits: ["clan"] });
      const bottomSentinel = createMockUnit({ name: "Bottom Sentinel" });
      const enemy = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03Nyaan092],
          play: [host],
          deck: [bottomSentinel, clanCard],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p1.getHand()[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilotId, hostId));
      expect(p1.getCardZone(clanCard)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("deck")).toHaveLength(1);
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        sourceCardId: pilotId,
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p2.getDamage(enemyId)).toBe(1);
    });

    it("loses immediately without publishing a damage target when the final deck card is Zeon", () => {
      const host = createMockUnit({
        name: "Nyaan Host",
        ap: 2,
        hp: 4,
        level: 4,
        cost: 2,
        linkCondition: "[Nyaan]",
      });
      const finalZeonCard = createMockUnit({ name: "Final Zeon Card", traits: ["zeon"] });
      const enemy = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03Nyaan092],
          play: [host],
          deck: [finalZeonCard],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p1.getHand()[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilotId, hostId));

      expect(p1.getBoardView().winner).toBe(PLAYER_TWO);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getDamage(enemyId)).toBe(0);
    });

    it("mills without dealing damage when the top card is not Zeon or Clan", () => {
      const host = createMockUnit({
        name: "Nyaan Host",
        ap: 2,
        hp: 4,
        level: 4,
        cost: 2,
        linkCondition: "[Nyaan]",
      });
      const nonMatch = createMockUnit({ name: "Non-match", traits: ["vagan"] });
      const bottomSentinel = createMockUnit({ name: "Bottom Sentinel" });
      const enemy = createMockUnit({ ap: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03Nyaan092],
          play: [host],
          deck: [bottomSentinel, nonMatch],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const pilotId = p1.getHand()[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilotId, hostId));

      expect(p1.getCardZone(nonMatch)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("deck")).toHaveLength(1);
      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p2.getDamage(enemyId)).toBe(0);
    });

    it("does not mill when Nyaan's paired Unit is not linked", () => {
      const host = createMockUnit({ linkCondition: "[Different Pilot]" });
      const zeonCard = createMockUnit({ traits: ["zeon"] });
      const enemy = createMockUnit({ hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03Nyaan092],
          play: [host],
          deck: [zeonCard],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd03Nyaan092, hostId));

      expect(p1.getBoardView().pendingChoice).toBeUndefined();
      expect(p1.getCardsInZone("deck")).toHaveLength(1);
      expect(p1.getCardsInZone("trash")).toHaveLength(0);
      expect(p2.getDamage(enemyId)).toBe(0);
    });
  });
});
