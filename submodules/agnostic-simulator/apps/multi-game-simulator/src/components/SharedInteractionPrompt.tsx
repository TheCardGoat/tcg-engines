import { ContextualChoiceControl } from "./ContextualChoiceControl";
import { CardDestinationPrompt } from "./CardDestinationPrompt";
import { OrderingInteractionTray } from "./OrderingInteractionTray";
import { OrderedCardGroups } from "./OrderedCardGroups";
import { playSimulatorSound } from "@tcg/simulator-presentation/audio/sound-service";
import {
  BoundedNumberControl,
  smallNumberChoices,
} from "@tcg/simulator-ui/components/BoundedNumberControl";
import type { SimulatorAudioCueId } from "@tcg/protocol";
import { CardReference } from "@tcg/simulator-presentation/card-reference";
import { useEffect, useRef } from "react";
import "./contextual-interaction.css";
import type { EngineInteractionView } from "@tcg/protocol";
import {
  AllocationWorkspace,
  InteractionDraftPrompt,
  CostSlotControl,
  useInteractionDraft,
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
  confirmOnBoard = false,
  onChoose,
  numberedOrdering = false,
  onOrderMove,
  soundEnabled = false,
  reducedMotion = false,
  onCue,
  suppressCostSlots = false,
  autoSubmitSingleTarget = false,
  contextualPlacement = "overlay",
}: {
  surface: ReturnType<typeof useInteractionSurface>;
  view: EngineInteractionView;
  viewerId: string;
  cards: ReadonlyMap<string, TargetCard>;
  source?: TargetCard;
  onInspect?: (card: TargetCard) => void;
  confirmOnBoard?: boolean;
  onChoose?: () => void;
  /** Render ordering inputs as the numbered reorder tray (Alpha Clash board). */
  numberedOrdering?: boolean;
  onOrderMove?: () => void;
  soundEnabled?: boolean;
  reducedMotion?: boolean;
  onCue?: (cue: SimulatorAudioCueId) => void;
  /** The board renders cost slots itself (tap-to-pay stage); skip the dropdown. */
  suppressCostSlots?: boolean;
  /** A single required target submits the moment it is selected (board or tray). */
  autoSubmitSingleTarget?: boolean;
  /** Inline hosts own positioning; never size their prompt against the host's height. */
  contextualPlacement?: "overlay" | "inline";
}) {
  const { action, input } = surface;
  const draft = useInteractionDraft();
  const commit = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (commit.current !== surface.requestId || !surface.canConfirm) return;
    commit.current = undefined;
    surface.confirm();
  }, [surface]);
  // Boards that select targets spatially never pass through choose(): when the
  // prompt wants exactly one required target, that selection IS the submission.
  const autoTarget =
    autoSubmitSingleTarget &&
    viewerId === view.actorId &&
    input?.kind === "entity-selection" &&
    input.ordered !== true &&
    input.min === 1 &&
    input.max === 1 &&
    input.required !== false;
  // A remount after closing another surface must preserve its existing draft.
  // Only a new pick while this prompt is active may auto-submit.
  const selectionKey = `${surface.requestId}:${JSON.stringify([...surface.selectedIds].sort())}`;
  const previousSelection = useRef(selectionKey);
  useEffect(() => {
    const changed = previousSelection.current !== selectionKey;
    previousSelection.current = selectionKey;
    if (!changed || !autoTarget || surface.locked || surface.rejected || !surface.canConfirm)
      return;
    if (surface.selectedIds.size !== 1) return;
    commit.current = undefined;
    surface.confirm();
  }, [autoTarget, selectionKey, surface]);
  const choose = (value: boolean | number | string[], submitImmediately = false) => {
    if (!input || surface.locked || viewerId !== view.actorId) return;
    if (input.kind === "boolean" || input.kind === "option-selection") onChoose?.();
    commit.current =
      input.confirmBeforeSubmit && !submitImmediately ? undefined : surface.requestId;
    draft.change(input.id, value);
  };
  if (!action) return null;
  if (
    (input?.kind === "entity-selection" || input?.kind === "option-selection") &&
    input.cardDestination
  )
    return (
      <CardDestinationPrompt
        input={input}
        selectionCommits={autoTarget}
        surface={surface}
        cards={cards}
        source={source}
        onCue={onCue}
      />
    );
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
    ? `${interactionBoundsCopy(requirementFromInput(cardInput), ordered ? (cardInput.kind === "ordering" && cardInput.entityKind === "resource" ? "item" : "card") : "target")} · ${surface.selectedIds.size} selected`
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
  const spatialCardOptions =
    input?.kind === "option-selection" &&
    surface.spatial &&
    input.options.every((option) => option.entity?.kind === "card");
  const compact =
    input?.kind === "number" ||
    input?.kind === "boolean" ||
    (input?.kind === "option-selection" && input.max === 1);
  if (input?.kind === "option-selection" && input.presentation?.kind === "cost-slots") {
    // The board's tap-to-pay stage owns this prompt; nothing may overlay it.
    if (suppressCostSlots) return null;
  }
  if (
    input?.kind === "option-selection" &&
    input.presentation?.kind === "cost-slots" &&
    !suppressCostSlots
  ) {
    const value = surface.values[input.id];
    return (
      <section
        className="tcg-contextual-choice tcg-contextual-choice--cost-slots"
        aria-label="Current game prompt"
        data-placement={contextualPlacement}
      >
        <CostSlotControl
          input={input}
          value={Array.isArray(value) ? value : []}
          disabled={surface.locked || viewerId !== view.actorId}
          onChange={(next) => draft.change(input.id, next)}
          onConfirm={surface.confirm}
          onCancel={surface.canCancel ? surface.cancel : undefined}
          canConfirm={surface.canConfirm}
          rejected={surface.rejected}
        />
      </section>
    );
  }
  if (compact) {
    const value = input ? surface.values[input.id] : undefined;
    const locked = surface.locked || viewerId !== view.actorId;
    return (
      <section
        className={`tcg-contextual-choice${spatialCardOptions ? " tcg-contextual-choice--spatial" : ""}`}
        aria-label="Current game prompt"
        data-kind={input.kind}
        data-placement={contextualPlacement}
        data-reduced-motion={reducedMotion || undefined}
      >
        <div className="tcg-contextual-choice__copy">
          {source && (
            <small>
              <CardReference card={source} />
            </small>
          )}
          <strong>{surface.title}</strong>
          {spatialCardOptions && <span>Select a highlighted card on the board.</span>}
          {input.kind === "number" &&
            (input.presentation?.contextParts ? (
              <span>
                {input.presentation.contextParts.map((part, index) => {
                  if (part.kind === "text")
                    return <span key={index}>{resolveInteractionText(part.text)}</span>;
                  const card = cards.get(part.entity.instanceId);
                  return card ? (
                    <CardReference key={index} card={card} />
                  ) : (
                    <span key={index}>Card</span>
                  );
                })}
              </span>
            ) : input.presentation?.contextText ? (
              <span>{resolveInteractionText(input.presentation.contextText)}</span>
            ) : null)}
          {status && <span role="status">{status}</span>}
        </div>
        <div className="tcg-contextual-choice__controls">
          {input.kind === "number" &&
            (() => {
              const cancel = input.presentation?.cancel;
              const amounts = smallNumberChoices(input);
              return (
                <>
                  {amounts ? (
                    <div
                      className="tcg-contextual-choice__amount-options"
                      role="group"
                      aria-label="Amount"
                    >
                      {amounts.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          aria-label={`Choose amount ${amount}`}
                          disabled={locked}
                          onClick={() => choose(amount, true)}
                        >
                          {amount}
                        </button>
                      ))}
                      <small className="tcg-contextual-choice__hint">
                        Choose an amount to submit.
                      </small>
                    </div>
                  ) : (
                    <BoundedNumberControl
                      className="tcg-contextual-choice__amount"
                      value={typeof value === "number" ? value : undefined}
                      min={input.min}
                      max={input.max}
                      step={input.step}
                      disabled={locked}
                      onChange={(next) => {
                        if (locked) return;
                        if (next === undefined) draft.unset(input.id);
                        else draft.change(input.id, next);
                      }}
                    />
                  )}
                  {!amounts && (!confirmOnBoard || input.presentation) && (
                    <button data-primary disabled={!surface.canConfirm} onClick={surface.confirm}>
                      {input.presentation?.confirmText
                        ? resolveInteractionText(input.presentation.confirmText)
                        : "Confirm amount"}
                    </button>
                  )}
                  {cancel && (
                    <button disabled={locked} onClick={() => choose(cancel.value)}>
                      {resolveInteractionText(cancel.text)}
                    </button>
                  )}
                  {input.presentation?.cancel?.description && (
                    <small className="tcg-contextual-choice__hint">
                      {resolveInteractionText(input.presentation.cancel.description)}
                    </small>
                  )}
                </>
              );
            })()}
          {(input.kind === "boolean" ||
            (input.kind === "option-selection" && !spatialCardOptions)) && (
            <ContextualChoiceControl
              key={surface.requestId}
              input={input}
              cards={cards}
              locked={locked}
              onChoose={choose}
            />
          )}
          {input.kind === "option-selection" && input.confirmBeforeSubmit && (
            <>
              <button disabled={locked || !surface.selectedIds.size} onClick={surface.clear}>
                Clear targets
              </button>
              <button data-primary disabled={!surface.canConfirm} onClick={surface.confirm}>
                Confirm target
              </button>
            </>
          )}
          {surface.canCancel && (
            <button onClick={surface.cancel} disabled={locked}>
              Cancel
            </button>
          )}
          {surface.canRetry && <button onClick={surface.retry}>Retry choice</button>}
        </div>
      </section>
    );
  }
  const grouped =
    input?.kind === "entity-partition" && input.routes.every((route) => route.ordered);
  if (
    numberedOrdering &&
    input?.kind === "ordering" &&
    input.min === input.candidates.length &&
    input.max === input.min &&
    !surface.minimized
  )
    return (
      <OrderingInteractionTray
        input={input}
        surface={surface}
        cards={cards}
        reducedMotion={reducedMotion}
        onMove={onOrderMove}
      />
    );
  const allocation = input?.kind === "entity-allocation";
  const allocationValue = allocation ? surface.values[input.id] : undefined;
  const amounts = Object.fromEntries(
    Object.entries(
      allocationValue && typeof allocationValue === "object" ? allocationValue : {},
    ).filter((entry): entry is [string, number] => typeof entry[1] === "number"),
  );
  const buttons = allocation ? (
    <button type="button" data-primary disabled={!surface.canConfirm} onClick={surface.confirm}>
      Confirm allocation
    </button>
  ) : grouped ? (
    <button type="button" data-primary disabled={!surface.canConfirm} onClick={surface.confirm}>
      Confirm order
    </button>
  ) : cardInput ? (
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
      {(!confirmOnBoard || !surface.spatial || surface.opened) && (
        <button type="button" data-primary disabled={!surface.canConfirm} onClick={surface.confirm}>
          {ordered ? "Confirm order" : "Confirm targets"}
        </button>
      )}
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
        presentation={grouped || allocation || !surface.spatial ? "focus" : "tray"}
        className={allocation ? "tcg-target-allocation" : undefined}
        reducedMotion={reducedMotion}
        title={grouped ? "Arrange your deck" : surface.title}
        cards={candidates}
        mode="select"
        source={source}
        summary={summary}
        description={
          status ??
          (ordered
            ? input?.kind === "ordering" && input.entityKind === "resource"
              ? "Select items in the order they should be processed. Select an item again to remove it from the order."
              : "Select cards in the order they should resolve. Select a card again to remove it from the order."
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
          allocation ? (
            <div className="tcg-prompt-inputs tcg-prompt-allocation">
              <AllocationWorkspace
                input={input}
                presentation="cards"
                value={amounts}
                disabled={surface.locked || viewerId !== view.actorId}
                onChange={(value) => draft.change(input.id, value)}
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
              />
            </div>
          ) : grouped && input?.kind === "entity-partition" ? (
            <OrderedCardGroups
              key={action.requestId}
              input={input}
              value={surface.values[input.id]}
              cards={cards}
              locked={surface.locked || viewerId !== view.actorId}
              reducedMotion={reducedMotion}
              onChange={(value) => draft.change(input.id, value)}
              onPlace={() => {
                if (soundEnabled && !document.hidden) playSimulatorSound("card.move");
              }}
            />
          ) : cardInput ? undefined : (
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
