import type { CombinedLobbyState } from "./shared-types";

export type LobbyEvent<State = unknown, Context = unknown> =
  | { type: "player_joined"; playerId: string; playerData: Context | unknown }
  | { type: "player_left"; playerId: string }
  | { type: "player_accepted"; playerId: string }
  | { type: "player_rejected"; playerId: string }
  | { type: "lobby_status_changed"; oldStatus: string; newStatus: string }
  | { type: "lobby_ready"; playerIds: string[] }
  | { type: "match_creating"; state: State; context: Context }
  | { type: "match_created"; matchId: string }
  | { type: "match_failed"; error: string }
  | { type: "lobby_timeout"; reason: "empty" | "duration" | "accept_deadline" }
  | {
      type: "force_sync";
      combinesState: CombinedLobbyState<State, Context>;
      ids?: string[];
    }
  | {
      type: "tick";
      emptyTicks: number;
      acceptDeadlineTicks: number;
      maxDurationTicks: number;
    };

export type EventHandler<State = unknown, Context = unknown> = (
  event: LobbyEvent<State, Context>,
) => void | Promise<void>;

export interface EventBus<State = unknown, Context = unknown> {
  emit(event: LobbyEvent<State, Context>): void;
  on(handler: EventHandler<State, Context>): () => void; // Returns unsubscribe function
  off(handler: EventHandler<State, Context>): void;
}

export class LightweightEventBus<State = unknown, Context = unknown>
  implements EventBus<State, Context>
{
  private handlers: EventHandler<State, Context>[] = [];

  emit(event: LobbyEvent<State, Context>): void {
    for (const handler of this.handlers) {
      try {
        handler(event);
      } catch (error) {
        console.error("Event handler error:", error);
      }
    }
  }

  on(handler: EventHandler<State, Context>): () => void {
    this.handlers.push(handler);
    return () => this.off(handler);
  }

  off(handler: EventHandler<State, Context>): void {
    const index = this.handlers.indexOf(handler);
    if (index > -1) {
      this.handlers.splice(index, 1);
    }
  }
}
