import { describe, expect, it } from "vite-plus/test";
import type { SimulatorEntity } from "@tcg/simulator-contract";

import type { BoardProjection } from "../game/index.ts";
import type { TurnTaggedPacketAnimation } from "../game/adapter.ts";
import {
  gundamPacketAnimationToAnimationPlans,
  itemsAfterPreviousSnapshot,
  projectedTurnAnimationPlan,
  resolveAnimatedEntity,
} from "./GundamSharedAnimationLayer.tsx";

const VIEWER = "player_one";
const OPPONENT = "player_two";
const view = {
  players: [{ playerId: VIEWER }, { playerId: OPPONENT }],
  zones: { zones: {} },
} as BoardProjection;

function packet(
  data: TurnTaggedPacketAnimation["animation"]["data"],
  id = "animation-1",
): TurnTaggedPacketAnimation {
  return {
    animation: {
      id,
      type: data.kind,
      duration: 320,
      data,
    } as TurnTaggedPacketAnimation["animation"],
    stateID: 3,
    turnNumber: 1,
  };
}

const publicEntity = (ownerId: string): SimulatorEntity => ({
  id: "card-1",
  title: "Known card",
  kind: "card",
  ownerId,
  face: "public",
  states: [],
  stats: [],
  traits: [],
});
const hiddenEntity = (ownerId: string): SimulatorEntity => ({
  ...publicEntity(ownerId),
  title: "Hidden Card",
  face: "hidden",
});

describe("authoritative Gundam animation packets", () => {
  it("detects new packets when a capped history keeps the same length", () => {
    const previous = Array.from({ length: 256 }, (_, index) => ({ id: `packet-${index}` }));
    const current = [...previous.slice(1), { id: "packet-256" }];

    expect(itemsAfterPreviousSnapshot(current, previous, (item) => item.id)).toEqual({
      newItems: [{ id: "packet-256" }],
      didReset: false,
    });
  });

  it("maps a raw concealed draw packet without needing a move log", () => {
    const plans = gundamPacketAnimationToAnimationPlans(
      {
        animation: {
          id: "draw-1",
          type: "cardMove",
          duration: 320,
          data: {
            kind: "cardMove",
            cardId: "player_two_private_drawn_card",
            ownerId: OPPONENT,
            fromZone: "deck",
            toZone: "hand",
          },
        },
        stateID: 3,
        turnNumber: 1,
      },
      view,
      VIEWER,
    );

    expect(plans).toHaveLength(1);
    expect(plans[0]?.steps[0]).toMatchObject({
      type: "moveEntity",
      entity: { id: "player_two_private_drawn_card" },
      from: { kind: "zone", id: `deck:${OPPONENT}` },
      to: { kind: "zone", id: `hand:${OPPONENT}` },
    });
  });

  it("maps command lifecycle packets through the shared focus area", () => {
    const plans = gundamPacketAnimationToAnimationPlans(
      {
        animation: {
          id: "command-1",
          type: "generic",
          duration: 320,
          data: {
            kind: "generic",
            name: "commandPlayed",
            params: { cardId: "command-card", ownerId: VIEWER, awaitsResolution: false },
          },
        },
        stateID: 8,
        turnNumber: 2,
      },
      view,
      VIEWER,
    );

    expect(plans).toHaveLength(2);
    expect(plans[0]?.steps[0]).toMatchObject({
      type: "moveEntity",
      entity: { id: "command-card" },
      from: { kind: "zone", id: `hand:${VIEWER}` },
      to: { kind: "anchor" },
    });
    expect(plans[1]?.steps.at(-1)).toMatchObject({
      type: "moveEntity",
      to: { kind: "zone", id: `trash:${VIEWER}` },
    });
  });

  it("maps phase and turn changes only from packets", () => {
    const phasePlans = gundamPacketAnimationToAnimationPlans(
      {
        animation: {
          id: "phase-1",
          type: "generic",
          duration: 320,
          data: {
            kind: "generic",
            name: "phaseChanged",
            params: { from: "Main", to: "End" },
          },
        },
        stateID: 9,
        turnNumber: 2,
      },
      view,
      VIEWER,
    );
    expect(phasePlans[0]?.steps[0]).toMatchObject({
      type: "phaseChange",
      from: "Main",
      to: "End",
    });
    const turnPlans = gundamPacketAnimationToAnimationPlans(
      packet({
        kind: "generic",
        name: "turnChanged",
        params: { previousTurn: 1, turn: 2, playerId: VIEWER },
      }),
      view,
      VIEWER,
    );
    expect(turnPlans[0]?.steps[0]).toMatchObject({
      type: "phaseChange",
      variant: "turn",
      turnNumber: 2,
    });
    expect(projectedTurnAnimationPlan(1, { number: 2, playerId: VIEWER }).steps[0]).toMatchObject({
      type: "phaseChange",
      variant: "turn",
      turnNumber: 2,
    });
  });

  it("maps resource movement and resource spending", () => {
    const gainPlans = gundamPacketAnimationToAnimationPlans(
      packet({
        kind: "cardMove",
        cardId: "resource-1",
        ownerId: VIEWER,
        fromZone: "deck",
        toZone: "resourceArea",
      }),
      view,
      VIEWER,
    );
    const spendPlans = gundamPacketAnimationToAnimationPlans(
      packet({
        kind: "generic",
        name: "resourcesSpent",
        params: { playerId: VIEWER, amount: 2 },
      }),
      view,
      VIEWER,
    );

    expect(gainPlans).toHaveLength(2);
    expect(gainPlans[1]?.steps[0]).toMatchObject({ type: "resourceDelta", delta: 1 });
    expect(spendPlans[0]?.steps[0]).toMatchObject({ type: "resourceDelta", delta: -2 });
  });

  it("maps attack, block, and damage packets", () => {
    const attack = gundamPacketAnimationToAnimationPlans(
      packet({
        kind: "generic",
        name: "attackDeclared",
        params: { attackerId: "attacker", targetId: "direct", playerId: VIEWER },
      }),
      view,
      VIEWER,
    );
    const block = gundamPacketAnimationToAnimationPlans(
      packet({
        kind: "generic",
        name: "blockDeclared",
        params: { blockerId: "blocker", attackerId: "attacker", playerId: OPPONENT },
      }),
      view,
      VIEWER,
    );
    const damage = gundamPacketAnimationToAnimationPlans(
      packet({
        kind: "damage",
        sourceId: "attacker",
        targetId: "target",
        amount: 3,
        damageType: "battle",
      }),
      view,
      VIEWER,
    );

    expect(attack[0]?.steps[0]).toMatchObject({ type: "combat", reason: "declared" });
    expect(block[0]?.steps[0]).toMatchObject({ type: "combat", source: { id: "blocker" } });
    expect(damage[0]?.steps[0]).toMatchObject({
      type: "combat",
      reason: "resolved",
      detailLabel: "3 DMG",
    });
  });

  it("maps manual command resolution, ordinary effects, and card state changes", () => {
    const manualCommand = gundamPacketAnimationToAnimationPlans(
      packet({
        kind: "generic",
        name: "commandPlayed",
        params: { cardId: "command-card", ownerId: VIEWER, awaitsResolution: true },
      }),
      view,
      VIEWER,
    );
    const effect = gundamPacketAnimationToAnimationPlans(
      packet({
        kind: "generic",
        name: "effectResolved",
        params: { sourceCardId: "unit-1", playerId: VIEWER, targets: ["target-1"] },
      }),
      view,
      VIEWER,
    );
    const stateChange = gundamPacketAnimationToAnimationPlans(
      packet({
        kind: "generic",
        name: "cardStateChanged",
        params: { cardId: "unit-1", state: "ready" },
      }),
      view,
      VIEWER,
    );
    const restedStateChange = gundamPacketAnimationToAnimationPlans(
      packet({
        kind: "generic",
        name: "cardStateChanged",
        params: { cardId: "unit-1", state: "rested" },
      }),
      view,
      VIEWER,
    );

    expect(manualCommand).toHaveLength(1);
    expect(effect[0]?.steps[0]).toMatchObject({ type: "effect", label: "EFFECT" });
    expect(stateChange[0]?.steps[0]).toMatchObject({
      type: "spotlightEntity",
      label: "READY",
    });
    expect(restedStateChange[0]?.steps[0]).toMatchObject({
      type: "spotlightEntity",
      label: "REST",
    });
  });

  it("maps a command effect through the shared focus area", () => {
    const commandView = {
      ...view,
      zones: {
        zones: {
          removal: {
            cards: [
              {
                instanceId: "command-card",
                ownerId: VIEWER,
                zoneId: "removalArea",
                definition: { type: "command" },
              },
            ],
          },
        },
      },
    } as unknown as BoardProjection;
    const plans = gundamPacketAnimationToAnimationPlans(
      packet({
        kind: "generic",
        name: "effectResolved",
        params: { sourceCardId: "command-card", playerId: VIEWER, targets: ["target-1"] },
      }),
      commandView,
      VIEWER,
    );

    expect(plans).toHaveLength(1);
    expect(plans[0]?.steps[0]).toMatchObject({ type: "effect", label: "COMMAND EFFECT" });
  });

  it("ignores damage without a public source and command removal cleanup moves", () => {
    const sourceLessDamage = gundamPacketAnimationToAnimationPlans(
      packet({ kind: "damage", targetId: "target", amount: 1, damageType: "effect" }),
      view,
      VIEWER,
    );
    const commandView = {
      ...view,
      zones: {
        zones: {
          removal: {
            cards: [
              {
                instanceId: "command-card",
                ownerId: VIEWER,
                definition: { type: "command" },
              },
            ],
          },
        },
      },
    } as unknown as BoardProjection;
    const cleanupMove = gundamPacketAnimationToAnimationPlans(
      packet({
        kind: "cardMove",
        cardId: "command-card",
        ownerId: VIEWER,
        fromZone: "removalArea",
        toZone: "trash",
      }),
      commandView,
      VIEWER,
    );

    expect(sourceLessDamage).toEqual([]);
    expect(cleanupMove).toEqual([]);
  });
});

describe("resolveAnimatedEntity", () => {
  it("preserves only the viewer-authorized historical face", () => {
    const viewerHistorical = publicEntity(VIEWER);
    expect(resolveAnimatedEntity(hiddenEntity(VIEWER), viewerHistorical, VIEWER)).toBe(
      viewerHistorical,
    );

    const opponentCurrent = hiddenEntity(OPPONENT);
    const opponentHistorical = publicEntity(OPPONENT);
    expect(resolveAnimatedEntity(opponentCurrent, opponentHistorical, VIEWER)).toBe(
      opponentCurrent,
    );
    expect(resolveAnimatedEntity(opponentCurrent, opponentHistorical, null)).toBe(opponentCurrent);
  });
});
