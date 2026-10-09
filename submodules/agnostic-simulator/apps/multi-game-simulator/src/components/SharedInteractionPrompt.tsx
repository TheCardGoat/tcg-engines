import type { EngineInteractionView } from "@tcg/protocol";
import {
  InteractionDraftPrompt,
  interactionBoundsCopy,
  requirementFromInput,
  resolveInteractionText,
  useInteractionSurface,
} from "@tcg/simulator-ui";
import {
  PromptBanner,
  TargetModal,
  type TargetCard,
} from "@tcg/simulator-presentation/target-modal";

/** Composition adapter: shared protocol state + shared visuals. No game engine imports. */
export function SharedInteractionPrompt({
  surface,
  view,
  viewerId,
  cards,
  source,
  onInspect,
}: {
  surface: ReturnType<typeof useInteractionSurface>;
  view: EngineInteractionView;
  viewerId: string;
  cards: ReadonlyMap<string, TargetCard>;
  source?: TargetCard;
  onInspect?: (card: TargetCard) => void;
}) {
  const { action, input } = surface;
  if (!action) return null;
  const cardInput =
    input?.kind === "entity-selection" || input?.kind === "ordering" ? input : undefined;
  const candidates =
    cardInput?.candidates.map((candidate) => {
      const id = candidate.entity.instanceId;
      const presentation = cards.get(id);
      return {
        ...presentation,
        id,
        label:
          presentation?.label ??
          (candidate.text ? resolveInteractionText(candidate.text) : "Target"),
        group: presentation?.group,
        enabled: candidate.enabled,
        disabledReason: candidate.disabledText
          ? resolveInteractionText(candidate.disabledText)
          : undefined,
      };
    }) ?? [];
  const ordered =
    cardInput?.kind === "ordering" || (cardInput?.kind === "entity-selection" && cardInput.ordered);
  const selectedValue = cardInput ? surface.values[cardInput.id] : undefined;
  const selectionOrder = ordered && Array.isArray(selectedValue) ? selectedValue : undefined;
  const summary = cardInput
    ? `${interactionBoundsCopy(requirementFromInput(cardInput), ordered ? "card" : "target")} · ${surface.selectedIds.size} selected`
    : input
      ? resolveInteractionText(input.text)
      : surface.rejected
        ? "Your choice is saved for retry"
        : "Awaiting game state";
  const status = surface.locked
    ? "Waiting for the game. Input is paused."
    : surface.rejected
      ? surface.canRetry
        ? "The choice was not accepted. Try again when ready."
        : "The choice was not accepted. Review it and try again."
      : undefined;
  const buttons = cardInput ? (
    <>
      <button
        type="button"
        onClick={surface.clear}
        disabled={surface.locked || surface.selectedIds.size === 0}
      >
        Clear
      </button>
      {surface.canSkip && (
        <button type="button" onClick={surface.skip}>
          Skip
        </button>
      )}
      {surface.canCancel && (
        <button type="button" onClick={surface.cancel}>
          Cancel action
        </button>
      )}
      <button type="button" data-primary disabled={!surface.canConfirm} onClick={surface.confirm}>
        {ordered ? "Confirm order" : "Confirm targets"}
      </button>
    </>
  ) : null;
  return (
    <>
      <PromptBanner
        title={surface.title || resolveInteractionText(action.text)}
        detail={summary}
        source={source}
        status={status}
        onRestore={surface.restore}
        restoreDisabled={surface.locked || !input}
      >
        {surface.spatial && !surface.minimized && !surface.locked ? buttons : null}
        {surface.canRetry && (
          <button type="button" onClick={surface.retry}>
            Retry choice
          </button>
        )}
      </PromptBanner>
      <TargetModal
        opened={surface.opened}
        title={surface.title}
        cards={candidates}
        mode="select"
        source={source}
        summary={summary}
        description={
          status ??
          (ordered
            ? "Select cards in the order they should resolve. Select a card again to remove it from the order."
            : undefined)
        }
        locked={surface.locked}
        selectedIds={surface.selectedIds}
        selectionOrder={selectionOrder}
        closeLabel="Minimize"
        onClose={surface.minimize}
        onCard={(card) => surface.select(card.id)}
        onInspect={onInspect}
        footer={buttons}
        content={
          cardInput ? undefined : (
            <div className="tcg-prompt-inputs">
              <InteractionDraftPrompt
                view={view}
                viewerId={viewerId}
                embedded
                cancellable={surface.canCancel}
                instructionOnly={surface.locked}
                renderCandidate={(_, id) => {
                  const card = cards.get(id);
                  return card?.imageUrl ? (
                    <img
                      src={card.imageUrl}
                      alt={card.label}
                      className="tcg-prompt-candidate-art"
                    />
                  ) : undefined;
                }}
                candidateCaption={(_, id) => cards.get(id)?.label}
              />
            </div>
          )
        }
      />
    </>
  );
}
