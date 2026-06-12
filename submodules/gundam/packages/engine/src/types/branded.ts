declare const __brand: unique symbol;
type Brand<T, TBrand> = T & { readonly [__brand]: TBrand };

export type CardInstanceId = Brand<string, "CardInstanceId">;
export type CardPublicId = Brand<string, "CardPublicId">;
export type PlayerId = Brand<string, "PlayerId">;
export type GameId = Brand<string, "GameId">;
export type ZoneId = Brand<string, "ZoneId">;

function validateNonEmpty(id: string, label: string): void {
  if (id === "") {
    throw new Error(`${label} cannot be an empty string`);
  }
}

// Factory functions with runtime validation (throw on empty string)
export function createCardInstanceId(id: string): CardInstanceId {
  validateNonEmpty(id, "CardInstanceId");
  return id as CardInstanceId;
}

export function createPlayerId(id: string): PlayerId {
  validateNonEmpty(id, "PlayerId");
  return id as PlayerId;
}

export function createGameId(id: string): GameId {
  validateNonEmpty(id, "GameId");
  return id as GameId;
}

export function createZoneId(id: string): ZoneId {
  validateNonEmpty(id, "ZoneId");
  return id as ZoneId;
}

// Safe casting (no runtime cost, no validation)
export function asCardInstanceId(id: string): CardInstanceId {
  return id as CardInstanceId;
}

export function asPlayerId(id: string): PlayerId {
  return id as PlayerId;
}

export function asPlayerIdOptional(id: string | undefined): PlayerId | undefined {
  return id as PlayerId | undefined;
}
