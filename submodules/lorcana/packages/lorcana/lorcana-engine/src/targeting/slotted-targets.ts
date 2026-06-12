import type { CardInstanceId, PlayerId } from "#core";

/**
 * Central registry of multi-slot target input families.
 *
 * Any effect that asks the player to make **distinct-filter** selections at the
 * same resolution step (shift + pick, move damage from + to, etc.) is modeled
 * here as a discriminated union variant. Single-filter "pick N" effects keep
 * using the flat array form and do NOT belong here.
 *
 * Adding a new variant must cause `bun run check-types` to fail at every
 * consumer that switches over `kind`, because the `default: assertNever(t)`
 * branch collapses when a new kind escapes handling.
 */
export type SlottedTargetInput =
  | {
      kind: "move-damage";
      from: ReadonlyArray<CardInstanceId>;
      to: ReadonlyArray<CardInstanceId>;
    }
  | {
      kind: "move-to-location";
      subject: ReadonlyArray<CardInstanceId>;
      location: ReadonlyArray<CardInstanceId>;
    }
  | {
      kind: "shift-and-choose";
      chosenCard: ReadonlyArray<CardInstanceId>;
    }
  | {
      kind: "banish-and-play";
      banish: ReadonlyArray<CardInstanceId>;
      play: ReadonlyArray<CardInstanceId>;
    };

export type SlottedTargetKind = SlottedTargetInput["kind"];

export const SLOTTED_TARGET_KINDS = [
  "move-damage",
  "move-to-location",
  "shift-and-choose",
  "banish-and-play",
] as const satisfies ReadonlyArray<SlottedTargetKind>;

/**
 * Per-kind slot keys the UI / engine rely on. Kept here so renaming a slot key
 * requires touching only one place, and consumers can read the canonical key
 * list without introspecting variants.
 */
export const SLOTTED_TARGET_SLOT_KEYS = {
  "move-damage": ["from", "to"],
  "move-to-location": ["subject", "location"],
  "shift-and-choose": ["chosenCard"],
  "banish-and-play": ["banish", "play"],
} as const satisfies {
  [K in SlottedTargetKind]: ReadonlyArray<string>;
};

export function isSlottedTargetInput(value: unknown): value is SlottedTargetInput {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const kind = (value as { kind?: unknown }).kind;
  if (typeof kind !== "string" || !(SLOTTED_TARGET_KINDS as ReadonlyArray<string>).includes(kind)) {
    return false;
  }
  const slotKeys = SLOTTED_TARGET_SLOT_KEYS[kind as SlottedTargetKind];
  return slotKeys.every((k) => Array.isArray((value as Record<string, unknown>)[k]));
}

export function isSlotted<K extends SlottedTargetKind>(
  value: unknown,
  kind: K,
): value is Extract<SlottedTargetInput, { kind: K }> {
  return isSlottedTargetInput(value) && value.kind === kind;
}

export function assertNeverSlottedKind(kind: never): never {
  throw new Error(`unhandled slotted target kind: ${JSON.stringify(kind)}`);
}

/**
 * Flatten a slotted input to the positional id list expected by resolvers that
 * have not been slot-aware'd. Exhaustiveness is enforced by the `assertNever`
 * branch: adding a new kind without a case here is a compile error.
 */
export function flattenSlottedTargets(
  input: SlottedTargetInput,
): ReadonlyArray<CardInstanceId | PlayerId> {
  switch (input.kind) {
    case "move-damage":
      return [...input.from, ...input.to];
    case "move-to-location":
      return [...input.subject, ...input.location];
    case "shift-and-choose":
      return [...input.chosenCard];
    case "banish-and-play":
      return [...input.banish, ...input.play];
    default:
      return assertNeverSlottedKind(input);
  }
}

/**
 * Slot keys for a given kind.
 */
export function slotKeysFor<K extends SlottedTargetKind>(kind: K): ReadonlyArray<string> {
  return SLOTTED_TARGET_SLOT_KEYS[kind];
}

/**
 * Test-/client-facing slotted input where slot values are `T` (e.g. `CardInput`
 * or opaque card refs) instead of resolved `CardInstanceId`. The engine-base
 * `playCard` helper resolves each slot into `CardInstanceId[]` via
 * {@link resolveSlottedTargetInputWith}.
 */
export type SlottedTargetInputOf<T> =
  | { kind: "move-damage"; from: ReadonlyArray<T>; to: ReadonlyArray<T> }
  | { kind: "move-to-location"; subject: ReadonlyArray<T>; location: ReadonlyArray<T> }
  | { kind: "shift-and-choose"; chosenCard: ReadonlyArray<T> }
  | { kind: "banish-and-play"; banish: ReadonlyArray<T>; play: ReadonlyArray<T> };

export function resolveSlottedTargetInputWith<T>(
  input: SlottedTargetInputOf<T>,
  resolveSlot: (ids: ReadonlyArray<T>) => ReadonlyArray<CardInstanceId | PlayerId>,
): SlottedTargetInput {
  switch (input.kind) {
    case "move-damage":
      return {
        kind: "move-damage",
        from: resolveSlot(input.from) as ReadonlyArray<CardInstanceId>,
        to: resolveSlot(input.to) as ReadonlyArray<CardInstanceId>,
      };
    case "move-to-location":
      return {
        kind: "move-to-location",
        subject: resolveSlot(input.subject) as ReadonlyArray<CardInstanceId>,
        location: resolveSlot(input.location) as ReadonlyArray<CardInstanceId>,
      };
    case "shift-and-choose":
      return {
        kind: "shift-and-choose",
        chosenCard: resolveSlot(input.chosenCard) as ReadonlyArray<CardInstanceId>,
      };
    case "banish-and-play":
      return {
        kind: "banish-and-play",
        banish: resolveSlot(input.banish) as ReadonlyArray<CardInstanceId>,
        play: resolveSlot(input.play) as ReadonlyArray<CardInstanceId>,
      };
    default:
      return assertNeverSlottedKind(input);
  }
}

/**
 * Structural guard that recognizes the unresolved {@link SlottedTargetInputOf}
 * form (slot arrays may contain {@link CardInput}-typed values, not just string
 * ids). Exists so the engine base can accept pre-resolution slotted input from
 * tests without widening {@link isSlottedTargetInput}, whose contract is
 * "value is already a resolved `SlottedTargetInput`".
 */
export function isUnresolvedSlottedTargetInput(value: unknown): boolean {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const kind = (value as { kind?: unknown }).kind;
  return typeof kind === "string" && (SLOTTED_TARGET_KINDS as ReadonlyArray<string>).includes(kind);
}
