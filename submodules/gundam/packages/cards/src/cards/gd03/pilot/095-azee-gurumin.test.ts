import { describe, it, expect } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  executeCardEffect,
  expectSuccess,
  getEffectiveStats,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { gd03AzeeGurumin095 } from "./095-azee-gurumin.ts";

const enemyEffectDamage: CardEffect = {
  type: "command",
  activation: { timing: ["action"] },
  directives: [
    {
      action: {
        action: "dealDamage",
        amount: 1,
        target: {
          owner: "opponent",
          cardType: "unit",
          count: 1,
        },
      },
    },
  ],
  sourceText: "Deal 1 effect damage to 1 enemy Unit.",
};

describe("Azee Gurumin (GD03-095)", () => {
  it("【Burst】 adds this card to hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03AzeeGurumin095] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  describe("【Once per Turn】When this Unit receives effect damage, choose 1 enemy Unit. It gets AP-1 during this turn.", () => {
    it("gives an enemy Unit AP-1 when Azee's paired Unit receives enemy effect damage", () => {
      const host = createMockUnit({ name: "Azee Host", ap: 2, hp: 5 });
      const enemy = createMockUnit({ name: "Enemy Target", ap: 4, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03AzeeGurumin095],
          play: [host],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd03AzeeGurumin095, hostId));

      engine.getRuntime().runTestMutation(PLAYER_TWO as PlayerId, ({ G, framework }) => {
        executeCardEffect(enemyEffectDamage, {
          G,
          framework,
          sourcePlayerId: PLAYER_TWO,
          sourceCardId: enemyId,
          chosenTargets: [hostId],
        });
      });

      const pending = engine.getPendingChoice();
      if (pending) expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      const framework = engine.getRuntime().getFrameworkReadAPI();
      expect(getEffectiveStats(enemyId, engine.getG(), framework.cards, framework).ap).toBe(3);
    });

    it("does not trigger when a different friendly Unit receives enemy effect damage", () => {
      const host = createMockUnit({ name: "Azee Host", ap: 2, hp: 5 });
      const otherFriendly = createMockUnit({ name: "Other Friendly", ap: 2, hp: 5 });
      const enemy = createMockUnit({ name: "Enemy Target", ap: 4, hp: 4 });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03AzeeGurumin095],
          play: [host, otherFriendly],
          resourceArea: activeResources(5),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [hostId, otherFriendlyId] = p1.getCardsInZone("battleArea");
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd03AzeeGurumin095, hostId!));

      engine.getRuntime().runTestMutation(PLAYER_TWO as PlayerId, ({ G, framework }) => {
        executeCardEffect(enemyEffectDamage, {
          G,
          framework,
          sourcePlayerId: PLAYER_TWO,
          sourceCardId: enemyId,
          chosenTargets: [otherFriendlyId!],
        });
      });

      const framework = engine.getRuntime().getFrameworkReadAPI();
      expect(engine.getPendingChoice()).toBeUndefined();
      expect(getEffectiveStats(enemyId, engine.getG(), framework.cards, framework).ap).toBe(4);
    });
  });
});
