/**
 * Immutable runtime resources used to resolve runtime card instances to static data.
 *
 * These resources are intentionally kept out of serialized match state so snapshots/replays
 * can store lightweight references instead of large card catalogs.
 */

import type { BaseCardDefinition } from "./card-contracts";
import type { ZoneConfig } from "./match-runtime.types";

type CardInstanceId = string;
type CardPublicId = string;

export interface CardCatalog {
  readonly ref: string;
  get(definitionId: CardPublicId): BaseCardDefinition | undefined;
  has(definitionId: CardPublicId): boolean;
}

export interface CardInstanceRecord {
  instanceId: string;
  definitionId: string;
  ownerID: string;
}

export interface CardInstanceRegistry {
  readonly ref: string;
  get(instanceId: CardInstanceId): CardInstanceRecord | undefined;
  has(instanceId: CardInstanceId): boolean;
  entries?(): Iterable<CardInstanceRecord>;
}

export interface MatchStaticResources {
  cards: CardCatalog;
  instances: CardInstanceRegistry;
  zoneDefinitions: Record<string, ZoneConfig>;
}

export interface StaticResourceRefs {
  cardsCatalogRef: string;
  cardInstancesRef: string;
}

export interface CardsMaps {
  cardInstances: Record<string, string>;
  owners: Record<string, string[]>;
}

type RecordLike<T> = Record<string, T> | Readonly<Record<string, T>>;

class RecordCardCatalog implements CardCatalog {
  readonly ref: string;
  readonly #definitions: RecordLike<BaseCardDefinition>;

  constructor(ref: string, definitions: RecordLike<BaseCardDefinition>) {
    this.ref = ref;
    this.#definitions = definitions;
  }

  get(definitionId: string): BaseCardDefinition | undefined {
    return this.#definitions[definitionId];
  }

  has(definitionId: string): boolean {
    return definitionId in this.#definitions;
  }
}

class RecordCardInstanceRegistry implements CardInstanceRegistry {
  readonly ref: string;
  readonly #records: Record<string, CardInstanceRecord>;

  constructor(ref: string, records: Record<string, CardInstanceRecord>) {
    this.ref = ref;
    this.#records = records;
  }

  get(instanceId: string): CardInstanceRecord | undefined {
    return this.#records[instanceId];
  }

  has(instanceId: string): boolean {
    return instanceId in this.#records;
  }

  *entries(): Iterable<CardInstanceRecord> {
    for (const record of Object.values(this.#records)) {
      yield record;
    }
  }
}

export function createRecordCardCatalog(
  ref: string,
  definitions: RecordLike<BaseCardDefinition>,
): CardCatalog {
  return new RecordCardCatalog(ref, definitions);
}

export function createRecordCardInstanceRegistry(
  ref: string,
  records: Record<string, CardInstanceRecord>,
): CardInstanceRegistry {
  return new RecordCardInstanceRegistry(ref, records);
}

export function createEmptyMatchStaticResources(): MatchStaticResources {
  return {
    zoneDefinitions: {},
    cards: createRecordCardCatalog("cards:none", {}),
    instances: createRecordCardInstanceRegistry("instances:none", {}),
  };
}

function hashString(input: string): string {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function createCardsMapsRef(cardsMaps: CardsMaps): string {
  const cardInstances = Object.entries(cardsMaps.cardInstances).sort(([a], [b]) =>
    a.localeCompare(b),
  );
  const owners = Object.entries(cardsMaps.owners)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([ownerID, instanceIds]) => [ownerID, [...instanceIds]]);
  const signature = JSON.stringify({ cardInstances, owners });
  return `cards-maps:${cardInstances.length}:${hashString(signature)}`;
}

function buildRecordsFromCardsMaps(cardsMaps: CardsMaps): Record<string, CardInstanceRecord> {
  const records: Record<string, CardInstanceRecord> = {};
  const seenInstanceIds = new Set<string>();

  for (const [ownerID, instanceIds] of Object.entries(cardsMaps.owners)) {
    for (const instanceId of instanceIds) {
      if (seenInstanceIds.has(instanceId)) {
        throw new Error(
          `CARDS_MAPS_INVALID: duplicate instance '${instanceId}' assigned to multiple owners`,
        );
      }

      const definitionId = cardsMaps.cardInstances[instanceId];
      if (!definitionId) {
        throw new Error(
          `CARDS_MAPS_INVALID: owner '${ownerID}' references unknown instance '${instanceId}'`,
        );
      }

      records[instanceId] = {
        instanceId,
        definitionId,
        ownerID,
      };
      seenInstanceIds.add(instanceId);
    }
  }

  for (const instanceId of Object.keys(cardsMaps.cardInstances)) {
    if (!seenInstanceIds.has(instanceId)) {
      throw new Error(`CARDS_MAPS_INVALID: missing owner for instance '${instanceId}'`);
    }
  }

  return records;
}

export function createMatchStaticResourcesFromCardsMaps(
  cardsMaps: CardsMaps,
  cardCatalog: CardCatalog,
  zoneDefinitions: Record<string, ZoneConfig>,
): MatchStaticResources {
  const records = buildRecordsFromCardsMaps(cardsMaps);

  const ref = createCardsMapsRef(cardsMaps);
  const staticResources = {
    cards: cardCatalog,
    instances: createRecordCardInstanceRegistry(ref, records),
    zoneDefinitions,
  };
  validateMatchStaticResources(staticResources);

  return staticResources;
}

export function createCardsMapsFromStaticResources(resources: MatchStaticResources): CardsMaps {
  if (typeof resources.instances.entries !== "function") {
    throw new Error(
      "STATIC_RESOURCES_UNSERIALIZABLE: instances registry must implement entries() to derive cardsMaps",
    );
  }

  const cardInstances: Record<string, string> = {};
  const owners: Record<string, string[]> = {};

  for (const record of resources.instances.entries()) {
    cardInstances[record.instanceId] = record.definitionId;
    (owners[record.ownerID] ||= []).push(record.instanceId);
  }

  return { cardInstances, owners };
}

export function getStaticResourceRefs(resources: MatchStaticResources): StaticResourceRefs {
  return {
    cardsCatalogRef: resources.cards.ref,
    cardInstancesRef: resources.instances.ref,
  };
}

export function validateMatchStaticResources(resources: MatchStaticResources): void {
  if (!resources?.cards || !resources?.instances) {
    throw new Error("STATIC_RESOURCES_INVALID: cards and instances registries are required");
  }

  if (!resources.cards.ref) {
    throw new Error("STATIC_RESOURCES_INVALID: cards catalog ref is required");
  }

  if (!resources.instances.ref) {
    throw new Error("STATIC_RESOURCES_INVALID: card instance registry ref is required");
  }

  if (resources.zoneDefinitions && Object.keys(resources.zoneDefinitions).length === 0) {
  }

  if (typeof resources.instances.entries === "function") {
    for (const record of resources.instances.entries()) {
      if (!record?.instanceId || !record.definitionId) {
        throw new Error("STATIC_RESOURCES_INVALID: invalid card instance record");
      }

      if (!resources.cards.has(record.definitionId)) {
        throw new Error(
          `STATIC_RESOURCES_INVALID: missing card definition '${record.definitionId}' for instance '${record.instanceId}'`,
        );
      }
    }
  }
}
