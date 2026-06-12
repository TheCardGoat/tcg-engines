import { useEffect, useState } from "react";
import { IconMinus } from "@tabler/icons-react";
import {
  buildInteractionSubmissionForActionId,
  type InteractionAction,
  type InteractionSubmissionValue,
} from "@tcg/protocol";
import { defOf } from "@tcg/cyberpunk-engine";
import {
  PLAYER_SIDE_TO_ID,
  interactionSubmissionToEngineAction,
  useBoardMode,
  useEngine,
  useEngineInteractionView,
  type Side,
} from "../../engine";
import { CardImage } from "../GameBoard/CardImage";
import { CardNameToken } from "../GameBoard/CardNameToken";
import { choiceModalActionFromInteractionView } from "./choiceModalAction";
import {
  setChoiceModalMinimized,
  useChoiceModalMinimized,
  useChoiceModalOpen,
} from "./choiceModalState";
import { booleanInput, entityInput, optionInput } from "./interactionInputs";
import classes from "./ChoiceModal.module.css";

interface ChoiceModalProps {
  /** The side whose perspective the modal is rendered for. */
  side: Side;
}

/**
 * Renders a centered sheet for non-spatial choice prompts. Spatial choices
 * (chooseCardToPlay where candidates are visible on the board, chooseCardToMove
 * onto a unit, etc.) are handled inline by Card.tsx and don't surface here.
 *
 * chooseEffect is fully wired; the rest get a JSON placeholder so designers can
 * see the shape and we can plumb them incrementally.
 */
export function ChoiceModal({ side }: ChoiceModalProps) {
  const mode = useBoardMode(side);
  const { humanSide, matchState } = useEngine();
  const interactionView = useEngineInteractionView(side);
  const autoAction = choiceModalActionFromInteractionView(interactionView.actions, matchState);
  const requestedAction = choiceModalActionFromInteractionView(
    interactionView.actions,
    matchState,
    {
      includeSpatialTargets: true,
    },
  );
  const requestId = requestedAction?.requestId;
  const opened = useChoiceModalOpen(side, requestId);
  const action = opened ? requestedAction : autoAction;
  const minimized = useChoiceModalMinimized(side, action?.requestId);
  const actionRequestId = autoAction?.requestId;

  useEffect(() => {
    if (actionRequestId) {
      setChoiceModalMinimized(side, actionRequestId, false);
    }
  }, [actionRequestId, side]);

  if (side !== humanSide || mode !== "select-target" || !action) {
    return null;
  }
  const title = modalTitle(action);
  if (minimized) {
    return null;
  }
  return (
    <div className={classes.scrim} role="dialog" aria-modal="true">
      <div className={classes.sheet}>
        <button
          type="button"
          className={classes.minimizeButton}
          data-testid="choice-modal-minimize"
          aria-label={`Minimize ${title}`}
          title="Minimize"
          onClick={() => setChoiceModalMinimized(side, action.requestId, true)}
        >
          <IconMinus size={14} stroke={1.8} />
        </button>
        <ChoiceContent action={action} side={side} />
      </div>
    </div>
  );
}

function modalTitle(action: InteractionAction): string {
  if (optionInput(action, "effectId")) {
    return "Choose effect";
  }
  switch (action.id) {
    case "resolveSearchDeck":
      return "Deck search";
    case "resolveTrigger":
      return "Choose trigger";
    case "resolveEffectTarget":
      return "Choose target";
    case "resolveCardToMove":
      return "Choose target";
    default:
      return "Choice";
  }
}

function ChoiceContent({ action, side }: { action: InteractionAction; side: Side }) {
  const { dispatch, matchState } = useEngine();
  const interactionView = useEngineInteractionView(side);
  const [selectedSearchIds, setSelectedSearchIds] = useState<string[]>([]);
  const [selectedTargetIds, setSelectedTargetIds] = useState<string[]>([]);
  const submitInteraction = (
    actionId: string,
    values: Record<string, InteractionSubmissionValue> = {},
  ) => {
    const submission = buildInteractionSubmissionForActionId({
      view: interactionView,
      actionId,
      values,
    });
    if (!submission) {
      return;
    }
    const action = interactionSubmissionToEngineAction(submission, PLAYER_SIDE_TO_ID[side]);
    if (action) {
      dispatch(action);
    }
  };
  const choiceResetKey = `${action.requestId}:${action.id}`;

  useEffect(() => {
    setSelectedSearchIds([]);
    setSelectedTargetIds([]);
  }, [choiceResetKey]);

  const effectInput = optionInput(action, "effectId");
  if (effectInput) {
    const effects = effectInput.options;
    return (
      <>
        <p className={classes.title}>Choose effect</p>
        <p className={classes.subtitle}>Pick one effect to resolve.</p>
        <div className={classes.options}>
          {effects.map((eff) => (
            <button
              key={eff.id}
              type="button"
              className={classes.option}
              disabled={!action.enabled}
              onClick={() => {
                // Effect resolution is handled engine-side via resolveCardToPlay
                // for the chooseCardToPlay subtype, or the engine auto-applies
                // for chooseEffect when the chooser submits a direct index.
                // For this prototype we surface the option but rely on the
                // engine's own auto-resolve for chooseEffect — manual wiring
                // requires a new dispatch action which we'll add when the
                // engine surfaces `resolveChooseEffect`.
                // eslint-disable-next-line no-console
                console.warn("chooseEffect id", eff.id, "not yet wired to a dispatch");
              }}
            >
              {textParam(eff.text.params, "label") ?? `Effect ${eff.id}`}
            </button>
          ))}
        </div>
      </>
    );
  }

  switch (action.id) {
    case "resolveEffectTarget": {
      const targetInput = entityInput(action, "targetIds", "card");
      if (targetInput) {
        const passInput = booleanInput(action, "pass");
        const sourceName = textParam(action.text.params, "sourceDisplayName");
        const sourceCardId = textParam(action.text.params, "sourceCardId");
        const required = targetInput.min;
        const max = targetInput.max;
        const selectedCount = selectedTargetIds.length;
        const canConfirm =
          selectedCount >= required && selectedCount <= max && !(passInput && selectedCount === 0);
        const toggleTarget = (cardId: string) => {
          if (max <= 1) {
            submitInteraction("resolveEffectTarget", { targetIds: [cardId] });
            return;
          }
          setSelectedTargetIds((current) =>
            current.includes(cardId)
              ? current.filter((id) => id !== cardId)
              : current.length >= max
                ? current
                : [...current, cardId],
          );
        };
        return (
          <>
            <p className={classes.title}>
              {sourceName ? (
                <>
                  Choose target for{" "}
                  <SourceCardName cardId={sourceCardId} fallbackName={sourceName} />
                </>
              ) : (
                "Choose target"
              )}
            </p>
            <p className={classes.subtitle}>
              Pick {required === max ? required : `${required}-${max}`} card
              {max === 1 ? "" : "s"}. Hover for full card view.
            </p>
            <div className={`${classes.options} ${classes.searchOptions}`}>
              {targetInput.candidates.map((candidate) => {
                const cardId = candidate.entity.instanceId;
                const selected = selectedTargetIds.includes(cardId);
                const summary = cardSummary(matchState, cardId);
                const selectable = candidate.enabled !== false;
                return (
                  <button
                    key={cardId}
                    type="button"
                    className={`${classes.option} ${classes.cardOption} ${
                      selected ? classes.optionSelected : ""
                    } ${selectable ? "" : classes.optionUnavailable}`}
                    aria-label={`${
                      selectable ? (selected ? "Selected" : "Select") : "Not a valid target"
                    } ${summary?.name ?? cardId}`}
                    aria-disabled={selectable ? undefined : true}
                    aria-pressed={selected}
                    onClick={() => {
                      if (!selectable) return;
                      toggleTarget(cardId);
                    }}
                  >
                    <CardArt summary={summary} fallbackName={cardId} />
                    <CardMeta summary={summary} />
                    {!selectable ? <span className={classes.invalidMark}>Not target</span> : null}
                    {selected ? <span className={classes.selectedMark}>Selected</span> : null}
                  </button>
                );
              })}
            </div>
            {max > 1 || passInput ? (
              <div className={classes.actions}>
                <span className={classes.selectionCount}>
                  {selectedCount}/{max}
                </span>
                <button
                  type="button"
                  className={classes.secondary}
                  onClick={() => setSelectedTargetIds([])}
                >
                  Clear
                </button>
                {passInput ? (
                  <button
                    type="button"
                    className={classes.secondary}
                    onClick={() => {
                      submitInteraction("resolveEffectTarget", { pass: true });
                    }}
                  >
                    Pass
                  </button>
                ) : null}
                <button
                  type="button"
                  className={classes.primary}
                  disabled={!canConfirm}
                  onClick={() => {
                    if (!canConfirm) return;
                    submitInteraction("resolveEffectTarget", { targetIds: selectedTargetIds });
                  }}
                >
                  Confirm
                </button>
              </div>
            ) : null}
          </>
        );
      }
      return (
        <>
          <p className={classes.title}>Choose target</p>
          <p className={classes.subtitle}>{action.id}</p>
          <pre className={classes.placeholder}>{JSON.stringify(action, null, 2)}</pre>
        </>
      );
    }

    case "resolveDiscardFromHand": {
      const cardInput = entityInput(action, "cardIds", "card");
      if (!cardInput) return null;
      const passInput = booleanInput(action, "pass");
      const max = cardInput.max;
      const required = passInput ? max : cardInput.min;
      const selectedCount = selectedTargetIds.length;
      const canConfirm = selectedCount >= required && selectedCount <= max;
      const toggleCard = (cardId: string) => {
        setSelectedTargetIds((current) =>
          current.includes(cardId)
            ? current.filter((id) => id !== cardId)
            : current.length >= max
              ? current
              : [...current, cardId],
        );
      };
      const requirement = required === max ? `${required}` : `${required}-${max}`;
      return (
        <>
          <p className={classes.title}>Choose cards to discard</p>
          <p className={classes.subtitle}>
            Select {requirement} card{max === 1 ? "" : "s"}, or skip this optional effect.
          </p>
          <div className={`${classes.options} ${classes.searchOptions}`}>
            {cardInput.candidates.map((candidate) => {
              const cardId = candidate.entity.instanceId;
              const selected = selectedTargetIds.includes(cardId);
              const summary = cardSummary(matchState, cardId);
              return (
                <button
                  key={cardId}
                  type="button"
                  className={`${classes.option} ${classes.cardOption} ${
                    selected ? classes.optionSelected : ""
                  }`}
                  aria-label={`${selected ? "Selected" : "Select"} ${summary?.name ?? cardId}`}
                  aria-pressed={selected}
                  onClick={() => toggleCard(cardId)}
                >
                  <CardArt summary={summary} fallbackName={cardId} />
                  <CardMeta summary={summary} />
                  {selected ? <span className={classes.selectedMark}>Selected</span> : null}
                </button>
              );
            })}
          </div>
          <div className={classes.actions}>
            <span className={classes.selectionCount}>
              {selectedCount}/{max} selected
            </span>
            <button
              type="button"
              className={classes.secondary}
              onClick={() => setSelectedTargetIds([])}
              disabled={selectedCount === 0}
            >
              Clear
            </button>
            {passInput ? (
              <button
                type="button"
                className={classes.secondary}
                data-testid="discard-from-hand-pass"
                onClick={() => {
                  submitInteraction("resolveDiscardFromHand", { pass: true });
                }}
              >
                Skip effect
              </button>
            ) : null}
            <button
              type="button"
              className={classes.primary}
              data-testid="discard-from-hand-confirm"
              disabled={!canConfirm}
              onClick={() => {
                if (!canConfirm) return;
                submitInteraction("resolveDiscardFromHand", { cardIds: selectedTargetIds });
              }}
            >
              Discard selected
            </button>
          </div>
        </>
      );
    }

    case "resolveTrigger": {
      const triggerInput = optionInput(action, "triggerId");
      if (!triggerInput) return null;
      return (
        <>
          <p className={classes.title}>Choose trigger</p>
          <p className={classes.subtitle}>
            {!triggerInput.required
              ? "Choose an optional effect to resolve, or pass."
              : "Pick the next trigger to resolve."}
          </p>
          <div className={classes.options}>
            {triggerInput.options.map((option) => (
              <button
                key={option.id}
                type="button"
                className={classes.option}
                onClick={() => {
                  submitInteraction("resolveTrigger", { triggerId: option.id });
                }}
              >
                {textParam(option.text.params, "cardName") ?? option.id}
              </button>
            ))}
            {!triggerInput.required ? (
              <button
                type="button"
                className={classes.option}
                onClick={() => {
                  submitInteraction("resolveTrigger", { pass: true });
                }}
              >
                Pass
              </button>
            ) : null}
          </div>
        </>
      );
    }

    case "resolveSearchDeck": {
      const cardInput = entityInput(action, "selectedCardIds", "card");
      if (!cardInput) return null;
      const canSkip = cardInput.min === 0;
      const maxSelect = cardInput.max;
      const multiSelect = maxSelect > 1;
      const requiredText =
        cardInput.min === cardInput.max
          ? `${cardInput.min}`
          : cardInput.min === 0
            ? `up to ${cardInput.max}`
            : `${cardInput.min}-${cardInput.max}`;
      const lookCount = numberParam(action.text.params, "lookCount") ?? maxSelect;
      const sourceName = textParam(action.text.params, "sourceDisplayName");
      const sourceCardId = textParam(action.text.params, "sourceCardId");
      const selectedCount = selectedSearchIds.length;
      const canConfirm =
        selectedCount >= cardInput.min && selectedCount <= cardInput.max && selectedCount > 0;
      const toggleSearchCard = (cardId: string) => {
        setSelectedSearchIds((current) => {
          if (current.includes(cardId)) {
            return current.filter((id) => id !== cardId);
          }
          if (current.length >= maxSelect) {
            return current;
          }
          return [...current, cardId];
        });
      };
      return (
        <>
          <div className={classes.searchHeader}>
            <div className={classes.searchTitleBlock}>
              <p className={classes.kicker}>Deck search</p>
              {sourceName ? (
                <p className={classes.sourceLine}>
                  Resolving <SourceCardName cardId={sourceCardId} fallbackName={sourceName} />
                </p>
              ) : null}
              <p className={classes.title}>Pick {requiredText}</p>
              <p className={classes.subtitle}>
                Top {lookCount} revealed. Hover for full card view.
              </p>
            </div>
            <div
              className={classes.searchMeter}
              aria-label={`${selectedCount} of ${maxSelect} selected`}
            >
              <strong>
                {selectedCount}/{maxSelect}
              </strong>
              <span>selected</span>
            </div>
          </div>
          <div className={`${classes.options} ${classes.searchOptions}`}>
            {cardInput.candidates.map((candidate) => {
              const cardId = candidate.entity.instanceId;
              const selected = selectedSearchIds.includes(cardId);
              const summary = cardSummary(matchState, cardId);
              const selectable = candidate.enabled !== false;
              return (
                <button
                  key={cardId}
                  type="button"
                  className={`${classes.option} ${classes.searchOption} ${
                    selected ? classes.optionSelected : ""
                  } ${selectable ? "" : classes.optionUnavailable}`}
                  data-testid="search-deck-card"
                  data-card-id={cardId}
                  data-definition-id={cardId}
                  data-selected={selected ? "true" : "false"}
                  data-selectable={selectable ? "true" : "false"}
                  aria-pressed={multiSelect ? selected : undefined}
                  aria-disabled={selectable ? undefined : true}
                  aria-label={`${
                    selectable ? (selected ? "Selected" : "Select") : "Not a valid target"
                  } ${summary?.name ?? cardId}`}
                  onClick={() => {
                    if (!selectable) {
                      return;
                    }
                    if (multiSelect) {
                      toggleSearchCard(cardId);
                    } else {
                      submitInteraction("resolveSearchDeck", {
                        selectedCardIds: [cardId],
                      });
                    }
                  }}
                >
                  <CardArt summary={summary} fallbackName={cardId} />
                  <CardMeta summary={summary} />
                  {!selectable ? <span className={classes.invalidMark}>Not target</span> : null}
                  {selected ? <span className={classes.selectedMark}>Selected</span> : null}
                </button>
              );
            })}
          </div>
          <div className={classes.actions}>
            <span className={classes.selectionCount}>
              {selectedCount === 0 ? "No cards selected" : `${selectedCount} ready for hand`}
            </span>
            {canSkip ? (
              <button
                type="button"
                className={`${classes.secondary} ${
                  selectedCount === 0 ? classes.emptySelectionPrimary : ""
                }`}
                data-testid="search-deck-skip"
                onClick={() => {
                  submitInteraction("resolveSearchDeck", { selectedCardIds: [] });
                }}
              >
                Take none
              </button>
            ) : null}
            {multiSelect ? (
              <button
                type="button"
                className={classes.primary}
                data-testid="search-deck-confirm"
                disabled={!canConfirm}
                onClick={() => {
                  submitInteraction("resolveSearchDeck", { selectedCardIds: selectedSearchIds });
                }}
              >
                Add selected
              </button>
            ) : null}
          </div>
        </>
      );
    }

    case "resolveCardToMove": {
      const cardInput = entityInput(action, "cardId", "card");
      if (!cardInput) return null;
      const sourceName = textParam(action.text.params, "sourceDisplayName");
      const sourceCardId = textParam(action.text.params, "sourceCardId");
      const destination = textParam(action.text.params, "destination");
      const titlePrefix =
        destination === "trash" && sourceName
          ? "Choose card to trash for"
          : sourceName
            ? "Choose target for"
            : null;
      return (
        <>
          <p className={classes.title}>
            {titlePrefix && sourceName ? (
              <>
                {titlePrefix} <SourceCardName cardId={sourceCardId} fallbackName={sourceName} />
              </>
            ) : (
              "Choose target"
            )}
          </p>
          <p className={classes.subtitle}>Select from the legal targets below.</p>
          <div className={`${classes.options} ${classes.searchOptions}`}>
            {cardInput.candidates.map((candidate) => {
              const cardId = candidate.entity.instanceId;
              const summary = cardSummary(matchState, cardId);
              const selectable = candidate.enabled !== false;
              return (
                <button
                  key={cardId}
                  type="button"
                  className={`${classes.option} ${classes.cardOption} ${
                    selectable ? "" : classes.optionUnavailable
                  }`}
                  data-testid="target-modal-card"
                  data-card-id={cardId}
                  data-selectable={selectable ? "true" : "false"}
                  aria-disabled={selectable ? undefined : true}
                  aria-label={`${selectable ? "Select" : "Not a valid target"} ${
                    summary?.name ?? cardId
                  }`}
                  onClick={() => {
                    if (!selectable) return;
                    submitInteraction("resolveCardToMove", { cardId });
                  }}
                >
                  <CardArt summary={summary} fallbackName={cardId} />
                  <CardMeta summary={summary} />
                  {!selectable ? <span className={classes.invalidMark}>Not target</span> : null}
                </button>
              );
            })}
          </div>
        </>
      );
    }

    case "gainGig":
    case "resolveCardToPlay":
      return null;
    default:
      return null;
  }
}

function textParam(params: InteractionAction["text"]["params"], key: string): string | undefined {
  const value = params?.[key];
  return typeof value === "string" ? value : undefined;
}

function SourceCardName({
  cardId,
  fallbackName,
}: {
  cardId: string | undefined;
  fallbackName: string;
}) {
  return <CardNameToken cardId={cardId} fallbackName={fallbackName} />;
}

function numberParam(params: InteractionAction["text"]["params"], key: string): number | undefined {
  const value = params?.[key];
  return typeof value === "number" ? value : undefined;
}

type CardType = "legend" | "unit" | "gear" | "program";
type CardColor = "blue" | "green" | "red" | "yellow";

interface CardSummary {
  name: string;
  type: CardType | null;
  cost: number | null;
  power: number | null;
  imageUrl: string | undefined;
  color: CardColor | undefined;
  classifications: readonly string[];
  keywords: readonly string[];
  rules: readonly string[];
  hasSellTag: boolean;
}

function CardArt({ summary, fallbackName }: { summary: CardSummary | null; fallbackName: string }) {
  const name = summary?.name ?? fallbackName;
  return (
    <span className={classes.cardArt}>
      <CardImage
        imageUrl={summary?.imageUrl}
        alt={name}
        cardType={summary?.type ?? undefined}
        color={summary?.color}
        previewDetails={
          summary
            ? {
                name,
                cardType: summary.type,
                cost: summary.cost,
                power: summary.power,
                classifications: summary.classifications,
                keywords: summary.keywords,
                rules: summary.rules,
                hasSellTag: summary.hasSellTag,
              }
            : { name }
        }
      />
    </span>
  );
}

function CardMeta({ summary }: { summary: CardSummary | null }) {
  if (!summary) {
    return null;
  }
  return (
    <span className={classes.searchCardMeta}>
      {summary.type ? <span>{summary.type}</span> : null}
      {summary.cost !== null ? <span>Cost {summary.cost}</span> : null}
    </span>
  );
}

function cardSummary(
  matchState: ReturnType<typeof useEngine>["matchState"],
  cardId: string,
): CardSummary | null {
  const card = matchState.G.cardIndex[cardId];
  if (!card) {
    return null;
  }
  const definition = defOf(card);
  return {
    name: definition.displayName ?? definition.name,
    type: isCardType(definition.type) ? definition.type : null,
    cost: definition.cost ?? null,
    power: definition.power ?? null,
    imageUrl: definition.imageUrl,
    color: isCardColor(definition.color) ? definition.color : undefined,
    classifications: definition.classifications,
    keywords: definition.keywords,
    rules: definition.rulesText ? [definition.rulesText] : [],
    hasSellTag: definition.hasSellTag,
  };
}

function isCardType(value: string | null | undefined): value is CardType {
  return value === "legend" || value === "unit" || value === "gear" || value === "program";
}

function isCardColor(value: string | null | undefined): value is CardColor {
  return value === "blue" || value === "green" || value === "red" || value === "yellow";
}
