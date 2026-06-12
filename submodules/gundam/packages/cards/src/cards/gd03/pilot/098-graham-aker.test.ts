import { describe, it, expect } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  executeCardEffect,
  expectCardInHand,
  expectSuccess,
  seedShieldsFromDeck,
} from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { gd03GrahamAker098 } from "./098-graham-aker.ts";

const readyEffect: CardEffect = {
  type: "command",
  activation: { timing: ["main"] },
  directives: [
    {
      action: {
        action: "setActive",
        target: { owner: "friendly", cardType: "unit", count: 1 },
      },
    },
  ],
  sourceText: "Set 1 rested friendly Unit as active.",
};

describe("Graham Aker (GD03-098)", () => {
  it("【Burst】 adds this card to hand", () => {
    const engine = GundamTestEngine.create({}, { deck: [gd03GrahamAker098] });
    const [shieldId] = seedShieldsFromDeck(engine, PLAYER_TWO, 1);
    if (!shieldId) throw new Error("seed setup: no shield created");

    engine.fireShieldBurst(shieldId);

    expect(engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey).toBe(
      `hand:${PLAYER_TWO}`,
    );
  });

  describe("【During Link】When this rested Unit is set as active by an effect, choose 1 enemy Unit with 3 or less HP. Return it to its owner's hand.", () => {
    function setup(linkCondition = "[Graham Aker]", enemyHp = 3, hostExhausted = true) {
      const host = createMockUnit({ name: "Graham Host", hp: 6, linkCondition });
      const enemy = createMockUnit({ name: "Enemy Target", hp: enemyHp });
      const engine = GundamTestEngine.create(
        {
          hand: [gd03GrahamAker098],
          play: [{ card: host, exhausted: hostExhausted }],
          resourceArea: activeResources(4),
        },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const hostId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.assignPilot(gd03GrahamAker098, hostId));
      engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
        G.exhausted[hostId] = hostExhausted;
        framework.cards.patchMeta(hostId, { exhausted: hostExhausted });
      });

      return { engine, hostId, enemyId };
    }

    function readyHostByEffect(engine: GundamTestEngine, hostId: string) {
      engine.getRuntime().runTestMutation(PLAYER_ONE as PlayerId, ({ G, framework }) => {
        executeCardEffect(readyEffect, {
          G,
          framework,
          sourcePlayerId: PLAYER_ONE,
          sourceCardId: hostId,
          chosenTargets: [hostId],
        });
      });
    }

    it("returns an enemy Unit with 3 or less HP when the linked rested Unit is readied by an effect", () => {
      const { engine, hostId, enemyId } = setup();

      readyHostByEffect(engine, hostId);
      if (engine.getPendingChoice()) {
        expectSuccess(engine.asPlayer(PLAYER_ONE).resolveEffect({ targets: [enemyId] }));
      }

      expectCardInHand(engine, enemyId, PLAYER_TWO);
    });

    it("does not trigger when the paired Unit is not linked", () => {
      const { engine, hostId } = setup("[Different Pilot]");

      readyHostByEffect(engine, hostId);

      expect(engine.getPendingChoice()).toBeUndefined();
    });

    it("does not trigger when the Unit was already active", () => {
      const { engine, hostId } = setup("[Graham Aker]", 3, false);

      readyHostByEffect(engine, hostId);

      expect(engine.getPendingChoice()).toBeUndefined();
    });

    it("does not enqueue without an enemy Unit with 3 or less HP", () => {
      const { engine, hostId } = setup("[Graham Aker]", 4);

      readyHostByEffect(engine, hostId);

      expect(engine.getPendingChoice()).toBeUndefined();
    });
  });
});
