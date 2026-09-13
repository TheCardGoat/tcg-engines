import type { AnimationRef } from "@tcg/protocol/animations";
import type { SimulatorEntity } from "@tcg/simulator-contract";

export type AnimationNodePresence = "present" | "exiting";
export type AnimationNodeDensity = "mini" | "compact" | "normal" | "large";

export interface AnimationNodeRecord {
  readonly key: string;
  readonly ref: AnimationRef;
  readonly node: HTMLElement;
  readonly entity?: SimulatorEntity;
  readonly zoneId?: string;
  readonly density?: AnimationNodeDensity;
  readonly presence: AnimationNodePresence;
}

export interface AnimationNodeRegistry {
  register(record: AnimationNodeRecord): () => void;
  get(ref: AnimationRef): readonly AnimationNodeRecord[];
  getPreferred(ref: AnimationRef): AnimationNodeRecord | null;
  getVersion(): number;
  subscribe(listener: () => void): () => void;
  clear(): void;
}

export function animationRefKey(ref: AnimationRef): string {
  return `${ref.kind}:${"ownerId" in ref && ref.ownerId ? `${ref.ownerId}:` : ""}${ref.id}`;
}

export function createAnimationNodeRegistry(): AnimationNodeRegistry {
  const records = new Map<string, Map<string, AnimationNodeRecord>>();
  const listeners = new Set<() => void>();
  let version = 0;
  const publish = () => {
    version += 1;
    for (const listener of listeners) listener();
  };

  return {
    register(record) {
      const refKey = animationRefKey(record.ref);
      const entries = records.get(refKey) ?? new Map<string, AnimationNodeRecord>();
      entries.set(record.key, record);
      records.set(refKey, entries);
      publish();
      return () => {
        const current = records.get(refKey);
        current?.delete(record.key);
        if (current?.size === 0) records.delete(refKey);
        publish();
      };
    },
    get(ref) {
      return [...(records.get(animationRefKey(ref))?.values() ?? [])];
    },
    getPreferred(ref) {
      const candidates = [...(records.get(animationRefKey(ref))?.values() ?? [])];
      return (
        candidates.find((candidate) => candidate.presence === "present") ?? candidates.at(0) ?? null
      );
    },
    getVersion() {
      return version;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    clear() {
      if (records.size === 0) return;
      records.clear();
      publish();
    },
  };
}
