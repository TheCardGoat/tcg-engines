/**
 * ServerEngine — Server-authoritative engine that is THE source of truth.
 * Wraps MatchRuntime and broadcasts filtered state updates to connected
 * player and spectator transports.
 */

import type { CommandEnvelope, CommandSuccess } from "../types/command.ts";
import type { PlayerId } from "../types/branded.ts";
import type { FilteredMatchView, ViewRoleContext } from "../types/projection.ts";
import type { MatchState } from "../types/match-state.ts";
import type { Transport, ClientMessage, ServerMessage } from "../types/transport.ts";
import type { MatchStaticResources, Player } from "../runtime/static-resources.ts";
import type { TransportAwareEngine } from "./contracts.ts";
import type { CommandResult } from "../types/command.ts";

import { MatchRuntime } from "../runtime/match-runtime.ts";
import { stripPrivateFields } from "../runtime/private-field.ts";

export class ServerEngine implements TransportAwareEngine {
  private runtime: MatchRuntime;
  private transports: Map<PlayerId, Transport> = new Map();
  private spectatorTransports: Set<Transport> = new Set();

  constructor(staticResources: MatchStaticResources) {
    this.runtime = new MatchRuntime(staticResources);
  }

  initialize(players: Player[], seed?: string): void {
    this.runtime.initialize(players, seed);
  }

  // ── GameEngine interface ────────────────────────────────────────────────

  executeCommand(envelope: CommandEnvelope, playerId: PlayerId): CommandResult {
    const result = this.runtime.executeCommand(envelope, playerId);
    if (result.success) {
      this.broadcastStateUpdate(result);
    }
    return result;
  }

  getView(roleCtx: ViewRoleContext): FilteredMatchView {
    return this.runtime.getFilteredView(roleCtx);
  }

  getAvailableMoves(playerId: PlayerId): string[] {
    return this.runtime.getAvailableMoves(playerId);
  }

  getState(): MatchState {
    return this.runtime.getState() as MatchState;
  }

  getStateID(): number {
    return this.runtime.state.ctx._stateID;
  }

  canUndo(playerId: PlayerId): boolean {
    return this.runtime.canUndo(playerId);
  }

  undo(playerId: PlayerId): CommandResult | null {
    const result = this.runtime.undo(playerId);
    if (result !== null && result.success) {
      this.broadcastStateUpdate(result);
    }
    return result;
  }

  // ── Transport management ────────────────────────────────────────────────

  connect(transport: Transport): void {
    this.connectSpectator(transport);
  }

  disconnect(): void {
    for (const transport of this.transports.values()) transport.close();
    for (const transport of this.spectatorTransports) transport.close();
    this.transports.clear();
    this.spectatorTransports.clear();
  }

  dispose(): void {
    this.disconnect();
    this.runtime.dispose();
  }

  connectPlayer(playerId: PlayerId, transport: Transport): void {
    this.transports.set(playerId, transport);

    transport.onMessage((msg) => {
      this.handleClientMessage(playerId, transport, msg as ClientMessage);
    });

    this.sendStateSync(playerId, transport);
  }

  connectSpectator(transport: Transport): void {
    this.spectatorTransports.add(transport);

    transport.onMessage((msg) => {
      const typed = msg as ClientMessage;
      if (typed.type === "ping") {
        this.sendTo(transport, { type: "pong" });
      } else if (typed.type === "syncRequest") {
        const view = this.runtime.getFilteredView({ role: "spectator" });
        this.sendTo(transport, { type: "stateSync", view, stateID: this.getStateID() });
      }
    });

    const view = this.runtime.getFilteredView({ role: "spectator" });
    this.sendTo(transport, { type: "stateSync", view, stateID: this.getStateID() });
  }

  disconnectPlayer(playerId: PlayerId): void {
    const transport = this.transports.get(playerId);
    if (transport) {
      transport.close();
      this.transports.delete(playerId);
    }
  }

  disconnectSpectator(transport: Transport): void {
    transport.close();
    this.spectatorTransports.delete(transport);
  }

  // ── Private ─────────────────────────────────────────────────────────────

  private handleClientMessage(playerId: PlayerId, transport: Transport, msg: ClientMessage): void {
    switch (msg.type) {
      case "command": {
        const result = this.executeCommand(msg.envelope, playerId);
        this.sendTo(transport, {
          type: "commandResult",
          result: result.success ? (stripPrivateFields(result, playerId) ?? result) : result,
          commandID: msg.envelope.commandID,
        });
        break;
      }
      case "undo": {
        const result = this.undo(playerId);
        if (result) {
          this.sendTo(transport, {
            type: "commandResult",
            result: result.success ? (stripPrivateFields(result, playerId) ?? result) : result,
            commandID: `undo-${playerId}`,
          });
        }
        break;
      }
      case "syncRequest":
        this.sendStateSync(playerId, transport);
        break;
      case "ping":
        this.sendTo(transport, { type: "pong" });
        break;
    }
  }

  private sendStateSync(playerId: PlayerId, transport: Transport): void {
    const view = this.runtime.getFilteredView({ role: "player", playerId });
    this.sendTo(transport, { type: "stateSync", view, stateID: this.getStateID() });
  }

  private sendTo(transport: Transport, message: ServerMessage): void {
    transport.send(message);
  }

  private broadcastStateUpdate(result: CommandSuccess): void {
    const stateID = this.getStateID();

    for (const [playerId, transport] of this.transports) {
      const view = this.runtime.getFilteredView({ role: "player", playerId });
      this.sendTo(transport, {
        type: "statePatch",
        stateID,
        view,
        gameEvents: result.gameEvents,
        logEntries: result.logEntries,
        moveLogs: stripPrivateFields(result.moveLogs ?? [], playerId) ?? [],
        animations: result.animations,
        processedCommand: result.processedCommand,
        canUndo: this.runtime.canUndo(playerId),
      });
    }

    const spectatorView = this.runtime.getFilteredView({ role: "spectator" });
    for (const transport of this.spectatorTransports) {
      this.sendTo(transport, {
        type: "statePatch",
        stateID,
        view: spectatorView,
        gameEvents: result.gameEvents,
        logEntries: result.logEntries,
        moveLogs: stripPrivateFields(result.moveLogs ?? [], null) ?? [],
        animations: result.animations,
        processedCommand: result.processedCommand,
        canUndo: false,
      });
    }
  }
}
