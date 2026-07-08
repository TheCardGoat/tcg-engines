import { useEffect, type ReactNode } from "react";
import type { GameSnapshot } from "@tcg/game-page-contract";
import {
  useLiveTransitionController,
  useLiveTransitionSnapshot,
} from "@tcg/simulator-runtime/live-transition";

import { createRequiredSimulatorContext } from "./context-utils";
import type { SimulatorGameTransitionAnimation, SimulatorTransitionContextValue } from "./types";

export const EMPTY_SIMULATOR_TRANSITION_CONTEXT: SimulatorTransitionContextValue = {
  authoritativeGame: null,
  displayGame: null,
  activeTransition: null,
  queuedTransitions: [],
  markAnimationComplete: () => {},
  enqueueAuthoritativeGameUpdate: () => {},
};

export const [SimulatorTransitionContextProvider, useSimulatorTransition] =
  createRequiredSimulatorContext<SimulatorTransitionContextValue>(
    EMPTY_SIMULATOR_TRANSITION_CONTEXT,
  );

export function SimulatorGameTransitionProvider({
  game,
  children,
}: {
  game: GameSnapshot | null;
  children: ReactNode;
}) {
  const controller = useLiveTransitionController<GameSnapshot, SimulatorGameTransitionAnimation>();
  const snapshot = useLiveTransitionSnapshot(controller);
  const gameKey = game ? `${game.gameId}:${game.stateVersion}` : null;

  useEffect(() => {
    if (!game) {
      controller.clear();
      return;
    }
    const current = controller.getSnapshot();
    if (
      current.authoritativeState?.gameId === game.gameId &&
      current.authoritativeVersion === game.stateVersion
    ) {
      return;
    }
    controller.hydrateAuthoritativeState({
      state: game,
      version: game.stateVersion,
    });
  }, [controller, game, gameKey]);

  const value: SimulatorTransitionContextValue = {
    authoritativeGame: snapshot.authoritativeState,
    displayGame: snapshot.displayState,
    activeTransition: snapshot.activeTransition,
    queuedTransitions: snapshot.queuedTransitions,
    markAnimationComplete: (transitionId) => controller.markAnimationComplete(transitionId),
    enqueueAuthoritativeGameUpdate: (input) =>
      controller.enqueueAuthoritativeUpdate({
        state: input.game,
        version: input.game.stateVersion,
        ...(input.correlationId ? { correlationId: input.correlationId } : {}),
        ...(input.animationPlan ? { animationPlan: input.animationPlan } : {}),
        ...(input.source ? { source: input.source } : {}),
      }),
  };

  return (
    <SimulatorTransitionContextProvider value={value}>
      {children}
    </SimulatorTransitionContextProvider>
  );
}
