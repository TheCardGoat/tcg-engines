import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

import { cx } from "../class-names";
import classes from "./SimulatorMatchSidebar.module.css";

export interface SimulatorMatchMetric {
  readonly id: string;
  readonly label: string;
  readonly value: ReactNode;
}

interface SimulatorMatchParticipantBase {
  readonly id: string;
  readonly role: "opponent" | "self";
  /** Moves transient state beside the clock so narrow identity rows keep the player name readable. */
  readonly layout?: "stacked";
  readonly ariaLabel?: string;
  readonly testId?: string;
  readonly clock?: ReactNode;
  readonly status?: ReactNode;
  readonly active?: boolean;
  readonly priority?: boolean;
  readonly meta?: ReactNode;
  readonly connection?: ReactNode;
  /** Contextual identity actions supplied by the game surface. */
  readonly actions?: ReactNode;
  readonly metrics?: readonly SimulatorMatchMetric[];
}

export type SimulatorMatchParticipant = SimulatorMatchParticipantBase &
  (
    | {
        readonly name: ReactNode;
        readonly shortLabel: string;
        readonly showAvatar?: true;
      }
    | {
        /** Games without participant imagery may omit synthetic identity chrome entirely. */
        readonly name?: ReactNode;
        readonly shortLabel?: string;
        readonly showAvatar: false;
      }
  );

export interface SimulatorMatchAutomation {
  readonly summary: ReactNode;
  readonly details: ReactNode;
  /** An optional direct control, such as play/pause for automated playback. */
  readonly control?: ReactNode;
  readonly label?: string;
  readonly panelLabel?: string;
}

export type SimulatorActivityTab = "combined" | "log" | "chat" | "secondary";

export interface SimulatorMatchActivity {
  readonly log: ReactNode;
  readonly chat?: ReactNode;
  /** A single chronological activity stream used by the All tab. */
  readonly combined?: ReactNode;
  readonly combinedLabel?: string;
  readonly secondary?: ReactNode;
  readonly logLabel?: string;
  readonly chatLabel?: string;
  readonly secondaryLabel?: string;
  readonly defaultTab?: SimulatorActivityTab;
  readonly activeTab?: SimulatorActivityTab;
  readonly onActiveTabChange?: (tab: SimulatorActivityTab) => void;
}

export interface SimulatorMatchSidebarProps extends HTMLAttributes<HTMLElement> {
  readonly opponent: SimulatorMatchParticipant;
  readonly self: SimulatorMatchParticipant;
  readonly activity: SimulatorMatchActivity;
  readonly activityLabel?: string;
  readonly automation?: SimulatorMatchAutomation;
  /** Game-owned public match context, such as an ordered resolution stack. */
  readonly context?: ReactNode;
  readonly contextLabel?: string;
  readonly actions: SimulatorMatchActions;
}

/**
 * Game-agnostic match chrome with one stable information hierarchy.
 *
 * Games provide vocabulary, values, and controls. The shared layer owns
 * ordering, density, participant semantics, and the flexible activity region.
 */
export function SimulatorMatchSidebar({
  opponent,
  self,
  activity,
  activityLabel = "Activity",
  automation,
  context,
  contextLabel = "Match context",
  actions,
  className,
  ...props
}: SimulatorMatchSidebarProps) {
  const hasCompactParticipants = !opponent.metrics?.length && !self.metrics?.length;

  return (
    <aside
      className={cx(classes.root, className)}
      data-has-automation={automation ? "true" : "false"}
      data-has-context={context ? "true" : "false"}
      data-compact-participants={hasCompactParticipants ? "true" : undefined}
      {...props}
    >
      <SimulatorMatchParticipantView participant={opponent} />
      {automation ? <SimulatorAutomationControl automation={automation} /> : null}
      {context ? (
        <section className={classes.context} aria-label={contextLabel}>
          {context}
        </section>
      ) : null}
      <section className={classes.activity} aria-label={activityLabel}>
        <SimulatorActivityTabs {...activity} />
      </section>
      <section className={classes.matchActions} aria-label="Match actions">
        <SimulatorMatchActionDock {...actions} />
      </section>
      <SimulatorMatchParticipantView participant={self} />
    </aside>
  );
}

const POPOVER_FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function SimulatorAutomationControl({
  automation,
}: {
  readonly automation: SimulatorMatchAutomation;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    panelRef.current?.querySelector<HTMLElement>(POPOVER_FOCUSABLE_SELECTOR)?.focus();

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(POPOVER_FOCUSABLE_SELECTOR) ?? [],
      );
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) {
        event.preventDefault();
        panelRef.current?.focus();
        return;
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <section
      className={classes.automationControls}
      aria-label={automation.label ?? "Automated opponent controls"}
      data-open={open ? "true" : "false"}
    >
      {automation.control ? (
        <div className={classes.automationControl}>{automation.control}</div>
      ) : null}
      <button
        ref={triggerRef}
        type="button"
        className={classes.automationTrigger}
        aria-label={automation.label ?? "Automated opponent controls"}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
      >
        <span className={classes.automationSummary}>{automation.summary}</span>
        <span className={classes.automationChevron} aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>
      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          className={classes.automationPanel}
          role="dialog"
          tabIndex={-1}
          aria-label={automation.panelLabel ?? automation.label ?? "Automated opponent controls"}
        >
          {automation.details}
        </div>
      ) : null}
    </section>
  );
}

export function SimulatorMatchParticipantView({
  participant,
  className,
}: {
  readonly participant: SimulatorMatchParticipant;
  readonly className?: string;
}) {
  const hasVisibleName = participant.name !== undefined && participant.name !== null;

  return (
    <section
      className={cx(classes.participant, className)}
      data-role={participant.role}
      data-active={participant.active ? "true" : undefined}
      data-priority={participant.priority ? "true" : undefined}
      data-has-metrics={participant.metrics?.length ? "true" : "false"}
      data-has-avatar={participant.showAvatar === false ? "false" : "true"}
      data-layout={participant.layout}
      data-has-visible-name={hasVisibleName ? "true" : "false"}
      data-testid={participant.testId}
      aria-label={
        participant.ariaLabel ??
        (participant.role === "self" ? "Your match status" : "Opponent match status")
      }
    >
      <div className={classes.participantLine}>
        {participant.showAvatar !== false ? (
          <div className={classes.avatar} aria-hidden="true">
            {participant.shortLabel}
          </div>
        ) : null}
        <div className={classes.identity}>
          {hasVisibleName ? (
            <div className={classes.nameLine}>
              <strong>{participant.name}</strong>
              {participant.status && participant.layout !== "stacked" ? (
                <span className={classes.status}>{participant.status}</span>
              ) : null}
            </div>
          ) : null}
          {participant.layout === "stacked" && (participant.status || participant.clock) ? (
            <div className={classes.stateLine} data-participant-state-line="true">
              {participant.status ? (
                <span className={classes.status} data-participant-status="true">
                  {participant.status}
                </span>
              ) : null}
              {participant.clock ? (
                <span className={classes.clock} data-participant-clock="true">
                  {participant.clock}
                </span>
              ) : null}
            </div>
          ) : participant.clock ? (
            <div className={classes.clock} data-participant-clock="true">
              {participant.clock}
            </div>
          ) : null}
          {participant.meta ? <div className={classes.meta}>{participant.meta}</div> : null}
        </div>
        {participant.connection ? (
          <div className={classes.connection}>{participant.connection}</div>
        ) : null}
        {participant.actions ? (
          <div className={classes.participantActions} data-participant-actions="true">
            {participant.actions}
          </div>
        ) : null}
      </div>
      {participant.metrics?.length ? (
        <dl
          className={classes.metrics}
          aria-label={participant.role === "self" ? "Your resources" : "Opponent resources"}
          style={
            {
              "--simulator-match-metric-count": participant.metrics.length,
            } as CSSProperties
          }
        >
          {participant.metrics.map((metric) => (
            <div key={metric.id}>
              <dt>{metric.label}</dt>
              <dd>{metric.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}

export interface SimulatorActivityTabsProps extends HTMLAttributes<HTMLDivElement> {
  readonly log: ReactNode;
  readonly chat?: ReactNode;
  /** A single chronological activity stream used by the All tab. */
  readonly combined?: ReactNode;
  readonly secondary?: ReactNode;
  readonly logLabel?: string;
  readonly chatLabel?: string;
  readonly secondaryLabel?: string;
  readonly combinedLabel?: string;
  readonly defaultTab?: SimulatorActivityTab;
  readonly activeTab?: SimulatorActivityTab;
  readonly onActiveTabChange?: (tab: SimulatorActivityTab) => void;
}

export type SimulatorMatchActions = HTMLAttributes<HTMLDivElement> &
  (
    | {
        readonly undo: ReactNode;
        readonly primary: ReactNode;
        readonly controls?: never;
      }
    | {
        readonly controls: ReactNode;
        readonly undo?: never;
        readonly primary?: never;
      }
  ) & {
    readonly danger: ReactNode;
  };
export type SimulatorMatchActionDockProps = SimulatorMatchActions;

/**
 * Stable universal-action geometry. Games keep their native command and
 * confirmation behavior while the shared layer keeps Undo, Pass, and Concede
 * in the same order and at the same reachable size.
 */
export function SimulatorMatchActionDock(props: SimulatorMatchActionDockProps) {
  const { undo, primary, controls, danger, className, ...domProps } = props;
  return (
    <div className={cx(classes.actionDock, className)} {...domProps}>
      {"controls" in props ? (
        controls != null && <div data-action="controls">{controls}</div>
      ) : (
        <>
          <div>{undo}</div>
          <div data-action="primary">{primary}</div>
        </>
      )}
      <div data-action="danger">{danger}</div>
    </div>
  );
}

/** Shared Log/Chat surface used by the desktop activity region and phone sheet. */
export function SimulatorActivityTabs({
  log,
  chat,
  combined,
  secondary,
  logLabel = "Log",
  chatLabel = "Chat",
  secondaryLabel = "More",
  combinedLabel = "All",
  defaultTab = "combined",
  activeTab: controlledActiveTab,
  onActiveTabChange,
  className,
  ...props
}: SimulatorActivityTabsProps) {
  const hasCombinedTab = Boolean(combined);
  const [uncontrolledActiveTab, setUncontrolledActiveTab] = useState<SimulatorActivityTab>(
    defaultTab === "combined" && hasCombinedTab
      ? "combined"
      : defaultTab === "chat" && chat
        ? "chat"
        : defaultTab === "secondary" && secondary
          ? "secondary"
          : "log",
  );
  const tabsId = useId();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const availableTabs = [
    ...(hasCombinedTab ? [{ id: "combined" as const, label: combinedLabel, content: null }] : []),
    { id: "log" as const, label: logLabel, content: log },
    ...(chat ? [{ id: "chat" as const, label: chatLabel, content: chat }] : []),
    ...(secondary ? [{ id: "secondary" as const, label: secondaryLabel, content: secondary }] : []),
  ];
  const requestedActiveTab = controlledActiveTab ?? uncontrolledActiveTab;
  const activeTab = availableTabs.some((tab) => tab.id === requestedActiveTab)
    ? requestedActiveTab
    : "log";
  const activePanelId = `${tabsId}-${activeTab}-panel`;
  const selectTab = (tab: SimulatorActivityTab) => {
    if (controlledActiveTab === undefined) setUncontrolledActiveTab(tab);
    onActiveTabChange?.(tab);
  };
  const onTabKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIndex: number | null = null;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % availableTabs.length;
    if (event.key === "ArrowLeft") {
      nextIndex = (currentIndex - 1 + availableTabs.length) % availableTabs.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = availableTabs.length - 1;
    if (nextIndex === null) return;

    event.preventDefault();
    const nextTab = availableTabs[nextIndex];
    if (!nextTab) return;
    selectTab(nextTab.id);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <div className={cx(classes.activityTabs, className)} {...props}>
      <div className={classes.tabList} role="tablist" aria-label="Match activity">
        {availableTabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${tabsId}-${tab.id}-tab`}
            aria-selected={activeTab === tab.id}
            aria-controls={`${tabsId}-${tab.id}-panel`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => selectTab(tab.id)}
            onKeyDown={(event) => onTabKeyDown(event, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        className={classes.tabPanel}
        id={activePanelId}
        role="tabpanel"
        aria-labelledby={`${tabsId}-${activeTab}-tab`}
      >
        {activeTab === "combined" && combined
          ? combined
          : activeTab === "chat" && chat
            ? chat
            : activeTab === "secondary" && secondary
              ? secondary
              : log}
      </div>
    </div>
  );
}
