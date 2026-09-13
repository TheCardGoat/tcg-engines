import { describe, expect, test } from "vite-plus/test";

import type { BoardProjection } from "../game/index.ts";
import type { TurnTaggedPacketAnimation } from "../game/adapter.ts";
import { didAuthoritativeHistoryReset, itemsAfterPreviousSnapshot } from "../game/store.ts";
import {
  animationCombatFocusRef,
  isHandToBattleAreaTransfer,
} from "./GundamSharedAnimationLayer.tsx";
import {
  GUNDAM_ANIMATION_DURATION_MS,
  gundamPacketAnimationToAnimationPlans,
  prepareGundamSharedAnimationSteps,
  projectGundamAuthoritativeAnimationPlan,
  staggerGundamCardTransfers,
} from "@tcg/gundam-server-adapter";

describe("Gundam AnimationPlanV2 adapter", () => {
  test("identifies the combat target that mobile playback must reveal", () => {
    expect(
      animationCombatFocusRef({
        id: "base-impact",
        version: 2,
        steps: [
          {
            id: "base-impact:step",
            type: "combat",
            source: { kind: "entity", id: "attacker" },
            target: { kind: "entity", id: "white-base" },
            reason: "resolved",
            durationMs: 850,
          },
        ],
      }),
    ).toEqual({ kind: "entity", id: "white-base" });
  });

  test("maps a packet draw with explicit hidden and public faces", () => {
    const entry = {
      animation: {
        id: "draw-1",
        type: "cardMove",
        duration: 560,
        data: {
          kind: "cardMove",
          cardId: "player_one_deck_card_1",
          ownerId: "player_one",
          fromZone: "deck",
          toZone: "hand",
        },
      },
      stateID: 2,
      turnNumber: 1,
    } as TurnTaggedPacketAnimation;

    expect(
      gundamPacketAnimationToAnimationPlans(entry, emptyView(), "player_one")[0],
    ).toMatchObject({
      version: 2,
      steps: [
        {
          type: "entityTransfer",
          sourceFace: "hidden",
          destinationFace: "public",
          audioCue: "card.draw",
        },
      ],
    });
  });

  test("maps resource placement as a hidden-to-public transfer from the resource deck", () => {
    const entry = {
      animation: {
        id: "resource-1",
        type: "cardMove",
        duration: 560,
        data: {
          kind: "cardMove",
          cardId: "player_one_resourceDeck_card_1",
          ownerId: "player_one",
          fromZone: "resourceDeck",
          toZone: "resourceArea",
        },
      },
      stateID: 2,
      turnNumber: 1,
    } as TurnTaggedPacketAnimation;

    expect(
      gundamPacketAnimationToAnimationPlans(entry, emptyView(), "player_one")[0],
    ).toMatchObject({
      version: 2,
      steps: [
        {
          type: "entityTransfer",
          from: { kind: "zone", id: "resourceDeck:player_one" },
          to: { kind: "zone", id: "resourceArea:player_one" },
          sourceFace: "hidden",
          destinationFace: "public",
          audioCue: "resource.gain",
        },
      ],
    });
  });

  test("maps an explicit Shield reveal to the shared face-change primitive", () => {
    const entry = {
      animation: {
        id: "shield-reveal",
        type: "cardFlip",
        duration: 320,
        data: { kind: "cardFlip", cardId: "shield-1", faceDown: false },
      },
      stateID: 3,
      turnNumber: 1,
    } as TurnTaggedPacketAnimation;

    expect(gundamPacketAnimationToAnimationPlans(entry, emptyView(), "player_one")).toEqual([
      {
        id: "shield-reveal:flip",
        version: 2,
        steps: [
          expect.objectContaining({
            type: "entityStateChange",
            change: "face",
            sourceFace: "hidden",
            destinationFace: "public",
          }),
        ],
      },
    ]);
  });

  test("staggers adjacent Shield transfers without delaying unrelated movement", () => {
    const shieldTransfer = (id: string) => ({
      id,
      type: "entityTransfer" as const,
      entity: { kind: "entity" as const, id },
      from: { kind: "zone" as const, id: "shieldArea:p2", ownerId: "p2" },
      to: { kind: "zone" as const, id: "trash:p2", ownerId: "p2" },
      sourceFace: "hidden" as const,
      destinationFace: "public" as const,
    });
    const draw = {
      ...shieldTransfer("draw-1"),
      from: { kind: "zone" as const, id: "deck:p1", ownerId: "p1" },
      to: { kind: "zone" as const, id: "hand:p1", ownerId: "p1" },
    };

    expect(
      staggerGundamCardTransfers([shieldTransfer("shield-1"), shieldTransfer("shield-2"), draw]),
    ).toEqual([
      shieldTransfer("shield-1"),
      { ...shieldTransfer("shield-2"), startAtMs: 120 },
      draw,
    ]);
  });

  test("infers the battlefield source for a defeated Unit when the packet omits it", () => {
    const entry = {
      animation: {
        id: "defeated-unit",
        type: "cardMove",
        duration: 560,
        data: {
          kind: "cardMove",
          cardId: "player_two_unit_1",
          ownerId: "player_two",
          fromZone: "",
          toZone: "trash",
        },
      },
      stateID: 2,
      turnNumber: 1,
    } as TurnTaggedPacketAnimation;
    const view = {
      ...emptyView(),
      zones: {
        zones: {
          "trash:player_two": {
            cards: [
              {
                instanceId: "player_two_unit_1",
                ownerId: "player_two",
                zoneId: "trash",
                definition: { type: "unit" },
              },
            ],
          },
        },
      },
    } as unknown as BoardProjection;

    expect(gundamPacketAnimationToAnimationPlans(entry, view, "player_one")[0]).toMatchObject({
      steps: [
        {
          type: "entityTransfer",
          from: { kind: "zone", id: "battleArea:player_two" },
          to: { kind: "zone", id: "trash:player_two" },
        },
      ],
    });
  });

  test("identifies only hand-to-battle-area transfers for drag visual handoff", () => {
    const deployAnimation = {
      id: "deploy-1",
      type: "cardMove",
      duration: 560,
      data: {
        kind: "cardMove",
        cardId: "unit-1",
        ownerId: "player_one",
        fromZone: "hand",
        toZone: "battleArea",
      },
    };
    const deployEntry = {
      animation: deployAnimation,
      stateID: 2,
      turnNumber: 1,
    } as TurnTaggedPacketAnimation;
    const drawEntry = {
      ...deployEntry,
      animation: {
        ...deployAnimation,
        data: {
          ...deployAnimation.data,
          fromZone: "deck",
          toZone: "hand",
        },
      },
    } as TurnTaggedPacketAnimation;

    expect(isHandToBattleAreaTransfer(deployEntry)).toBe(true);
    expect(isHandToBattleAreaTransfer(drawEntry)).toBe(false);
  });

  test("keeps provider ingestion isolated to newly accepted packets", () => {
    const previous = [{ id: "a" }, { id: "b" }];
    const current = [...previous, { id: "c" }];
    expect(itemsAfterPreviousSnapshot(current, previous, (item) => item.id)).toEqual({
      newItems: [{ id: "c" }],
      didReset: false,
    });
  });

  test("does not replay packets after a repeated phase animation id", () => {
    const previous = [{ id: "attack-1" }, { id: "phase:main" }];
    const current = [...previous, { id: "attack-2" }, { id: "phase:main" }, { id: "phase:end" }];

    expect(itemsAfterPreviousSnapshot(current, previous, (item) => item.id)).toEqual({
      newItems: [{ id: "attack-2" }, { id: "phase:main" }, { id: "phase:end" }],
      didReset: false,
    });
    expect(
      itemsAfterPreviousSnapshot([...current, { id: "turn:2" }], current, (item) => item.id),
    ).toEqual({
      newItems: [{ id: "turn:2" }],
      didReset: false,
    });
  });

  test("detects a state rollback even when packet animation history is unchanged", () => {
    expect(didAuthoritativeHistoryReset(12, 8, false)).toBe(true);
    expect(didAuthoritativeHistoryReset(12, 13, false)).toBe(false);
  });

  test("projects authoritative hand faces for owner and opponent viewers", () => {
    const plan = {
      id: "server-plan",
      version: 2 as const,
      steps: [
        {
          id: "deploy",
          type: "entityTransfer" as const,
          entity: { kind: "entity" as const, id: "unit" },
          from: { kind: "zone" as const, id: "hand:player_one", ownerId: "player_one" },
          to: { kind: "zone" as const, id: "battleArea:player_one", ownerId: "player_one" },
          sourceFace: "hidden" as const,
          destinationFace: "public" as const,
        },
      ],
    };

    expect(projectGundamAuthoritativeAnimationPlan(plan, "player_one").steps[0]).toMatchObject({
      sourceFace: "public",
      destinationFace: "public",
    });
    expect(projectGundamAuthoritativeAnimationPlan(plan, "player_two").steps[0]).toMatchObject({
      sourceFace: "hidden",
      destinationFace: "public",
    });
  });

  test("lets the compact center ribbon own battle-step transitions", () => {
    const entry = {
      animation: {
        id: "battle-action-step",
        type: "phaseChanged",
        duration: 780,
        data: {
          kind: "generic",
          name: "phaseChanged",
          params: {
            from: "turnCycle / battle-phase / block-step",
            to: "turnCycle / battle-phase / action-step",
          },
        },
      },
      stateID: 4,
      turnNumber: 1,
    } as TurnTaggedPacketAnimation;

    expect(gundamPacketAnimationToAnimationPlans(entry, emptyView(), "player_one")).toEqual([]);
  });

  test("lets required setup prompts own first-player and mulligan transitions", () => {
    const entry = {
      animation: {
        id: "mulligan-phase",
        type: "phaseChanged",
        duration: 780,
        data: {
          kind: "generic",
          name: "phaseChanged",
          params: {
            from: "game-setup / choose-first-player",
            to: "game-setup / mulligan",
          },
        },
      },
      stateID: 1,
      turnNumber: 1,
    } as TurnTaggedPacketAnimation;

    expect(gundamPacketAnimationToAnimationPlans(entry, emptyView(), "player_one")).toEqual([]);
  });

  test("does not cover mulligan with the setup-only Turn 1 announcement", () => {
    const entry = {
      animation: {
        id: "initial-turn",
        type: "turnChanged",
        duration: 780,
        data: {
          kind: "generic",
          name: "turnChanged",
          params: {
            previousTurn: 0,
            turn: 1,
            playerId: "player_one",
          },
        },
      },
      stateID: 1,
      turnNumber: 1,
    } as TurnTaggedPacketAnimation;

    expect(gundamPacketAnimationToAnimationPlans(entry, emptyView(), "player_one")).toEqual([]);
  });

  test("leaves declaration routes to the persistent overlay and resolves damage before trash", () => {
    const attacker = { kind: "entity", id: "attacker" } as const;
    const defender = { kind: "entity", id: "defender" } as const;

    expect(
      prepareGundamSharedAnimationSteps([
        {
          id: "declared",
          type: "combat",
          source: attacker,
          target: defender,
          reason: "declared",
          audioCue: "combat.start",
        },
        {
          id: "attacker-damage",
          type: "combat",
          source: defender,
          target: attacker,
          reason: "resolved",
        },
        {
          id: "defender-damage",
          type: "combat",
          source: attacker,
          target: defender,
          reason: "resolved",
        },
        {
          id: "attacker-trash",
          type: "entityTransfer",
          entity: attacker,
          to: { kind: "zone", id: "trash:p1", ownerId: "p1" },
          sourceFace: "public",
          destinationFace: "public",
        },
        {
          id: "defender-trash",
          type: "entityTransfer",
          entity: defender,
          to: { kind: "zone", id: "trash:p2", ownerId: "p2" },
          sourceFace: "public",
          destinationFace: "public",
        },
      ]),
    ).toEqual([
      {
        id: "declared",
        type: "hold",
        durationMs: GUNDAM_ANIMATION_DURATION_MS.combat,
        audioCue: "combat.start",
      },
      expect.objectContaining({ id: "attacker-damage", type: "combat" }),
      expect.objectContaining({ id: "defender-damage", type: "combat" }),
      expect.objectContaining({
        id: "attacker-trash",
        type: "entityTransfer",
        startAtMs: GUNDAM_ANIMATION_DURATION_MS.combat + GUNDAM_ANIMATION_DURATION_MS.readingPause,
      }),
      expect.objectContaining({
        id: "defender-trash",
        type: "entityTransfer",
        startAtMs: GUNDAM_ANIMATION_DURATION_MS.combat + GUNDAM_ANIMATION_DURATION_MS.readingPause,
      }),
      expect.objectContaining({
        type: "hold",
        durationMs: GUNDAM_ANIMATION_DURATION_MS.readingPause,
      }),
    ]);
  });

  test("defers and then staggers same-owner defeated cards until combat resolves", () => {
    const source = { kind: "entity", id: "source" } as const;
    const defeatedOne = { kind: "entity", id: "defeated-1" } as const;
    const defeatedTwo = { kind: "entity", id: "defeated-2" } as const;

    const prepared = prepareGundamSharedAnimationSteps([
      {
        id: "damage-1",
        type: "combat",
        source,
        target: defeatedOne,
        reason: "resolved",
      },
      {
        id: "damage-2",
        type: "combat",
        source,
        target: defeatedTwo,
        reason: "resolved",
      },
      {
        id: "trash-1",
        type: "entityTransfer",
        entity: defeatedOne,
        from: { kind: "zone", id: "battleArea:p2", ownerId: "p2" },
        to: { kind: "zone", id: "trash:p2", ownerId: "p2" },
        sourceFace: "public",
        destinationFace: "public",
      },
      {
        id: "trash-2",
        type: "entityTransfer",
        entity: defeatedTwo,
        from: { kind: "zone", id: "battleArea:p2", ownerId: "p2" },
        to: { kind: "zone", id: "trash:p2", ownerId: "p2" },
        sourceFace: "public",
        destinationFace: "public",
      },
    ]);

    expect(prepared[2]).toMatchObject({
      id: "trash-1",
      startAtMs: GUNDAM_ANIMATION_DURATION_MS.combat + GUNDAM_ANIMATION_DURATION_MS.readingPause,
    });
    expect(prepared[3]).toMatchObject({
      id: "trash-2",
      startAtMs:
        GUNDAM_ANIMATION_DURATION_MS.combat + GUNDAM_ANIMATION_DURATION_MS.readingPause + 120,
    });
  });

  test("maps HP recovery to a neutral spotlight and positive card-local delta", () => {
    const entry = {
      animation: {
        id: "repair-2",
        type: "generic",
        duration: 320,
        data: {
          kind: "generic",
          name: "hpRecovered",
          params: { cardId: "super-gundam", amount: 2 },
        },
      },
      stateID: 9,
      turnNumber: 1,
    } as TurnTaggedPacketAnimation;

    expect(gundamPacketAnimationToAnimationPlans(entry, emptyView(), "player_one")).toEqual([
      {
        id: "repair-2:recovery",
        version: 2,
        steps: [
          expect.objectContaining({
            type: "emphasize",
            at: { kind: "entity", id: "super-gundam" },
            label: "RECOVER",
            audioCue: "effect.trigger",
          }),
          expect.objectContaining({
            type: "valueDelta",
            subject: { kind: "entity", id: "super-gundam" },
            delta: 2,
            label: "HP",
            tone: "positive",
          }),
        ],
      },
    ]);
  });

  test("maps a battle stat modifier to a card-local value delta", () => {
    const entry = {
      animation: {
        id: "diffuse-beam-ap",
        type: "generic",
        duration: 520,
        data: {
          kind: "generic",
          name: "statModified",
          params: {
            cardId: "guncannon",
            stat: "ap",
            amount: -3,
            duration: "thisBattle",
          },
        },
      },
      stateID: 10,
      turnNumber: 1,
    } as TurnTaggedPacketAnimation;

    expect(gundamPacketAnimationToAnimationPlans(entry, emptyView(), "player_one")).toEqual([
      expect.objectContaining({
        steps: [
          expect.objectContaining({
            type: "valueDelta",
            subject: { kind: "entity", id: "guncannon" },
            delta: -3,
            label: "AP",
            tone: "negative",
          }),
        ],
      }),
    ]);
  });

  test("keeps a zero-delta stat modifier in the animation stream", () => {
    const entry = {
      animation: {
        id: "zero-ap",
        type: "generic",
        duration: 520,
        data: {
          kind: "generic",
          name: "statModified",
          params: { cardId: "guncannon", stat: "ap", amount: 0 },
        },
      },
      stateID: 10,
      turnNumber: 1,
    } as TurnTaggedPacketAnimation;

    expect(gundamPacketAnimationToAnimationPlans(entry, emptyView(), "player_one")).toEqual([
      expect.objectContaining({
        steps: [expect.objectContaining({ type: "valueDelta", delta: 0, label: "AP" })],
      }),
    ]);
  });

  test("holds a targeted unit effect for the Lorcana-normal signature beat", () => {
    const entry = {
      animation: {
        id: "effect-resolved",
        type: "generic",
        duration: 520,
        data: {
          kind: "generic",
          name: "effectResolved",
          params: {
            sourceCardId: "zeta",
            playerId: "player_one",
            targets: ["gouf"],
          },
        },
      },
      stateID: 9,
      turnNumber: 1,
    } as TurnTaggedPacketAnimation;

    expect(gundamPacketAnimationToAnimationPlans(entry, emptyView(), "player_one")).toEqual([
      expect.objectContaining({
        steps: [
          expect.objectContaining({
            type: "effect",
            source: { kind: "entity", id: "zeta" },
            targets: [{ kind: "entity", id: "gouf" }],
            durationMs: GUNDAM_ANIMATION_DURATION_MS.effectHold,
          }),
        ],
      }),
    ]);
  });

  test("keeps a resolving command staged until effect resolution moves it to trash", () => {
    const cardId = "player_one_command_1";
    const view = {
      ...emptyView(),
      zones: {
        zones: {
          "hand:player_one": {
            cards: [
              {
                instanceId: cardId,
                ownerId: "player_one",
                zoneId: "hand",
                definition: { type: "command" },
              },
            ],
          },
        },
      },
    } as unknown as BoardProjection;
    const commandPlayed = {
      animation: {
        id: "command-played",
        type: "generic",
        duration: 460,
        data: {
          kind: "generic",
          name: "commandPlayed",
          params: {
            cardId,
            ownerId: "player_one",
            awaitsResolution: true,
          },
        },
      },
      stateID: 8,
      turnNumber: 1,
    } as TurnTaggedPacketAnimation;
    const effectResolved = {
      animation: {
        id: "effect-resolved",
        type: "generic",
        duration: 620,
        data: {
          kind: "generic",
          name: "effectResolved",
          params: {
            sourceCardId: cardId,
            playerId: "player_one",
            targets: ["unit-1"],
          },
        },
      },
      stateID: 9,
      turnNumber: 1,
    } as TurnTaggedPacketAnimation;

    expect(gundamPacketAnimationToAnimationPlans(commandPlayed, view, "player_one")).toEqual([
      expect.objectContaining({
        steps: [
          expect.objectContaining({
            type: "entityTransfer",
            entity: { kind: "entity", id: cardId },
            from: { kind: "zone", id: "hand:player_one", ownerId: "player_one" },
            to: { kind: "anchor", id: "gundam-command-focus" },
          }),
        ],
      }),
    ]);

    expect(gundamPacketAnimationToAnimationPlans(effectResolved, view, "player_one")).toEqual([
      expect.objectContaining({
        steps: [
          expect.objectContaining({
            type: "effect",
            source: { kind: "anchor", id: "gundam-command-focus" },
            targets: [{ kind: "entity", id: "unit-1" }],
            durationMs: GUNDAM_ANIMATION_DURATION_MS.commandEffect,
          }),
          expect.objectContaining({
            type: "entityTransfer",
            entity: { kind: "entity", id: cardId },
            from: { kind: "anchor", id: "gundam-command-focus" },
            to: { kind: "zone", id: "trash:player_one", ownerId: "player_one" },
            startAtMs:
              GUNDAM_ANIMATION_DURATION_MS.commandEffect +
              GUNDAM_ANIMATION_DURATION_MS.readingPause,
          }),
        ],
      }),
    ]);
  });
});

function emptyView(): BoardProjection {
  return {
    G: {},
    stateID: 1,
    status: null,
    players: [],
    availableMoves: [],
    timerView: {},
    zones: { zones: {} },
  } as unknown as BoardProjection;
}
