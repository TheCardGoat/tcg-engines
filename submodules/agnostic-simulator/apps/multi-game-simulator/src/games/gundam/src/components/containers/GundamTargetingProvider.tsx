import { useMemo } from "react";
import type { ReactNode } from "react";
import { activeActionableInputs, TargetingProvider } from "@tcg/simulator-ui";
import { pilotSatisfiesUnitLinkCondition } from "@tcg/gundam-engine";
import type { Card } from "@tcg/gundam-types";

import { useBoardProjection } from "../../game/index.ts";
import { useGundamInteractionDraft } from "../../game/interaction-draft.tsx";
import { LinkTargetPreviewContext } from "../ui/link-target-preview-context.tsx";

export function GundamTargetingProvider({ children }: { readonly children: ReactNode }) {
  const draft = useGundamInteractionDraft();
  const view = useBoardProjection();
  const candidateIds = useMemo(() => [...draft.boardCandidateIds], [draft.boardCandidateIds]);
  const hasCandidates = candidateIds.length > 0;
  const role = draft.input?.kind === "entity-selection" ? draft.input.role : undefined;
  const linkCandidateIds = useMemo(() => {
    const linkTargetInput = draft.action
      ? activeActionableInputs(draft.action, draft.values).find(
          (input) =>
            input.kind === "entity-selection" &&
            (draft.actionId === "assignPilot" || draft.actionId === "playCommandAsPilot") &&
            input.id === "unitId",
        )
      : undefined;
    if (linkTargetInput?.kind !== "entity-selection") {
      return new Set<string>();
    }

    const sourceId = draft.sourceId;
    if (!sourceId) return new Set<string>();

    const definitions = new Map<string, Card>();
    for (const zone of Object.values(view.zones.zones)) {
      for (const card of zone.cards) {
        if (card.definition) definitions.set(card.instanceId, card.definition as Card);
      }
    }

    const pilot = definitions.get(sourceId);
    if (!pilot) return new Set<string>();

    return new Set(
      linkTargetInput.candidates
        .filter((candidate) => candidate.enabled)
        .map((candidate) => candidate.entity.instanceId)
        .filter((candidateId) =>
          pilotSatisfiesUnitLinkCondition(pilot, definitions.get(candidateId)),
        ),
    );
  }, [draft.action, draft.sourceId, view]);
  const linkPreviewValue = useMemo(
    () => ({
      active:
        draft.active &&
        (draft.actionId === "assignPilot" || draft.actionId === "playCommandAsPilot"),
      linkCandidateIds,
    }),
    [draft.actionId, draft.active, linkCandidateIds],
  );

  return (
    <LinkTargetPreviewContext.Provider value={linkPreviewValue}>
      <TargetingProvider active={hasCandidates} candidateIds={candidateIds} role={role}>
        {children}
      </TargetingProvider>
    </LinkTargetPreviewContext.Provider>
  );
}
