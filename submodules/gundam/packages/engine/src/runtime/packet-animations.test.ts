import { describe, expect, it } from "vite-plus/test";
import type { CtxStatus } from "../types/match-state.ts";
import type { GundamMoveLog } from "../types/move-log.ts";
import { buildPacketAnimations } from "./packet-animations.ts";

const status = (overrides: Partial<CtxStatus> = {}) =>
  ({
    turn: 1,
    turnPlayer: "p1",
    activePlayer: "p1",
    gameSegment: "game",
    phase: "main",
    step: "main",
    ...overrides,
  }) as CtxStatus;

describe("buildPacketAnimations", () => {
  it("emits complete command, resource, card-state, and phase packets", () => {
    const log = {
      type: "playCommand",
      commandID: "command-1",
      timestamp: 1,
      playerId: "p1",
      cardId: "card-1",
      outcomes: {
        resourcesSpent: { regularCount: 2, exRemovedCount: 1 },
        cardsExhausted: ["resource-1"],
      },
    } as unknown as GundamMoveLog;

    const packets = buildPacketAnimations({
      moveLogs: [log],
      previousStatus: status(),
      nextStatus: status({ phase: "end", step: "end" }),
    });

    expect(packets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          data: {
            kind: "generic",
            name: "commandPlayed",
            params: { cardId: "card-1", ownerId: "p1", awaitsResolution: false },
          },
        }),
        expect.objectContaining({
          data: {
            kind: "generic",
            name: "resourcesSpent",
            params: { playerId: "p1", amount: 3 },
          },
        }),
        expect.objectContaining({
          data: {
            kind: "generic",
            name: "cardStateChanged",
            params: { cardId: "resource-1", state: "rested" },
          },
        }),
        expect.objectContaining({
          data: {
            kind: "generic",
            name: "phaseChanged",
            params: { from: "game / main / main", to: "game / end / end" },
          },
        }),
      ]),
    );
  });

  it("deduplicates the direct play and matching move outcome", () => {
    const packets = buildPacketAnimations({
      moveLogs: [
        {
          type: "deployUnit",
          commandID: "deploy-1",
          timestamp: 1,
          playerId: "p1",
          cardId: "unit-1",
          outcomes: {
            cardsMoved: [{ cardId: "unit-1", from: "hand", to: "battleArea" }],
          },
        } as unknown as GundamMoveLog,
      ],
      previousStatus: status(),
      nextStatus: status(),
    });

    expect(
      packets.filter(
        ({ data }) =>
          data.kind === "cardMove" &&
          data.cardId === "unit-1" &&
          data.fromZone === "hand" &&
          data.toZone === "battleArea",
      ),
    ).toHaveLength(1);
  });

  it("moves a returned card to its owner's hand", () => {
    const packets = buildPacketAnimations({
      moveLogs: [
        {
          type: "resolveEffect",
          commandID: "bounce-1",
          timestamp: 1,
          playerId: "p1",
          sourceCardId: "p1-command",
          outcomes: { cardsReturnedToHand: ["p2-unit"] },
        } as unknown as GundamMoveLog,
      ],
      previousStatus: status(),
      nextStatus: status(),
      ownerIdForCard: (cardId) => (cardId === "p2-unit" ? "p2" : undefined),
    });

    expect(packets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          data: expect.objectContaining({
            kind: "cardMove",
            cardId: "p2-unit",
            ownerId: "p2",
            toZone: "hand",
          }),
        }),
      ]),
    );
  });

  it("emits draw, combat, effect, and turn packets from authoritative outcomes", () => {
    const packets = buildPacketAnimations({
      moveLogs: [
        {
          type: "attack",
          commandID: "attack-1",
          timestamp: 1,
          playerId: "p1",
          attackerId: "attacker-1",
          targetId: "target-1",
          outcomes: {
            cardsDrawn: { count: 1, playerId: "p1", cardIds: ["drawn-1"] },
            damageDealt: [{ targetId: "target-1", amount: 2 }],
          },
        },
        {
          type: "block",
          commandID: "block-1",
          timestamp: 2,
          playerId: "p2",
          blockerId: "blocker-1",
          attackerId: "attacker-1",
        },
        {
          type: "resolveEffect",
          commandID: "effect-1",
          timestamp: 3,
          playerId: "p1",
          sourceCardId: "source-1",
          resolution: { targets: ["target-1"] },
        },
      ] as unknown as GundamMoveLog[],
      previousStatus: status(),
      nextStatus: status({ turn: 2, turnPlayer: "p2" as never, activePlayer: "p2" as never }),
    });

    expect(packets).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ data: expect.objectContaining({ name: "attackDeclared" }) }),
        expect.objectContaining({ data: expect.objectContaining({ name: "blockDeclared" }) }),
        expect.objectContaining({ data: expect.objectContaining({ name: "effectResolved" }) }),
        expect.objectContaining({ data: expect.objectContaining({ name: "turnChanged" }) }),
        expect.objectContaining({
          data: expect.objectContaining({
            kind: "cardMove",
            cardId: "drawn-1",
            fromZone: "deck",
            toZone: "hand",
          }),
        }),
        expect.objectContaining({
          data: expect.objectContaining({
            kind: "damage",
            sourceId: "attacker-1",
            targetId: "target-1",
            amount: 2,
          }),
        }),
      ]),
    );
  });
});
