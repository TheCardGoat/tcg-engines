import type { MatchNavigationContext } from "@/features/simulator/model/contracts.js";

export type PostGameMatchAction = "next-game" | "return" | "finalizing";

export function resolveMatchCompletionFailed(
  current: boolean | undefined,
  progression: { matchCompleted: boolean; nextGameId?: string },
): boolean {
  if (progression.matchCompleted || progression.nextGameId !== undefined) {
    return false;
  }

  return current ?? false;
}

export function resolvePostGameMatchAction(
  matchContext: MatchNavigationContext | null | undefined,
  hasNextGameHandler: boolean,
): PostGameMatchAction {
  if (matchContext?.nextGameId && hasNextGameHandler) {
    return "next-game";
  }

  if (
    !matchContext ||
    matchContext.matchCompleted ||
    matchContext.format === "best_of_1" ||
    matchContext.completionFailed
  ) {
    return "return";
  }

  return "finalizing";
}
