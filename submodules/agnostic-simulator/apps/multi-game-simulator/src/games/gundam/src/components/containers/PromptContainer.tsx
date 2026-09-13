import { InteractionResolutionPrompt, useSimulatorViewportLayout } from "@tcg/simulator-ui";
import type { EngineInteractionView, InteractionInput } from "@tcg/protocol";
import { useLayoutEffect, useRef } from "react";

import { useBoardProjection, useGundamGame, useInteractionView } from "../../game/index.ts";
import { useGundamInteractionDraft } from "../../game/interaction-draft.tsx";
import { useCompactLandscapeViewport } from "../../lib/use-layout-mode.ts";
import {
  isDedicatedUnitAttackTargeting,
  useGundamAttackInteraction,
} from "../attack-interactions.ts";
import { GameCard } from "../ui/GameCard.tsx";
import { cardDefinitionToGameCardData, findCardByInstanceId, toGameCardData } from "./mappers.ts";

interface PromptScrollRestore {
  readonly table: HTMLElement;
  readonly bottomOffset: number;
  returnTargetId: string | null;
}

export function PromptContainer() {
  const board = useBoardProjection();
  const view = useInteractionView();
  const { adapter } = useGundamGame();
  const draft = useGundamInteractionDraft();
  const attackInteraction = useGundamAttackInteraction();
  const viewportLayout = useSimulatorViewportLayout();
  const compactLandscape = useCompactLandscapeViewport();
  const scrollRestoreRef = useRef<PromptScrollRestore | null>(null);
  const candidateIds = [...draft.boardCandidateIds];
  const firstCandidateId = candidateIds[0];
  const visibleEntityIds = visibleSpatialTargetIds(board, candidateIds);
  const viewerId = String(adapter.viewerId);
  const targetEdge = targetSelectionBoardEdge(board, candidateIds, viewerId);
  const effectSource = view.resolution?.currentEffect.source;
  const effectReturnTargetId =
    view.resolution?.actingPlayerId === viewerId &&
    effectSource?.kind === "card" &&
    effectSource.zoneId === "battleArea"
      ? effectSource.instanceId
      : null;
  const preferredPlacement = targetEdge === "bottom" ? "top" : "bottom";
  const stepPrompt = interactionPromptParam(view.resolution?.currentStep.text, "prompt");
  const optionSummaries = optionStatSummaries(draft.input, stepPrompt);
  const actionPresentation = view.resolution
    ? promptPresentation(
        draft.input,
        board,
        candidateIds,
        targetEdge,
        stepPrompt,
        viewportLayout === "mobile",
        optionSummaries.size > 0,
      )
    : draftPromptPresentation(draft.actionId ?? null, draft.input, board, draft.sourceId);
  const promptView: EngineInteractionView = {
    ...view,
    actions: view.actions.map((action) => ({
      ...action,
      inputs: action.inputs.map((input) => {
        if (input.kind !== "entity-selection") return input;
        return {
          ...input,
          candidates: input.candidates.map((candidate) => {
            if (candidate.text || candidate.entity.kind !== "card") return candidate;
            const card = findCardByInstanceId(board, candidate.entity.instanceId);
            // Names come only from the viewer's projection, never the private
            // static registry. The same labels identify choices and selections.
            const label = card?.faceDown ? "Face-down card" : (card?.definition?.name ?? "Card");
            return {
              ...candidate,
              text: { key: "gundam.card.name", params: { label } },
            };
          }),
        };
      }),
    })),
  };

  useLayoutEffect(() => {
    if (!draft.active || viewportLayout !== "mobile" || targetEdge === null) {
      const restore = scrollRestoreRef.current;
      if (restore && (!draft.active || viewportLayout !== "mobile")) {
        scrollRestoreRef.current = null;
        restorePromptScroll(restore);
      }
      return;
    }

    const table = document.querySelector<HTMLElement>(".gundam-simulator-root [data-sim-board]");
    if (!table) return;
    scrollRestoreRef.current ??= {
      table,
      bottomOffset: Math.max(0, table.scrollHeight - table.clientHeight - table.scrollTop),
      returnTargetId: null,
    };
    if (targetEdge === "bottom" && candidateIds[0]) {
      scrollRestoreRef.current.returnTargetId = candidateIds[0];
    } else if (!scrollRestoreRef.current.returnTargetId && effectReturnTargetId) {
      scrollRestoreRef.current.returnTargetId = effectReturnTargetId;
    }
    const frame = window.requestAnimationFrame(() => {
      table.scrollTop = targetEdge === "top" ? 0 : table.scrollHeight - table.clientHeight;
      if (targetEdge === "bottom" && compactLandscape && firstCandidateId) {
        revealEntityInBoard(table, firstCandidateId);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [
    compactLandscape,
    draft.actionId,
    draft.active,
    effectReturnTargetId,
    firstCandidateId,
    targetEdge,
    viewportLayout,
  ]);

  useLayoutEffect(
    () => () => {
      const restore = scrollRestoreRef.current;
      if (restore) restorePromptScroll(restore);
    },
    [],
  );

  if (
    !view.resolution &&
    isDedicatedUnitAttackTargeting(draft, attackInteraction.unitTargetingAttackerId)
  ) {
    return null;
  }
  if (!draft.active && !view.resolution) return null;

  return (
    <InteractionResolutionPrompt
      view={promptView}
      viewerId={String(adapter.viewerId)}
      actionId={draft.actionId}
      values={draft.values}
      confirmedInputIds={draft.confirmedInputIds}
      visibleEntityIds={visibleEntityIds}
      onChange={draft.change}
      onClearInput={draft.unset}
      onConfirm={draft.confirmCurrent}
      onClear={draft.clear}
      onCancel={draft.cancel}
      preferredPlacement={preferredPlacement}
      immediateDrawerSelection
      immediateOptionalSingletons
      actionPresentation={actionPresentation}
      suppressInstructionTooltip={viewportLayout === "mobile"}
      renderText={
        optionSummaries.size > 0
          ? (text) => {
              const summary = optionSummaries.get(text);
              return summary ? (
                <span className="flex min-w-0 flex-col items-start gap-0.5 text-left">
                  <span>{text}</span>
                  <span aria-hidden="true" className="text-hud-xs font-medium text-hud-text-muted">
                    {summary}
                  </span>
                </span>
              ) : (
                text
              );
            }
          : undefined
      }
      renderCandidate={(_input, entityId) => {
        const card = findCardByInstanceId(board, entityId);
        // Deck-look projections authorize the controller to see looked-at
        // identities (face-up on the board view). Prefer that public data;
        // fall back to the static definition map when the board still hides
        // the card (e.g. non-deck temporary candidates).
        if (card && !card.faceDown && card.definition) {
          return (
            <span className="pointer-events-none block" data-revealed-card-id={entityId}>
              <GameCard
                {...toGameCardData(board, card)}
                size={compactLandscape ? "micro" : "small"}
              />
            </span>
          );
        }
        const definition = adapter.cardDefinitionOf(entityId);
        return definition ? (
          <span className="pointer-events-none block" data-revealed-card-id={entityId}>
            <GameCard
              {...cardDefinitionToGameCardData(definition, entityId)}
              size={compactLandscape ? "micro" : "small"}
            />
          </span>
        ) : (
          entityId
        );
      }}
    />
  );
}

function restorePromptScroll(restore: PromptScrollRestore): void {
  restore.table.scrollTop = Math.max(
    0,
    restore.table.scrollHeight - restore.table.clientHeight - restore.bottomOffset,
  );
  const returnTargetId = restore.returnTargetId;
  if (!returnTargetId) return;
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => revealEntityInBoard(restore.table, returnTargetId));
  });
}

function revealEntityInBoard(table: HTMLElement, entityId: string): void {
  const escaped =
    typeof CSS !== "undefined" && typeof CSS.escape === "function"
      ? CSS.escape(entityId)
      : entityId.replace(/["\\\n\r\f]/g, (character) => `\\${character}`);
  const entity = [...table.querySelectorAll<HTMLElement>(`[data-sim-entity-id="${escaped}"]`)].find(
    (node) => !node.closest("[aria-hidden='true']") && node.getClientRects().length > 0,
  );
  if (!entity) return;

  const entityRect = entity.getBoundingClientRect();
  const pairedStack = entity.closest<HTMLElement>("[data-paired-pilot-stack]");
  const pairedStackRect = pairedStack?.getBoundingClientRect();
  const pairedPilot = pairedStack?.querySelector<HTMLElement>("[data-paired-pilot-card]");
  const pairedPilotRect = pairedPilot?.getBoundingClientRect();
  const contentTop = Math.min(
    entityRect.top,
    pairedStackRect?.top ?? entityRect.top,
    pairedPilotRect?.top ?? entityRect.top,
  );
  const contentBottom = Math.max(
    entityRect.bottom,
    pairedStackRect?.bottom ?? entityRect.bottom,
    pairedPilotRect?.bottom ?? entityRect.bottom,
  );
  const tableRect = table.getBoundingClientRect();
  const visibleTop = tableRect.top + 8;
  const visibleBottom = tableRect.bottom - 8;

  if (contentTop < visibleTop) table.scrollTop += contentTop - visibleTop;
  else if (contentBottom > visibleBottom) table.scrollTop += contentBottom - visibleBottom;
}

function draftPromptPresentation(
  actionId: string | null,
  input: InteractionInput | undefined,
  view: ReturnType<typeof useBoardProjection>,
  sourceId: string | undefined,
): { readonly body: string } | undefined {
  if (
    (actionId !== "assignPilot" && actionId !== "playCommandAsPilot") ||
    input?.kind !== "entity-selection"
  ) {
    return undefined;
  }

  const sourceName = sourceId ? findCardByInstanceId(view, sourceId)?.definition?.name : undefined;
  return {
    body: sourceName
      ? `Choose a Unit. Green LINK meets ${sourceName}'s Link Condition.`
      : "Choose a Unit. Green LINK meets this Pilot's Link Condition.",
  };
}

function promptPresentation(
  input: InteractionInput | undefined,
  view: ReturnType<typeof useBoardProjection>,
  targetIds: readonly string[],
  targetEdge: "top" | "bottom" | null,
  stepPrompt: string | undefined,
  compactSpatialCopy: boolean,
  hasOptionSummaries: boolean,
): { readonly body: string } | undefined {
  if (input?.kind === "option-selection") {
    if (!compactSpatialCopy && !hasOptionSummaries) return undefined;
    const isTokenDeployment =
      /\bdeploy\b/i.test(stepPrompt ?? "") && /\bunit token\b/i.test(stepPrompt ?? "");
    return {
      body: isTokenDeployment ? "Choose a Unit token to deploy." : "Choose one option.",
    };
  }
  if (input?.kind !== "entity-selection" || targetIds.length === 0) return undefined;

  const supportInstruction = supportTargetInstruction(stepPrompt);
  if (supportInstruction) return { body: supportInstruction };
  if (!compactSpatialCopy) return undefined;

  const candidateTypes = new Set(
    targetIds.flatMap((targetId) => {
      const type = findCardByInstanceId(view, targetId)?.definition?.type;
      return type ? [type] : [];
    }),
  );
  const onlyType = candidateTypes.size === 1 ? [...candidateTypes][0] : undefined;
  const singularNoun = onlyType === "base" ? "Base" : onlyType === "unit" ? "Unit" : "card";
  const targetNoun = spatialTargetNoun(singularNoun, input.max, targetEdge);
  const count =
    input.min === input.max
      ? String(input.min)
      : input.min === 0
        ? `up to ${input.max}`
        : `${input.min}–${input.max}`;
  const ownership =
    targetEdge === "bottom"
      ? "of your highlighted"
      : targetEdge === "top"
        ? "highlighted enemy"
        : "highlighted";

  return { body: `Choose ${count} ${ownership} ${targetNoun}.` };
}

export function supportTargetInstruction(stepPrompt: string | undefined): string | undefined {
  const amount = stepPrompt?.match(/^<Support (\d+)>$/u)?.[1];
  return amount ? `Choose another friendly Unit to get +${amount} AP this turn.` : undefined;
}

export function spatialTargetNoun(
  singularNoun: string,
  maximum: number,
  targetEdge: "top" | "bottom" | null,
): string {
  return `${singularNoun}${maximum === 1 && targetEdge !== "bottom" ? "" : "s"}`;
}

function optionStatSummaries(
  input: InteractionInput | undefined,
  stepPrompt: string | undefined,
): ReadonlyMap<string, string> {
  if (input?.kind !== "option-selection" || !stepPrompt) return new Map();

  const summaries = new Map<string, string>();
  for (const option of input.options) {
    const label = interactionPromptParam(option.text, "label");
    if (!label) continue;
    const marker = `[${label}]`;
    const start = stepPrompt.indexOf(marker);
    if (start < 0) continue;
    const optionText = stepPrompt.slice(start + marker.length, start + marker.length + 120);
    const ap = optionText.match(/\bAP\s*(\d+)/i)?.[1];
    const hp = optionText.match(/\bHP\s*(\d+)/i)?.[1];
    const keyword = optionText.match(/<([^>]+)>/)?.[1];
    const parts = [ap ? `AP ${ap}` : undefined, hp ? `HP ${hp}` : undefined, keyword].filter(
      (part): part is string => Boolean(part),
    );
    if (parts.length > 0) summaries.set(label, parts.join(" · "));
  }
  return summaries;
}

function interactionPromptParam(
  text: { readonly params?: Readonly<Record<string, unknown>> } | undefined,
  key: string,
): string | undefined {
  const value = text?.params?.[key];
  return typeof value === "string" ? value : undefined;
}

export function targetSelectionBoardEdge(
  view: ReturnType<typeof useBoardProjection>,
  targetIds: readonly string[],
  viewerId: string,
): "top" | "bottom" | null {
  const targets = new Set(targetIds);
  let hasViewerTarget = false;
  let hasOpponentTarget = false;

  for (const [zoneId, zone] of Object.entries(view.zones.zones)) {
    if (
      zoneId.startsWith("trash:") ||
      zoneId.startsWith("deck:") ||
      zoneId.startsWith("resourceDeck:")
    ) {
      continue;
    }
    for (const card of zone.cards) {
      if (!targets.has(card.instanceId)) continue;
      if (String(card.controllerId) === viewerId) hasViewerTarget = true;
      else hasOpponentTarget = true;
    }
  }

  if (hasViewerTarget === hasOpponentTarget) return null;
  return hasViewerTarget ? "bottom" : "top";
}

export function visibleSpatialTargetIds(
  view: ReturnType<typeof useBoardProjection>,
  targetIds: readonly string[],
): ReadonlySet<string> {
  const targets = new Set(targetIds);
  const visible = new Set<string>();
  for (const [zoneId, zone] of Object.entries(view.zones.zones)) {
    if (
      zoneId.startsWith("trash:") ||
      zoneId.startsWith("deck:") ||
      zoneId.startsWith("resourceDeck:")
    ) {
      continue;
    }
    for (const card of zone.cards) {
      if (targets.has(card.instanceId)) visible.add(card.instanceId);
    }
  }
  return visible;
}
