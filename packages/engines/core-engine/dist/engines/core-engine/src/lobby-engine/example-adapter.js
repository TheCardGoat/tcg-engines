import { logger } from "../shared/logger";
import { ServerMessageType } from "./lobby-messages-type";
import { BaseSideEffectsAdapter } from "./side-effects-adapter";
/**
 * Example adapter that demonstrates how to implement a SideEffectsAdapter
 * with event handling capabilities
 */
export class ExampleSideEffectsAdapter extends BaseSideEffectsAdapter {
    constructor() {
        super();
        this.logger = logger;
    }
    broadcast(message, targets) {
        this.logger.info("Broadcasting message", {
            message,
            targets: targets || "all players",
        });
        // Implement actual broadcast logic
    }
    onMessageReceived(message, clientId) {
        this.logger.info("Message received", {
            message,
            clientId: clientId || "unknown",
        });
        // Implement actual message handling
    }
    createMatch(lobby) {
        this.logger.info("Creating lobby", lobby);
        // Implement actual lobby creation logic
        return true;
    }
    // Override the default event handler with specialized handling
    onLobbyEvent = (event) => {
        // Log all events for debugging
        this.logger.debug(`Event received: ${event.type}`, event);
        // Handle specific event types with specialized logic
        switch (event.type) {
            case "player_joined":
                this.logger.info(`Player ${event.playerId} joined the lobby`);
                // Send notification to other players
                this.broadcast({
                    type: ServerMessageType.PLAYER_JOINED,
                    payload: {
                        playerId: event.playerId,
                        playerData: event.playerData,
                    },
                });
                break;
            case "player_left":
                this.logger.info(`Player ${event.playerId} left the lobby`);
                // Send notification to remaining players
                this.broadcast({
                    type: ServerMessageType.PLAYER_LEFT,
                    payload: {
                        playerId: event.playerId,
                    },
                });
                break;
            case "player_accepted":
                this.logger.info(`Player ${event.playerId} accepted the lobby`);
                // Update player status in external system
                this.updatePlayerStatus(event.playerId, "accepted");
                // Notify other players
                break;
            case "player_rejected":
                this.logger.info(`Player ${event.playerId} rejected the lobby`);
                // Update player status in external system
                this.updatePlayerStatus(event.playerId, "rejected");
                // Notify other players
                break;
            case "lobby_status_changed":
                this.logger.info(`Lobby status changed from ${event.oldStatus} to ${event.newStatus}`);
                // Notify external systems about status change
                this.notifyExternalSystems(event.newStatus);
                break;
            case "match_creating":
                this.logger.info("Creating lobby in external system");
                // Prepare resources in external system
                break;
            case "match_created":
                this.logger.info(`Lobby created with ID: ${event.matchId}`);
                // Finalize resources in external system
                break;
            case "lobby_timeout":
                this.logger.warn(`Lobby timed out due to: ${event.reason}`);
                // Handle timeout in external system
                this.handleTimeout(event.reason);
                break;
            case "tick":
                // Only log every 10 seconds to avoid excessive logging
                if (event.maxDurationTicks % 10 === 0) {
                    this.logger.debug("Lobby tick", {
                        empty: event.emptyTicks,
                        acceptDeadline: event.acceptDeadlineTicks,
                        maxDuration: event.maxDurationTicks,
                    });
                }
                break;
        }
    };
    // Example helper methods that would interact with external systems
    updatePlayerStatus(playerId, status) {
        this.logger.debug(`Updating player ${playerId} status to ${status} in external system`);
        // Implement actual external system update
    }
    notifyExternalSystems(newStatus) {
        this.logger.debug(`Notifying external systems about status change to ${newStatus}`);
        // Implement actual external system notification
    }
    handleTimeout(reason) {
        this.logger.debug(`Handling timeout due to ${reason} in external system`);
        // Implement actual timeout handling
    }
    toJSON() {
        return {};
    }
    setEngine() { }
}
//# sourceMappingURL=example-adapter.js.map