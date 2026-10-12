import { useEffect, useRef } from "react";
import styles from "./search-retrieve.module.css";
import {
  TargetModal,
  PromptBanner,
  type TargetCard,
} from "@tcg/simulator-presentation/target-modal";
import {
  useInteractionDraft,
  useInteractionSurface,
  resolveInteractionText,
} from "@tcg/simulator-ui";

export interface PickExitPlan {
  /** The interaction completes on this pick; the real transfer shows the move. */
  suppressChosenFlight?: boolean;
  tiles: Array<{
    left: number;
    top: number;
    width: number;
    height: number;
    imageUrl?: string;
    chosen: boolean;
  }>;
  pedestal?: { left: number; top: number; width: number; height: number; imageUrl?: string };
}

function captureExitPlan(chosenLabel: string): PickExitPlan | undefined {
  if (typeof document === "undefined") return undefined;
  const dialog = document.querySelector("[role=dialog]");
  if (!dialog) return undefined;
  let chosenSeen = false;
  const tiles = [...dialog.querySelectorAll<HTMLElement>(".tcg-target__card")].map((el) => {
    const rect = el.getBoundingClientRect();
    const matches = (el.getAttribute("aria-label") ?? "").includes(chosenLabel);
    const chosen = matches && !chosenSeen;
    if (matches) chosenSeen = true;
    return {
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      imageUrl: el.querySelector("img")?.getAttribute("src") ?? undefined,
      chosen,
    };
  });
  const frame = dialog.querySelector<HTMLElement>(".tcg-target__source-frame img");
  const frameRect = frame?.getBoundingClientRect();
  return {
    tiles,
    pedestal: frameRect
      ? {
          left: frameRect.left,
          top: frameRect.top,
          width: frameRect.width,
          height: frameRect.height,
          imageUrl: frame?.getAttribute("src") ?? undefined,
        }
      : undefined,
  };
}

/** Uses the authoritative draft shared by board hit targets and server submission. */
export function SearchRetrievePrompt({
  surface,
  cards,
  onExitPlan,
  title,
  reducedMotion = false,
}: {
  surface: ReturnType<typeof useInteractionSurface>;
  cards: ReadonlyMap<string, TargetCard>;
  onExitPlan?: (plan: PickExitPlan | undefined) => void;
  title?: string;
  reducedMotion?: boolean;
}) {
  const draft = useInteractionDraft();
  const input = surface.input;
  const pendingConfirmation = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (
      pendingConfirmation.current !== surface.requestId ||
      !surface.canConfirm ||
      surface.rejected
    )
      return;
    pendingConfirmation.current = undefined;
    surface.confirm();
  }, [surface]);
  const destination =
    input?.kind === "entity-selection" && input.role === "destination" ? input : undefined;
  const options = input?.kind === "option-selection" ? input.options : [];
  const candidates = options.length
    ? options.flatMap((option) =>
        option.entity
          ? [
              {
                id: option.entity.instanceId,
                value: option.id,
                label: resolveInteractionText(option.text),
                enabled: option.enabled !== false,
              },
            ]
          : [],
      )
    : input?.kind === "entity-selection" && !destination
      ? input.candidates.map((candidate) => ({
          id: candidate.entity.instanceId,
          value: candidate.entity.instanceId,
          label: candidate.text ? resolveInteractionText(candidate.text) : "Card",
          enabled: candidate.enabled !== false,
        }))
      : [];
  const value = input ? surface.values[input.id] : undefined;
  const selected = new Set(
    candidates
      .filter((candidate) => Array.isArray(value) && value.includes(candidate.value))
      .map((candidate) => candidate.id),
  );
  const results = candidates.map((candidate) => ({
    ...cards.get(candidate.id),
    ...candidate,
    label: cards.get(candidate.id)?.label ?? candidate.label,
    stackKey: cards.get(candidate.id)?.stackKey,
  }));
  const source = surface.action?.source ? cards.get(surface.action.source.instanceId) : undefined;
  const fromDeck = results.some((card) => card.group?.includes("deck"));
  const placement = surface.action?.inputs.find(
    (entry) => entry.kind === "entity-selection" && entry.role === "destination",
  );
  const destinationLabel =
    input?.kind === "entity-selection" && input.cardDestination
      ? resolveInteractionText(input.cardDestination.label)
      : placement?.kind === "entity-selection" && placement.candidates[0]?.text
        ? resolveInteractionText(placement.candidates[0].text).replace(/^Your /, "your ")
        : "the marked zone";
  const done = options.find((option) => !option.entity);
  return (
    <div className={styles.prompt}>
      {(!surface.opened || destination) && (
        <PromptBanner
          title={destination ? `Place in ${destinationLabel}` : "Choose a card"}
          detail={
            destination
              ? "Select the glowing zone on the battlefield."
              : "Your card choice is waiting."
          }
          status={surface.rejected ? "The choice was not accepted. Clear it or retry." : undefined}
          onRestore={surface.restore}
          restoreDisabled={surface.locked || Boolean(destination)}
        >
          <button onClick={surface.clear} disabled={surface.locked}>
            Cancel selection
          </button>
          {destination?.candidates.map((candidate) => (
            <button
              key={candidate.entity.instanceId}
              disabled={surface.locked}
              onClick={() => surface.select(candidate.entity.instanceId)}
            >
              {candidate.text ? resolveInteractionText(candidate.text) : "Place card"}
            </button>
          ))}
          {surface.canRetry && <button onClick={surface.retry}>Retry choice</button>}
        </PromptBanner>
      )}
      <TargetModal
        opened={Boolean(input && !destination && surface.opened)}
        presentation="dialog"
        fullScreen
        className={styles.selection}
        reducedMotion={reducedMotion}
        title={
          title ??
          (fromDeck
            ? "Search your deck"
            : input?.kind === "entity-selection" && input.cardDestination
              ? "Choose a card"
              : "Retrieve a card")
        }
        cards={results}
        mode="select"
        selectedIds={selected}
        summary={`${input && "min" in input ? (input.min === input.max ? `Choose ${input.max}` : `Choose ${input.min}–${input.max}`) : "Choose a card"} · ${selected.size} selected · ${results.length} available`}
        description={
          surface.rejected
            ? "The choice was not accepted. Review it and retry."
            : destinationLabel === "the marked zone"
              ? "Choose from the cards allowed by this effect."
              : `Select a card to move to ${destinationLabel}.`
        }
        source={source ? { ...source, detail: undefined } : undefined}
        locked={surface.locked}
        onClose={surface.minimize}
        closeLabel="View battlefield"
        onCard={(card) => {
          if (surface.locked || !input || !card.enabled) return;
          const previousPick = surface.values[input.id];
          const previous = Array.isArray(previousPick) ? previousPick : [];
          const next = previous.includes(card.value)
            ? previous.filter((id) => id !== card.value)
            : input.kind === "entity-selection" || input.kind === "option-selection"
              ? input.max === 1
                ? [card.value]
                : previous.length < input.max
                  ? [...previous, card.value]
                  : previous
              : previous;
          const pickedCount = next.length;
          const lastPick =
            (input.kind === "option-selection" || input.kind === "entity-selection") &&
            pickedCount >= input.max;
          // A single forced destination completes the interaction on this click;
          // with several, the placement step stays for the player to choose.
          const forcedDestination = surface.action?.inputs.find(
            (entry) => entry.kind === "entity-selection" && entry.role === "destination",
          );
          const singleDestination =
            forcedDestination?.kind === "entity-selection" &&
            forcedDestination.min === 1 &&
            forcedDestination.max === 1 &&
            forcedDestination.candidates.filter((candidate) => candidate.enabled !== false)
              .length === 1;
          const autoComplete = lastPick && singleDestination;
          const plan = captureExitPlan(card.label);
          if (plan) onExitPlan?.({ ...plan, suppressChosenFlight: autoComplete });
          pendingConfirmation.current =
            lastPick && !input.confirmBeforeSubmit ? surface.requestId : undefined;
          draft.change(input.id, next);
          if (autoComplete && forcedDestination?.kind === "entity-selection") {
            const candidate = forcedDestination.candidates.find((entry) => entry.enabled !== false);
            if (candidate) draft.change(forcedDestination.id, [candidate.entity.instanceId]);
          }
        }}
        footer={
          <>
            <button disabled={surface.locked || selected.size === 0} onClick={surface.clear}>
              Clear selection
            </button>
            <button disabled={!surface.canConfirm} onClick={surface.confirm}>
              {surface.rejected
                ? "Retry selection"
                : selected.size === 0
                  ? "Choose none"
                  : "Use selected"}
            </button>
            {surface.canSkip && input?.kind === "entity-selection" && input.min > 0 && (
              <button disabled={surface.locked} onClick={surface.skip}>
                {input.role === "cost" ? "Skip payment" : "Skip selection"}
              </button>
            )}
            {surface.canRetry && <button onClick={surface.retry}>Retry choice</button>}
            {surface.canCancel && <button onClick={surface.cancel}>Cancel action</button>}
            {done && (
              <button
                disabled={surface.locked}
                onClick={() => {
                  if (input) {
                    pendingConfirmation.current = surface.requestId;
                    draft.change(input.id, [done.id]);
                  }
                }}
              >
                Find no card
              </button>
            )}
          </>
        }
      />
    </div>
  );
}
