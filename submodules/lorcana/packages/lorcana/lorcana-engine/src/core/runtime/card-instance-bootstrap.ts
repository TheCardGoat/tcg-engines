import type { CardCatalog, CardInstanceRecord, CardInstanceRegistry } from "./static-resources";
import { createRecordCardInstanceRegistry } from "./static-resources";

export interface DeckEntryInput {
  definitionId: string;
  qty: number;
}

export interface PlayerDeckInput {
  ownerID: string;
  deck: DeckEntryInput[];
}

export interface DeterministicCardInstanceRegistry extends CardInstanceRegistry {
  ownerToInstanceIDs: Record<string, string[]>;
}

function formatInstanceId(seq: number, prefix: string): string {
  return `${prefix}${String(seq).padStart(6, "0")}`;
}

function hashString(input: string): string {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export function buildDeterministicCardInstanceRegistry(
  inputs: PlayerDeckInput[],
  options?: { prefix?: string },
): DeterministicCardInstanceRegistry {
  const prefix = (options?.prefix ?? "c").trim() || "c";
  const records: Record<string, CardInstanceRecord> = {};
  const ownerToInstanceIDs: Record<string, string[]> = {};

  let seq = 1;

  for (const input of inputs) {
    const ownerID = input.ownerID;
    ownerToInstanceIDs[ownerID] ||= [];

    for (const entry of input.deck) {
      const qty = Math.max(0, Math.floor(entry.qty ?? 0));
      for (let i = 0; i < qty; i++) {
        const instanceId = formatInstanceId(seq++, prefix);
        records[instanceId] = {
          instanceId,
          definitionId: entry.definitionId,
          ownerID,
        };
        ownerToInstanceIDs[ownerID].push(instanceId);
      }
    }
  }

  const registry = createRecordCardInstanceRegistry(
    `deterministic:${prefix}:${Object.keys(records).length}:${hashString(
      JSON.stringify(
        inputs.map((input) => ({
          ownerID: input.ownerID,
          deck: input.deck.map((entry) => ({ definitionId: entry.definitionId, qty: entry.qty })),
        })),
      ),
    )}`,
    records,
  );

  return {
    ref: registry.ref,
    get: (instanceId: string) => registry.get(instanceId),
    has: (instanceId: string) => registry.has(instanceId),
    entries: () => (registry.entries ? registry.entries() : []),
    ownerToInstanceIDs,
  };
}
