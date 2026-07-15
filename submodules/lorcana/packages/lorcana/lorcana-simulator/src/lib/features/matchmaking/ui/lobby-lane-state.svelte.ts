import { getContext, setContext } from "svelte";
import type { LobbyLane } from "./matchmaking-lobby.constants.js";

export class LobbyLaneState {
  current = $state<LobbyLane>("queue");
  select(lane: LobbyLane): void {
    this.current = lane;
  }
}

const LOBBY_LANE_CONTEXT_KEY = Symbol.for("lorcana.lobby-lane");

export function setLobbyLaneContext(state: LobbyLaneState): LobbyLaneState {
  return setContext(LOBBY_LANE_CONTEXT_KEY, state);
}

export function getLobbyLaneContext(): LobbyLaneState {
  return getContext<LobbyLaneState>(LOBBY_LANE_CONTEXT_KEY);
}
