import { createContext, useContext, useMemo } from "react";
import type { ReactNode } from "react";

import {
  protocolTargetSelection,
  useCurrentTargetingStep,
  useInteractionView,
} from "../../game/index.ts";

/**
 * Surface "a target-selection step is active, here are the legal
 * candidates" to every `CardFace` so non-candidate cards can
 * dim/redden on hover and candidates can highlight.
 *
 * Driven by `useCurrentTargetingStep`, which reads the engine's
 * `describeProcedure` output via the pending state. Any move whose
 * current step is `{ kind: "selectTarget", candidateIds, role, ... }`
 * lights up its candidates here — not just attack targeting. New
 * moves that use `describeProcedure` for target collection get this
 * treatment for free.
 *
 * `AttackTargetingOverlayContainer` continues to gate on its own
 * (`enterBattle` + `attackTarget`) because it draws an attack-specific
 * arrow overlay; this provider only fans the candidate set out to the
 * card tree.
 */
export interface TargetingContextValue {
  readonly active: boolean;
  readonly candidateIds: ReadonlySet<string>;
  /**
   * Step role from the engine (e.g. `"attackTarget"`, `"effectTarget"`).
   * `undefined` outside a targeting step. Future styling can branch on
   * this — e.g. red rim for attack targets, green for beneficial — but
   * today it's purely informational.
   */
  readonly role?: string;
}

const DEFAULT: TargetingContextValue = { active: false, candidateIds: new Set() };

// Exported for test harnesses that need to inject a synthetic value
// without spinning up the full engine/`usePending` stack.
export const TargetingContext = createContext<TargetingContextValue>(DEFAULT);

export function TargetingProvider({ children }: { readonly children: ReactNode }) {
  const step = useCurrentTargetingStep();
  const targetSelection = protocolTargetSelection(useInteractionView());
  const pendingEffectIds = targetSelection?.targetIds;

  // Stringify candidate ids for a stable key — `useMemo` depends on it
  // to avoid re-allocating the Set/value object every render when the
  // underlying candidate list hasn't actually changed.
  const candidateKey = step
    ? [...step.candidateIds].sort().join(",")
    : pendingEffectIds
      ? [...pendingEffectIds].sort().join(",")
      : "";
  const role = step?.role ?? (pendingEffectIds ? "effectTarget" : undefined);

  const value = useMemo<TargetingContextValue>(() => {
    if (!candidateKey) return DEFAULT;
    return {
      active: true,
      candidateIds: new Set(candidateKey.split(",").filter(Boolean)),
      role,
    };
    // `step` is intentionally omitted — `candidateKey` + `role` already
    // encode the parts of `step` we read, and `step.candidateIds` is a
    // fresh Set on every render that would otherwise invalidate the memo
    // even when the underlying ids are unchanged.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidateKey, role]);

  return <TargetingContext.Provider value={value}>{children}</TargetingContext.Provider>;
}

export function useTargeting(): TargetingContextValue {
  return useContext(TargetingContext);
}
