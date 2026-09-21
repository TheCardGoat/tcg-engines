import { fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test, vi } from "vite-plus/test";

vi.mock("../animation", async () => {
  const actual = await vi.importActual<typeof import("../animation")>("../animation");
  return { ...actual, SoundPlayer: () => null };
});

import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";
import type { QueuedTrigger } from "@tcg/cyberpunk-engine";
import { CYBERPUNK_P1, CYBERPUNK_P2 } from "./cyberpunk-simulator-pom";

describe("Cyberpunk board correction UI", () => {
  test("requests last-action and turn-start undo scopes from the board menu in live play", async () => {
    const requestRemoteUndo = vi.fn(() => true);
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "openingMain",
      boardProps: {
        remoteDispatch: () => true,
        requestRemoteUndo,
        remoteMoveLogs: [
          { type: "turnStarted", playerId: CYBERPUNK_P1, turnNumber: 1, timestamp: 1 },
        ],
      },
    });
    try {
      const board = view.container.querySelector('[data-testid="game-board"]');
      expect(board).not.toBeNull();
      fireEvent.contextMenu(board!);

      const undoLast = document.body.querySelector(
        '[data-testid="board-action-undo"]',
      ) as HTMLButtonElement | null;
      const undoTurn = document.body.querySelector(
        '[data-testid="board-action-undo-turn-start"]',
      ) as HTMLButtonElement | null;
      expect(undoLast).not.toBeNull();
      expect(undoTurn).not.toBeNull();
      await waitFor(() => {
        expect(undoLast!.disabled).toBe(false);
        expect(undoTurn!.disabled).toBe(false);
      });

      fireEvent.click(undoLast!);
      expect(requestRemoteUndo).toHaveBeenLastCalledWith("last_move");

      fireEvent.contextMenu(board!);
      fireEvent.click(document.body.querySelector('[data-testid="board-action-undo-turn-start"]')!);
      expect(requestRemoteUndo).toHaveBeenLastCalledWith("turn_start");
    } finally {
      view.unmount();
    }
  });

  test("enables correction from the board menu and shows move-to actions", () => {
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "openingMain" });
    try {
      const board = view.container.querySelector('[data-testid="game-board"]');
      expect(board).not.toBeNull();
      fireEvent.contextMenu(board!);
      const request = document.body.querySelector(
        '[data-testid="board-action-request-board-correction"]',
      );
      expect(request).not.toBeNull();
      expect(request!.textContent).toContain("Enable Board State Correction");
      expect(request!.textContent).not.toContain("Request");
      fireEvent.click(request!);

      const strip = view.container.querySelector('[data-testid="board-correction-strip"]');
      expect(strip).not.toBeNull();
      expect(strip!.getAttribute("data-pending")).toBe("false");
      expect(strip!.textContent).toContain("You can edit the board");
      expect(strip!.textContent).not.toContain("Waiting");
      expect(board!.getAttribute("data-board-correction")).toBe("on");

      const handCard = view.container.querySelector(
        '[data-testid="hand-zone"][data-side="player"] [data-sim-entity-id]',
      );
      expect(handCard).not.toBeNull();
      fireEvent.click(handCard!);
      const cardMenu = document.body.querySelector('[data-testid="card-context-menu"]');
      expect(cardMenu).not.toBeNull();
      const moveAction = document.body.querySelector(
        '[data-testid="card-context-menu"] [data-action-role="submenu"][data-action-id^="manualMoveCard:"]',
      );
      expect(moveAction).not.toBeNull();
      expect(moveAction!.textContent).toContain("Move");
      expect(
        document.body.querySelector(
          '[data-testid="card-context-menu"] [data-action-id^="manualMoveCard:field"]',
        ),
      ).toBeNull();
      fireEvent.click(moveAction!);
      expect(
        document.body.querySelector(
          '[data-testid="card-context-menu"] [data-action-id^="manualMoveCard:field"]',
        ),
      ).not.toBeNull();

      fireEvent.click(view.container.querySelector('[data-testid="board-correction-exit"]')!);

      expect(view.container.querySelector('[data-testid="board-correction-strip"]')).toBeNull();
      expect(board!.getAttribute("data-board-correction")).toBe("off");
      expect(view.container.querySelector('[data-testid="gig-correction-menu"]')).toBeNull();

      fireEvent.click(handCard!);
      expect(document.body.querySelector('[data-action-id^="manualMoveCard:"]')).toBeNull();
      expect(document.body.textContent).not.toContain("Move to Field");
      fireEvent.contextMenu(board!);
      expect(
        document.body.querySelector('[data-testid="board-action-request-board-correction"]')
          ?.textContent,
      ).toContain("Enable Board State Correction");
    } finally {
      view.unmount();
    }
  });

  test("opens the card popup from the trash viewer so a card can move back to hand", async () => {
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "openingMain" });
    try {
      const board = view.container.querySelector('[data-testid="game-board"]');
      fireEvent.contextMenu(board!);
      fireEvent.click(
        document.body.querySelector('[data-testid="board-action-request-board-correction"]')!,
      );

      const handCard = view.container.querySelector(
        '[data-testid="hand-zone"][data-side="player"] [data-sim-entity-id]',
      );
      fireEvent.click(handCard!);
      fireEvent.click(
        document.body.querySelector(
          '[data-testid="card-context-menu"] [data-action-role="submenu"][data-action-id^="manualMoveCard:"]',
        )!,
      );
      fireEvent.click(
        document.body.querySelector(
          '[data-testid="card-context-menu"] [data-action-id^="manualMoveCard:trash"]',
        )!,
      );

      const trash = view.container.querySelector('[data-testid="trash-zone"][data-side="player"]');
      expect(trash).not.toBeNull();
      fireEvent.click(trash!);
      const trashCard =
        document.body.querySelector(
          '[data-testid="target-filter-modal"] [data-sim-entity-id] button',
        ) ??
        document.body.querySelector('[data-testid="target-filter-modal"] [data-sim-entity-id]');
      expect(trashCard).not.toBeNull();
      fireEvent.click(trashCard!);
      await Promise.resolve();
      await new Promise((resolve) => window.setTimeout(resolve, 0));
      expect(document.body.querySelector('[data-testid="card-context-menu"]')).not.toBeNull();
      fireEvent.click(
        document.body.querySelector(
          '[data-testid="card-context-menu"] [data-action-role="submenu"][data-action-id^="manualMoveCard:"]',
        )!,
      );
      expect(
        document.body.querySelector(
          '[data-testid="card-context-menu"] [data-action-id^="manualMoveCard:hand"]',
        ),
      ).not.toBeNull();
    } finally {
      view.unmount();
    }
  });

  test("opens the card popup on a Dum Dum QA click instead of calling the Legend", () => {
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "legendDumDumMaelstromTriggermanRetail",
    });
    try {
      const board = view.container.querySelector('[data-testid="game-board"]');
      fireEvent.contextMenu(board!);
      fireEvent.click(
        document.body.querySelector('[data-testid="board-action-request-board-correction"]')!,
      );

      const dumDum = view.container.querySelector(
        '[data-zone-id="p-legendArea"] [data-face-down="true"][data-sim-entity-id]',
      );
      expect(dumDum).not.toBeNull();
      fireEvent.click(dumDum!);
      expect(document.body.querySelector('[data-testid="card-context-menu"]')).not.toBeNull();
      expect(dumDum!.getAttribute("data-face-down")).toBe("true");
      const legendMove = document.body.querySelector(
        '[data-testid="card-context-menu"] [data-action-role="submenu"][data-action-id^="manualMoveCard:"]',
      );
      expect(legendMove).not.toBeNull();
      fireEvent.click(legendMove!);
      expect(
        document.body.querySelector(
          '[data-testid="card-context-menu"] [data-action-id^="manualMoveCard:trash"]',
        ),
      ).not.toBeNull();

      const gear = view.container.querySelector('[data-testid="attached-gear"]');
      expect(gear).not.toBeNull();
      fireEvent.click(gear!);
      expect(document.body.querySelector('[data-testid="card-context-menu"]')?.textContent).toMatch(
        /Unattach|Move/,
      );

      const deck = view.container.querySelector('[data-testid="deck-stack"]');
      expect(deck).not.toBeNull();
      fireEvent.click(deck!);
      expect(document.body.querySelector('[data-testid="card-context-menu"]')?.textContent).toMatch(
        /Draw top/,
      );

      const gig = view.container.querySelector('[data-testid="gig-die"]');
      expect(gig).not.toBeNull();
      fireEvent.click(gig!);
      expect(document.body.querySelector('[data-testid="card-context-menu"]')).not.toBeNull();
      expect(document.body.querySelector('[data-testid="card-context-menu"]')?.textContent).toMatch(
        /Decrease face|Increase face|Move/,
      );
    } finally {
      view.unmount();
    }
  });

  test("skips and clears a wedged trigger resolution from the correction strip", async () => {
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "openingMain" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      const board = view.container.querySelector('[data-testid="game-board"]');
      expect(board).not.toBeNull();
      fireEvent.contextMenu(board!);
      fireEvent.click(
        document.body.querySelector('[data-testid="board-action-request-board-correction"]')!,
      );

      const strip = view.container.querySelector('[data-testid="board-correction-strip"]')!;
      expect(strip.getAttribute("data-pending")).toBe("false");
      // A bare pendingChoice (gain-gig) is not a trigger resolution: no skip controls.
      expect(strip.querySelector('[data-testid="board-correction-skip-trigger"]')).toBeNull();
      expect(strip.querySelector('[data-testid="board-correction-clear-stack"]')).toBeNull();

      // Deterministic fixture: wedge the match inside an ability resolution the
      // way a stuck match looks (in-progress trigger + its target choice).
      await pom.harness.dispatchEngine((engine) => {
        const unit = engine.getCardsInZone("field", CYBERPUNK_P1)[0];
        if (!unit) throw new Error("Fixture field is empty");
        engine.judgeSetTurnMetadata({
          currentTrigger: fixtureTrigger("stuck-1", unit.instanceId, 0),
        });
        engine.judgeSetPendingChoice({
          type: "chooseTarget",
          chooserId: CYBERPUNK_P1,
          effectId: "stuck",
          payload: { type: "effectTarget", min: 1, max: 1, canDecline: false },
        });
      });

      expect(strip.querySelector('[data-testid="board-correction-skip-trigger"]')).not.toBeNull();
      expect(strip.querySelector('[data-testid="board-correction-clear-stack"]')).not.toBeNull();

      fireEvent.click(strip.querySelector('[data-testid="board-correction-skip-trigger"]')!);
      await pom.waitForReady();
      expect(
        await pom.harness.evalEngine((engine) => {
          const metadata = engine.getState().G.turnMetadata;
          return {
            currentTrigger: metadata.currentTrigger,
            pendingChoice: metadata.pendingChoice,
          };
        }),
      ).toEqual({ currentTrigger: undefined, pendingChoice: undefined });

      // Re-wedge with a backed-up queue, then clear the whole stack.
      await pom.harness.dispatchEngine((engine) => {
        const unit = engine.getCardsInZone("field", CYBERPUNK_P1)[0];
        if (!unit) throw new Error("Fixture field is empty");
        engine.judgeSetTurnMetadata({
          currentTrigger: fixtureTrigger("stuck-2", unit.instanceId, 0),
          triggerQueue: [
            fixtureTrigger("queued-1", unit.instanceId, 1),
            fixtureTrigger("queued-2", unit.instanceId, 2),
          ],
        });
        engine.judgeSetPendingChoice({
          type: "chooseTarget",
          chooserId: CYBERPUNK_P1,
          effectId: "stuck",
          payload: { type: "effectTarget", min: 1, max: 1, canDecline: false },
        });
      });

      fireEvent.click(strip.querySelector('[data-testid="board-correction-clear-stack"]')!);
      await pom.waitForReady();
      const afterClear = await pom.harness.evalEngine((engine) => {
        const metadata = engine.getState().G.turnMetadata;
        return {
          currentTrigger: metadata.currentTrigger,
          pendingChoice: metadata.pendingChoice,
          queueLength: metadata.triggerQueue.length,
        };
      });
      expect(afterClear).toEqual({
        currentTrigger: undefined,
        pendingChoice: undefined,
        queueLength: 0,
      });
      expect(strip.querySelector('[data-testid="board-correction-skip-trigger"]')).toBeNull();
      expect(strip.querySelector('[data-testid="board-correction-clear-stack"]')).toBeNull();
    } finally {
      view.unmount();
    }
  });

  test("resets combat and force-passes the turn from the correction strip", async () => {
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "openingMain" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      const board = view.container.querySelector('[data-testid="game-board"]');
      fireEvent.contextMenu(board!);
      fireEvent.click(
        document.body.querySelector('[data-testid="board-action-request-board-correction"]')!,
      );
      const strip = view.container.querySelector('[data-testid="board-correction-strip"]')!;

      // Deterministic fixture: wedge an in-progress attack plus a stuck trigger.
      await pom.harness.dispatchEngine((engine) => {
        const unit = engine.getCardsInZone("field", CYBERPUNK_P1)[0];
        if (!unit) throw new Error("Fixture field is empty");
        engine.judgeSetAttackState({
          attackerId: unit.instanceId,
          defenderId: null,
          rivalId: CYBERPUNK_P2,
          kind: "direct",
          step: "attack",
        });
        engine.judgeSetTurnMetadata({
          currentTrigger: fixtureTrigger("rc-stuck", unit.instanceId, 0),
          triggerQueue: [fixtureTrigger("rc-q1", unit.instanceId, 1)],
        });
        engine.judgeSetPendingChoice({
          type: "chooseTarget",
          chooserId: CYBERPUNK_P1,
          effectId: "stuck",
          payload: { type: "effectTarget", min: 1, max: 1, canDecline: false },
        });
      });

      expect(strip.querySelector('[data-testid="board-correction-reset-combat"]')).not.toBeNull();
      expect(strip.querySelector('[data-testid="board-correction-force-pass"]')).not.toBeNull();

      fireEvent.click(strip.querySelector('[data-testid="board-correction-reset-combat"]')!);
      await pom.waitForReady();
      const afterReset = await pom.harness.evalEngine((engine) => {
        const state = engine.getState();
        return {
          attackState: state.G.attackState,
          currentTrigger: state.G.turnMetadata.currentTrigger,
          pendingChoice: state.G.turnMetadata.pendingChoice,
          queueLength: state.G.turnMetadata.triggerQueue.length,
        };
      });
      expect(afterReset).toEqual({
        attackState: null,
        currentTrigger: undefined,
        pendingChoice: undefined,
        queueLength: 0,
      });
      expect(
        document.body.querySelector('[data-testid="board-correction-reset-combat"]'),
      ).toBeNull();
      expect(
        document.body.querySelector('[data-testid="board-correction-clear-stack"]'),
      ).toBeNull();

      // Force pass from the recovered main phase hands the turn to the rival.
      const before = await pom.harness.evalEngine((engine) => ({
        turnNumber: engine.getState().G.turnMetadata.turnNumber,
      }));
      fireEvent.click(strip.querySelector('[data-testid="board-correction-force-pass"]')!);
      await pom.waitForReady();
      const afterPass = await pom.harness.evalEngine((engine) => {
        const state = engine.getState();
        return {
          turnNumber: state.G.turnMetadata.turnNumber,
          activePlayerId: state.G.turnMetadata.activePlayerId,
          currentTrigger: state.G.turnMetadata.currentTrigger,
          pendingChoice: state.G.turnMetadata.pendingChoice,
          queueLength: state.G.turnMetadata.triggerQueue.length,
          attackState: state.G.attackState,
        };
      });
      expect(afterPass.turnNumber).toBe(before.turnNumber + 1);
      expect(afterPass.activePlayerId).not.toBe(CYBERPUNK_P1);
      expect(afterPass.currentTrigger).toBeUndefined();
      // The flip lands on the rival's start-of-turn gain-gig prompt.
      expect(afterPass.pendingChoice).toMatchObject({
        type: "gainGig",
        chooserId: afterPass.activePlayerId,
      });
      expect(afterPass.queueLength).toBe(0);
      expect(afterPass.attackState).toBeNull();
    } finally {
      view.unmount();
    }
  });

  test("sends recovery corrections while a live move confirmation is stuck", async () => {
    const remoteExecuteMove = vi.fn(
      (_input: { moveType: string; payload: Record<string, unknown>; expectedVersion: number }) =>
        true,
    );
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "openingMain",
      boardProps: {
        remoteDispatch: () => true,
        remoteExecuteMove,
        remoteBoardCorrectionEnabled: true,
        hasPendingRemoteMove: true,
      },
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      await pom.harness.dispatchEngine((engine) => {
        const unit = engine.getCardsInZone("field", CYBERPUNK_P1)[0];
        if (!unit) throw new Error("Fixture field is empty");
        engine.judgeSetAttackState({
          attackerId: unit.instanceId,
          defenderId: null,
          rivalId: CYBERPUNK_P2,
          kind: "direct",
          step: "attack",
        });
        engine.judgeSetTurnMetadata({
          currentTrigger: fixtureTrigger("live-stuck", unit.instanceId, 0),
          triggerQueue: [fixtureTrigger("live-queued", unit.instanceId, 1)],
        });
      });

      const strip = view.container.querySelector('[data-testid="board-correction-strip"]')!;
      fireEvent.click(strip.querySelector('[data-testid="board-correction-reset-combat"]')!);
      fireEvent.click(strip.querySelector('[data-testid="board-correction-clear-stack"]')!);
      fireEvent.click(strip.querySelector('[data-testid="board-correction-tools-toggle"]')!);
      fireEvent.click(strip.querySelector('[data-testid="board-correction-recompute"]')!);

      expect(remoteExecuteMove.mock.calls.map(([command]) => command)).toEqual([
        expect.objectContaining({ moveType: "manualResetCombat", payload: {} }),
        expect.objectContaining({
          moveType: "manualClearPendingResolution",
          payload: { scope: "all" },
        }),
        expect.objectContaining({ moveType: "manualRecomputeActiveEffects", payload: {} }),
      ]);
      expect(document.body.textContent).not.toContain(
        "Waiting for the previous move to be confirmed",
      );
    } finally {
      view.unmount();
    }
  });

  test("fix tools adjust Eddies and rewind the turn via the in-memory checkpoint", async () => {
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "openingMain" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      const board = view.container.querySelector('[data-testid="game-board"]');
      fireEvent.contextMenu(board!);
      fireEvent.click(
        document.body.querySelector('[data-testid="board-action-request-board-correction"]')!,
      );
      const strip = view.container.querySelector('[data-testid="board-correction-strip"]')!;

      const tools = strip.querySelector(
        '[data-testid="board-correction-tools"]',
      ) as HTMLDetailsElement | null;
      expect(tools).not.toBeNull();
      fireEvent.click(tools!.querySelector("summary")!);
      if (!tools!.open) tools!.open = true;

      // Eddies −1 / +1 round-trip, clamped by the engine's Eddie-card backing.
      const eddiesBefore = await pom.harness.evalEngine((engine) => engine.getEddies(CYBERPUNK_P1));
      expect(eddiesBefore).toBeGreaterThan(0);
      fireEvent.click(strip.querySelector('[data-testid="board-correction-eddies-dec"]')!);
      await pom.waitForReady();
      expect(await pom.harness.evalEngine((engine) => engine.getEddies(CYBERPUNK_P1))).toBe(
        eddiesBefore - 1,
      );
      fireEvent.click(strip.querySelector('[data-testid="board-correction-eddies-inc"]')!);
      await pom.waitForReady();
      expect(await pom.harness.evalEngine((engine) => engine.getEddies(CYBERPUNK_P1))).toBe(
        eddiesBefore,
      );

      // Reset once-per-turn limits executes cleanly with nothing to clear.
      fireEvent.click(strip.querySelector('[data-testid="board-correction-reset-once-per-turn"]')!);
      await pom.waitForReady();

      // Rewind: make a real change (a correction draw), then rewind it away.
      const before = await pom.harness.evalEngine((engine) => ({
        hand: engine.getCardsInZone("hand", CYBERPUNK_P1).length,
        stateID: engine.getState().ctx.stateID,
      }));
      await pom.harness.dispatchEngine((engine) => {
        engine.executeMove("manualDrawCard", { args: { from: "top" } }, CYBERPUNK_P1);
      });
      const mid = await pom.harness.evalEngine((engine) => ({
        hand: engine.getCardsInZone("hand", CYBERPUNK_P1).length,
        stateID: engine.getState().ctx.stateID,
      }));
      expect(mid.hand).toBe(before.hand + 1);

      fireEvent.click(strip.querySelector('[data-testid="board-correction-rewind"]')!);
      await pom.waitForReady();
      const after = await pom.harness.evalEngine((engine) => ({
        hand: engine.getCardsInZone("hand", CYBERPUNK_P1).length,
        stateID: engine.getState().ctx.stateID,
      }));
      expect(after.hand).toBe(before.hand);
      // The rewind publishes a fresh authoritative version.
      expect(after.stateID).toBe(mid.stateID + 1);
    } finally {
      view.unmount();
    }
  });
});

function fixtureTrigger(
  id: string,
  sourceCardId: QueuedTrigger["sourceCardId"],
  order: number,
): QueuedTrigger & { nextEffectIndex: number } {
  return {
    id,
    sourceCardId,
    sourcePlayerId: CYBERPUNK_P1,
    abilityIndex: 0,
    abilityText: "Stuck fixture trigger",
    event: { type: "effectTriggered", sourceCardId, effectType: "event", playerId: CYBERPUNK_P1 },
    contextTargets: {},
    boundTargets: {},
    order,
    nextEffectIndex: 0,
  };
}
