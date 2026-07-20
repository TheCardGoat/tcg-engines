import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockPilot,
  createMockUnit,
  expectFailure,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st06KanebanCoLtd015 } from "./015-kaneban-co-ltd.ts";

describe("Kaneban Co., Ltd. (ST06-015)", () => {
  describe("Printed Lv.4 and cost 2", () => {
    it("deploys to the Base Section for two active Resources", () => {
      const engine = GundamTestEngine.create({
        hand: [st06KanebanCoLtd015],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const cardId = p1.getHand()[0]!;

      expectSuccess(p1.deployBase(cardId));

      expect(p1.getCardZone(cardId)).toBe(`baseSection:${PLAYER_ONE}`);
      expect(p1.getCardsInZone("resourceArea").filter((id) => p1.isExhausted(id))).toHaveLength(2);
    });

    it("rejects deployment below Lv.4", () => {
      const engine = GundamTestEngine.create({
        hand: [st06KanebanCoLtd015],
        resourceArea: activeResources(3),
      });
      expectFailure(
        engine.asPlayer(PLAYER_ONE).deployBase(st06KanebanCoLtd015),
        "INSUFFICIENT_RESOURCE_LEVEL",
      );
    });
  });

  describe("【Deploy】Add 1 of your Shields to your hand.", () => {
    it("moves one Shield to hand", () => {
      const engine = GundamTestEngine.create({
        hand: [st06KanebanCoLtd015],
        shieldArea: [createMockUnit()],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const handBefore = p1.getHand().length;

      expectSuccess(p1.deployBase(st06KanebanCoLtd015));

      expect(p1.getHand()).toHaveLength(handBefore);
      expect(p1.getCardsInZone("shieldArea")).toHaveLength(0);
    });
  });

  describe("【Burst】Deploy this card.", () => {
    it("deploys from Shield and then adds the remaining Shield to hand", () => {
      const engine = GundamTestEngine.create(
        { play: [createMockUnit({ ap: 1, hp: 5 })] },
        { shieldArea: [st06KanebanCoLtd015, createMockUnit()] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      expectSuccess(p1.enterBattle(p1.getCardsInZone("battleArea")[0]!, "direct"));
      expectSuccess(p2.passBlock());
      expectSuccess(p2.passBattleAction());
      expectSuccess(p1.passBattleAction());
      const burst = p2.getBoardView().pendingChoice;
      if (burst?.kind !== "optional") throw new Error("Expected the visible Burst choice");
      expectSuccess(p2.resolveEffect({ optionalAnswers: { [burst.directiveIndex]: true } }));

      expect(p2.getCardZone(burst.sourceCardId)).toBe(`baseSection:${PLAYER_TWO}`);
      expect(p2.getCardsInZone("shieldArea")).toHaveLength(0);
      expect(p2.getHand()).toHaveLength(1);
    });
  });

  describe("【Once per Turn】When a friendly (Clan) Unit links, it gains <Breach 3> during this turn.", () => {
    it("grants Breach to a Clan Unit when that Unit links", () => {
      const unit = createMockUnit({ traits: ["clan"], linkCondition: "[Clan Pilot]" });
      const pilot = createMockPilot({ name: "Clan Pilot", cost: 0, level: 1 });
      const engine = GundamTestEngine.create({
        baseSection: [st06KanebanCoLtd015],
        play: [unit],
        hand: [pilot],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, unitId));

      expect(p1.getVisibleCard(unitId)?.keywords).toContain("Breach");
    });

    it("does not trigger when a non-Clan Unit links", () => {
      const unit = createMockUnit({ traits: ["zeon"], linkCondition: "[Pilot]" });
      const pilot = createMockPilot({ name: "Pilot", cost: 0, level: 1 });
      const engine = GundamTestEngine.create({
        baseSection: [st06KanebanCoLtd015],
        play: [unit],
        hand: [pilot],
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const unitId = p1.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(pilot, unitId));

      expect(p1.getVisibleCard(unitId)?.keywords).not.toContain("Breach");
    });

    it("grants Breach only to the Clan Unit that just linked when another Clan Link Unit is already in play", () => {
      const first = createMockUnit({
        name: "First Clan Unit",
        traits: ["clan"],
        linkCondition: "[First Pilot]",
      });
      const second = createMockUnit({
        name: "Second Clan Unit",
        traits: ["clan"],
        linkCondition: "[Second Pilot]",
      });
      const firstPilot = createMockPilot({ name: "First Pilot", cost: 0, level: 1 });
      const secondPilot = createMockPilot({ name: "Second Pilot", cost: 0, level: 1 });
      const engine = GundamTestEngine.create({
        play: [first, second],
        hand: [firstPilot, st06KanebanCoLtd015, secondPilot],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [firstId, secondId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(firstPilot, firstId!));
      expect(p1.getVisibleCard(firstId!)?.keywords).not.toContain("Breach");
      expect(p1.getVisibleCard(secondId!)?.keywords).not.toContain("Breach");
      expectSuccess(p1.deployBase(st06KanebanCoLtd015));
      expectSuccess(p1.assignPilot(secondPilot, secondId!));

      expect(p1.getVisibleCard(firstId!)?.keywords).not.toContain("Breach");
      expect(p1.getVisibleCard(secondId!)?.keywords).toContain("Breach");
    });
  });
});
