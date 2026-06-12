import type { PlayerId } from "./branded.ts";

export interface RuntimeCard<TDefinition = unknown> {
  instanceId: string;
  definitionId: string;
  ownerId: PlayerId;
  controllerId: PlayerId;
  zoneId: string;
  meta: BaseCardMeta;
  definition: TDefinition;
}

export interface BaseCardMeta {
  [key: string]: unknown;
}

export interface CardsMaps<TCard = unknown> {
  instances: {
    get(id: string): RuntimeCard<TCard> | undefined;
    register(id: string, entry: RuntimeCard<TCard>): void;
    delete(id: string): void;
    entries(): IterableIterator<[string, RuntimeCard<TCard>]>;
    size: number;
  };
  definitions: Map<string, TCard>;
}
