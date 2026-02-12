/**
 * Type Verification Test for Trigger Detection
 *
 * This test verifies that the trigger detection module is properly typed
 * and can be imported and used correctly.
 */

import { describe, expect, it } from "bun:test";
import type {
  ActivePlayerOrderResult,
  AttackTriggerEvent,
  DeployTriggerEvent,
  DestroyedTriggerEvent,
  EndOfTurnTriggerEvent,
  StartOfTurnTriggerEvent,
  TriggerDetectionResult,
  TriggerEvent,
  TriggeredEffectRef,
} from "../trigger-detection";
import {
  detectAttackTriggers,
  detectDeployTriggers,
  detectDestroyedTriggers,
  detectEndOfTurnTriggers,
  detectStartOfTurnTriggers,
  detectTriggeredEffects,
  orderTriggeredEffects,
} from "../trigger-detection";

describe("Trigger Detection Type Verification", () => {
  it("should export all trigger detection functions", () => {
    expect(typeof detectTriggeredEffects).toBe("function");
    expect(typeof detectDeployTriggers).toBe("function");
    expect(typeof detectAttackTriggers).toBe("function");
    expect(typeof detectDestroyedTriggers).toBe("function");
    expect(typeof detectStartOfTurnTriggers).toBe("function");
    expect(typeof detectEndOfTurnTriggers).toBe("function");
    expect(typeof orderTriggeredEffects).toBe("function");
  });

  it("should properly type trigger events", () => {
    const deployEvent: DeployTriggerEvent = {
      cardId: "card-1" as any,
      playerId: "p1" as any,
      type: "DEPLOY",
    };
    expect(deployEvent.type).toBe("DEPLOY");

    const attackEvent: AttackTriggerEvent = {
      attackerId: "attacker-1" as any,
      playerId: "p1" as any,
      type: "ATTACK",
    };
    expect(attackEvent.type).toBe("ATTACK");

    const destroyedEvent: DestroyedTriggerEvent = {
      cardId: "card-1" as any,
      playerId: "p1" as any,
      type: "DESTROYED",
    };
    expect(destroyedEvent.type).toBe("DESTROYED");

    const startEvent: StartOfTurnTriggerEvent = {
      playerId: "p1" as any,
      type: "START_OF_TURN",
    };
    expect(startEvent.type).toBe("START_OF_TURN");

    const endEvent: EndOfTurnTriggerEvent = {
      playerId: "p1" as any,
      type: "END_OF_TURN",
    };
    expect(endEvent.type).toBe("END_OF_TURN");
  });

  it("should properly type trigger detection results", () => {
    const result: TriggerDetectionResult = {
      effects: [],
      hasTriggers: false,
    };
    expect(result.hasTriggers).toBe(false);
    expect(result.effects).toEqual([]);
  });

  it("should properly type triggered effect refs", () => {
    const effectRef: TriggeredEffectRef = {
      controllerId: "p1" as any,
      effectRef: { effectId: "effect-1" },
      sourceCardId: "card-1" as any,
    };
    expect(effectRef.effectRef.effectId).toBe("effect-1");
  });

  it("should properly type active player order result", () => {
    const orderResult: ActivePlayerOrderResult = {
      activePlayerEffects: [0, 2],
      opponentEffects: [1],
      order: [0, 1, 2],
    };
    expect(orderResult.order).toEqual([0, 1, 2]);
    expect(orderResult.activePlayerEffects).toEqual([0, 2]);
    expect(orderResult.opponentEffects).toEqual([1]);
  });

  it("should handle discriminated union types for TriggerEvent", () => {
    const events: TriggerEvent[] = [
      { cardId: "card-1" as any, playerId: "p1" as any, type: "DEPLOY" },
      {
        attackerId: "attacker-1" as any,
        playerId: "p1" as any,
        type: "ATTACK",
      },
      { cardId: "card-1" as any, playerId: "p1" as any, type: "DESTROYED" },
      { playerId: "p1" as any, type: "START_OF_TURN" },
      { playerId: "p1" as any, type: "END_OF_TURN" },
    ];

    for (const event of events) {
      // Type narrowing should work correctly
      switch (event.type) {
        case "DEPLOY": {
          expect(event).toHaveProperty("cardId");
          break;
        }
        case "ATTACK": {
          expect(event).toHaveProperty("attackerId");
          break;
        }
        case "DESTROYED": {
          expect(event).toHaveProperty("cardId");
          break;
        }
        case "START_OF_TURN":
        case "END_OF_TURN": {
          expect(event).toHaveProperty("playerId");
          break;
        }
        default: {
          // Exhaustive check - should never reach here
          const _exhaustive: never = event;
          return _exhaustive;
        }
      }
    }
  });
});
