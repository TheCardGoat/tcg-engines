import { useEffect } from "react";
import { autoAssignCostSlots, useInteractionDraft, useInteractionSurface } from "@tcg/simulator-ui";
import { ResolutionFocusCard } from "@tcg/simulator-presentation/focus";
import { ResourceGem } from "./ResourceGem";
import type { CostSlotsPresentation, OptionSelectionInput } from "@tcg/protocol";
import { resourceColorHex, resourceOptionColor } from "./resource-colors";
import styles from "./payment-stage.module.css";

/**
 * Resource-payment prompt for Alpha Clash, rendered through the shared
 * ResolutionFocusCard: the declared card is in Standby (601.1a) while the
 * player taps ready resources on the board; a complete draft plays the card.
 */
export function PaymentStage({
  surface,
  input,
  source,
  reducedMotion = false,
  sceneOwnsCard = false,
  compact = false,
}: {
  surface: ReturnType<typeof useInteractionSurface>;
  input: OptionSelectionInput & { presentation: CostSlotsPresentation };
  source?: { name?: string; imageUrl?: string };
  reducedMotion?: boolean;
  sceneOwnsCard?: boolean;
  compact?: boolean;
}) {
  const draft = useInteractionDraft();
  const value = surface.values[input.id];
  // Paying the last resource plays the card, like every staged resolution.
  useEffect(() => {
    if (!surface.locked && !surface.rejected && surface.canConfirm) surface.confirm();
  }, [surface]);
  const slots = input.presentation.slots;
  const assigned = slots.map(
    (_, index) =>
      (Array.isArray(value) && typeof value[index] === "string" ? value[index] : "") as string,
  );
  const optionById = new Map(input.options.map((option) => [option.id, option]));
  const clearSlot = (slotIndex: number) => {
    if (surface.locked || !assigned[slotIndex]) return;
    const next = [...assigned];
    next[slotIndex] = "";
    draft.change(input.id, next);
  };
  const autoFill = () => {
    // Keeps the resources the player picked and fills only the shortfall.
    const completion = autoAssignCostSlots(input, assigned);
    if (completion) draft.change(input.id, completion);
  };
  const panel = (
    <div
      className={styles.panel}
      data-testid="ac-payment-stage"
      data-compact={compact || undefined}
      data-reduced-motion={reducedMotion || undefined}
      title="Tap a ready resource to engage it · tap again to unassign"
    >
      <div className={styles.context}>
        <strong>{source?.name ?? "Pay resources"}</strong>
        <span>Tap highlighted resources. The last resource continues the action.</span>
      </div>
      <div className={styles.slots}>
        {slots.map((slot, index) => {
          const option = assigned[index] ? optionById.get(assigned[index]!) : undefined;
          const gemColor = option
            ? resourceColorHex(resourceOptionColor(option.id) ?? "")
            : slot.color
              ? resourceColorHex(slot.color)
              : "#8ea3ad";
          return (
            <button
              key={index}
              type="button"
              className={`${styles.slot} ${option ? styles.slotFilled : styles.slotEmpty}`}
              disabled={surface.locked}
              aria-pressed={Boolean(option)}
              aria-label={
                option
                  ? `${slot.text.key}: ${option.text.key}, tap to unassign`
                  : `${slot.text.key}, unassigned`
              }
              onClick={() => clearSlot(index)}
            >
              <span className={styles.slotGem}>
                <ResourceGem color={gemColor} size={15} />
              </span>
            </button>
          );
        })}
        <span className={styles.progress} aria-live="polite">
          {`${assigned.filter(Boolean).length} of ${slots.length} resources engaged`}
        </span>
      </div>
      {surface.rejected && (
        <p className={styles.rejected} role="alert">
          Payment was not accepted. Check your choices and retry.
        </p>
      )}
      <div className={styles.actions}>
        {surface.canRetry && (
          <button type="button" className={styles.frameButton} onClick={surface.retry}>
            Retry payment
          </button>
        )}
        <button
          type="button"
          className={styles.frameButton}
          disabled={surface.locked}
          onClick={autoFill}
        >
          Pay automatically
        </button>
        <button
          type="button"
          className={styles.frameButton}
          data-secondary
          disabled={surface.locked || !surface.canCancel}
          onClick={surface.cancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
  if (compact) return <div className={styles.compactStage}>{panel}</div>;
  return (
    <ResolutionFocusCard
      caption="Pay resources"
      art={source?.imageUrl}
      name={source?.name}
      ready={surface.canConfirm}
      rejected={surface.rejected}
      panelSide="left"
      sceneOwnsCard={sceneOwnsCard}
      reducedMotion={reducedMotion}
    >
      {panel}
    </ResolutionFocusCard>
  );
}
