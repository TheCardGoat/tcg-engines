import {
  Bug,
  Flag,
  Gamepad2,
  Lightbulb,
  MessageSquare,
  MoreHorizontal,
  Settings,
  UserPlus,
  UserRound,
  X,
} from "lucide-react";
import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { Popover, Text, Tooltip } from "@mantine/core";
import type { PlayableGameSlug } from "@tcg/protocol";
import { SimulatorSidebarIconButton, useSimulatorViewportLayout } from "@tcg/simulator-ui";

import { apiUrl } from "../../runtime/gameRuntimeApi";
import { AnimationSpeedControl, useSimulatorSettings } from "../settings";
import classes from "./SimulatorParticipantActions.module.css";

const REPORT_REASONS = [
  { value: "stalling", label: "Stalling" },
  { value: "abusive_chat", label: "Abusive chat" },
  { value: "exploit", label: "Exploit" },
  { value: "collusion", label: "Collusion" },
  { value: "inappropriate_name", label: "Inappropriate name" },
  { value: "intentional_disconnect", label: "Intentional disconnect" },
  { value: "other", label: "Other" },
] as const;

type RequestState = "idle" | "loading" | "done";
type SupportDialogKind = "bug" | "feature" | "feedback";

const SUPPORT_DIALOG_COPY: Record<
  SupportDialogKind,
  { readonly title: string; readonly description: string; readonly placeholder: string }
> = {
  bug: {
    title: "Report bug",
    description: "Tell us what went wrong. The current match context is included automatically.",
    placeholder: "What happened?",
  },
  feature: {
    title: "Request feature",
    description: "Tell us what would make this simulator more useful.",
    placeholder: "What should we add or improve?",
  },
  feedback: {
    title: "Share feedback",
    description: "Tell us what would make the match experience better.",
    placeholder: "What should we improve?",
  },
};

export interface SimulatorHumanParticipantIdentity {
  readonly kind: "human";
  readonly gameProfileId: string;
  readonly userId?: string;
  readonly displayName: string;
  readonly connected?: boolean;
  readonly profileHref?: string;
}

export interface SimulatorBotParticipantIdentity {
  readonly kind: "bot";
  readonly displayName: string;
}

export interface SimulatorLocalParticipantIdentity {
  readonly kind: "local";
  readonly displayName: string;
}

export type SimulatorParticipantIdentity =
  | SimulatorHumanParticipantIdentity
  | SimulatorBotParticipantIdentity
  | SimulatorLocalParticipantIdentity;

export interface SimulatorMatchIdentityContext {
  readonly matchId: string;
  readonly gameId: string;
  readonly gameSlug: PlayableGameSlug;
}

export interface SimulatorSupportContext {
  readonly source: string;
  readonly gameSlug: PlayableGameSlug;
  readonly matchId?: string;
  readonly gameId?: string;
  readonly stateVersion?: number;
  readonly turn?: number;
}

export interface SimulatorGameConfigurationAction {
  readonly label?: string;
  readonly title?: string;
  readonly description?: string;
  readonly confirmLabel?: string;
  readonly requiresConfirmation?: boolean;
  /** Match-scoped settings rendered inside the unified Game tab. */
  readonly settings?: ReactNode;
  readonly onSelect: () => void;
}

export function SimulatorParticipantConnectionStatus({
  displayName,
  status,
}: {
  readonly displayName: string;
  readonly status: "connected" | "reconnecting" | "disconnected" | "unknown";
}) {
  const stateLabel =
    status === "connected"
      ? "online"
      : status === "reconnecting"
        ? "reconnecting"
        : status === "disconnected"
          ? "offline"
          : "connection unknown";
  const label = `${displayName} is ${stateLabel}`;
  return (
    <Popover position="bottom-start" withinPortal withArrow zIndex={5100}>
      <Popover.Target>
        <Tooltip label={label} zIndex={5100} events={{ hover: true, focus: true, touch: false }}>
          <button type="button" className={classes.connectionTrigger} aria-label={label}>
            <span className={classes.connectionDot} data-status={status} aria-hidden="true" />
          </button>
        </Tooltip>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="sm">{label}</Text>
      </Popover.Dropdown>
    </Popover>
  );
}

function readResponseMessage(response: Response, fallback: string): Promise<string> {
  return response
    .json()
    .then((body: unknown) => {
      if (!body || typeof body !== "object") return fallback;
      const value = body as { message?: unknown; error?: unknown };
      return typeof value.message === "string"
        ? value.message
        : typeof value.error === "string"
          ? value.error
          : fallback;
    })
    .catch(() => fallback);
}

function useEscape(onClose: () => void): void {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);
}

/** Shared compact trigger used by participant-row actions across games. */
export const SimulatorParticipantActionButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & {
    readonly tooltip?: ReactNode;
  }
>(function SimulatorParticipantActionButton(
  { className, tooltip, onBlur, onClick, onFocus, onPointerEnter, onPointerLeave, ...props },
  ref,
) {
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const tooltipId = useId();
  const [tooltipPosition, setTooltipPosition] = useState<{
    readonly left: number;
    readonly top: number;
    readonly side: "top" | "bottom";
  } | null>(null);

  const setButtonRef = (node: HTMLButtonElement | null) => {
    buttonRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) (ref as { current: HTMLButtonElement | null }).current = node;
  };
  const showTooltip = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!tooltip || !rect) return;
    const width = Math.min(248, window.innerWidth - 16);
    const side = rect.top >= 104 ? "top" : "bottom";
    setTooltipPosition({
      left: Math.max(
        8,
        Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 8),
      ),
      top: side === "top" ? rect.top - 8 : rect.bottom + 8,
      side,
    });
  };
  const button = (
    <SimulatorSidebarIconButton
      ref={setButtonRef}
      {...props}
      className={className}
      aria-describedby={tooltip && tooltipPosition ? tooltipId : props["aria-describedby"]}
      onBlur={(event) => {
        setTooltipPosition(null);
        onBlur?.(event);
      }}
      onFocus={(event) => {
        showTooltip();
        onFocus?.(event);
      }}
      onClick={(event) => {
        setTooltipPosition(null);
        onClick?.(event);
      }}
      onPointerEnter={(event) => {
        showTooltip();
        onPointerEnter?.(event);
      }}
      onPointerLeave={(event) => {
        setTooltipPosition(null);
        onPointerLeave?.(event);
      }}
    />
  );
  return (
    <>
      {button}
      {tooltip && tooltipPosition
        ? createPortal(
            <span
              id={tooltipId}
              className={classes.actionTooltip}
              data-side={tooltipPosition.side}
              role="tooltip"
              style={{ left: tooltipPosition.left, top: tooltipPosition.top }}
            >
              {tooltip}
            </span>,
            document.body,
          )
        : null}
    </>
  );
});

function DialogShell({
  title,
  onClose,
  children,
  actions,
}: {
  readonly title: string;
  readonly onClose: () => void;
  readonly children: ReactNode;
  readonly actions?: ReactNode;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  useEscape(onClose);

  useEffect(() => {
    previousFocus.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();
    return () => previousFocus.current?.focus();
  }, []);

  return createPortal(
    <div
      className={classes.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section className={classes.dialog} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className={classes.dialogHeader}>
          <h2 id={titleId}>{title}</h2>
          <button
            ref={closeRef}
            type="button"
            className={classes.iconButton}
            aria-label={`Close ${title.toLowerCase()}`}
            onClick={onClose}
          >
            <X aria-hidden="true" size={18} />
          </button>
        </header>
        {children}
        {actions ? <footer className={classes.dialogActions}>{actions}</footer> : null}
      </section>
    </div>,
    document.body,
  );
}

function ParticipantMenu({
  label,
  title,
  subtitle,
  children,
  message,
  messageTone,
}: {
  readonly label: string;
  readonly title: string;
  readonly subtitle: string;
  readonly children: (close: () => void) => ReactNode;
  readonly message?: string | null;
  readonly messageTone?: "error";
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEscape(() => setOpen(false));

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const trigger = triggerRef.current;
    const place = () => {
      const rect = trigger.getBoundingClientRect();
      const width = Math.min(272, window.innerWidth - 16);
      const height = Math.min(
        menuRef.current?.getBoundingClientRect().height ?? 280,
        window.innerHeight - 16,
      );
      const below = rect.bottom + 6;
      const above = rect.top - height - 6;
      const top =
        below + height <= window.innerHeight - 8
          ? below
          : above >= 8
            ? above
            : Math.max(8, window.innerHeight - height - 8);
      setPosition({
        top,
        left: Math.max(8, Math.min(rect.right - width, window.innerWidth - width - 8)),
      });
    };
    const closeFromOutside = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!menuRef.current?.contains(target) && !trigger.contains(target)) setOpen(false);
    };
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    document.addEventListener("pointerdown", closeFromOutside);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      document.removeEventListener("pointerdown", closeFromOutside);
    };
  }, [open]);

  const menu = open
    ? createPortal(
        <div
          ref={menuRef}
          className={classes.menu}
          role="menu"
          aria-label={label}
          style={{ top: position.top, left: position.left }}
        >
          <header className={classes.menuHeader}>
            <strong>{title}</strong>
            <span>{subtitle}</span>
          </header>
          <div className={classes.menuGroup}>{children(() => setOpen(false))}</div>
          {message ? (
            <p className={classes.menuMessage} data-tone={messageTone} role="status">
              {message}
            </p>
          ) : null}
        </div>,
        document.body,
      )
    : null;

  return (
    <>
      <SimulatorParticipantActionButton
        ref={triggerRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        tooltip={label}
        onClick={() => setOpen((value) => !value)}
      >
        <MoreHorizontal aria-hidden="true" size={18} />
      </SimulatorParticipantActionButton>
      {menu}
    </>
  );
}

function ReportPlayerDialog({
  participant,
  match,
  onClose,
  onSubmitted,
}: {
  readonly participant: SimulatorHumanParticipantIdentity;
  readonly match: SimulatorMatchIdentityContext;
  readonly onClose: () => void;
  readonly onSubmitted: () => void;
}) {
  const [reason, setReason] = useState<(typeof REPORT_REASONS)[number]["value"]>("stalling");
  const [details, setDetails] = useState("");
  const [state, setState] = useState<RequestState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (state === "loading") return;
    setState("loading");
    setError(null);
    try {
      const response = await fetch(apiUrl("platform", "/moderation/player-reports"), {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          reportedGameProfileId: participant.gameProfileId,
          matchId: match.matchId,
          gameId: match.gameId,
          reason,
          details: details.trim() || undefined,
        }),
      });
      if (!response.ok)
        throw new Error(await readResponseMessage(response, "Could not submit report."));
      setState("done");
      onSubmitted();
      onClose();
    } catch (cause) {
      setState("idle");
      setError(cause instanceof Error ? cause.message : "Could not submit report.");
    }
  }

  return (
    <DialogShell title={`Report ${participant.displayName}`} onClose={onClose}>
      <form onSubmit={submit}>
        <div className={classes.dialogBody}>
          <p className={classes.dialogDescription}>
            Reports include this match and game so moderators can review the relevant activity.
          </p>
          <label className={classes.field}>
            <span>Reason</span>
            <select
              value={reason}
              onChange={(event) => setReason(event.currentTarget.value as typeof reason)}
            >
              {REPORT_REASONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className={classes.field}>
            <span>Details</span>
            <textarea
              value={details}
              onChange={(event) => setDetails(event.currentTarget.value)}
              maxLength={2000}
              rows={5}
              placeholder="What happened?"
            />
          </label>
          {error ? (
            <p className={classes.dialogError} role="alert">
              {error}
            </p>
          ) : null}
        </div>
        <footer className={classes.dialogActions}>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={state === "loading"}>
            {state === "loading" ? "Submitting…" : "Submit report"}
          </button>
        </footer>
      </form>
    </DialogShell>
  );
}

function SupportDialog({
  kind,
  context,
  platform,
  onClose,
  onSubmitted,
}: {
  readonly kind: SupportDialogKind;
  readonly context: SimulatorSupportContext;
  readonly platform: "mobile" | "desktop";
  readonly onClose: () => void;
  readonly onSubmitted: (message: string) => void;
}) {
  const copy = SUPPORT_DIALOG_COPY[kind];
  const [message, setMessage] = useState("");
  const [state, setState] = useState<RequestState>("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const text = message.trim();
    if (!text || state === "loading") return;
    setState("loading");
    setError(null);
    try {
      const isBug = kind === "bug";
      const response = await fetch(
        apiUrl("platform", isBug ? "/feedback/bug-reports" : "/feedback"),
        {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: isBug
            ? JSON.stringify({
                description: text,
                source: context.source,
                context: {
                  gameSlug: context.gameSlug,
                  matchId: context.matchId,
                  gameId: context.gameId,
                  stateVersion: context.stateVersion,
                  turn: context.turn,
                  platform,
                },
              })
            : JSON.stringify({
                message: kind === "feature" ? `Feature request: ${text}` : text,
                source: context.source,
              }),
        },
      );
      if (!response.ok) {
        throw new Error(await readResponseMessage(response, "Could not send this right now."));
      }
      setState("done");
      onSubmitted(
        kind === "bug"
          ? "Bug report submitted. Thanks for helping us improve."
          : kind === "feature"
            ? "Feature request submitted. Thanks for the idea."
            : "Feedback submitted. Thanks for sharing it.",
      );
      onClose();
    } catch (cause) {
      setState("idle");
      setError(cause instanceof Error ? cause.message : "Could not send this right now.");
    }
  }

  return (
    <DialogShell title={copy.title} onClose={onClose}>
      <form onSubmit={submit}>
        <div className={classes.dialogBody}>
          <p className={classes.dialogDescription}>{copy.description}</p>
          <label className={classes.field}>
            <span>{kind === "bug" ? "Description" : "Message"}</span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.currentTarget.value)}
              maxLength={4000}
              rows={6}
              placeholder={copy.placeholder}
              required
            />
          </label>
          {error ? (
            <p className={classes.dialogError} role="alert">
              {error}
            </p>
          ) : null}
        </div>
        <footer className={classes.dialogActions}>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" disabled={state === "loading" || message.trim().length === 0}>
            {state === "loading" ? "Sending…" : "Send"}
          </button>
        </footer>
      </form>
    </DialogShell>
  );
}

const SETTINGS_TABS = [
  ["simulator", "Simulator"],
  ["game", "Game"],
  ["account", "Account"],
] as const;

// SETTINGS PARITY: keep in sync with the platform web app's PlayerSettingsDialog.svelte.
// Keep persistent controls/options in sync; see docs/implementation/settings-inventory-and-plan.md.
export function SimulatorSettingsDialog({
  gameConfiguration,
  accountSettingsHref,
  onOpenGameConfiguration,
  showCardInteraction = true,
  onClose,
}: {
  readonly gameConfiguration: SimulatorGameConfigurationAction;
  readonly accountSettingsHref: string;
  readonly onOpenGameConfiguration?: () => void;
  readonly showCardInteraction?: boolean;
  readonly onClose: () => void;
}) {
  const { settings, setSoundVolume, setCardInteractionMode } = useSimulatorSettings();
  const [activeTab, setActiveTab] = useState<"simulator" | "game" | "account">("simulator");
  const tablistRef = useRef<HTMLDivElement>(null);

  // ARIA tabs pattern: arrows (plus Home/End) move both selection and focus;
  // all panels stay mounted with `hidden` so `aria-controls` ids always resolve.
  const onTablistKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight" &&
      event.key !== "ArrowUp" &&
      event.key !== "ArrowDown" &&
      event.key !== "Home" &&
      event.key !== "End"
    ) {
      return;
    }
    event.preventDefault();
    const tabs = SETTINGS_TABS.map(([id]) => id);
    const currentIndex = Math.max(0, tabs.indexOf(activeTab));
    let nextIndex: number;
    if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    else {
      const delta = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
      nextIndex = (currentIndex + delta + tabs.length) % tabs.length;
    }
    const next = tabs[nextIndex];
    setActiveTab(next);
    tablistRef.current
      ?.querySelector<HTMLButtonElement>(`#simulator-settings-tab-${next}`)
      ?.focus();
  };

  return (
    <DialogShell title="Settings" onClose={onClose}>
      <div
        ref={tablistRef}
        className={classes.settingsTabs}
        role="tablist"
        aria-label="Settings sections"
        onKeyDown={onTablistKeyDown}
      >
        {SETTINGS_TABS.map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            aria-controls={`simulator-settings-panel-${id}`}
            id={`simulator-settings-tab-${id}`}
            tabIndex={activeTab === id ? 0 : -1}
            onClick={() => setActiveTab(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div
        className={classes.settingsPanel}
        id="simulator-settings-panel-simulator"
        role="tabpanel"
        aria-labelledby="simulator-settings-tab-simulator"
        hidden={activeTab !== "simulator"}
      >
        <div className={classes.dialogBody}>
          <label className={classes.field}>
            <span>Sound volume</span>
            <div className={classes.rangeRow}>
              <input
                type="range"
                min={0}
                max={100}
                step={1}
                value={settings.soundVolume}
                aria-label="Sound volume"
                onChange={(event) => setSoundVolume(event.currentTarget.valueAsNumber)}
              />
              <output>{settings.soundVolume}%</output>
            </div>
          </label>
          <AnimationSpeedControl />
          {showCardInteraction ? (
            <fieldset className={classes.field}>
              <legend>Card interaction</legend>
              <div className={classes.segmented}>
                <label>
                  <input
                    type="radio"
                    name="simulator-card-interaction"
                    checked={settings.cardInteractionMode === "quick"}
                    onChange={() => setCardInteractionMode("quick")}
                  />
                  Quick
                </label>
                <label>
                  <input
                    type="radio"
                    name="simulator-card-interaction"
                    checked={settings.cardInteractionMode === "detailed"}
                    onChange={() => setCardInteractionMode("detailed")}
                  />
                  Detailed
                </label>
              </div>
            </fieldset>
          ) : null}
        </div>
      </div>
      <div
        className={classes.settingsPanel}
        id="simulator-settings-panel-game"
        role="tabpanel"
        aria-labelledby="simulator-settings-tab-game"
        hidden={activeTab !== "game"}
      >
        <div className={classes.dialogBody}>
          {gameConfiguration.settings}
          {onOpenGameConfiguration ? (
            <section className={classes.settingsAction}>
              <div>
                <strong>{gameConfiguration.label ?? "Game configuration"}</strong>
                <p>
                  {gameConfiguration.description ??
                    "Change the game, deck, and match configuration for your next session."}
                </p>
              </div>
              <button type="button" onClick={onOpenGameConfiguration}>
                {gameConfiguration.confirmLabel ?? "Open configuration"}
              </button>
            </section>
          ) : null}
        </div>
      </div>
      <div
        className={classes.settingsPanel}
        id="simulator-settings-panel-account"
        role="tabpanel"
        aria-labelledby="simulator-settings-tab-account"
        hidden={activeTab !== "account"}
      >
        <div className={classes.dialogBody}>
          <section className={classes.settingsAction}>
            <div>
              <strong>Account settings</strong>
              <p>Manage your profile, security, and account-wide preferences.</p>
            </div>
            <a href={accountSettingsHref}>Open account settings</a>
          </section>
        </div>
      </div>
    </DialogShell>
  );
}

function ChangeGameDialog({
  action,
  onClose,
}: {
  readonly action: SimulatorGameConfigurationAction;
  readonly onClose: () => void;
}) {
  return (
    <DialogShell
      title={action.title ?? "Change game configuration?"}
      onClose={onClose}
      actions={
        <>
          <button type="button" onClick={onClose}>
            Keep playing
          </button>
          <button
            type="button"
            data-primary="true"
            onClick={() => {
              onClose();
              action.onSelect();
            }}
          >
            {action.confirmLabel ?? "Continue"}
          </button>
        </>
      }
    >
      <div className={classes.dialogBody}>
        <p className={classes.dialogDescription}>
          {action.description ?? "Open the game-specific configuration for this simulator."}
        </p>
      </div>
    </DialogShell>
  );
}

export function SimulatorOpponentParticipantActions({
  participant,
  match,
  takeoverActive = false,
  onToggleTakeover,
}: {
  readonly participant: SimulatorParticipantIdentity;
  readonly match?: SimulatorMatchIdentityContext;
  readonly takeoverActive?: boolean;
  readonly onToggleTakeover?: () => void;
}) {
  const [friendState, setFriendState] = useState<RequestState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<"error" | undefined>();
  const [reportOpen, setReportOpen] = useState(false);

  async function addFriend(): Promise<void> {
    if (participant.kind !== "human" || !participant.userId || !match || friendState !== "idle")
      return;
    setFriendState("loading");
    setMessage(null);
    setMessageTone(undefined);
    try {
      const response = await fetch(
        apiUrl("platform", `/friends/by-user/${encodeURIComponent(participant.userId)}`),
        {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ matchId: match.matchId, gameId: match.gameId }),
        },
      );
      if (!response.ok)
        throw new Error(await readResponseMessage(response, "Could not add friend."));
      setFriendState("done");
      setMessage(`${participant.displayName} is now in your friends list.`);
    } catch (cause) {
      setFriendState("idle");
      setMessageTone("error");
      setMessage(cause instanceof Error ? cause.message : "Could not add friend.");
    }
  }

  const subtitle =
    participant.kind === "bot"
      ? "Automated opponent"
      : participant.kind === "local"
        ? "Local seat"
        : participant.connected === undefined
          ? "Player"
          : participant.connected
            ? "Online"
            : "Offline";

  return (
    <>
      <ParticipantMenu
        label={`Open ${participant.displayName} actions`}
        title={participant.displayName}
        subtitle={subtitle}
        message={message}
        messageTone={messageTone}
      >
        {(close) => (
          <>
            {participant.kind === "human" ? (
              <>
                <a
                  className={classes.menuItem}
                  role="menuitem"
                  href={
                    participant.profileHref ??
                    `/${match?.gameSlug ?? "platform"}/users/${encodeURIComponent(participant.gameProfileId)}`
                  }
                >
                  <UserRound aria-hidden="true" size={16} />
                  <span>View profile</span>
                </a>
                {participant.userId && match ? (
                  <button
                    type="button"
                    role="menuitem"
                    className={classes.menuItem}
                    disabled={friendState === "loading" || friendState === "done"}
                    onClick={() => void addFriend()}
                  >
                    <UserPlus aria-hidden="true" size={16} />
                    <span>
                      {friendState === "done"
                        ? "Friend added"
                        : friendState === "loading"
                          ? "Adding…"
                          : "Add friend"}
                    </span>
                  </button>
                ) : null}
                {match ? (
                  <button
                    type="button"
                    role="menuitem"
                    className={classes.menuItem}
                    data-danger="true"
                    onClick={() => {
                      close();
                      setReportOpen(true);
                    }}
                  >
                    <Flag aria-hidden="true" size={16} />
                    <span>Report player</span>
                  </button>
                ) : null}
              </>
            ) : onToggleTakeover ? (
              <button
                type="button"
                role="menuitem"
                className={classes.menuItem}
                onClick={() => {
                  close();
                  onToggleTakeover();
                }}
              >
                <Gamepad2 aria-hidden="true" size={16} />
                <span>{takeoverActive ? "Return opponent to bot" : "Control opponent"}</span>
              </button>
            ) : null}
          </>
        )}
      </ParticipantMenu>
      {reportOpen && participant.kind === "human" && match ? (
        <ReportPlayerDialog
          participant={participant}
          match={match}
          onClose={() => setReportOpen(false)}
          onSubmitted={() => {
            setMessageTone(undefined);
            setMessage("Report submitted. Moderators will review this match.");
          }}
        />
      ) : null}
    </>
  );
}

export function SimulatorSelfParticipantActions({
  gameConfiguration,
  support,
  accountSettingsHref = "/dashboard/settings",
  matchMenuItems,
  menuHost,
  viewportLayout,
}: {
  readonly gameConfiguration: SimulatorGameConfigurationAction;
  readonly support: SimulatorSupportContext;
  readonly accountSettingsHref?: string;
  /** Match-owned quick actions rendered before the shared settings/support items. */
  readonly matchMenuItems?: (close: () => void) => ReactNode;
  /** Keep dialog ownership stable while mounting the menu in responsive chrome. */
  readonly menuHost?: HTMLElement | null;
  readonly viewportLayout?: "mobile" | "desktop";
}) {
  const inheritedLayout = useSimulatorViewportLayout();
  const platform = viewportLayout ?? inheritedLayout;
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [configurationOpen, setConfigurationOpen] = useState(false);
  const [supportDialog, setSupportDialog] = useState<SupportDialogKind | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const menu = (
    <ParticipantMenu
      label="Open your player actions"
      title="You"
      subtitle="Player, match, and support"
      message={message}
    >
      {(close) => (
        <>
          {matchMenuItems?.(close)}
          <button
            type="button"
            role="menuitem"
            className={classes.menuItem}
            onClick={() => {
              close();
              setSettingsOpen(true);
            }}
          >
            <Settings aria-hidden="true" size={16} />
            <span>Settings</span>
          </button>
          <button
            type="button"
            role="menuitem"
            className={classes.menuItem}
            onClick={() => {
              close();
              setSupportDialog("bug");
            }}
          >
            <Bug aria-hidden="true" size={16} />
            <span>Report bug</span>
          </button>
          <button
            type="button"
            role="menuitem"
            className={classes.menuItem}
            onClick={() => {
              close();
              setSupportDialog("feature");
            }}
          >
            <Lightbulb aria-hidden="true" size={16} />
            <span>Request feature</span>
          </button>
          <button
            type="button"
            role="menuitem"
            className={classes.menuItem}
            onClick={() => {
              close();
              setSupportDialog("feedback");
            }}
          >
            <MessageSquare aria-hidden="true" size={16} />
            <span>Share feedback</span>
          </button>
        </>
      )}
    </ParticipantMenu>
  );

  return (
    <>
      {menuHost === undefined ? menu : menuHost ? createPortal(menu, menuHost) : null}
      {settingsOpen ? (
        <SimulatorSettingsDialog
          gameConfiguration={gameConfiguration}
          accountSettingsHref={accountSettingsHref}
          onOpenGameConfiguration={() => {
            setSettingsOpen(false);
            if (gameConfiguration.requiresConfirmation === false) {
              gameConfiguration.onSelect();
            } else {
              setConfigurationOpen(true);
            }
          }}
          onClose={() => setSettingsOpen(false)}
        />
      ) : null}
      {configurationOpen ? (
        <ChangeGameDialog action={gameConfiguration} onClose={() => setConfigurationOpen(false)} />
      ) : null}
      {supportDialog ? (
        <SupportDialog
          kind={supportDialog}
          context={support}
          platform={platform}
          onClose={() => setSupportDialog(null)}
          onSubmitted={setMessage}
        />
      ) : null}
    </>
  );
}
