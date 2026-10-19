import type { PlayerId, ProjectedState } from "@tcg/alpha-clash-engine";

/** Public setup pacing from the native projection (rule 103.5). */
export function openingActionFor(
  view: Pick<ProjectedState, "activePlayer" | "mulligan">,
  seat: PlayerId,
): "declare" | "select" | "start" | "wait" {
  if (view.mulligan.resolved) return seat === view.activePlayer ? "start" : "wait";
  const other = view.activePlayer === "player-one" ? "player-two" : "player-one";
  const order: readonly PlayerId[] = [view.activePlayer, other];
  const nextDeclaration = order.find((player) => view.mulligan.declarations[player] === undefined);
  if (nextDeclaration) return nextDeclaration === seat ? "declare" : "wait";
  return view.mulligan.pendingSelections.includes(seat) ? "select" : "wait";
}
