// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { buildCyberpunkInteractionView } from "@tcg/cyberpunk-server-adapter/interaction-protocol";
import { createSimulatorExternalCommandGate } from "@tcg/simulator-runtime/animation";
import { parseGatewayEvent } from "@tcg/simulator-runtime/gateway";
import type { PlayerPrompt } from "@tcg/cyberpunk-engine";
import { EngineProvider, type EngineAction } from "../engine/EngineProvider";
import { UserConfigProvider } from "../engine/UserConfigContext";
import { getScenario, P1 } from "../engine/fixtures/scenarios";
import { ChoiceModal } from "../components/Prompt/ChoiceModal";
import { PaymentSelectionProvider } from "../components/PaymentSelection/PaymentSelectionContext";
import { resetChoiceModalStateForTests } from "../components/Prompt/choiceModalState";
import { createLiveMatchViewerEngine } from "../engine/live/liveState";
import { reduceLiveGatewayMessage } from "../engine/live/liveMessages";
import type { LiveMatchContext } from "../engine/live/matchContext";
import {
  shouldClearPendingAfterAuthoritativeState,
  type PendingOptimisticMove,
} from "./livePendingMove";

if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = (() =>
    ({
      matches: false,
      media: "",
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList) as typeof window.matchMedia;
}

afterEach(() => {
  cleanup();
  resetChoiceModalStateForTests();
});

test.each(["state_update", "state_sync"] as const)(
  "%s replaces a submitted trigger chooser with an actionable empty target choice",
  (event) => {
    const source = getScenario("openingMain").build();
    const card = source.getCardsInZone("field", P1)[0]!;
    const prompt: PlayerPrompt = {
      status: "choice",
      availableMoves: [],
      choice: {
        type: "chooseTrigger",
        chooserId: P1,
        payload: {
          options: [1, 2].map((n) => ({
            triggerId: `trigger-${n}`,
            sourceCardId: card.instanceId,
            sourcePlayerId: P1,
            abilityIndex: 0,
            abilityText: `Pending effect ${n}`,
            cardName: `Effect ${n}`,
          })),
        },
      },
    };
    const context: LiveMatchContext = {
      match: {
        matchId: "match-1",
        status: "in_progress",
        format: "best_of_1",
        gameIds: ["game-1"],
      },
      game: {
        gameId: "game-1",
        gameNumber: 1,
        status: "in_progress",
        authority: "server",
        version: 69,
        state: source.getState(),
        viewerProjection: { ...source.getFilteredView(P1), prompt },
        interactionView: buildCyberpunkInteractionView({ actorId: P1, stateVersion: 69, prompt }),
      },
    };
    const gate = createSimulatorExternalCommandGate();
    const dispatch = vi.fn<(_action: EngineAction) => boolean>(() => true);
    const board = (value: LiveMatchContext, pending: boolean) => (
      <MantineProvider env="test">
        <EngineProvider
          initialEngineBuilder={() => createLiveMatchViewerEngine(value.game.state!)}
          initialAi={{ player: null, opponent: null }}
          animationCommandGate={gate}
          remoteDispatch={dispatch}
          remoteInteractionView={value.game.interactionView}
          remotePrompt={value.game.viewerProjection?.prompt}
          hasPendingRemoteMove={pending}
        >
          <UserConfigProvider>
            <PaymentSelectionProvider>
              <ChoiceModal side="player" />
            </PaymentSelectionProvider>
          </UserConfigProvider>
        </EngineProvider>
      </MantineProvider>
    );
    const view = render(board(context, false));
    fireEvent.click(screen.getAllByTestId("pending-effect-option")[0]!);
    expect(dispatch).toHaveBeenCalledTimes(1);
    view.rerender(board(context, true));
    expect(screen.queryByTestId("pending-effect-option")).toBeNull();
    const targetPrompt: PlayerPrompt = {
      status: "choice",
      availableMoves: [],
      choice: {
        type: "chooseTarget",
        chooserId: P1,
        payload: {
          type: "effectTarget",
          targetKind: "card",
          min: 0,
          max: 1,
          eligibleIds: [],
          canDecline: true,
        },
      },
    };
    const message = parseGatewayEvent(event, {
      gameId: "game-1",
      stateVersion: 70,
      engineLogs: [],
      animationPlan: null,
      ...(event === "state_update" ? { patches: [] } : {}),
      state: { ...source.getFilteredView(P1), stateID: 70, prompt: targetPrompt },
      interactionView: buildCyberpunkInteractionView({
        actorId: P1,
        stateVersion: 70,
        prompt: targetPrompt,
      }),
    });
    if (!message || (message.type !== "state_sync" && message.type !== "state_update"))
      throw Error("Snapshot rejected");
    const pending: PendingOptimisticMove = {
      gameId: "game-1",
      correlationId: "move-1",
      startingVersion: 69,
      localOptimisticStateId: 69,
      optimisticApplied: false,
      awaitingRecoverySync: false,
      actionId: "resolveTrigger",
      startingInteractionSignature: JSON.stringify(targetPrompt),
      side: "player",
    };
    const next = reduceLiveGatewayMessage(context, message, {
      gameId: "game-1",
    });
    if (next.type !== "state") throw Error("Snapshot not applied");
    expect(shouldClearPendingAfterAuthoritativeState(pending, message)).toBe(true);
    view.rerender(board(next.context, false));
    expect(screen.queryByTestId("pending-effect-option")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: /take none/i }));
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch.mock.calls[1]?.[0]).toMatchObject({ type: "resolveEffectTarget" });
    const stale = reduceLiveGatewayMessage(
      next.context,
      { ...message, stateVersion: 69 },
      { gameId: "game-1" },
    );
    expect(stale.type).toBe("ignore");
  },
);
