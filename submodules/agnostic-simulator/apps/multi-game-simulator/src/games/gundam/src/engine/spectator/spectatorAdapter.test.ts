import { describe, expect, it } from "vite-plus/test";
import {
  asPlayerId,
  privateField,
  type GundamMoveLog,
  type MatchRuntime,
} from "@tcg/gundam-engine";

import { loadMainPhaseDemo } from "../../game/fixtures/main-phase-demo.ts";
import { createSpectatorEngineAdapter } from "./spectatorAdapter.ts";

describe("createSpectatorEngineAdapter", () => {
  it("keeps board perspective separate from private-information authorization", () => {
    const dev = loadMainPhaseDemo();
    const adapter = createSpectatorEngineAdapter({
      runtime: dev.runtime,
      staticResources: dev.staticResources,
      viewerId: dev.p1Id,
    });

    expect(adapter.viewerContext).toEqual({
      role: "spectator",
      playerId: null,
      perspectivePlayerId: dev.p1Id,
    });
    expect(adapter.interactionView()).toMatchObject({
      actorId: "spectator",
      status: "idle",
      actions: [],
    });
  });

  it("strips private card ids from spectator move logs", () => {
    const dev = loadMainPhaseDemo();
    const secretCardId = "player_one_deck_ST01-015_01";
    const privateDrawLog = {
      type: "pass",
      playerId: asPlayerId("player_one"),
      timestamp: 1,
      passKind: "action-step",
      outcomes: {
        cardsDrawn: {
          count: 1,
          playerId: asPlayerId("player_one"),
          cardIds: privateField([secretCardId as never], ["player_one"]),
        },
      },
    } satisfies GundamMoveLog;
    const runtime = new Proxy(dev.runtime, {
      get(target, property, receiver) {
        if (property === "getMoveLogHistory") return () => [privateDrawLog];
        const value = Reflect.get(target, property, receiver) as unknown;
        return typeof value === "function" ? value.bind(target) : value;
      },
    }) as MatchRuntime;
    const adapter = createSpectatorEngineAdapter({
      runtime,
      staticResources: dev.staticResources,
      viewerId: dev.p1Id,
    });

    const serialized = JSON.stringify(adapter.moveLogs());
    expect(serialized).not.toContain(secretCardId);
    expect(adapter.moveLogs()[0]?.log.outcomes?.cardsDrawn).toMatchObject({ count: 1 });
    expect(adapter.moveLogs()[0]?.log.outcomes?.cardsDrawn?.cardIds).toBeUndefined();
  });

  it("preserves private animation identities so the renderer privacy boundary is exercised", () => {
    const dev = loadMainPhaseDemo();
    const secretCardId = "player_one_deck_ST01-015_01";
    const runtime = new Proxy(dev.runtime, {
      get(target, property, receiver) {
        if (property === "getPacketAnimationHistory") {
          return () => [
            {
              stateID: 4,
              turnNumber: 1,
              animation: {
                id: "private-draw",
                type: "cardMove",
                duration: 420,
                data: {
                  kind: "cardMove",
                  cardId: secretCardId,
                  ownerId: "player_one",
                  fromZone: "deck",
                  toZone: "hand",
                },
              },
            },
          ];
        }
        const value = Reflect.get(target, property, receiver) as unknown;
        return typeof value === "function" ? value.bind(target) : value;
      },
    }) as MatchRuntime;
    const adapter = createSpectatorEngineAdapter({
      runtime,
      staticResources: dev.staticResources,
      viewerId: dev.p1Id,
    });

    expect(adapter.packetAnimations()[0]?.animation.data).toMatchObject({
      kind: "cardMove",
      cardId: secretCardId,
      fromZone: "deck",
      toZone: "hand",
    });
  });
});
