/**
 * Authentication and Authorization
 *
 * Phase 6 of PLAN.md: Persistence, Replay, Audit, and Auth
 *
 * Credential validation and access control.
 */

import type { Role } from "./types";
import type { MatchConfig } from "./persistence";

// =============================================================================
// Auth Types
// =============================================================================

export interface Credentials {
  playerID: string;
  token: string;
  role: Role;
  expiresAt?: number;
}

export interface AuthContext {
  playerID: string;
  role: Role;
  matchID: string;
  authenticatedAt: number;
}

export interface AuthResult {
  success: boolean;
  context?: AuthContext;
  error?: string;
  errorCode?: AuthErrorCode;
}

export type AuthErrorCode =
  | "INVALID_CREDENTIALS"
  | "EXPIRED_TOKEN"
  | "MATCH_NOT_FOUND"
  | "PLAYER_NOT_IN_MATCH"
  | "ROLE_NOT_ALLOWED"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR";

export interface AccessPolicy {
  spectatorPolicy: "public" | "private" | "judges-only";
  allowSpectators: boolean;
  maxSpectators: number;
  requireAuthentication: boolean;
  allowedRoles: Role[];
}

// =============================================================================
// Auth Provider Interface
// =============================================================================

export interface AuthProvider {
  validateCredentials(playerID: string, token: string): Promise<boolean>;
  generateToken(playerID: string, matchID: string, role: Role): Promise<string>;
  revokeToken(token: string): Promise<void>;
}

// =============================================================================
// Simple Auth Provider (for testing)
// =============================================================================

export class SimpleAuthProvider implements AuthProvider {
  private validTokens: Map<string, { playerID: string; matchID: string; role: Role }> = new Map();

  async validateCredentials(playerID: string, token: string): Promise<boolean> {
    const data = this.validTokens.get(token);
    return data !== undefined && data.playerID === playerID;
  }

  async generateToken(playerID: string, matchID: string, role: Role): Promise<string> {
    const token = `token-${matchID}-${playerID}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.validTokens.set(token, { playerID, matchID, role });
    return token;
  }

  async revokeToken(token: string): Promise<void> {
    this.validTokens.delete(token);
  }

  // Test utility
  clear(): void {
    this.validTokens.clear();
  }
}

// =============================================================================
// Auth Service
// =============================================================================

export class AuthService {
  private provider: AuthProvider;
  private activeSessions: Map<string, AuthContext> = new Map();

  constructor(provider: AuthProvider) {
    this.provider = provider;
  }

  /**
   * Authenticate a player for a match.
   */
  async authenticate(
    playerID: string,
    token: string,
    matchID: string,
    matchConfig: MatchConfig,
  ): Promise<AuthResult> {
    // Validate credentials
    const isValid = await this.provider.validateCredentials(playerID, token);
    if (!isValid) {
      return {
        success: false,
        error: "Invalid credentials",
        errorCode: "INVALID_CREDENTIALS",
      };
    }

    // Check if player is allowed in this match
    // This would typically check against match participants
    // For now, we assume the player is allowed

    const context: AuthContext = {
      playerID,
      role: "player", // This would be determined by match config
      matchID,
      authenticatedAt: Date.now(),
    };

    this.activeSessions.set(this.getSessionKey(playerID, matchID), context);

    return {
      success: true,
      context,
    };
  }

  /**
   * Check if a session is authenticated.
   */
  isAuthenticated(playerID: string, matchID: string): boolean {
    return this.activeSessions.has(this.getSessionKey(playerID, matchID));
  }

  /**
   * Get auth context for a session.
   */
  getAuthContext(playerID: string, matchID: string): AuthContext | undefined {
    return this.activeSessions.get(this.getSessionKey(playerID, matchID));
  }

  /**
   * End a session.
   */
  logout(playerID: string, matchID: string): void {
    this.activeSessions.delete(this.getSessionKey(playerID, matchID));
  }

  /**
   * Check if a role can access a match.
   */
  canAccessMatch(role: Role, matchConfig: MatchConfig): boolean {
    switch (role) {
      case "player":
        return true;
      case "spectator":
        return matchConfig.allowSpectators && matchConfig.spectatorPolicy !== "judges-only";
      case "judge":
        return true; // Judges always have access
      default:
        return false;
    }
  }

  /**
   * Check if a role can perform an action.
   */
  canPerformAction(role: Role, action: string): boolean {
    switch (action) {
      case "view":
        return true; // All roles can view
      case "play":
        return role === "player";
      case "judge":
        return role === "judge";
      case "administrate":
        return role === "judge";
      default:
        return false;
    }
  }

  private getSessionKey(playerID: string, matchID: string): string {
    return `${matchID}:${playerID}`;
  }
}

// =============================================================================
// Access Control
// =============================================================================

export class AccessControl {
  private policy: AccessPolicy;

  constructor(policy: Partial<AccessPolicy> = {}) {
    this.policy = {
      spectatorPolicy: "public",
      allowSpectators: true,
      maxSpectators: 10,
      requireAuthentication: true,
      allowedRoles: ["player", "spectator", "judge"],
      ...policy,
    };
  }

  /**
   * Check if a player can join as a spectator.
   */
  canJoinAsSpectator(currentSpectatorCount: number): { allowed: boolean; reason?: string } {
    if (!this.policy.allowSpectators) {
      return { allowed: false, reason: "Spectators not allowed" };
    }

    if (this.policy.spectatorPolicy === "judges-only") {
      return { allowed: false, reason: "Spectators not allowed, judges only" };
    }

    if (currentSpectatorCount >= this.policy.maxSpectators) {
      return { allowed: false, reason: "Max spectators reached" };
    }

    return { allowed: true };
  }

  /**
   * Check if a role is allowed.
   */
  isRoleAllowed(role: Role): boolean {
    return this.policy.allowedRoles.includes(role);
  }

  /**
   * Get the access policy.
   */
  getPolicy(): AccessPolicy {
    return this.policy;
  }
}

// =============================================================================
// Audit Logger
// =============================================================================

export interface AuditEvent {
  timestamp: number;
  eventType: string;
  matchID?: string;
  playerID?: string;
  details: Record<string, unknown>;
}

export class AuditLogger {
  private events: AuditEvent[] = [];
  private maxEvents: number;

  constructor(maxEvents: number = 10000) {
    this.maxEvents = maxEvents;
  }

  /**
   * Log an audit event.
   */
  log(event: Omit<AuditEvent, "timestamp">): void {
    const fullEvent: AuditEvent = {
      timestamp: Date.now(),
      ...event,
    };

    this.events.push(fullEvent);

    // Trim if exceeding max
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }
  }

  /**
   * Get all events.
   */
  getEvents(): AuditEvent[] {
    return [...this.events];
  }

  /**
   * Get events for a specific match.
   */
  getEventsForMatch(matchID: string): AuditEvent[] {
    return this.events.filter((e) => e.matchID === matchID);
  }

  /**
   * Get events for a specific player.
   */
  getEventsForPlayer(playerID: string): AuditEvent[] {
    return this.events.filter((e) => e.playerID === playerID);
  }

  /**
   * Clear all events.
   */
  clear(): void {
    this.events = [];
  }
}
