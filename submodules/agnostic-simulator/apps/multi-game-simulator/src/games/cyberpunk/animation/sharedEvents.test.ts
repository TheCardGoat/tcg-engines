import { describe, expect, test } from "vite-plus/test";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import { PLAYER_SIDE_TO_ID } from "../engine";
import type {
  CardAttachStep,
  CardEnterStep,
  CardExitStep,
  EffectTargetStep,
  CardLandStep,
  CardMoveStep,
  LegendRevealStep,
} from "./types";
import {
  type CyberpunkSharedAnimationContext,
  cyberpunkAnimationScriptToSimulatorEvents,
  cyberpunkAnimationStepToSimulatorEvent,
  isCyberpunkAnimationStepSharedSupported,
} from "./sharedEvents";

const baseEntity: SimulatorEntity = {
  id: "card-1",
  title: "Floor It",
  subtitle: "Program",
  kind: "card",
  ownerId: String(PLAYER_SIDE_TO_ID.player),
  face: "public",
  states: [],
  stats: [],
  traits: [],
};

const context: CyberpunkSharedAnimationContext = {
  viewerSeatId: String(PLAYER_SIDE_TO_ID.player),
  resolveEntity: (cardId: string) =>
    cardId === "missing" ? null : { ...baseEntity, id: cardId, title: cardId },
};

describe("cyberpunkAnimationStepToSimulatorEvent", () => {
  test("maps cardMove to a shared zoneTransfer event", () => {
    const step: CardMoveStep = {
      id: "step-1",
      kind: "cardMove",
      startMs: 120,
      durationMs: 340,
      reason: "cardMoved",
      cardId: "card-1" as CardMoveStep["cardId"],
      fromZone: "hand",
      toZone: "field",
      playerId: PLAYER_SIDE_TO_ID.player,
    };

    const event = cyberpunkAnimationStepToSimulatorEvent(step, context);

    expect(event).toMatchObject({
      id: "step-1",
      primitive: "zoneTransfer",
      delayMs: 120,
      durationMs: 340,
      fromZone: { id: "p-hand", visibility: "private", role: "hand" },
      toZone: { id: "p-field", visibility: "public", role: "battlefield" },
    });
  });

  test("maps cardsDrawn cardEnter steps to draw events from deck to hand", () => {
    const step: CardEnterStep = {
      id: "step-2",
      kind: "cardEnter",
      startMs: 80,
      durationMs: 300,
      reason: "cardsDrawn",
      cardId: "card-2" as CardEnterStep["cardId"],
      toZone: "hand",
      playerId: PLAYER_SIDE_TO_ID.player,
    };

    const event = cyberpunkAnimationStepToSimulatorEvent(step, context);

    expect(event).toMatchObject({
      primitive: "draw",
      fromZone: { id: "p-deck", visibility: "secret", role: "deck" },
      toZone: { id: "p-hand", visibility: "private", role: "hand" },
    });
  });

  test("maps non-draw cardEnter and cardExit steps to enter and exit events", () => {
    const enter: CardEnterStep = {
      id: "step-3",
      kind: "cardEnter",
      startMs: 0,
      durationMs: 200,
      reason: "search",
      cardId: "card-3" as CardEnterStep["cardId"],
      toZone: "trash",
      playerId: PLAYER_SIDE_TO_ID.player,
    };
    const exit: CardExitStep = {
      id: "step-4",
      kind: "cardExit",
      startMs: 0,
      durationMs: 200,
      reason: "cardSold",
      cardId: "card-4" as CardExitStep["cardId"],
      fromZone: "hand",
      playerId: PLAYER_SIDE_TO_ID.player,
      exitReason: "sold",
    };

    expect(cyberpunkAnimationStepToSimulatorEvent(enter, context)).toMatchObject({
      primitive: "zoneEnter",
      toZone: { id: "p-trash" },
    });
    expect(cyberpunkAnimationStepToSimulatorEvent(exit, context)).toMatchObject({
      primitive: "zoneExit",
      fromZone: { id: "p-hand" },
    });
  });

  test("maps attach and legend reveal steps to their shared primitives", () => {
    const attach: CardAttachStep = {
      id: "step-5",
      kind: "cardAttach",
      startMs: 0,
      durationMs: 300,
      reason: "cardAttached",
      gearId: "gear-1" as CardAttachStep["gearId"],
      hostId: "host-1" as CardAttachStep["hostId"],
      playerId: PLAYER_SIDE_TO_ID.player,
    };
    const reveal: LegendRevealStep = {
      id: "step-6",
      kind: "legendReveal",
      startMs: 0,
      durationMs: 300,
      reason: "legendCalled",
      cardId: "legend-1" as LegendRevealStep["cardId"],
      playerId: PLAYER_SIDE_TO_ID.player,
    };

    expect(cyberpunkAnimationStepToSimulatorEvent(attach, context)).toMatchObject({
      primitive: "attach",
      targetEntityId: "host-1",
      fromZone: { id: "p-hand" },
      toZone: { id: "p-field" },
    });
    expect(cyberpunkAnimationStepToSimulatorEvent(reveal, context)).toMatchObject({
      primitive: "flipReveal",
      zone: { id: "p-legends" },
    });
  });

  test("maps effect targets to a shared source-to-target primitive", () => {
    const step: EffectTargetStep = {
      id: "step-target",
      kind: "effectTarget",
      startMs: 40,
      durationMs: 380,
      reason: "effectTargeted",
      sourceCardId: "program-1" as EffectTargetStep["sourceCardId"],
      targets: [{ kind: "card", cardId: "unit-1" as EffectTargetStep["sourceCardId"] }],
      playerId: PLAYER_SIDE_TO_ID.player,
    };

    const event = cyberpunkAnimationStepToSimulatorEvent(step, context);

    expect(event).toMatchObject({
      id: "step-target",
      primitive: "effectTarget",
      delayMs: 40,
      durationMs: 380,
      sourceEntity: { id: "program-1" },
      sourceZone: { id: "p-trash", visibility: "public" },
      targets: [{ kind: "entity", entityId: "unit-1" }],
    });
  });

  test("leaves Cyberpunk-only emphasis and overlay steps on the script-player path", () => {
    const land: CardLandStep = {
      id: "step-7",
      kind: "cardLand",
      startMs: 0,
      durationMs: 160,
      reason: "cardPlayed",
      cardId: "card-7" as CardLandStep["cardId"],
      playerId: PLAYER_SIDE_TO_ID.player,
    };

    expect(cyberpunkAnimationStepToSimulatorEvent(land, context)).toBeNull();
  });

  test("classifies which script steps the shared layer owns", () => {
    const move: CardMoveStep = {
      id: "step-supported",
      kind: "cardMove",
      startMs: 0,
      durationMs: 300,
      reason: "cardMoved",
      cardId: "card-supported" as CardMoveStep["cardId"],
      fromZone: "hand",
      toZone: "field",
      playerId: PLAYER_SIDE_TO_ID.player,
    };
    const land: CardLandStep = {
      id: "step-unsupported",
      kind: "cardLand",
      startMs: 0,
      durationMs: 160,
      reason: "cardPlayed",
      cardId: "card-unsupported" as CardLandStep["cardId"],
      playerId: PLAYER_SIDE_TO_ID.player,
    };

    expect(isCyberpunkAnimationStepSharedSupported(move)).toBe(true);
    expect(isCyberpunkAnimationStepSharedSupported(land)).toBe(false);
  });

  test("maps whole scripts and preserves entry prefixes", () => {
    const step: CardMoveStep = {
      id: "step-8",
      kind: "cardMove",
      startMs: 0,
      durationMs: 300,
      reason: "cardMoved",
      cardId: "card-8" as CardMoveStep["cardId"],
      fromZone: "hand",
      toZone: "trash",
      playerId: PLAYER_SIDE_TO_ID.player,
    };

    const events = cyberpunkAnimationScriptToSimulatorEvents(
      { steps: [step], totalDurationMs: 300 },
      { ...context, idPrefix: "entry-1" },
    );

    expect(events).toHaveLength(1);
    expect(events[0]?.id).toBe("entry-1:step-8");
  });
});
