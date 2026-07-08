import { useMemo } from "react";
import type { ReactNode } from "react";
import { TargetingProvider } from "@tcg/simulator-ui";

import {
  protocolTargetSelection,
  useCurrentTargetingStep,
  useInteractionView,
} from "../../game/index.ts";

export function GundamTargetingProvider({ children }: { readonly children: ReactNode }) {
  const step = useCurrentTargetingStep();
  const targetSelection = protocolTargetSelection(useInteractionView());
  const pendingEffectIds = targetSelection?.targetIds;

  const candidateIds = useMemo(() => {
    if (step) return step.candidateIds;
    if (pendingEffectIds) return pendingEffectIds;
    return [];
  }, [pendingEffectIds, step]);
  const hasCandidates = [...candidateIds].length > 0;
  const role = step?.role ?? (pendingEffectIds ? "effectTarget" : undefined);

  return (
    <TargetingProvider active={hasCandidates} candidateIds={candidateIds} role={role}>
      {children}
    </TargetingProvider>
  );
}
