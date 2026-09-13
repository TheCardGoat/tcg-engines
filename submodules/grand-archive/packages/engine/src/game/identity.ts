declare const grandArchiveIdentity: unique symbol;

type Brand<Value, Name extends string> = Value & {
  readonly [grandArchiveIdentity]: Name;
};

export type GrandArchivePlayerId = Brand<string, "GrandArchivePlayerId">;
export type GrandArchiveObjectId = Brand<string, "GrandArchiveObjectId">;
export type GrandArchiveStackItemId = Brand<string, "GrandArchiveStackItemId">;
export type GrandArchiveTargetId =
  | GrandArchiveObjectId
  | GrandArchivePlayerId
  | GrandArchiveStackItemId;
export type GrandArchiveDecisionId = Brand<string, "GrandArchiveDecisionId">;
export type GrandArchiveEventId = Brand<string, "GrandArchiveEventId">;
/** Groups committed records that represent one rules-defined game event. */
export type GrandArchiveGameEventId = Brand<string, "GrandArchiveGameEventId">;

function requireIdentifier(value: string, kind: string): string {
  const normalized = value.trim();
  if (normalized.length === 0) throw new Error(`${kind} must not be empty`);
  return normalized;
}

export const grandArchivePlayerId = (value: string): GrandArchivePlayerId =>
  requireIdentifier(value, "player id") as GrandArchivePlayerId;
export const grandArchiveObjectId = (value: string): GrandArchiveObjectId =>
  requireIdentifier(value, "object id") as GrandArchiveObjectId;
export const grandArchiveStackItemId = (value: string): GrandArchiveStackItemId =>
  requireIdentifier(value, "stack item id") as GrandArchiveStackItemId;
export const grandArchiveTargetId = (value: string): GrandArchiveTargetId =>
  requireIdentifier(value, "target id") as GrandArchiveTargetId;
export const grandArchiveDecisionId = (value: string): GrandArchiveDecisionId =>
  requireIdentifier(value, "decision id") as GrandArchiveDecisionId;
export const grandArchiveEventId = (value: string): GrandArchiveEventId =>
  requireIdentifier(value, "event id") as GrandArchiveEventId;
export const grandArchiveGameEventId = (value: string): GrandArchiveGameEventId =>
  requireIdentifier(value, "game event id") as GrandArchiveGameEventId;
