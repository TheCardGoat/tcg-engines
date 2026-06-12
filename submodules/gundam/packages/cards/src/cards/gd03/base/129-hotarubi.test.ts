import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectSuccess,
  seedBaseAsShield,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import { gd03Hotarubi129 } from "./129-hotarubi.ts";

describe("Hotarubi (GD03-129)", () => {
  describe("【Burst】Deploy this card.", () => {
    it("flips into baseSection on shield destruction", () => {
      const engine = GundamTestEngine.create({}, { deck: [gd03Hotarubi129] });
      const shieldId = seedBaseAsShield(engine, PLAYER_TWO, gd03Hotarubi129);

      engine.fireShieldBurst(shieldId);

      expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
        `baseSection:${PLAYER_TWO}`,
      );
    });
  });

  describe("【Deploy】Add 1 of your Shields to your hand.", () => {
    it("adds 1 shield to hand when deployed", () => {
      const engine = GundamTestEngine.create(
        { hand: [gd03Hotarubi129], resourceArea: activeResources(4), deck: 6 },
        {},
      );
      const shieldIds = seedShieldsFromDeck(engine, PLAYER_ONE, 2);
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectSuccess(p1.deployBase(gd03Hotarubi129));

      expect(p1.getHand()).toContain(shieldIds[0]);
      expect(p1.getCardsInZone("baseSection")).toHaveLength(1);
    });
  });

  describe("During your turn, when one of your friendly (Tekkadan)/(Teiwaz) Units receives effect damage, you may rest this Base. If you do, place the top card of your deck into your trash.", () => {
    it("may rest itself to mill 1 when a friendly Tekkadan Unit receives effect damage", () => {
      const unit = createMockUnit({ traits: ["tekkadan"], hp: 5 });
      const damageCommand = createEffectDamageCommand();
      const engine = GundamTestEngine.create({
        hand: [damageCommand],
        baseSection: [gd03Hotarubi129],
        play: [unit],
        resourceArea: activeResources(1),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getCardsInZone("baseSection")[0]!;
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const deckBefore = p1.getCardsInZone("deck").length;

      expectSuccess(p1.playCommand(damageCommand, { targets: [unitId] }));
      expect(engine.getPendingChoice()).toBeTruthy();
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: true } }));

      expect(p1.getDamage(unitId)).toBe(1);
      expect(p1.isExhausted(baseId)).toBe(true);
      expect(p1.getCardsInZone("deck")).toHaveLength(deckBefore - 1);
    });

    it("may decline to rest itself and skips the mill", () => {
      const unit = createMockUnit({ traits: ["teiwaz"], hp: 5 });
      const damageCommand = createEffectDamageCommand();
      const engine = GundamTestEngine.create({
        hand: [damageCommand],
        baseSection: [gd03Hotarubi129],
        play: [unit],
        resourceArea: activeResources(1),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getCardsInZone("baseSection")[0]!;
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const deckBefore = p1.getCardsInZone("deck");

      expectSuccess(p1.playCommand(damageCommand, { targets: [unitId] }));
      expectSuccess(p1.resolveEffect({ optionalAnswers: { 0: false } }));

      expect(p1.getDamage(unitId)).toBe(1);
      expect(p1.isExhausted(baseId)).toBe(false);
      expect(p1.getCardsInZone("deck")).toEqual(deckBefore);
    });

    it("does not trigger for a friendly Unit outside Tekkadan and Teiwaz", () => {
      const unit = createMockUnit({ traits: ["earth federation"], hp: 5 });
      const damageCommand = createEffectDamageCommand();
      const engine = GundamTestEngine.create({
        hand: [damageCommand],
        baseSection: [gd03Hotarubi129],
        play: [unit],
        resourceArea: activeResources(1),
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const baseId = p1.getCardsInZone("baseSection")[0]!;
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const deckBefore = p1.getCardsInZone("deck");

      expectSuccess(p1.playCommand(damageCommand, { targets: [unitId] }));

      expect(engine.getPendingChoice()).toBeUndefined();
      expect(p1.isExhausted(baseId)).toBe(false);
      expect(p1.getCardsInZone("deck")).toEqual(deckBefore);
    });

    it("does not trigger during the opponent's turn", () => {
      const unit = createMockUnit({ traits: ["tekkadan"], hp: 5 });
      const damageCommand = createEffectDamageCommand();
      const engine = GundamTestEngine.create(
        {
          baseSection: [gd03Hotarubi129],
          play: [unit],
          deck: 3,
        },
        {
          hand: [damageCommand],
          resourceArea: activeResources(1),
        },
        { initialActivePlayer: PLAYER_TWO },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const baseId = p1.getCardsInZone("baseSection")[0]!;
      const unitId = p1.getCardsInZone("battleArea")[0]!;
      const deckBefore = p1.getCardsInZone("deck");

      expectSuccess(p2.playCommand(damageCommand, { targets: [unitId] }));

      expect(engine.getPendingChoice()).toBeUndefined();
      expect(p1.getDamage(unitId)).toBe(1);
      expect(p1.isExhausted(baseId)).toBe(false);
      expect(p1.getCardsInZone("deck")).toEqual(deckBefore);
    });
  });
});

function createEffectDamageCommand() {
  return createMockCommand({
    effect: "【Main】Choose 1 Unit. Deal 1 damage to it.",
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "dealDamage",
              amount: 1,
              target: { owner: "any", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "【Main】Choose 1 Unit. Deal 1 damage to it.",
      },
    ],
  });
}
