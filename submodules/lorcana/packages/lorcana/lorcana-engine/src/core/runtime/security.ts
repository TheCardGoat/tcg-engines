import {
  REDACTED_MOVE_INPUT,
  type MatchState,
  type CommandEnvelope,
  type MoveInput,
  type SanitizedCommandEnvelope,
} from "./types";

// =============================================================================
// Security Types
// =============================================================================

export interface SecurityPolicy {
  maxCommandSize: number;
  maxArgsDepth: number;
  maxArgsSize: number;
  allowedMoveNames: string[];
  sanitizeArgs: boolean;
  rateLimitPerSecond: number;
  maxPendingCommands: number;
}

export interface SecurityCheckResult {
  allowed: boolean;
  reason?: string;
  sanitized?: unknown;
}

export interface RateLimitEntry {
  count: number;
  firstRequest: number;
  windowStart: number;
}

// =============================================================================
// Default Security Policy
// =============================================================================

export const DEFAULT_SECURITY_POLICY: SecurityPolicy = {
  maxCommandSize: 64 * 1024, // 64KB
  maxArgsDepth: 5,
  maxArgsSize: 16 * 1024, // 16KB
  allowedMoveNames: [], // Empty means all moves allowed (checked against game definition)
  sanitizeArgs: true,
  rateLimitPerSecond: 10,
  maxPendingCommands: 5,
};

// =============================================================================
// Input Validator
// =============================================================================

export class InputValidator {
  private policy: SecurityPolicy;

  constructor(policy: Partial<SecurityPolicy> = {}) {
    this.policy = { ...DEFAULT_SECURITY_POLICY, ...policy };
  }

  /**
   * Validate a command envelope.
   */
  validateCommand(command: unknown): SecurityCheckResult {
    if (typeof command !== "object" || command === null) {
      return { allowed: false, reason: "Command must be an object" };
    }

    const cmd = command as CommandEnvelope;

    // Check command ID
    if (!cmd.commandID || typeof cmd.commandID !== "string") {
      return { allowed: false, reason: "Invalid or missing commandID" };
    }

    if (cmd.commandID.length > 256) {
      return { allowed: false, reason: "commandID too long" };
    }

    // Check move name
    if (!cmd.move || typeof cmd.move !== "string") {
      return { allowed: false, reason: "Invalid or missing move name" };
    }

    if (cmd.move.length > 128) {
      return { allowed: false, reason: "Move name too long" };
    }

    if (!cmd.input || typeof cmd.input !== "object") {
      return { allowed: false, reason: "Missing move input payload" };
    }

    if (!("args" in cmd.input)) {
      return { allowed: false, reason: "Move input must include args" };
    }

    // Check input size/depth
    const commandPayload = cmd.input;
    if (commandPayload !== undefined) {
      const inputSize = this.calculateSize(commandPayload);
      if (inputSize > this.policy.maxArgsSize) {
        return { allowed: false, reason: "Input size exceeds limit" };
      }

      const inputDepth = this.calculateDepth(commandPayload);
      if (inputDepth > this.policy.maxArgsDepth) {
        return { allowed: false, reason: "Input depth exceeds limit" };
      }
    }

    // Check total command size
    const totalSize = this.calculateSize(command);
    if (totalSize > this.policy.maxCommandSize) {
      return { allowed: false, reason: "Command size exceeds limit" };
    }

    // Sanitize if enabled
    let sanitized: unknown = command;
    if (this.policy.sanitizeArgs) {
      sanitized = this.sanitize(command);
    }

    return { allowed: true, sanitized };
  }

  /**
   * Validate player ID.
   */
  validatePlayerID(playerID: unknown): SecurityCheckResult {
    if (typeof playerID !== "string") {
      return { allowed: false, reason: "playerID must be a string" };
    }

    if (playerID.length === 0 || playerID.length > 64) {
      return { allowed: false, reason: "playerID length invalid" };
    }

    // Check for valid characters (alphanumeric, dash, underscore)
    if (!/^[a-zA-Z0-9_-]+$/.test(playerID)) {
      return { allowed: false, reason: "playerID contains invalid characters" };
    }

    return { allowed: true };
  }

  /**
   * Validate match ID.
   */
  validateMatchID(matchID: unknown): SecurityCheckResult {
    if (typeof matchID !== "string") {
      return { allowed: false, reason: "matchID must be a string" };
    }

    if (matchID.length === 0 || matchID.length > 128) {
      return { allowed: false, reason: "matchID length invalid" };
    }

    return { allowed: true };
  }

  /**
   * Calculate object size (approximate).
   */
  private calculateSize(obj: unknown): number {
    return JSON.stringify(obj).length;
  }

  /**
   * Calculate object depth.
   */
  private calculateDepth(obj: unknown, currentDepth: number = 0): number {
    if (currentDepth > this.policy.maxArgsDepth) {
      return currentDepth;
    }

    if (obj === null || typeof obj !== "object") {
      return currentDepth;
    }

    if (Array.isArray(obj)) {
      return Math.max(
        currentDepth,
        ...obj.map((item) => this.calculateDepth(item, currentDepth + 1)),
      );
    }

    return Math.max(
      currentDepth,
      ...Object.values(obj).map((value) => this.calculateDepth(value, currentDepth + 1)),
    );
  }

  /**
   * Sanitize input by removing potentially dangerous values.
   */
  private sanitize(obj: unknown): unknown {
    if (obj === null || typeof obj !== "object") {
      // Sanitize strings
      if (typeof obj === "string") {
        return this.sanitizeString(obj);
      }
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.sanitize(item));
    }

    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      // Sanitize keys
      const sanitizedKey = this.sanitizeString(key);
      sanitized[sanitizedKey] = this.sanitize(value);
    }

    return sanitized;
  }

  /**
   * Sanitize a string value.
   */
  private sanitizeString(str: string): string {
    // Remove null bytes
    let sanitized = str.replaceAll("\0", "");

    // Trim whitespace
    sanitized = sanitized.trim();

    // Limit length
    if (sanitized.length > 10000) {
      sanitized = sanitized.substring(0, 10000);
    }

    return sanitized;
  }
}

// =============================================================================
// Rate Limiter
// =============================================================================

export class RateLimiter {
  private policy: SecurityPolicy;
  private limits: Map<string, RateLimitEntry> = new Map();
  private windowMs: number = 1000; // 1 second window

  constructor(policy: Partial<SecurityPolicy> = {}) {
    this.policy = { ...DEFAULT_SECURITY_POLICY, ...policy };
  }

  /**
   * Check if a request is allowed under rate limiting.
   */
  checkLimit(key: string): { allowed: boolean; retryAfterMs?: number } {
    const now = Date.now();
    const entry = this.limits.get(key);

    if (!entry) {
      // First request
      this.limits.set(key, {
        count: 1,
        firstRequest: now,
        windowStart: now,
      });
      return { allowed: true };
    }

    // Check if window has expired
    if (now - entry.windowStart > this.windowMs) {
      // Reset window
      this.limits.set(key, {
        count: 1,
        firstRequest: now,
        windowStart: now,
      });
      return { allowed: true };
    }

    // Check if limit exceeded
    if (entry.count >= this.policy.rateLimitPerSecond) {
      const retryAfterMs = this.windowMs - (now - entry.windowStart);
      return { allowed: false, retryAfterMs };
    }

    // Increment count
    entry.count++;
    return { allowed: true };
  }

  /**
   * Reset rate limit for a key.
   */
  reset(key: string): void {
    this.limits.delete(key);
  }

  /**
   * Reset all rate limits.
   */
  resetAll(): void {
    this.limits.clear();
  }

  /**
   * Get current rate limit status.
   */
  getStatus(key: string): {
    remaining: number;
    limit: number;
    windowMs: number;
    resetTime: number;
  } | null {
    const entry = this.limits.get(key);
    if (!entry) {
      return {
        remaining: this.policy.rateLimitPerSecond,
        limit: this.policy.rateLimitPerSecond,
        windowMs: this.windowMs,
        resetTime: Date.now() + this.windowMs,
      };
    }

    const now = Date.now();
    const remaining = Math.max(0, this.policy.rateLimitPerSecond - entry.count);
    const resetTime = entry.windowStart + this.windowMs;

    return {
      remaining,
      limit: this.policy.rateLimitPerSecond,
      windowMs: this.windowMs,
      resetTime: resetTime > now ? resetTime : now + this.windowMs,
    };
  }
}

// =============================================================================
// State Sanitizer
// =============================================================================

export class StateSanitizer {
  /**
   * Sanitize match state for logging (remove sensitive data).
   */
  static forLogging(state: MatchState): Partial<MatchState> {
    return {
      G: state.G,
      ctx: {
        ...state.ctx,
        // Remove sensitive fields
        random: {
          seed: state.ctx.random.seed,
          draws: state.ctx.random.draws,
          // Remove RNG state
          state: undefined,
        },
      } as MatchState["ctx"],
    };
  }

  /**
   * Sanitize command for logging.
   */
  static sanitizeCommand<TInput extends MoveInput>(
    command: CommandEnvelope<TInput>,
  ): SanitizedCommandEnvelope<TInput> {
    const sanitizedInput = command.redactInput
      ? REDACTED_MOVE_INPUT
      : (command.input ?? REDACTED_MOVE_INPUT);

    return { ...command, input: sanitizedInput };
  }

  /**
   * Validate state integrity.
   */
  static validateIntegrity(state: MatchState): {
    valid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    // Check required fields
    if (!state.G) {
      errors.push("Missing game state (G)");
    }

    if (!state.ctx) {
      errors.push("Missing context (ctx)");
    } else {
      if (typeof state.ctx._stateID !== "number") {
        errors.push("Invalid _stateID");
      }

      if (!state.ctx.matchID) {
        errors.push("Missing matchID");
      }

      if (!state.ctx.rulesetHash) {
        errors.push("Missing rulesetHash");
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// =============================================================================
// Security Manager
// =============================================================================

export class SecurityManager {
  private validator: InputValidator;
  private rateLimiter: RateLimiter;
  private policy: SecurityPolicy;

  constructor(policy: Partial<SecurityPolicy> = {}) {
    this.policy = { ...DEFAULT_SECURITY_POLICY, ...policy };
    this.validator = new InputValidator(this.policy);
    this.rateLimiter = new RateLimiter(this.policy);
  }

  /**
   * Validate and sanitize a command.
   */
  validateCommand(command: unknown): SecurityCheckResult {
    return this.validator.validateCommand(command);
  }

  /**
   * Check rate limit for a player.
   */
  checkRateLimit(playerID: string): { allowed: boolean; retryAfterMs?: number } {
    return this.rateLimiter.checkLimit(playerID);
  }

  /**
   * Get security policy.
   */
  getPolicy(): SecurityPolicy {
    return this.policy;
  }

  /**
   * Update security policy.
   */
  updatePolicy(policy: Partial<SecurityPolicy>): void {
    this.policy = { ...this.policy, ...policy };
    this.validator = new InputValidator(this.policy);
    this.rateLimiter = new RateLimiter(this.policy);
  }
}
