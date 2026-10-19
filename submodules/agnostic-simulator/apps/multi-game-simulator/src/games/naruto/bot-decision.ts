import {
  chooseAiAction,
  type GameState,
  type PlayerId,
  type Action,
} from "@tcg-engines/naruto-engine";
export type BotStrategy = "greedy" | "passive";
export interface NarutoBotInput {
  state: GameState;
  player: PlayerId;
  strategy: BotStrategy;
}
export function choosePracticeAiAction(
  state: GameState,
  player: PlayerId,
  strategy: BotStrategy,
): Action | null {
  if (strategy === "greedy") return chooseAiAction(state, player);
  if (state.pendingChoice || state.awaitingMulligan === player)
    return chooseAiAction(state, player);
  if (state.step === "counter" && state.priority === player) {
    return { type: "PASS_COUNTER", player };
  }
  if (state.activePlayer === player && state.phase === "main") return { type: "END_TURN", player };
  return null;
}

export function decideNarutoBot(input: NarutoBotInput) {
  return { action: choosePracticeAiAction(input.state, input.player, input.strategy) };
}
