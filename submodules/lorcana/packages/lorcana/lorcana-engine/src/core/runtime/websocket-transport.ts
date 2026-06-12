/**
 * WebSocket Transport Implementation
 *
 * Phase 5 of PLAN.md: Multiplayer protocol and transports
 *
 * WebSocket-based transport for client-server communication.
 */

import type { Transport, ClientMessage, ServerMessage, ConnectionState } from "./protocol-types";
import { validateProtocolMessage } from "./protocol-types";

// =============================================================================
// WebSocket Transport Configuration
// =============================================================================

export interface WebSocketTransportConfig {
  url: string;
  reconnectAttempts?: number;
  reconnectDelayMs?: number;
  heartbeatIntervalMs?: number;
  connectionTimeoutMs?: number;
}

// =============================================================================
// WebSocket Transport
// =============================================================================

export class WebSocketTransport implements Transport {
  private config: Required<WebSocketTransportConfig>;
  private ws: WebSocket | null = null;
  private state: ConnectionState = "DISCONNECTED";

  private messageHandler: ((message: ServerMessage) => void) | null = null;
  private disconnectHandler: ((reason: string) => void) | null = null;
  private errorHandler: ((error: Error) => void) | null = null;

  private reconnectCount = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private connectionTimeoutTimer: ReturnType<typeof setTimeout> | null = null;

  private pendingMessages: ClientMessage[] = [];

  constructor(config: WebSocketTransportConfig) {
    this.config = {
      reconnectAttempts: 5,
      reconnectDelayMs: 1000,
      heartbeatIntervalMs: 30000,
      connectionTimeoutMs: 10000,
      ...config,
    };
  }

  // =============================================================================
  // Transport Interface Implementation
  // =============================================================================

  async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    this.setState("CONNECTING");

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.config.url);

        // Connection timeout
        this.connectionTimeoutTimer = setTimeout(() => {
          this.ws?.close();
          reject(new Error("Connection timeout"));
        }, this.config.connectionTimeoutMs);

        this.ws.onopen = () => {
          this.clearConnectionTimeout();
          this.setState("CONNECTED");
          this.reconnectCount = 0;
          this.startHeartbeat();
          this.flushPendingMessages();
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onclose = (event) => {
          this.clearConnectionTimeout();
          this.stopHeartbeat();
          this.setState("DISCONNECTED");

          if (event.wasClean) {
            this.disconnectHandler?.("Connection closed cleanly");
          } else {
            this.disconnectHandler?.(`Connection closed unexpectedly: ${event.reason}`);
            this.attemptReconnect();
          }
        };

        this.ws.onerror = (_error) => {
          this.clearConnectionTimeout();
          this.setState("ERROR");
          this.errorHandler?.(new Error("WebSocket error"));
        };
      } catch (error) {
        this.clearConnectionTimeout();
        reject(error);
      }
    });
  }

  async disconnect(): Promise<void> {
    this.stopReconnectAttempts();
    this.stopHeartbeat();

    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN) {
        this.ws.close(1000, "Client disconnected");
      }
      this.ws = null;
    }

    this.setState("DISCONNECTED");
  }

  send(message: ClientMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      // Queue message for when connection is established
      this.pendingMessages.push(message);
    }
  }

  onMessage(handler: (message: ServerMessage) => void): void {
    this.messageHandler = handler;
  }

  onDisconnect(handler: (reason: string) => void): void {
    this.disconnectHandler = handler;
  }

  onError(handler: (error: Error) => void): void {
    this.errorHandler = handler;
  }

  getState(): ConnectionState {
    return this.state;
  }

  // =============================================================================
  // Private Methods
  // =============================================================================

  private setState(state: ConnectionState): void {
    this.state = state;
  }

  private handleMessage(data: string): void {
    try {
      const parsed = JSON.parse(data);

      // Validate protocol message
      const validation = validateProtocolMessage(parsed);
      if (!validation.valid) {
        console.warn("Invalid protocol message:", validation.error);
        return;
      }

      this.messageHandler?.(parsed as ServerMessage);
    } catch (error) {
      console.warn("Failed to parse message:", error);
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectCount >= this.config.reconnectAttempts) {
      this.errorHandler?.(new Error("Max reconnection attempts reached"));
      return;
    }

    this.reconnectCount++;
    this.setState("RECONNECTING");

    this.reconnectTimer = setTimeout(() => {
      this.connect().catch(() => {
        // Reconnection failed, will try again
      });
    }, this.config.reconnectDelayMs * this.reconnectCount);
  }

  private stopReconnectAttempts(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private startHeartbeat(): void {
    this.stopHeartbeat();

    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        // Send ping (using a simple ACK message as heartbeat)
        this.ws.send(JSON.stringify({ type: "PING" }));
      }
    }, this.config.heartbeatIntervalMs);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private clearConnectionTimeout(): void {
    if (this.connectionTimeoutTimer) {
      clearTimeout(this.connectionTimeoutTimer);
      this.connectionTimeoutTimer = null;
    }
  }

  private flushPendingMessages(): void {
    const pendingMessages = this.pendingMessages.splice(0);
    for (const message of pendingMessages) {
      this.send(message);
    }
  }
}

// =============================================================================
// Server-Side WebSocket Handler (Node.js)
// =============================================================================

export interface ServerWebSocketConfig {
  verifyClient?: (info: { origin: string; secure: boolean; req: Request }) => boolean;
  maxPayloadLength?: number;
  idleTimeout?: number;
}

/**
 * WebSocket server handler factory for Node.js environments.
 * This is a stub that would need to be implemented with a WebSocket library like 'ws'.
 */
export function createWebSocketServer(
  _port: number,
  _config: ServerWebSocketConfig = {},
): {
  onConnection: (handler: (ws: WebSocket, playerID: string) => void) => void;
  broadcast: (message: ServerMessage) => void;
  close: () => void;
} {
  // This is a stub - actual implementation would use a WebSocket library
  // like 'ws' for Node.js
  throw new Error("WebSocket server requires 'ws' library. Install with: npm install ws");
}
