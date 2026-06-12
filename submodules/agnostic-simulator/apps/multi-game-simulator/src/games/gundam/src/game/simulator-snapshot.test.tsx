// @vitest-environment jsdom
import { describe, expect, it, vi } from "vite-plus/test";
import { fireEvent, render, screen } from "@testing-library/react";
import { INTERACTION_PROTOCOL_VERSION, type EngineInteractionView } from "@tcg/protocol";
import type { Card } from "@tcg/gundam-types";

import type { BoardProjection, PendingMoveControls, PendingState, SubmitOutcome } from "./index.ts";
import {
  projectGundamSimulatorSnapshot,
  submitGundamSimulatorInteraction,
} from "./simulator-snapshot.ts";
import { ChooseFirstPlayerPrompt } from "../components/ui/ChooseFirstPlayerPrompt.tsx";
import { MulliganPrompt } from "../components/ui/MulliganPrompt.tsx";

function makeCard(overrides: Partial<Card> = {}): Card {
  return {
    name: "RX-78-2 Gundam",
    cost: 3,
    level: 2,
    type: "unit",
    cardNumber: "ST01-001",
    rarity: "R",
    traits: ["Earth Federation", "Gundam"],
    keywordEffects: [],
    effect: "Test effect.",
    ap: 3,
    hp: 4,
    ...overrides,
  } as Card;
}

function makeView(): BoardProjection {
  const unit = {
    instanceId: "unit-1",
    definition: makeCard(),
    definitionId: "st01-001",
    meta: { exhausted: true, deployedThisTurn: true },
    ownerId: "p1",
    controllerId: "p1",
    faceDown: false,
    zoneId: "battleArea:p1",
  };
  const pilot = {
    instanceId: "pilot-1",
    definition: makeCard({ name: "Amuro Ray", type: "pilot", apBonus: 1 }),
    definitionId: "st01-010",
    meta: null,
    ownerId: "p1",
    controllerId: "p1",
    faceDown: false,
    zoneId: "battleArea:p1",
  };
  const hiddenHandCard = {
    instanceId: "hidden-1",
    definition: null,
    definitionId: null,
    meta: null,
    ownerId: "p2",
    controllerId: "p2",
    faceDown: true,
    zoneId: "hand:p2",
  };

  return {
    G: {
      damage: { "unit-1": 2 },
      pilotAssignments: { "unit-1": "pilot-1" },
    },
    stateID: 7,
    status: {
      phase: "main",
      activePlayer: "p1",
      turnPlayer: "p1",
      turn: 3,
      pendingDecision: [],
    } as never,
    zones: {
      zones: {
        "battleArea:p1": { count: 2, cards: [unit, pilot] },
        "resourceArea:p1": { count: 1, cards: [] },
        "hand:p2": { count: 1, cards: [hiddenHandCard] },
        "deck:p1": { count: 42, cards: [] },
        "trash:p1": { count: 1, cards: [] },
        "shieldArea:p1": { count: 6, cards: [] },
      },
    },
    players: [
      { playerId: "p1", publicData: {} },
      { playerId: "p2", publicData: {} },
    ],
    availableMoves: [],
    myPlayerId: "p1",
    timerView: {
      serverTimestamp: 1_000,
      players: {
        p1: {
          reserveMsRemaining: 60_000,
          isRunning: true,
          startedAtMs: 1_000,
          timeoutCount: 0,
          isInNegativeTime: false,
        },
      },
    },
  } as unknown as BoardProjection;
}

function readyInteractionView(): EngineInteractionView {
  return {
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    gameSlug: "gundam",
    actorId: "p1",
    stateVersion: 7,
    status: "ready",
    actions: [
      {
        id: "deployUnit",
        requestId: "req-deployUnit-7",
        intent: "play-card",
        text: { key: "gundam.move.deployUnit" },
        enabled: true,
        inputs: [
          {
            kind: "entity-selection",
            id: "cardId",
            role: "source",
            entityKinds: ["card"],
            min: 1,
            max: 1,
            ordered: false,
            text: { key: "gundam.input.card" },
            candidates: [{ entity: { kind: "card", instanceId: "unit-1" }, enabled: true }],
          },
        ],
      },
      {
        id: "passTurn",
        requestId: "req-passTurn-7",
        intent: "pass",
        text: { key: "gundam.move.passTurn" },
        enabled: true,
        inputs: [],
      },
    ],
  };
}

function resolveEffectInteractionView(): EngineInteractionView {
  return {
    protocolVersion: INTERACTION_PROTOCOL_VERSION,
    gameSlug: "gundam",
    actorId: "p1",
    stateVersion: 7,
    status: "choosing",
    actions: [
      {
        id: "resolveEffect",
        requestId: "req-resolveEffect-7",
        intent: "choose-targets",
        text: { key: "gundam.move.resolveEffect" },
        enabled: true,
        inputs: [
          {
            kind: "option-selection",
            id: "pendingEffectId",
            text: { key: "gundam.choice.pendingEffect" },
            required: true,
            min: 1,
            max: 1,
            options: [{ id: "effect-1", text: { key: "gundam.choice.effect" }, enabled: true }],
          },
          {
            kind: "entity-selection",
            id: "targets",
            role: "target",
            entityKinds: ["card"],
            min: 1,
            max: 2,
            ordered: false,
            text: { key: "gundam.input.targets" },
            candidates: [
              { entity: { kind: "card", instanceId: "unit-1" }, enabled: true },
              { entity: { kind: "card", instanceId: "pilot-1" }, enabled: true },
            ],
          },
          {
            kind: "entity-selection",
            id: "cost.0",
            role: "cost",
            entityKinds: ["resource"],
            min: 1,
            max: 2,
            ordered: false,
            text: { key: "gundam.input.cost" },
            candidates: [
              { entity: { kind: "resource", instanceId: "resource-1" }, enabled: true },
              { entity: { kind: "resource", instanceId: "resource-2" }, enabled: true },
            ],
          },
          {
            kind: "ordering",
            id: "deckLookAnswers.0.order",
            text: { key: "gundam.input.order" },
            required: false,
            entityKind: "card",
            min: 0,
            max: 2,
            candidates: [
              { entity: { kind: "card", instanceId: "deck-1" }, enabled: true },
              { entity: { kind: "card", instanceId: "deck-2" }, enabled: true },
            ],
          },
        ],
      },
    ],
  };
}

describe("projectGundamSimulatorSnapshot", () => {
  it("projects seats, zones, hidden cards, pilot pairing, badges, and timers", () => {
    const snapshot = projectGundamSimulatorSnapshot({
      view: makeView(),
      viewerId: "p1" as never,
      interactionView: readyInteractionView(),
      pendingState: { status: "idle" },
      logEntries: [
        {
          turnNumber: 3,
          entry: {
            id: 1,
            stateID: 7,
            timestamp: 1_000,
            type: "attack",
            message: "RX-78-2 attacks.",
            playerId: "p1" as never,
            cardIds: ["unit-1"],
          },
        },
      ],
      now: 2_000,
    });

    expect(snapshot.table.seats.map((seat) => seat.perspective)).toEqual(["top", "bottom"]);
    expect(snapshot.table.status).toMatchObject({
      activeSeatId: "p1",
      phase: "main",
      turn: 3,
      stateVersion: 7,
    });
    expect(snapshot.table.seats[1]?.timerMs).toBe(59_000);
    expect(snapshot.table.zones.find((zone) => zone.id === "deck:p1")?.count).toBe(42);
    expect(snapshot.table.zones.find((zone) => zone.id === "battleArea:p1")?.entityIds).toEqual([
      "unit-1",
    ]);

    const unit = snapshot.entities.find((entity) => entity.id === "unit-1");
    expect(unit?.states).toContain("rested");
    expect(unit?.overlayBadges?.map((badge) => badge.label)).toEqual(
      expect.arrayContaining(["2 DMG", "NEW", "PILOT"]),
    );

    const hidden = snapshot.entities.find((entity) => entity.id === "hidden-1");
    expect(hidden).toMatchObject({ title: "Hidden card", face: "hidden" });
    expect(snapshot.eventLog?.[0]).toMatchObject({ tags: ["combat"], entityIds: ["unit-1"] });
  });

  it("projects ready protocol actions as shared interactions", () => {
    const snapshot = projectGundamSimulatorSnapshot({
      view: makeView(),
      viewerId: "p1" as never,
      interactionView: readyInteractionView(),
      pendingState: { status: "idle" },
      logEntries: [],
      now: 1_000,
    });

    expect(snapshot.interactions.map((interaction) => interaction.id)).toEqual([
      "action:deployUnit",
      "action:passTurn",
    ]);
    expect(snapshot.interactions[0]?.input.kind).toBe("single-target");
    expect(snapshot.interactions[0]?.input.candidateEntityIds).toEqual(["unit-1"]);
    expect(snapshot.interactions[1]?.input.kind).toBe("action");
  });

  it("projects the first non-auto-filled input for multi-input protocol actions", () => {
    const snapshot = projectGundamSimulatorSnapshot({
      view: makeView(),
      viewerId: "p1" as never,
      interactionView: resolveEffectInteractionView(),
      pendingState: { status: "idle" },
      logEntries: [],
      now: 1_000,
    });

    expect(snapshot.interactions[0]).toMatchObject({
      id: "action:resolveEffect",
      input: {
        kind: "multi-target",
        candidateEntityIds: ["unit-1", "pilot-1"],
      },
    });
  });

  it("keeps fallback opponent seats distinct from the viewer", () => {
    const view = {
      ...makeView(),
      players: [{ playerId: "p1", publicData: {} }],
    } as BoardProjection;
    const snapshot = projectGundamSimulatorSnapshot({
      view,
      viewerId: "p1" as never,
      interactionView: readyInteractionView(),
      pendingState: { status: "idle" },
      logEntries: [],
      now: 1_000,
    });

    expect(new Set(snapshot.table.seats.map((seat) => seat.id)).size).toBe(
      snapshot.table.seats.length,
    );
  });

  it("projects pending target steps before ready actions", () => {
    const snapshot = projectGundamSimulatorSnapshot({
      view: makeView(),
      viewerId: "p1" as never,
      interactionView: readyInteractionView(),
      pendingState: {
        status: "collecting",
        move: "enterBattle" as never,
        partialInput: {},
        steps: [
          {
            kind: "selectTarget",
            role: "attacker",
            minTargets: 1,
            maxTargets: 1,
            candidateIds: ["unit-1"],
          } as never,
        ],
      },
      logEntries: [],
      now: 1_000,
    });

    expect(snapshot.interactions[0]?.id).toBe("pending:target:attacker");
    expect(snapshot.interactions[0]?.input.kind).toBe("single-target");
    expect(snapshot.interactions[1]?.id).toBe("pending:cancel");
  });
});

describe("submitGundamSimulatorInteraction", () => {
  it("starts card-sourced actions through the pending controller", () => {
    const pending = pendingHarness();
    const report = vi.fn((outcome) => outcome);
    submitGundamSimulatorInteraction({
      interactionId: "action:deployUnit",
      selection: {
        entityIds: ["unit-1"],
        optionIds: [],
        paymentIds: [],
        orderedIds: [],
      },
      pending,
      interactionView: readyInteractionView(),
      report,
      submitMove: vi.fn(),
    });

    expect(pending.startForCard).toHaveBeenCalledWith("deployUnit", "unit-1");
    expect(pending.confirm).not.toHaveBeenCalled();
    expect(report).not.toHaveBeenCalled();
  });

  it("confirms card-sourced actions immediately when no pending steps remain", () => {
    const pending = pendingHarness({
      startForCardState: {
        status: "collecting",
        move: "deployUnit" as never,
        partialInput: { cardId: "unit-1" },
        steps: [],
      },
      confirmOutcome: { ok: true, stateId: 8 },
    });
    const report = vi.fn((outcome) => outcome);
    submitGundamSimulatorInteraction({
      interactionId: "action:deployUnit",
      selection: {
        entityIds: ["unit-1"],
        optionIds: [],
        paymentIds: [],
        orderedIds: [],
      },
      pending,
      interactionView: readyInteractionView(),
      report,
      submitMove: vi.fn(),
    });

    expect(pending.confirm).toHaveBeenCalledOnce();
    expect(report).toHaveBeenCalledWith({ ok: true, stateId: 8 });
  });

  it("submits zero-input actions directly", () => {
    const submitMove = vi.fn((): SubmitOutcome => ({ ok: true, stateId: 8 }));
    const report = vi.fn((outcome) => outcome);
    submitGundamSimulatorInteraction({
      interactionId: "action:passTurn",
      selection: {
        entityIds: [],
        optionIds: [],
        paymentIds: [],
        orderedIds: [],
      },
      pending: pendingHarness(),
      interactionView: readyInteractionView(),
      report,
      submitMove,
    });

    expect(submitMove).toHaveBeenCalledWith("passTurn", {});
    expect(report).toHaveBeenCalledWith({ ok: true, stateId: 8 });
  });

  it("submits all protocol inputs as native Gundam pending payloads", () => {
    const submitMove = vi.fn((): SubmitOutcome => ({ ok: true, stateId: 8 }));
    const pending = pendingHarness();
    submitGundamSimulatorInteraction({
      interactionId: "action:resolveEffect",
      selection: {
        entityIds: ["unit-1", "pilot-1"],
        optionIds: [],
        paymentIds: ["resource-1", "resource-2"],
        orderedIds: ["deck-2", "deck-1"],
      },
      pending,
      interactionView: resolveEffectInteractionView(),
      report: (outcome) => outcome,
      submitMove,
    });

    expect(submitMove).not.toHaveBeenCalled();
    expect(pending.start).toHaveBeenCalledWith("resolveEffect", {
      pendingEffectId: "effect-1",
      targets: ["unit-1", "pilot-1"],
      cost: { 0: ["resource-1", "resource-2"] },
      deckLookAnswers: { 0: { toTop: ["deck-2", "deck-1"] } },
    });
  });

  it("confirms pending target selections immediately when no steps remain", () => {
    const basePending = pendingHarness({
      confirmOutcome: { ok: true, stateId: 8 },
    });
    const pending: PendingMoveControls = {
      ...basePending,
      state: {
        status: "collecting",
        move: "discardToHandLimit" as never,
        partialInput: {},
        steps: [
          {
            kind: "selectTarget",
            role: "discard-target",
            minTargets: 2,
            maxTargets: 2,
            candidateIds: ["unit-1", "pilot-1"],
          } as never,
        ],
      },
      provideTarget: vi.fn(
        (): PendingState => ({
          status: "collecting",
          move: "discardToHandLimit" as never,
          partialInput: { targets: ["unit-1", "pilot-1"] },
          steps: [],
        }),
      ),
    };
    const report = vi.fn((outcome) => outcome);

    submitGundamSimulatorInteraction({
      interactionId: "pending:target:discard-target",
      selection: {
        entityIds: ["unit-1", "pilot-1"],
        optionIds: [],
        paymentIds: [],
        orderedIds: [],
      },
      pending,
      interactionView: readyInteractionView(),
      report,
      submitMove: vi.fn(),
    });

    expect(pending.provideTarget).toHaveBeenCalledTimes(2);
    expect(pending.confirm).toHaveBeenCalledOnce();
    expect(report).toHaveBeenCalledWith({ ok: true, stateId: 8 });
  });

  it("projects and submits pending cost selections as payment input", () => {
    const pendingState: PendingState = {
      status: "collecting",
      move: "activateAbility" as never,
      partialInput: { cardId: "unit-1" },
      steps: [
        {
          kind: "selectCost",
          costType: "resource",
          candidateIds: ["resource-1", "resource-2"],
        } as never,
      ],
    };
    const snapshot = projectGundamSimulatorSnapshot({
      view: makeView(),
      viewerId: "p1" as never,
      interactionView: readyInteractionView(),
      pendingState,
      logEntries: [],
      now: Date.UTC(2026, 0, 1),
    });

    expect(snapshot.interactions[0]).toMatchObject({
      id: "pending:cost:resource",
      input: {
        kind: "payment",
        min: 1,
        max: 2,
        candidateEntityIds: ["resource-1", "resource-2"],
      },
    });

    const basePending = pendingHarness();
    const pending: PendingMoveControls = {
      ...basePending,
      state: pendingState,
      provide: vi.fn(
        (): PendingState => ({
          status: "collecting",
          move: "activateAbility" as never,
          partialInput: { cardId: "unit-1", cost: { 0: ["resource-1", "resource-2"] } },
          steps: [],
        }),
      ),
    };
    const report = vi.fn((outcome) => outcome);
    submitGundamSimulatorInteraction({
      interactionId: "pending:cost:resource",
      selection: {
        entityIds: [],
        optionIds: [],
        paymentIds: ["resource-1", "resource-2"],
        orderedIds: [],
      },
      pending,
      interactionView: readyInteractionView(),
      report,
      submitMove: vi.fn(),
    });

    expect(pending.provide).toHaveBeenCalledWith("cost", {
      0: ["resource-1", "resource-2"],
    });
    expect(pending.confirm).toHaveBeenCalledOnce();
    expect(report).toHaveBeenCalled();
  });

  it("keeps empty pending cost candidates within the payment input contract", () => {
    const snapshot = projectGundamSimulatorSnapshot({
      view: makeView(),
      viewerId: "p1" as never,
      interactionView: readyInteractionView(),
      pendingState: {
        status: "collecting",
        move: "activateAbility" as never,
        partialInput: { cardId: "unit-1" },
        steps: [
          {
            kind: "selectCost",
            costType: "resource",
            candidateIds: [],
          } as never,
        ],
      },
      logEntries: [],
      now: Date.UTC(2026, 0, 1),
    });

    expect(snapshot.interactions[0]?.input).toMatchObject({
      kind: "payment",
      min: 0,
      max: 0,
      candidateEntityIds: [],
    });
  });

  it("ignores pending cost submissions outside the advertised candidates", () => {
    const pendingState: PendingState = {
      status: "collecting",
      move: "activateAbility" as never,
      partialInput: { cardId: "unit-1" },
      steps: [
        {
          kind: "selectCost",
          costType: "resource",
          candidateIds: ["resource-1"],
        } as never,
      ],
    };
    const pending: PendingMoveControls = {
      ...pendingHarness(),
      state: pendingState,
    };
    const report = vi.fn((outcome) => outcome);
    submitGundamSimulatorInteraction({
      interactionId: "pending:cost:resource",
      selection: {
        entityIds: [],
        optionIds: [],
        paymentIds: ["resource-1", "resource-2"],
        orderedIds: [],
      },
      pending,
      interactionView: readyInteractionView(),
      report,
      submitMove: vi.fn(),
    });

    expect(pending.provide).not.toHaveBeenCalled();
    expect(pending.confirm).not.toHaveBeenCalled();
    expect(report).not.toHaveBeenCalled();
  });

  it("maps shared boolean selections to native pending effect answers", () => {
    const interactionView = resolveEffectInteractionView();
    const action = interactionView.actions[0];
    if (!action) throw new Error("Expected resolveEffect action");
    const pending = pendingHarness();
    submitGundamSimulatorInteraction({
      interactionId: "action:resolveEffect",
      selection: {
        entityIds: ["unit-1"],
        optionIds: ["true"],
        paymentIds: [],
        orderedIds: [],
      },
      pending,
      interactionView: {
        ...interactionView,
        actions: [
          {
            ...action,
            inputs: [
              action.inputs[0],
              {
                kind: "boolean",
                id: "optionalAnswers.0",
                text: { key: "gundam.choice.optional" },
                required: true,
                trueText: { key: "gundam.choice.yes" },
                falseText: { key: "gundam.choice.no" },
              },
            ],
          },
        ],
      },
      report: (outcome) => outcome,
      submitMove: vi.fn(),
    });

    expect(pending.start).toHaveBeenCalledWith("resolveEffect", {
      pendingEffectId: "effect-1",
      optionalAnswers: { 0: true },
    });
  });

  it("maps shared option selections to numeric native choose-one answers", () => {
    const interactionView = resolveEffectInteractionView();
    const action = interactionView.actions[0];
    if (!action) throw new Error("Expected resolveEffect action");
    const pending = pendingHarness();
    submitGundamSimulatorInteraction({
      interactionId: "action:resolveEffect",
      selection: {
        entityIds: [],
        optionIds: ["2"],
        paymentIds: [],
        orderedIds: [],
      },
      pending,
      interactionView: {
        ...interactionView,
        actions: [
          {
            ...action,
            inputs: [
              action.inputs[0],
              {
                kind: "option-selection",
                id: "chooseOneAnswers.1",
                text: { key: "gundam.choice.chooseOne" },
                required: true,
                min: 1,
                max: 1,
                options: [{ id: "2", text: { key: "gundam.choice.option" }, enabled: true }],
              },
            ],
          },
        ],
      },
      report: (outcome) => outcome,
      submitMove: vi.fn(),
    });

    expect(pending.start).toHaveBeenCalledWith("resolveEffect", {
      pendingEffectId: "effect-1",
      chooseOneAnswers: { 1: 2 },
    });
  });
});

describe("Gundam setup choice prompts", () => {
  it("keeps choose-first-player on the shared ChoiceModal wrapper", () => {
    const onChooseSelf = vi.fn();
    render(<ChooseFirstPlayerPrompt onChooseSelf={onChooseSelf} onChooseOpponent={vi.fn()} />);

    expect(document.querySelector(".choice-modal")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /I go first/i }));
    expect(onChooseSelf).toHaveBeenCalled();
  });

  it("keeps mulligan on the shared ChoiceModal wrapper", () => {
    const onRedraw = vi.fn();
    render(<MulliganPrompt onKeep={vi.fn()} onRedraw={onRedraw} />);

    expect(document.querySelector(".choice-modal")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /redraw/i }));
    expect(onRedraw).toHaveBeenCalled();
  });
});

function pendingHarness(
  options: {
    readonly startState?: PendingState;
    readonly startForCardState?: PendingState;
    readonly confirmOutcome?: SubmitOutcome | null;
  } = {},
): PendingMoveControls {
  const defaultCollectingState: PendingState = {
    status: "collecting",
    move: "deployUnit" as never,
    partialInput: {},
    steps: [{ kind: "confirm" } as never],
  };
  return {
    state: { status: "idle" },
    start: vi.fn(() => options.startState ?? defaultCollectingState),
    startForCard: vi.fn(() => options.startForCardState ?? defaultCollectingState),
    provide: vi.fn(() => defaultCollectingState),
    provideTarget: vi.fn(() => defaultCollectingState),
    confirm: vi.fn(() => options.confirmOutcome ?? null),
    cancel: vi.fn(),
  };
}
