import type { EngineLogger } from "../shared/logger";
import { logger } from "../shared/logger";
import type { EventHandler } from "./event-bus";
import type { CombinedLobbyState } from "./lobby-engine-types";
import type { ClientMessages, ServerMessages } from "./lobby-messages-type";

export type TransportMessage<T = unknown, C = unknown> =
  | ClientMessages<T, C>
  | ServerMessages<T, C>;

export interface SideEffectsAdapter<
  T = unknown,
  C = unknown,
  BroadcastMessage extends TransportMessage<T, C> = TransportMessage<T, C>,
  ReceiveMessage extends TransportMessage<T, C> = TransportMessage<T, C>,
> {
  logger: EngineLogger;

  broadcast(
    message: BroadcastMessage,
    targets?: string[],
  ): void | Promise<void>;

  onMessageReceived(
    message: ReceiveMessage,
    clientId?: string,
  ): void | Promise<void>;

  createMatch(lobby: CombinedLobbyState<T, C>): boolean;

  onLobbyEvent?: EventHandler<T, C>;

  setEngine(engine: unknown): void;

  dispose(): void;

  toJSON(): unknown;
}

// Base class for side effects adapters to implement common functionality
export abstract class BaseSideEffectsAdapter<
  T = unknown,
  C = unknown,
  BroadcastMessage extends TransportMessage<T, C> = TransportMessage<T, C>,
  ReceiveMessage extends TransportMessage<T, C> = TransportMessage<T, C>,
> implements SideEffectsAdapter<T, C, BroadcastMessage, ReceiveMessage>
{
  abstract broadcast(
    message: BroadcastMessage,
    targets?: string[],
  ): void | Promise<void>;

  abstract onMessageReceived(
    message: ReceiveMessage,
    clientId?: string,
  ): void | Promise<void>;

  abstract createMatch(lobby: CombinedLobbyState<T, C>): boolean;

  logger: EngineLogger = logger;

  onLobbyEvent: EventHandler<T, C> = (_event) => {};

  abstract setEngine(engine: unknown): void;

  dispose(): void {
    // Base implementation for cleanup
    // Individual adapters should override this method
    this.logger.debug("[BaseSideEffectsAdapter] dispose() called");
  }

  abstract toJSON(): unknown;
}
