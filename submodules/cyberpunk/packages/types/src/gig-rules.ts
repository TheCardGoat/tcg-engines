import type { DieType, TargetSelectionDSL } from "./index.ts";

export const DIE_MAX_VALUES = {
  d4: 4,
  d6: 6,
  d8: 8,
  d10: 10,
  d12: 12,
  d20: 20,
} as const satisfies Record<DieType, number>;

export const STANDARD_GIG_DICE: readonly DieType[] = ["d20", "d12", "d10", "d8", "d6", "d4"];

export function isDieType(value: string): value is DieType {
  return Object.hasOwn(DIE_MAX_VALUES, value);
}

export type GigCopyPairConstraint = NonNullable<TargetSelectionDSL["pairConstraint"]>;
/** Both dice may be chosen even when the instructed value adjustment will fail (CR 6.4.4–6.4.5). */
export function isGigCopyPairAllowed(
  sourceOwnerId: string,
  targetOwnerId: string,
  constraint: GigCopyPairConstraint,
): boolean {
  switch (constraint) {
    case "gig-copy":
      return true;
    case "gig-copy-between-players":
      return sourceOwnerId !== targetOwnerId;
    default: {
      const unexpected: never = constraint;
      throw new Error(`Unknown Gig copy constraint: ${String(unexpected)}`);
    }
  }
}
