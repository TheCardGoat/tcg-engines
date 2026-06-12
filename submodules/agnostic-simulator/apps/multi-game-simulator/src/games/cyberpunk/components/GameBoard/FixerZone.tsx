import { IconChevronLeft, IconChevronRight, IconMinus, IconPlus } from "@tabler/icons-react";
import { buildInteractionSubmissionForActionId } from "@tcg/protocol";
import {
  PLAYER_SIDE_TO_ID,
  interactionSubmissionToEngineAction,
  useEngineInteractionView,
  useEngineOptional,
  type GigDieView,
  type Side,
} from "../../engine";
import { ZoneBadge } from "./ZoneBadge";
import { DieDisplay } from "./DieDisplay";
import { simEntityAnchor, simZoneAnchor } from "./animationAnchors";
import classes from "./FixerZone.module.css";

interface FixerZoneProps {
  titlePosition?: "top" | "bottom";
  /**
   * Dice currently in the fixer area. When omitted the zone renders all six
   * standard slots (used as a layout reference / loading state).
   */
  dice?: ReadonlyArray<GigDieView>;
  /** Engine side. Surfaced as `data-side` for e2e queries. */
  side?: Side;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

type SlotDef = {
  key: string;
  dieType: GigDieView["dieType"];
  label: string;
  dieId: string | null;
};

const PLACEHOLDER_SLOTS: SlotDef[] = [
  { key: "d20", dieType: "d20", label: "D20", dieId: null },
  { key: "d12", dieType: "d12", label: "D12", dieId: null },
  { key: "d10", dieType: "d10", label: "D10", dieId: null },
  { key: "d8", dieType: "d8", label: "D8", dieId: null },
  { key: "d6", dieType: "d6", label: "D6", dieId: null },
  { key: "d4", dieType: "d4", label: "D4", dieId: null },
];

/**
 * Per-side fixer area. When the protocol exposes `gainGig`, enabled die
 * candidates render as pulsing buttons. Dice that aren't candidates (today:
 * d20 until it's the only one left) render disabled.
 */
export function FixerZone({
  titlePosition = "bottom",
  dice,
  side,
  collapsed = false,
  onToggleCollapsed,
}: FixerZoneProps) {
  // Hooks always run. When the zone is rendered without an EngineProvider
  // (legacy fixture-only render path), useEngineOptional returns null and the
  // pick-a-die behaviour is inert.
  const engineCtx = useEngineOptional();
  const interactionView = useEngineInteractionView(side ?? "player");
  const gainGigAction = interactionView.actions.find(
    (action) => action.enabled && action.id === "gainGig",
  );
  const dieInput = gainGigAction?.inputs.find(
    (input) => input.kind === "entity-selection" && input.id === "dieId",
  );
  const allowedIds =
    dieInput?.kind === "entity-selection"
      ? new Set(
          dieInput.candidates
            .filter((candidate) => candidate.enabled)
            .map((candidate) => candidate.entity.instanceId),
        )
      : null;
  const isPicker = side !== undefined && Boolean(engineCtx) && allowedIds !== null;

  const handlePick = (dieId: string) => {
    if (!isPicker || !engineCtx || !side) {
      return;
    }
    if (!allowedIds!.has(dieId)) {
      return;
    }
    const submission = buildInteractionSubmissionForActionId({
      view: interactionView,
      actionId: "gainGig",
      values: { dieId },
    });
    if (!submission) {
      return;
    }
    const action = interactionSubmissionToEngineAction(submission, PLAYER_SIDE_TO_ID[side]);
    if (action) {
      engineCtx.dispatch(action);
    }
  };

  const slots: SlotDef[] =
    dice !== undefined
      ? dice.map((d, i) => ({
          key: `${d.id}-${i}`,
          dieType: d.dieType,
          label: d.label,
          dieId: d.id,
        }))
      : PLACEHOLDER_SLOTS;
  const zoneId = side ? `${side}-fixer` : "fixer";

  return (
    <div
      className={`${classes.zone} ${classes[titlePosition]} ${collapsed ? classes.collapsed : ""}`}
      data-testid="fixer-zone"
      data-side={side}
      data-count={dice?.length ?? slots.length}
      data-picking={isPicker ? "true" : "false"}
      data-collapsed={collapsed ? "true" : "false"}
      {...simZoneAnchor({
        id: zoneId,
        side,
        visibility: "public",
        role: "resource",
      })}
    >
      {collapsed ? (
        <button
          type="button"
          className={classes.collapsedToggle}
          data-testid="fixer-toggle"
          aria-label="Show fixer areas"
          title="Show fixer areas"
          aria-pressed="true"
          onClick={onToggleCollapsed}
        >
          {titlePosition === "top" ? (
            <IconChevronLeft size={16} stroke={1.8} />
          ) : (
            <IconChevronRight size={16} stroke={1.8} />
          )}
          <span>Fixer</span>
          <IconPlus size={13} stroke={1.8} />
        </button>
      ) : (
        <>
          {onToggleCollapsed ? (
            <button
              type="button"
              className={classes.collapseToggle}
              data-testid="fixer-toggle"
              aria-label="Hide fixer areas"
              title="Hide fixer areas"
              aria-pressed="false"
              onClick={onToggleCollapsed}
            >
              <IconMinus size={13} stroke={1.8} />
            </button>
          ) : null}
          <div className={classes.diceStack}>
            {slots.map((die) => {
              const candidate = isPicker && die.dieId !== null && allowedIds!.has(die.dieId);
              const stateClass = isPicker
                ? candidate
                  ? classes.candidate
                  : classes.ineligible
                : "";
              return (
                <button
                  key={die.key}
                  type="button"
                  className={`${classes.slotBtn} ${stateClass}`}
                  data-testid="fixer-die"
                  data-die-type={die.dieType}
                  data-die-id={die.dieId ?? undefined}
                  data-candidate={candidate ? "true" : "false"}
                  {...simEntityAnchor({
                    entityId: die.dieId ?? undefined,
                    zoneId,
                    side,
                    face: "public",
                  })}
                  disabled={isPicker && !candidate}
                  onClick={candidate && die.dieId ? () => handlePick(die.dieId!) : undefined}
                  aria-label={candidate ? `Take ${die.label}` : die.label}
                >
                  <DieDisplay dieType={die.dieType} label={die.label} size="sm" />
                </button>
              );
            })}
          </div>
          <ZoneBadge position={titlePosition === "top" ? "top" : "bottom"}>Fixer</ZoneBadge>
        </>
      )}
    </div>
  );
}
