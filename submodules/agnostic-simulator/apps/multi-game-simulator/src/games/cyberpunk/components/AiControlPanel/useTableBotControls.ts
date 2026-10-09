import { getStrategyById, useEngine, type Side } from "../../engine";

const SIDES: readonly Side[] = ["player", "opponent"];
/** Shared by the Match menu and the buttons on the table. */
export function useTableBotControls() {
  const engine = useEngine();
  const botOn =
    SIDES.some((side) => engine.aiStrategies[side] !== null) || engine.aiTakeover !== null;
  const bothBots = SIDES.every((side) => engine.aiStrategies[side] !== null);
  const nextSide = SIDES.find((side) => {
    if (!bothBots && side === engine.humanSide) return false;
    const view = engine.interactionViews[side];
    return (
      engine.aiStrategies[side] !== null &&
      (view.status === "choosing" ||
        (view.status === "ready" && view.actions.some((action) => action.enabled)))
    );
  });
  const controlledSide =
    engine.aiTakeover?.side ??
    nextSide ??
    (engine.aiStrategies.opponent
      ? "opponent"
      : engine.aiStrategies.player
        ? "player"
        : "opponent");
  const automationDisabled =
    engine.matchState.G.gameEnded ||
    engine.boardCorrectionEnabled ||
    engine.aiTakeover !== null ||
    engine.isRemote;
  return {
    engine,
    botOn,
    mode: botOn ? engine.aiMode : "off",
    automationDisabled,
    canStep: !automationDisabled && engine.aiMode === "step" && nextSide !== undefined,
    toggleTakeover: () => {
      if (engine.aiTakeover) engine.releaseAiTakeover();
      else if (engine.aiStrategies[controlledSide]) engine.takeOverAiSide(controlledSide);
      else engine.toggleHumanSide();
    },
    setMode: (value: string) => {
      if (engine.isRemote) return;
      if (value === "off") {
        engine.setStrategy("player", null);
        engine.setStrategy("opponent", null);
        engine.setAiMode("step");
        return;
      }
      engine.setAiMode(value === "auto" ? "auto" : "step");
      if (engine.aiTakeover) {
        engine.releaseAiTakeover();
        return;
      }
      if (!SIDES.some((side) => engine.aiStrategies[side])) {
        const strategy = getStrategyById("default")?.strategy;
        if (!strategy) return;
        engine.setHumanSide("player");
        engine.setStrategy("opponent", strategy);
      }
    },
  };
}
