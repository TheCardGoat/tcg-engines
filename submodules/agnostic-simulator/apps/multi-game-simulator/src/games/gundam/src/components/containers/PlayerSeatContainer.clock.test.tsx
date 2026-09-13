// @vitest-environment jsdom
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import type { ReactNode } from "react";

const BASE_TIME_MS = 1_000_000;

const testState = vi.hoisted(() => {
  type SourceAction = {
    readonly id: string;
    readonly enabled: boolean;
    readonly inputs: readonly {
      readonly id: string;
      readonly kind: "entity-selection";
      readonly role: "source";
      readonly candidates: readonly {
        readonly enabled: boolean;
        readonly entity: { readonly instanceId: string };
      }[];
    }[];
  };
  const view = {
    G: {},
    status: {
      phase: "main",
      activePlayer: "p1",
      turnPlayer: "p1",
    },
    zones: {
      zones: {},
    },
    timerView: {
      serverTimestamp: 1_000_000,
      players: {
        p2: {
          reserveMsRemaining: 60_000,
          isRunning: true,
          startedAtMs: 1_000_000,
          timeoutCount: 0,
          isInNegativeTime: false,
          activePlayerAccumulatedMs: 0,
          maxDecisionTimeMs: 1_000,
        },
      },
    },
  };

  return {
    view,
    projectSeat: vi.fn(() => ({
      player: {
        name: "p2",
        clock: "\u2014",
        colors: [],
        deck: 0,
        resourceDeck: 0,
        discard: 0,
        shields: 0,
      },
      play: [],
      resourceArea: [],
      base: [],
      shields: [],
      discard: [],
      availableResources: 0,
    })),
    registerAttackDropHandler: vi.fn(() => () => {}),
    registerPilotDropHandler: vi.fn<
      (handler: (cardId: string, unitId: string) => boolean) => () => void
    >(() => () => {}),
    describeMove: vi.fn<
      (
        moveName: string,
        partialInput: { readonly cardId?: string; readonly pilotId?: string },
      ) => readonly {
        readonly kind: "selectTarget";
        readonly role: "unit";
        readonly candidateIds: readonly string[];
      }[]
    >(() => []),
    interactionView: { actions: [] as SourceAction[] },
    onHandCardDrop: undefined as ((cardId: string) => void) | undefined,
    draft: {
      active: false,
      values: {},
      candidateIds: new Set<string>(),
      boardCandidateIds: new Set<string>(),
      boardInteractionEnabled: true,
      selectedIds: new Set<string>(),
      begin: vi.fn(),
    },
    report: vi.fn(),
    submit: vi.fn(),
  };
});

vi.mock("../../game/index.ts", () => ({
  asMoveName: (name: string) => name,
  useBoardProjection: () => testState.view,
  useGundamControlState: () => ({
    kind: "interactive",
    turnOwner: "self",
    priorityHolder: "self",
  }),
  useGundamGame: () => ({
    adapter: {
      submit: testState.submit,
      describeMove: testState.describeMove,
    },
  }),
  useInteractionView: () => testState.interactionView,
  useViewerId: () => "p1",
}));

vi.mock("./player-seat-projection.ts", () => ({
  usePlayerSeatProjection: testState.projectSeat,
}));

vi.mock("./mappers.ts", () => ({
  resolveOpponentId: () => "p2",
}));

vi.mock("../attack-interactions.ts", () => ({
  legalAttackTargetIds: () => [],
}));

vi.mock("./direct-attack-presentation.ts", () => ({
  projectDirectAttackPresentation: () => ({ actionDetail: "Direct attack." }),
}));

vi.mock("../ui/playerSeat/gundam-drag-drop-context.tsx", () => ({
  useGundamDragCommands: () => ({
    registerAttackDropHandler: testState.registerAttackDropHandler,
    registerPilotDropHandler: testState.registerPilotDropHandler,
  }),
}));

vi.mock("../../game/interaction-draft.tsx", () => ({
  useGundamInteractionDraft: () => testState.draft,
}));

vi.mock("./submit-error-context.tsx", () => ({
  useSubmitError: () => ({ report: testState.report }),
}));

vi.mock("./SelfHandZoneContainer.tsx", () => ({
  SelfHandZoneContainer: () => null,
}));

vi.mock("./OpponentHandZoneContainer.tsx", () => ({
  OpponentHandZoneContainer: () => null,
}));

vi.mock("./cardAction.ts", () => ({
  dispatchCardAction: vi.fn(),
}));

vi.mock("../ui/playerSeat/PlayerSeat.tsx", () => ({
  PlayerSeat: ({
    timeoutOverlay,
    children,
    onHandCardDrop,
  }: {
    readonly timeoutOverlay?: ReactNode;
    readonly children?: ReactNode;
    readonly onHandCardDrop?: (cardId: string) => void;
  }) => {
    testState.onHandCardDrop = onHandCardDrop;
    return (
      <div>
        {timeoutOverlay}
        {children}
      </div>
    );
  },
}));

import { PlayerSeatContainer } from "./PlayerSeatContainer.tsx";

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(BASE_TIME_MS);
  testState.projectSeat.mockClear();
  testState.registerAttackDropHandler.mockClear();
  testState.registerPilotDropHandler.mockClear();
  testState.describeMove.mockReset();
  testState.interactionView.actions = [];
  testState.onHandCardDrop = undefined;
  testState.draft.begin.mockClear();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("PlayerSeatContainer clock isolation", () => {
  it("does not re-run the seat projection while the timeout leaf advances", async () => {
    render(<PlayerSeatContainer side="top" />);
    expect(testState.projectSeat).toHaveBeenCalledOnce();

    await act(async () => {
      vi.advanceTimersByTime(2_000);
    });

    expect(testState.projectSeat).toHaveBeenCalledOnce();
  });

  it("pairs a Command with a Pilot alternative only with its interaction-approved host", () => {
    let onPilotDrop: ((cardId: string, unitId: string) => boolean) | undefined;
    testState.registerPilotDropHandler.mockImplementation((handler) => {
      onPilotDrop = handler;
      return () => {};
    });
    testState.interactionView.actions = [
      {
        id: "playCommandAsPilot",
        enabled: true,
        inputs: [
          {
            id: "cardId",
            kind: "entity-selection",
            role: "source",
            candidates: [{ enabled: true, entity: { instanceId: "command-with-pilot" } }],
          },
        ],
      },
    ];
    testState.describeMove.mockImplementation((moveName, partialInput) => {
      if (moveName !== "playCommandAsPilot" || partialInput.cardId !== "command-with-pilot") {
        return [];
      }
      return [
        {
          kind: "selectTarget",
          role: "unit",
          candidateIds: ["legal-host"],
        },
      ];
    });

    render(<PlayerSeatContainer side="bottom" />);

    expect(onPilotDrop?.("command-with-pilot", "legal-host")).toBe(true);
    expect(testState.draft.begin).toHaveBeenCalledWith("playCommandAsPilot", {
      cardId: ["command-with-pilot"],
      unitId: ["legal-host"],
    });
    expect(onPilotDrop?.("command-with-pilot", "illegal-host")).toBe(false);
    expect(testState.draft.begin).toHaveBeenCalledOnce();
  });

  it("uses Command mode when a dual-mode Command is dropped on the battle area", () => {
    testState.interactionView.actions = [
      {
        id: "playCommand",
        enabled: true,
        inputs: [
          {
            id: "otherSource",
            kind: "entity-selection",
            role: "source",
            candidates: [{ enabled: true, entity: { instanceId: "other-command" } }],
          },
          {
            id: "cardId",
            kind: "entity-selection",
            role: "source",
            candidates: [{ enabled: true, entity: { instanceId: "command-with-pilot" } }],
          },
        ],
      },
    ];

    render(<PlayerSeatContainer side="bottom" />);

    testState.onHandCardDrop?.("command-with-pilot");
    expect(testState.draft.begin).toHaveBeenCalledWith("playCommand", {
      cardId: ["command-with-pilot"],
    });
  });
});
