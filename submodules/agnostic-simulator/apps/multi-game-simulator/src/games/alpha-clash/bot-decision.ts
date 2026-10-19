import { AlphaClashServerEngine } from "@tcg/alpha-clash-server-adapter";
export type AlphaClashBotContext = AlphaClashServerEngine["playerIdToSeat"];
export interface AlphaClashBotInput {
  state: AlphaClashServerEngine["state"];
  strategyId: string;
}
export function createAlphaClashBotPlanner(seats: AlphaClashBotContext) {
  let engine: AlphaClashServerEngine | undefined;
  return (input: AlphaClashBotInput) => {
    engine ??= new AlphaClashServerEngine(structuredClone(input.state), seats);
    engine.state = input.state;
    const actor = engine.getActivePlayerId();
    if (!actor) return { command: null };
    for (const command of engine.automatedActionCandidates(input.strategyId)) {
      const probe = new AlphaClashServerEngine(structuredClone(input.state), seats);
      const { type, ...payload } = command;
      if (
        probe.dispatch(type, actor, payload, {
          gameId: "alpha-clash-local-practice",
          sourceAuthority: "server",
        }).success
      )
        return { command };
    }
    return { command: null };
  };
}
