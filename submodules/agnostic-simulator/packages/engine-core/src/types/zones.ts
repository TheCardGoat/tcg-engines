export type ZoneVisibility = "public" | "private" | "secret";

export interface ZoneConfig<TZoneId extends string = string> {
  id: TZoneId;
  name: string;
  visibility: ZoneVisibility;
  ordered: boolean;
  ownerScoped: boolean;
  faceDown?: boolean;
  maxSize?: number;
}

export interface ZoneRef<TZoneId extends string = string> {
  zone: TZoneId;
  playerId?: string;
}

export interface ZoneRuntimeState<TCardId extends string = string> {
  public: {
    zoneSummaries: Record<string, { revision: number; count: number; topPublicCardID?: TCardId }>;
  };
  private: {
    zoneCards: Record<string, TCardId[]>;
    cardIndex: Record<
      TCardId,
      { zoneKey: string; index: number; ownerId: string; controllerId: string }
    >;
    cardMeta: Record<TCardId, Record<string, unknown>>;
  };
}
