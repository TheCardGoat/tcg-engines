import { useBoardProjection, useViewerId } from "../../game/index.ts";
import { MatchStatusBar } from "../ui/MatchStatusBar.tsx";
import type { MatchInfo } from "../ui/types.ts";

export function MatchStatusBarContainer({ embedded = false }: { readonly embedded?: boolean }) {
  const view = useBoardProjection();
  const viewerId = useViewerId();
  const turnPlayerId = view.status.turnPlayer ?? view.status.activePlayer;
  const matchInfo: MatchInfo = {
    format: view.status.gameSegment ?? "setup",
    turn: view.status.turn,
    phase: view.status.phase ?? "—",
    mode: "hot-seat",
  };

  return (
    <MatchStatusBar
      matchInfo={matchInfo}
      isSelfTurn={String(turnPlayerId) === String(viewerId)}
      isSelfPriority={String(view.status.activePlayer) === String(viewerId)}
      embedded={embedded}
    />
  );
}
