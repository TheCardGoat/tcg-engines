import { useGundamControlState, useGundamGame, useStatus } from "../../game/index.ts";
import { BattleStepRibbon } from "../ui/BattleStepRibbon.tsx";

export interface BattleStepRibbonContainerProps {
  /**
   * Reserve the existing status-row height instead of floating on the
   * zero-height battlefield centerline. Used by bot-vs-bot spectator mode.
   */
  readonly reserveSpace?: boolean;
}

export function BattleStepRibbonContainer({
  reserveSpace = false,
}: BattleStepRibbonContainerProps) {
  const status = useStatus();
  const controlState = useGundamControlState();
  const { adapter } = useGundamGame();
  const inBattle = status.phase === "battle-phase";

  if (!inBattle) {
    if (reserveSpace) return null;
    return (
      <div className="relative z-20 h-0 flex-none" aria-hidden>
        <div className="centerline -top-px hidden md:block" />
      </div>
    );
  }

  if (reserveSpace) {
    return (
      <div className="mx-2 flex h-9 min-w-0 flex-none items-center justify-center sm:mx-3">
        <BattleStepRibbon
          currentStep={status.step}
          controlState={controlState}
          spectator={adapter.viewerContext.role === "spectator"}
          className="max-w-[44.75rem]"
        />
      </div>
    );
  }

  return (
    <div className="relative z-40 h-0 flex-none">
      <div className="centerline -top-px hidden md:block" aria-hidden />
      <div className="absolute left-1/2 top-0 w-[calc(100%-1.5rem)] max-w-[21rem] -translate-x-1/2 -translate-y-1/2 sm:w-[calc(100%-1rem)] sm:max-w-[44.75rem]">
        <BattleStepRibbon
          currentStep={status.step}
          controlState={controlState}
          spectator={adapter.viewerContext.role === "spectator"}
        />
      </div>
    </div>
  );
}
