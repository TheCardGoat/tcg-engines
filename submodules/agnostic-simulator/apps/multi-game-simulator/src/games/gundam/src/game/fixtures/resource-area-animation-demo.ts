import { asPlayerId, type MatchRuntime } from "@tcg/gundam-engine";
import { simulatorExternalCommandGateFor } from "@tcg/simulator-runtime/animation";

import {
  createDevRuntime,
  DEV_PLAYER_ONE,
  type DevRuntime,
  type DevPlayerId,
} from "../dev-runtime.ts";

const MAX_RESOURCES = 15;

/**
 * A minimal board for repeatedly validating the concealed Resource Deck →
 * public Resource Area transfer. The button that drives this fixture uses the
 * engine's test-mutation pipeline as a judge action; no game-legal turn or card
 * effect is required.
 */
export function loadResourceAreaAnimationDemo(): DevRuntime {
  return createDevRuntime({
    skipToMainPhase: true,
    p1: {
      deck: 30,
      resourceDeck: 10,
    },
    p2: {
      deck: 30,
      resourceDeck: 10,
    },
  });
}

/**
 * Fixture-only judge action. It moves the top Resource card through the real
 * zone API and publishes the same native cardMove packet consumed by the
 * Gundam animation adapter.
 */
export function judgePlaceResource(
  runtime: MatchRuntime,
  playerId: DevPlayerId = DEV_PLAYER_ONE,
): boolean {
  if (simulatorExternalCommandGateFor(runtime).isBlocked()) return false;

  const state = runtime.getState();
  const resourceArea = state.ctx.zones.private.zoneCards[`resourceArea:${playerId}`] ?? [];
  const resourceDeck = state.ctx.zones.private.zoneCards[`resourceDeck:${playerId}`] ?? [];
  const cardId = resourceDeck.at(-1);
  if (!cardId || resourceArea.length >= MAX_RESOURCES) return false;

  const nextStateId = state.ctx._stateID + 1;
  runtime.packetAnimationHistory.push({
    animation: {
      id: `fixture:judge-place-resource:${nextStateId}:${cardId}`,
      type: "cardMove",
      duration: 420,
      data: {
        kind: "cardMove",
        cardId,
        ownerId: playerId,
        fromZone: "resourceDeck",
        toZone: "resourceArea",
      },
    },
    stateID: nextStateId,
    turnNumber: state.ctx.status.turn,
  });

  runtime.runTestMutation(asPlayerId(playerId), ({ framework }) => {
    framework.zones.drawCards({
      from: { zone: "resourceDeck", playerId },
      to: { zone: "resourceArea", playerId },
      count: 1,
    });
  });

  return true;
}
