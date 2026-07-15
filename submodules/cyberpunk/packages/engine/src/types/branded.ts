declare const __brand: unique symbol;
type Brand<T, TBrand> = T & { readonly [__brand]: TBrand };

export type CardInstanceId = Brand<string, "CardInstanceId">;
export type GigDieId = Brand<string, "GigDieId">;
export type PlayerId = Brand<string, "PlayerId">;
export type MatchId = Brand<string, "MatchId">;

export function createCardInstanceId(id: string): CardInstanceId {
  if (!id) throw new Error("CardInstanceId cannot be empty");
  return id as CardInstanceId;
}

export function createGigDieId(id: string): GigDieId {
  if (!id) throw new Error("GigDieId cannot be empty");
  return id as GigDieId;
}

export function createPlayerId(id: string): PlayerId {
  if (!id) throw new Error("PlayerId cannot be empty");
  return id as PlayerId;
}

export function createMatchId(id: string): MatchId {
  if (!id) throw new Error("MatchId cannot be empty");
  return id as MatchId;
}

export function asPlayerId(id: string): PlayerId {
  return id as PlayerId;
}

export function asCardInstanceId(id: string): CardInstanceId {
  return id as CardInstanceId;
}
