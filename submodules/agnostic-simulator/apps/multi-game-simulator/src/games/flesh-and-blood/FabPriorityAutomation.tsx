import { Anchor, Check, ChevronRight, FastForward, Hand, SkipForward } from "lucide-react";
import { Popover } from "@mantine/core";
import { motion } from "motion/react";
import {
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  FAB_PRIORITY_MODE_ACTION_LABEL,
  FAB_PRIORITY_MODES,
} from "@tcg/flesh-and-blood-server-adapter";
import { holdsPassOnlyWindows } from "./priority-automation";
import type { FabPriorityAutomationMode } from "./state";
import { SimulatorParticipantActionButton } from "../../simulator/participant-actions/SimulatorParticipantActions";
import { SimulatorSidebarTip } from "../../simulator/participant-actions/SimulatorSidebarTips";

interface FabPriorityCountdownPresentation {
  readonly windowKey: string;
  readonly durationMs: number;
  readonly onCancel: () => void;
}

const MODE_ICONS: Record<FabPriorityAutomationMode, typeof FastForward> = {
  "auto-pass": FastForward,
  "always-hold": Hand,
  "play-and-skip": SkipForward,
};
export const FAB_PRIORITY_MODE_LABELS: Record<FabPriorityAutomationMode, string> = {
  "auto-pass": "Auto-pass",
  "always-hold": "Hold priority",
  "play-and-skip": "Play & skip",
};
export const FAB_PRIORITY_MODE_BODIES: Record<FabPriorityAutomationMode, string> = {
  "auto-pass": "Immediately pass priority windows where passing is your only legal action.",
  "always-hold": "Stop at every priority window. Pass-only windows use a short countdown.",
  "play-and-skip":
    "Skip your immediate follow-up window after playing, activating, or attacking; hold other windows.",
};

export interface FabSavedOpponentTriggerYield {
  readonly canonicalId: string;
  readonly cardName: string;
  /** True when removal can also be submitted to this match right now. */
  readonly currentMatchRemovalAvailable: boolean;
}

/** Match-level controls that belong in the Game settings tab. */
export function FabPriorityAutomationSettings({
  mode,
  holdArmed = false,
  holdsPriority = false,
  autoOrderTriggers = false,
  autoSelectSingletonTargets = true,
  disabledReason,
  onSelectMode,
  onArmHold,
  onSetAutoOrderTriggers,
  onSetAutoSelectSingletonTargets,
  savedOpponentTriggerYields = [],
  onRemoveOpponentTriggerYield,
}: {
  readonly mode: FabPriorityAutomationMode | null | undefined;
  readonly holdArmed?: boolean | null;
  readonly holdsPriority?: boolean;
  readonly autoOrderTriggers?: boolean;
  readonly autoSelectSingletonTargets?: boolean;
  readonly disabledReason?: string;
  readonly onSelectMode?: (mode: FabPriorityAutomationMode) => void;
  readonly onArmHold?: () => void;
  readonly onSetAutoOrderTriggers?: (enabled: boolean) => void;
  readonly onSetAutoSelectSingletonTargets?: (enabled: boolean) => void;
  readonly savedOpponentTriggerYields?: readonly FabSavedOpponentTriggerYield[];
  readonly onRemoveOpponentTriggerYield?: (canonicalId: string) => void;
}) {
  if (!mode) return null;
  const disabled = Boolean(disabledReason || !onSelectMode);
  const canArm =
    mode === "play-and-skip" && holdsPriority && holdArmed !== true && !disabledReason && onArmHold;
  const groupRef = useRef<HTMLDivElement>(null);
  const onGroupKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight" &&
      event.key !== "ArrowUp" &&
      event.key !== "ArrowDown"
    ) {
      return;
    }
    // The roving reference is the focused radio (native radiogroup
    // semantics): focus can be ahead of the checked radio while an in-flight
    // selection round-trips through the engine, so the mode prop alone would
    // re-derive the same hop and strand rapid key presses.
    const focusedMode = FAB_PRIORITY_MODES.find(
      (candidate) =>
        document.activeElement ===
        groupRef.current?.querySelector(`[data-testid="fab-priority-mode-${candidate}"]`),
    );
    const index = FAB_PRIORITY_MODES.indexOf(focusedMode ?? mode);
    if (index < 0) return;
    event.preventDefault();
    const delta = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
    const next =
      FAB_PRIORITY_MODES[(index + delta + FAB_PRIORITY_MODES.length) % FAB_PRIORITY_MODES.length];
    groupRef.current
      ?.querySelector<HTMLButtonElement>(`[data-testid="fab-priority-mode-${next}"]`)
      ?.focus();
    if (next !== mode) onSelectMode?.(next);
  };

  return (
    <section className="fab-priority-settings" aria-labelledby="fab-priority-settings-title">
      <div className="fab-priority-settings__heading">
        <div>
          <h3 id="fab-priority-settings-title">Priority behavior</h3>
          <p>Choose how the simulator handles windows where you can pass.</p>
        </div>
        {disabledReason ? <small>{disabledReason}</small> : null}
      </div>
      <div
        ref={groupRef}
        className="fab-priority-settings__modes"
        role="radiogroup"
        aria-label="Priority mode"
        onKeyDown={onGroupKeyDown}
      >
        {FAB_PRIORITY_MODES.map((candidate) => {
          const checked = candidate === mode;
          const Icon = MODE_ICONS[candidate];
          return (
            <button
              key={candidate}
              type="button"
              role="radio"
              className="fab-priority-settings__mode"
              data-testid={`fab-priority-mode-${candidate}`}
              aria-checked={checked}
              aria-label={FAB_PRIORITY_MODE_ACTION_LABEL[candidate]}
              tabIndex={checked ? 0 : -1}
              disabled={disabled}
              onClick={() => {
                if (!disabled && !checked) onSelectMode?.(candidate);
              }}
            >
              <span className="fab-priority-settings__icon">
                <Icon aria-hidden="true" size={18} />
              </span>
              <span>
                <strong>{FAB_PRIORITY_MODE_LABELS[candidate]}</strong>
                <small>{FAB_PRIORITY_MODE_BODIES[candidate]}</small>
              </span>
              <span className="fab-priority-settings__check" aria-hidden="true">
                {checked ? <Check size={16} /> : null}
              </span>
            </button>
          );
        })}
      </div>
      {mode === "play-and-skip" ? (
        <div className="fab-priority-settings__hold-next">
          <div>
            <strong>Keep the next follow-up window</strong>
            <small>Useful before a combo when you do not want Play & skip to pass once.</small>
          </div>
          <button
            type="button"
            data-testid="fab-priority-hold-arm"
            disabled={!canArm}
            onClick={() => onArmHold?.()}
          >
            <Anchor aria-hidden="true" size={16} />
            {holdArmed ? "Armed" : "Hold next"}
          </button>
        </div>
      ) : null}
      <div className="fab-priority-settings__auto-order">
        <div>
          <strong>Auto-order simultaneous triggers</strong>
          <small>Uses the listed order whenever you control multiple simultaneous triggers.</small>
        </div>
        <button
          type="button"
          role="switch"
          data-testid="fab-auto-order-triggers"
          aria-checked={autoOrderTriggers}
          aria-label="Auto-order simultaneous triggers"
          title="Automatically uses the listed order for simultaneous triggers. Turn this off here in Game settings."
          disabled={disabled || !onSetAutoOrderTriggers}
          onClick={() => onSetAutoOrderTriggers?.(!autoOrderTriggers)}
        >
          {autoOrderTriggers ? "On" : "Off"}
        </button>
      </div>
      <div className="fab-priority-settings__auto-order">
        <div>
          <strong>Auto-select single targets</strong>
          <small>
            When an ability or effect has only one legal target, choose it automatically. You can
            still undo if nothing hidden was revealed.
          </small>
        </div>
        <button
          type="button"
          role="switch"
          data-testid="fab-auto-select-singleton-targets"
          aria-checked={autoSelectSingletonTargets}
          aria-label="Auto-select single targets"
          title="Automatically selects the only legal target. Turn this off here in Game settings."
          disabled={disabled || !onSetAutoSelectSingletonTargets}
          onClick={() => onSetAutoSelectSingletonTargets?.(!autoSelectSingletonTargets)}
        >
          {autoSelectSingletonTargets ? "On" : "Off"}
        </button>
      </div>
      <div className="fab-priority-settings__saved-yields">
        <div>
          <strong>Saved trigger yields</strong>
          <small>Automatically pass while these opposing card triggers are on top.</small>
        </div>
        {savedOpponentTriggerYields.length === 0 ? (
          <p>No saved opponent trigger yields.</p>
        ) : (
          <ul aria-label="Saved opponent trigger yields">
            {savedOpponentTriggerYields.map((entry) => (
              <li key={entry.canonicalId}>
                <span>
                  <strong>{entry.cardName}</strong>
                  <small>
                    {entry.currentMatchRemovalAvailable
                      ? "Remove from this match and future games."
                      : "Removal applies to future games; this match updates at your next legal priority window."}
                  </small>
                </span>
                <button
                  type="button"
                  aria-label={`Remove saved trigger yield for ${entry.cardName}`}
                  disabled={!onRemoveOpponentTriggerYield}
                  onClick={() => onRemoveOpponentTriggerYield?.(entry.canonicalId)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

interface FabPriorityQuickActionsProps {
  readonly mode: FabPriorityAutomationMode | null | undefined;
  readonly holdArmed?: boolean | null;
  readonly autoOrderTriggers?: boolean;
  readonly autoSelectSingletonTargets?: boolean;
  readonly disabledReason?: string;
  readonly onSelectMode?: (mode: FabPriorityAutomationMode) => void;
  readonly onArmHold?: () => void;
  readonly onSetAutoOrderTriggers?: (enabled: boolean) => void;
  readonly onSetAutoSelectSingletonTargets?: (enabled: boolean) => void;
}

function FabPriorityModeIcon({
  mode,
  size = 15,
}: {
  readonly mode: FabPriorityAutomationMode;
  readonly size?: number;
}) {
  const Icon = MODE_ICONS[mode];
  return <Icon aria-hidden="true" size={size} />;
}

function FabPriorityModeMenuItems({
  mode,
  disabledReason,
  onSelectMode,
  onComplete,
}: FabPriorityQuickActionsProps & { readonly onComplete?: () => void }) {
  return FAB_PRIORITY_MODES.map((candidate) => {
    const selected = candidate === mode;
    return (
      <button
        key={candidate}
        type="button"
        role="menuitemradio"
        className="fab-priority-menu__item"
        data-testid={`fab-priority-menu-mode-${candidate}`}
        aria-checked={selected}
        disabled={!onSelectMode || Boolean(disabledReason)}
        title={disabledReason ?? FAB_PRIORITY_MODE_BODIES[candidate]}
        onClick={() => {
          if (!selected) onSelectMode?.(candidate);
          onComplete?.();
        }}
      >
        <FabPriorityModeIcon mode={candidate} />
        <span>
          <strong>{FAB_PRIORITY_MODE_LABELS[candidate]}</strong>
          <small>{FAB_PRIORITY_MODE_BODIES[candidate]}</small>
        </span>
        <span className="fab-priority-menu__check" aria-hidden="true">
          {selected ? <Check size={14} /> : null}
        </span>
      </button>
    );
  });
}

function HoldNextMenuItem({
  mode,
  holdArmed,
  disabledReason,
  onArmHold,
  onComplete,
}: FabPriorityQuickActionsProps & { readonly onComplete?: () => void }) {
  if (mode !== "play-and-skip") return null;
  const disabled = holdArmed === true || !onArmHold || Boolean(disabledReason);
  const explanation = holdArmed
    ? "The next follow-up priority window is already held."
    : (disabledReason ??
      "Keep your next follow-up priority window instead of skipping it once. The hold clears when you pass.");
  return (
    <button
      type="button"
      role="menuitem"
      className="fab-priority-menu__item fab-priority-menu__hold"
      data-testid="fab-priority-menu-hold-next"
      disabled={disabled}
      title={explanation}
      onClick={() => {
        onArmHold?.();
        onComplete?.();
      }}
    >
      <Anchor aria-hidden="true" size={15} />
      <span>
        <strong>{holdArmed ? "Next window held" : "Hold next window"}</strong>
        <small>{explanation}</small>
      </span>
      <span />
    </button>
  );
}

function RelatedAutomationMenuItems({
  autoOrderTriggers = false,
  autoSelectSingletonTargets = true,
  disabledReason,
  onSetAutoOrderTriggers,
  onSetAutoSelectSingletonTargets,
}: FabPriorityQuickActionsProps) {
  const orderExplanation =
    disabledReason ?? "Use the listed order for simultaneous triggers you control.";
  const targetExplanation =
    disabledReason ?? "Automatically choose the only legal target for an ability or effect.";
  return (
    <div className="fab-priority-menu__related" role="group" aria-label="Related option">
      <span className="fab-priority-menu__related-label">Related option</span>
      <button
        type="button"
        role="menuitemcheckbox"
        className="fab-priority-menu__item fab-priority-menu__suboption"
        data-testid="fab-priority-menu-auto-order-triggers"
        aria-checked={autoOrderTriggers}
        disabled={!onSetAutoOrderTriggers || Boolean(disabledReason)}
        title={orderExplanation}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          onSetAutoOrderTriggers?.(!autoOrderTriggers);
        }}
      >
        <Check aria-hidden="true" size={14} opacity={autoOrderTriggers ? 1 : 0} />
        <span>
          <strong>Auto-order triggers</strong>
          <small>{orderExplanation}</small>
        </span>
        <span className="fab-priority-menu__check" aria-hidden="true">
          {autoOrderTriggers ? "On" : "Off"}
        </span>
      </button>
      <button
        type="button"
        role="menuitemcheckbox"
        className="fab-priority-menu__item fab-priority-menu__suboption"
        data-testid="fab-priority-menu-auto-select-singleton-targets"
        aria-checked={autoSelectSingletonTargets}
        disabled={!onSetAutoSelectSingletonTargets || Boolean(disabledReason)}
        title={targetExplanation}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.stopPropagation();
          onSetAutoSelectSingletonTargets?.(!autoSelectSingletonTargets);
        }}
      >
        <Check aria-hidden="true" size={14} opacity={autoSelectSingletonTargets ? 1 : 0} />
        <span>
          <strong>Auto-select single targets</strong>
          <small>{targetExplanation}</small>
        </span>
        <span className="fab-priority-menu__check" aria-hidden="true">
          {autoSelectSingletonTargets ? "On" : "Off"}
        </span>
      </button>
    </div>
  );
}

/** Compact controls shown beside the viewing player's participant identity. */
export function FabPriorityAutomationQuickControl(props: FabPriorityQuickActionsProps) {
  const { mode, holdArmed, disabledReason, onSelectMode, onArmHold } = props;
  const [open, setOpen] = useState(false);

  if (!mode) return null;
  const modeExplanation = disabledReason ?? FAB_PRIORITY_MODE_BODIES[mode];
  const canShowHold = mode === "play-and-skip";
  const holdExplanation = holdArmed
    ? "The next follow-up priority window is already held."
    : (disabledReason ??
      "Keep your next follow-up priority window instead of skipping it once. The hold clears when you pass.");

  return (
    <div className="fab-priority-quick" data-testid="fab-priority-quick-control">
      {canShowHold ? (
        <SimulatorParticipantActionButton
          type="button"
          className="fab-priority-quick__hold"
          data-testid="fab-priority-quick-hold-next"
          aria-label={holdArmed ? "Next priority window held" : "Hold next priority window"}
          disabled={holdArmed === true || !onArmHold || Boolean(disabledReason)}
          tooltip={
            <span className="fab-priority-action-tooltip">
              <strong>{holdArmed ? "Next window held" : "Hold next window"}</strong>
              <span>{holdExplanation}</span>
            </span>
          }
          onClick={() => onArmHold?.()}
        >
          {holdArmed ? (
            <Check aria-hidden="true" size={14} />
          ) : (
            <Anchor aria-hidden="true" size={14} />
          )}
        </SimulatorParticipantActionButton>
      ) : null}
      <Popover
        opened={open}
        onChange={setOpen}
        position="top-end"
        width={288}
        withinPortal
        withArrow
        zIndex={5100}
        middlewares={{ flip: true, shift: { padding: 8 } }}
        transitionProps={{ duration: 0 }}
      >
        <Popover.Target>
          <span aria-label="Priority behavior" className="fab-priority-quick__target">
            <SimulatorSidebarTip id="priority">
              <SimulatorParticipantActionButton
                type="button"
                className="fab-priority-quick__mode"
                aria-label={`Priority behavior: ${FAB_PRIORITY_MODE_LABELS[mode]}`}
                aria-haspopup="menu"
                aria-expanded={open}
                disabled={!onSelectMode || Boolean(disabledReason)}
                tooltip={
                  <span className="fab-priority-action-tooltip">
                    <strong>{FAB_PRIORITY_MODE_LABELS[mode]}</strong>
                    <span>{modeExplanation}</span>
                  </span>
                }
                onClick={() => setOpen((current) => !current)}
              >
                <FabPriorityModeIcon mode={mode} />
              </SimulatorParticipantActionButton>
            </SimulatorSidebarTip>
          </span>
        </Popover.Target>
        <Popover.Dropdown
          className="fab-priority-menu fab-priority-quick__menu"
          role="menu"
          aria-label="Priority behavior"
        >
          <FabPriorityModeMenuItems {...props} onComplete={() => setOpen(false)} />
          <RelatedAutomationMenuItems {...props} />
        </Popover.Dropdown>
      </Popover>
    </div>
  );
}

/** Nested priority submenu injected into the existing player overflow menu. */
export function FabPriorityAutomationParticipantMenu({
  onComplete,
  ...props
}: FabPriorityQuickActionsProps & { readonly onComplete?: () => void }) {
  const [open, setOpen] = useState(false);
  if (!props.mode) return null;
  return (
    <div className="fab-priority-participant-menu" data-open={open ? "true" : undefined}>
      <button
        type="button"
        role="menuitem"
        className="fab-priority-participant-menu__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <FabPriorityModeIcon mode={props.mode} size={16} />
        <span>Priority behavior</span>
        <small>{FAB_PRIORITY_MODE_LABELS[props.mode]}</small>
        <ChevronRight aria-hidden="true" size={15} />
      </button>
      {open ? (
        <div
          className="fab-priority-menu fab-priority-participant-menu__submenu"
          role="menu"
          aria-label="Priority behavior"
        >
          <FabPriorityModeMenuItems {...props} onComplete={onComplete} />
          <RelatedAutomationMenuItems {...props} />
          <HoldNextMenuItem {...props} onComplete={onComplete} />
        </div>
      ) : null}
    </div>
  );
}

/** Empty-board right-click menu with a nested Priority behavior submenu. */
export function FabBoardContextMenu({
  x,
  y,
  onClose,
  ...props
}: FabPriorityQuickActionsProps & {
  readonly x: number;
  readonly y: number;
  readonly onClose: () => void;
}) {
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: x, top: y });

  useLayoutEffect(() => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPosition({
      left: Math.max(8, Math.min(x, window.innerWidth - rect.width - 8)),
      top: Math.max(8, Math.min(y, window.innerHeight - rect.height - 8)),
    });
  }, [submenuOpen, x, y]);

  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && !ref.current?.contains(target)) onClose();
    };
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("pointerdown", closeOutside, true);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside, true);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  if (!props.mode) return null;
  return createPortal(
    <div
      ref={ref}
      className="fab-board-context-menu"
      style={{ left: position.left, top: position.top }}
      role="menu"
      aria-label="Board actions"
      data-testid="fab-board-context-menu"
      onContextMenu={(event: ReactMouseEvent) => event.preventDefault()}
    >
      <button
        type="button"
        role="menuitem"
        className="fab-board-context-menu__trigger"
        aria-haspopup="menu"
        aria-expanded={submenuOpen}
        onClick={() => setSubmenuOpen((current) => !current)}
      >
        <FabPriorityModeIcon mode={props.mode} size={16} />
        <span>
          <strong>Priority behavior</strong>
          <small>{FAB_PRIORITY_MODE_LABELS[props.mode]}</small>
        </span>
        <ChevronRight aria-hidden="true" size={15} />
      </button>
      {submenuOpen ? (
        <div
          className="fab-priority-menu fab-board-context-menu__submenu"
          role="menu"
          aria-label="Priority behavior"
        >
          <FabPriorityModeMenuItems {...props} onComplete={onClose} />
          <RelatedAutomationMenuItems {...props} />
        </div>
      ) : null}
      <HoldNextMenuItem {...props} onComplete={onClose} />
    </div>,
    document.body,
  );
}

/** In-match quick control: only the active countdown cancel replaces Undo. */
export function FabPriorityAutomationControl({
  mode,
  countdown,
}: {
  readonly mode: FabPriorityAutomationMode | null | undefined;
  readonly countdown?: FabPriorityCountdownPresentation;
}) {
  const [announcement, setAnnouncement] = useState("");
  const [remainingMs, setRemainingMs] = useState(countdown?.durationMs ?? 0);

  useEffect(() => {
    if (!countdown) {
      setRemainingMs(0);
      return;
    }
    const startedAt = Date.now();
    setRemainingMs(countdown.durationMs);
    const tick = window.setInterval(
      () => setRemainingMs(Math.max(0, countdown.durationMs - (Date.now() - startedAt))),
      250,
    );
    return () => window.clearInterval(tick);
  }, [countdown?.durationMs, countdown?.windowKey]);

  if (!mode || !countdown || !holdsPassOnlyWindows(mode)) return null;
  const seconds = Math.ceil(remainingMs / 1000);
  return (
    <>
      <div
        className="fab-priority-automation"
        data-testid="fab-priority-automation-toggle"
        data-mode={mode}
        data-countdown="true"
        data-window-key={countdown.windowKey}
        role="group"
        aria-label="Priority automation"
      >
        <button
          type="button"
          className="fab-priority-automation__button"
          data-countdown="true"
          aria-label={`Hold priority; passing in ${seconds} seconds`}
          title="Stop the automatic pass for this priority window."
          onPointerDown={(event) => event.stopPropagation()}
          onClick={(event) => {
            event.preventDefault();
            event.stopPropagation();
            countdown.onCancel();
            setAnnouncement("Automatic priority pass cancelled for this window");
          }}
        >
          <motion.span
            key={countdown.windowKey}
            className="fab-priority-automation__progress"
            initial={{ transform: "translate3d(0, 0, 0) scaleX(1)" }}
            animate={{ transform: "translate3d(0, 0, 0) scaleX(0)" }}
            transition={{ duration: countdown.durationMs / 1_000, ease: "linear" }}
          />
          <Hand aria-hidden="true" size={15} />
          <span className="fab-priority-automation__label">Hold</span>
          <kbd aria-hidden="true">Esc</kbd>
          <span className="fab-priority-automation__seconds" aria-hidden="true">
            {seconds}s
          </span>
        </button>
      </div>
      <span className="fab-visually-hidden" role="status" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
    </>
  );
}
