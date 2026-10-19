import * as engine from "@tcg/op-engine/practice-st01";
export interface OnePieceBotInput {
  state: engine.MatchState;
  setup: boolean;
}
export function decideOnePieceBot({ state, setup }: OnePieceBotInput) {
  const legal = engine.getLegalCommands(state, "north");
  const command = setup
    ? engine.passOnlyStrategy(state, "north", legal)
    : (engine.greedyStrategy(state, "north", legal) ??
      (() => {
        const pass = legal.find((candidate) => candidate.type === "endTurn");
        return pass ? engine.commandFromDescriptor(state, "north", pass) : null;
      })());
  return { command };
}
