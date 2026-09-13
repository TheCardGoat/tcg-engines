import { displayTurn, useBoardProjection, useGundamControlState } from "../../game/index.ts";
import { MatchStatusBar } from "../ui/MatchStatusBar.tsx";
import type { MatchInfo } from "../ui/types.ts";
import { BattleStepRibbonContainer } from "./BattleStepRibbonContainer.tsx";

export function MatchStatusBarContainer({
  embedded = false,
  compact = false,
}: {
  readonly embedded?: boolean;
  readonly compact?: boolean;
}) {
  const view = useBoardProjection();
  const controlState = useGundamControlState();
  const matchInfo: MatchInfo = {
    format: view.status.gameSegment ?? "setup",
    turn: displayTurn(view.status.turn),
    phase: view.status.phase ?? "—",
    mode: "hot-seat",
  };

  if (view.status.phase === "battle-phase") {
    return <BattleStepRibbonContainer reserveSpace />;
  }

  return (
    <MatchStatusBar
      matchInfo={matchInfo}
      controlState={controlState}
      embedded={embedded}
      compact={compact}
    />
  );
}
