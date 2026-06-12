import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockBase,
  createMockUnit,
  expectCardInTrash,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03EmmaSheen099 } from "./099-emma-sheen.ts";

describe("Emma Sheen (GD03-099)", () => {
  it("【Burst】Add this card to your hand.", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03EmmaSheen099] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.asPlayer(PLAYER_TWO).getHand()).toContain(shieldId);
  });

  describe("【During Link】【Destroyed】If a friendly white Base is in play, choose 1 enemy Unit whose Lv. is equal to or lower than this Unit. Return it to its owner's hand.", () => {
    const linkedHost = createMockUnit({
      name: "Emma Linked Host",
      level: 4,
      hp: 4,
      linkCondition: "[Emma Sheen]",
    });
    const unlinkedHost = createMockUnit({
      name: "Emma Unlinked Host",
      level: 4,
      hp: 4,
      linkCondition: "[Kamille Bidan]",
    });
    const whiteBase = createMockBase({ name: "Friendly White Base", color: "white" });
    const blueBase = createMockBase({ name: "Friendly Blue Base", color: "blue" });
    const levelFourEnemy = createMockUnit({ name: "Lv.4 Enemy", level: 4, hp: 4 });
    const levelFiveEnemy = createMockUnit({ name: "Lv.5 Enemy", level: 5, hp: 4 });

    function setup({
      host = linkedHost,
      base = whiteBase,
      enemy = levelFourEnemy,
    }: {
      host?: typeof linkedHost;
      base?: typeof whiteBase | null;
      enemy?: typeof levelFourEnemy;
    } = {}) {
      const engine = GundamTestEngine.create(
        {
          hand: [gd03EmmaSheen099],
          play: [host],
          ...(base === null ? {} : { baseSection: [base] }),
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd03EmmaSheen099, hostId));

      return { engine, p1, p2, hostId, enemyId };
    }

    it("returns an enemy Unit whose Lv. is equal to the linked Unit's Lv.", () => {
      const { engine, p2, hostId, enemyId } = setup();

      engine.destroyUnit(hostId);

      expect(p2.getHand()).toContain(enemyId);
    });

    it("uses the linked Unit's Lv. for the target cap, not Emma's Pilot Lv.", () => {
      const { engine, p2, hostId, enemyId } = setup();

      engine.destroyUnit(hostId);

      expect(gd03EmmaSheen099.level).toBeLessThan(linkedHost.level);
      expect(p2.getHand()).toContain(enemyId);
    });

    it("moves the destroyed linked Unit and paired Emma to trash", () => {
      const { engine, p1, hostId } = setup();
      const pilotId = p1.getPilotId(hostId)!;

      engine.destroyUnit(hostId);

      expectCardInTrash(engine, hostId, PLAYER_ONE);
      expectCardInTrash(engine, pilotId, PLAYER_ONE);
    });

    it("does not return an enemy Unit whose Lv. is higher than the linked Unit's Lv.", () => {
      const { engine, p2, hostId, enemyId } = setup({ enemy: levelFiveEnemy });

      engine.destroyUnit(hostId);

      expect(p2.getCardsInZone("battleArea")).toContain(enemyId);
    });

    it("does not return an enemy Unit without a friendly Base in play", () => {
      const { engine, p2, hostId, enemyId } = setup({ base: null });

      engine.destroyUnit(hostId);

      expect(p2.getCardsInZone("battleArea")).toContain(enemyId);
    });

    it("does not return an enemy Unit when the friendly Base is not white", () => {
      const { engine, p2, hostId, enemyId } = setup({ base: blueBase });

      engine.destroyUnit(hostId);

      expect(p2.getCardsInZone("battleArea")).toContain(enemyId);
    });

    it("does not return an enemy Unit when Emma is paired but not linked", () => {
      const { engine, p2, hostId, enemyId } = setup({ host: unlinkedHost });

      engine.destroyUnit(hostId);

      expect(p2.getCardsInZone("battleArea")).toContain(enemyId);
    });

    it("does not return a friendly Unit", () => {
      const friendlyBystander = createMockUnit({ name: "Friendly Bystander", level: 1, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03EmmaSheen099],
          play: [linkedHost, friendlyBystander],
          baseSection: [whiteBase],
          resourceArea: activeResources(4),
        },
        {},
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [hostId, friendlyId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(gd03EmmaSheen099, hostId!));
      engine.destroyUnit(hostId!);

      expect(p1.getCardsInZone("battleArea")).toContain(friendlyId);
    });
  });
});
