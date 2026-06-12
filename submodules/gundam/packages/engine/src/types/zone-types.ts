import type { PlayerId } from "./branded.ts";
import type { BaseCardMeta } from "./base-card.ts";

export type { ZoneVisibility, ZoneConfig, ZoneRef } from "@tcg/engine-core";

export interface ZoneRuntimeState {
  public: {
    zoneSummaries: Record<
      string,
      {
        revision: number;
        count: number;
        topPublicCardID?: string;
      }
    >;
  };
  private: {
    zoneCards: Record<string, string[]>;
    cardIndex: Record<
      string,
      {
        zoneKey: string;
        index: number;
        ownerID: PlayerId;
        controllerID: PlayerId;
      }
    >;
    cardMeta: Record<string, BaseCardMeta>;
  };
  reveals: {
    active: Record<
      string,
      {
        cardIds: string[];
        visibleTo: "all" | string[];
        expiresAtStateID: number;
      }
    >;
    nextId: number;
  };
}
