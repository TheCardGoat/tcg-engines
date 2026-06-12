import type { LifecycleContext } from "../../../types/index.ts";
import type { MatchState } from "../../../types/match-state.ts";
import type { PlayerId } from "../../../types/branded.ts";
import { logPhaseEntered } from "../../logging.ts";

export function actionStepOnEnter(ctx: LifecycleContext): void {
  logPhaseEntered(ctx.framework, { phase: "end-phase", step: "action-step" });

  const nextTurnPlayer = ctx.framework.state.status.nextTurnPlayer;
  const playerIds = [...ctx.framework.state.playerIds] as string[];

  const standbyPlayer = nextTurnPlayer
    ? (nextTurnPlayer as unknown as string)
    : (playerIds.find(
        (id) => id !== (ctx.framework.state.status.turnPlayer as unknown as string),
      ) ?? (playerIds[0] as unknown as string));

  const pendingDecision = [
    standbyPlayer as PlayerId,
    ...(playerIds.filter((id) => id !== standbyPlayer) as PlayerId[]),
  ];

  ctx.framework.status.patch({
    activePlayer: standbyPlayer as PlayerId,
    pendingDecision,
  });
}

export function actionStepEndIf(state: MatchState): boolean {
  return (state.ctx.status.pendingDecision?.length ?? 0) === 0;
}
