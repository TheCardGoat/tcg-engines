import type { Card } from "@tcg/gundam-types";
import type { CardInstanceId } from "./branded.ts";
import type {
  BaseCardMeta as UnifiedBaseCardMeta,
  RuntimeCard as UnifiedRuntimeCard,
} from "@tcg/engine-core";

export type { Card } from "@tcg/gundam-types";

export type BaseCardMeta = UnifiedBaseCardMeta;

export interface RuntimeCard extends UnifiedRuntimeCard<Card> {
  instanceId: CardInstanceId;
}

export interface CardsMaps {
  instances: {
    entries(): IterableIterator<{ instanceId: string; definitionId: string; ownerID: string }>;
    get(instanceId: string): { definitionId: string; ownerID: string } | undefined;
    register(instanceId: string, entry: { definitionId: string; ownerID: string }): void;
    delete(instanceId: string): void;
    size: number;
  };
  definitions: Map<string, Card>;
}

export interface CardCatalog {
  get(definitionId: string): Card | undefined;
  entries(): IterableIterator<[string, Card]>;
  size: number;
}
