import { printedIdentityKey } from "../rules/printed-identity.ts";
import type { FabTargetCandidate } from "./trigger-declaration.ts";

/** Printed "with different names" is a multi-pick set constraint (DTD106). */
export function targetRequiresDifferentNames(target: {
  readonly selector?: string;
  readonly filter?: { readonly differentNames?: boolean };
}): boolean {
  return target.selector === "object" && target.filter?.differentNames === true;
}

export function distinctPrintedNameCount(candidates: readonly FabTargetCandidate[]): number {
  return new Set(
    candidates.map((candidate) => candidate.printedName ?? printedIdentityKey([candidate.label])),
  ).size;
}

export function differentNamesSelectionError(
  candidates: readonly FabTargetCandidate[],
  instanceIds: readonly string[],
): string | null {
  const keys = instanceIds.map((instanceId) => {
    const candidate = candidates.find((entry) => entry.instanceId === instanceId);
    return candidate?.printedName ?? printedIdentityKey([candidate?.label ?? instanceId]);
  });
  return new Set(keys).size !== keys.length ? "Choose cards with different names." : null;
}
