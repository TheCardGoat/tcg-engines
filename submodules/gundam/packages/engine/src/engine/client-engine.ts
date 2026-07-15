/**
 * ClientEngine — Client-side engine that maintains a local filtered view
 * and communicates with the ServerEngine via a typed Transport protocol.
 */

import type { CommandEnvelope, CommandResult } from "../types/command.ts";
import type { PlayerId } from "../types/branded.ts";
import type { FilteredMatchView } from "../types/projection.ts";
import type { Transport, ServerMessage } from "../types/transport.ts";

export class ClientEngine {
  private localState: FilteredMatchView | null = null;
  private stateID = -1;
  private transport: Transport | null = null;
  private pendingCommands: Map<string, CommandEnvelope> = new Map();
  private stateUpdateHandler: ((view: FilteredMatchView) => void) | null = null;
  private errorHandler:
    | ((err: {
        code: string;
        message: string;
        resyncRequired: boolean;
        currentStateID: number;
      }) => void)
    | null = null;
  private unsubscribeTransport: (() => void) | null = null;

  readonly playerId: PlayerId;

  constructor(playerId: PlayerId) {
    this.playerId = playerId;
  }

  // ── Connection ──────────────────────────────────────────────────────────

  connect(transport: Transport): void {
    this.disconnectTransport();
    this.transport = transport;

    this.unsubscribeTransport = transport.onMessage((raw) => {
      const msg = raw as ServerMessage;
      switch (msg.type) {
        case "stateSync":
          this.stateID = msg.stateID;
          this.localState = msg.view;
          this.notifyUpdate();
          break;
        case "statePatch":
          this.stateID = msg.stateID;
          this.localState = msg.view;
          this.notifyUpdate();
          break;
        case "commandResult":
          this.handleCommandResult(msg.result, msg.commandID);
          break;
        case "error":
          this.handleError(msg);
          break;
        case "pong":
          break;
      }
    });
  }

  disconnect(): void {
    this.disconnectTransport();
    this.localState = null;
    this.stateID = -1;
    this.pendingCommands.clear();
  }

  private disconnectTransport(): void {
    if (this.unsubscribeTransport) {
      this.unsubscribeTransport();
      this.unsubscribeTransport = null;
    }
    if (this.transport) {
      this.transport.close();
      this.transport = null;
    }
  }

  // ── Commands ────────────────────────────────────────────────────────────

  sendCommand(envelope: CommandEnvelope): void {
    if (!this.transport) {
      throw new Error("ClientEngine: not connected to a transport");
    }
    this.pendingCommands.set(envelope.commandID, envelope);
    this.transport.send({
      type: "command",
      envelope,
      prevStateID: this.stateID,
    });
  }

  requestSync(): void {
    if (!this.transport) return;
    this.transport.send({ type: "syncRequest" });
  }

  // ── View access ─────────────────────────────────────────────────────────

  getView(): FilteredMatchView | null {
    return this.localState;
  }

  getStateID(): number {
    return this.stateID;
  }

  onUpdate(handler: (view: FilteredMatchView) => void): () => void {
    this.stateUpdateHandler = handler;
    return () => {
      if (this.stateUpdateHandler === handler) this.stateUpdateHandler = null;
    };
  }

  onError(
    handler: (err: {
      code: string;
      message: string;
      resyncRequired: boolean;
      currentStateID: number;
    }) => void,
  ): () => void {
    this.errorHandler = handler;
    return () => {
      if (this.errorHandler === handler) this.errorHandler = null;
    };
  }

  hasPendingCommands(): boolean {
    return this.pendingCommands.size > 0;
  }

  get pendingCommandCount(): number {
    return this.pendingCommands.size;
  }

  // ── Private ─────────────────────────────────────────────────────────────

  private handleCommandResult(result: CommandResult, commandID: string): void {
    this.pendingCommands.delete(commandID);
  }

  private handleError(msg: Extract<ServerMessage, { type: "error" }>): void {
    this.pendingCommands.clear();
    if (this.errorHandler) {
      this.errorHandler({
        code: msg.code,
        message: msg.message,
        resyncRequired: msg.resyncRequired,
        currentStateID: msg.currentStateID,
      });
    }
    if (msg.resyncRequired) {
      this.requestSync();
    }
  }

  private notifyUpdate(): void {
    if (this.stateUpdateHandler && this.localState) {
      this.stateUpdateHandler(this.localState);
    }
  }
}
