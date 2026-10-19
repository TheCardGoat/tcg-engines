import { useEffect, type ReactNode } from "react";
import type { InteractionOption } from "@tcg/protocol";
import {
  resolveInteractionText,
  useInteractionDraft,
  useInteractionSurface,
} from "@tcg/simulator-ui";
import styles from "./Arena3D/arena3d.module.css";

/** Route chip labels stay stable for QA and assistive tech; the option text rides along. */
export function costRouteChipLabel(option: InteractionOption): string {
  if (option.id === "normal")
    return option.text.key.startsWith("Required") ? "Additional (required)" : "Normal";
  if (option.id === "alternative") return "Alternative";
  return "Additional";
}

function CastAction({
  children,
  onClick,
  disabled,
  subtle,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  subtle?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`${styles.castAction} ${subtle ? styles.castActionSubtle : ""}`}
    >
      {children}
    </button>
  );
}

/**
 * Route choice for cost-route cards: the declared card holds center stage over
 * a dimmed board while the route is staged. Once a route is chosen the shared
 * PaymentStage owns the resource payment; this panel only ever stages the route.
 * Esc cancels.
 */
export function CostRouteCastPrompt({
  surface,
  card,
  compact,
}: {
  surface: ReturnType<typeof useInteractionSurface>;
  card?: { name: string; imageUrl: string };
  compact?: boolean;
}) {
  const draft = useInteractionDraft();
  const action = surface.action;
  const route = action?.inputs.find((candidate) => candidate.id === "costRoute");

  useEffect(() => {
    if (!surface.canCancel) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") surface.cancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [surface.canCancel, surface.cancel]);

  if (!action || surface.input?.id !== "costRoute" || route?.kind !== "option-selection")
    return null;
  return (
    <div className={styles.castLayer}>
      <div className={styles.castScrim} aria-hidden />
      <section
        aria-label="Cast payment"
        className={styles.cast}
        data-compact={compact || undefined}
      >
        {card && (
          <div className={styles.castCard}>
            <img src={card.imageUrl} alt="" draggable={false} />
            <span className={styles.castCardName}>{card.name}</span>
          </div>
        )}
        <div className={styles.castChips} aria-label="Cost route">
          {route.options.map((option) => {
            const selected = Array.isArray(draft.values.costRoute)
              ? draft.values.costRoute.includes(option.id)
              : false;
            return (
              <button
                key={option.id}
                type="button"
                className={styles.castChip}
                aria-label={costRouteChipLabel(option)}
                aria-pressed={selected}
                disabled={surface.locked || option.enabled === false}
                title={option.text.key}
                onClick={() => {
                  if (!selected) draft.change(route.id, [option.id]);
                }}
              >
                {costRouteChipLabel(option)}
                <small>{option.text.key}</small>
              </button>
            );
          })}
        </div>
        <div className={styles.castStep}>
          <p>{resolveInteractionText(action.text)}</p>
          {surface.rejected && (
            <p className={styles.castRejected}>
              Payment rejected. Change your choices and try again.
            </p>
          )}
        </div>
        <div className={styles.castActions}>
          <CastAction subtle onClick={() => surface.cancel()} disabled={!surface.canCancel}>
            Cancel
          </CastAction>
        </div>
      </section>
    </div>
  );
}
