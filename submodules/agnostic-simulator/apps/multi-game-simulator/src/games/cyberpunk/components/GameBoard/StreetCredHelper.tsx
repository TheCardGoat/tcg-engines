import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { WIN_GIG_THRESHOLD } from "../../engine";
import type { GigHelperComparison } from "./gigStats";
import classes from "./CenterRow.module.css";

export interface StreetCredHelperState {
  side: "rival" | "friendly";
  rect: DOMRect;
  pinned: boolean;
}

/** Stylized gig die glyph — a rounded die showing three pips. */
export function GigDieIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      style={{ display: "block" }}
    >
      <rect
        x="1.6"
        y="1.6"
        width="12.8"
        height="12.8"
        rx="2.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle cx="5.2" cy="5.2" r="1.25" fill="currentColor" />
      <circle cx="8" cy="8" r="1.25" fill="currentColor" />
      <circle cx="10.8" cy="10.8" r="1.25" fill="currentColor" />
    </svg>
  );
}

/** The official ☆ (Street Cred) symbol as an inline glyph. */
export function StreetCredStarIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      style={{ display: "block" }}
    >
      <path
        d="M8 1.7 9.85 5.55l4.2.55-3.1 2.95.78 4.2L8 11.25l-3.73 2 .78-4.2-3.1-2.95 4.2-.55z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Hover/click behavior for a Street Cred chip that opens the gig helper
 * popover. Hover shows a transient popover; clicking pins it until an outside
 * pointerdown, scroll, resize, or Escape — mirroring the gig-die popover.
 */
export function useStreetCredHelper(side: "rival" | "friendly") {
  const [state, setState] = useState<StreetCredHelperState | null>(null);
  const chipRef = useRef<HTMLButtonElement | null>(null);
  const open = useCallback(
    (pinned: boolean) => {
      const rect = chipRef.current?.getBoundingClientRect();
      if (!rect) {
        return;
      }
      setState((current) => (current?.pinned && !pinned ? current : { side, rect, pinned }));
    },
    [side],
  );
  const closeTransient = useCallback(() => {
    setState((current) => (current && !current.pinned ? null : current));
  }, []);
  const closePinned = useCallback(() => {
    setState(null);
  }, []);

  useEffect(() => {
    if (!state?.pinned) {
      return;
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePinned();
      }
    };
    window.addEventListener("pointerdown", closePinned);
    window.addEventListener("scroll", closePinned, true);
    window.addEventListener("resize", closePinned);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("pointerdown", closePinned);
      window.removeEventListener("scroll", closePinned, true);
      window.removeEventListener("resize", closePinned);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closePinned, state?.pinned]);

  const chipHandlers = {
    "aria-controls": `${side}-street-cred-helper`,
    "aria-expanded": state !== null,
    "aria-describedby": state ? `${side}-street-cred-helper` : undefined,
    "data-cred-helper": state ? "open" : "ready",
    onMouseEnter: () => open(false),
    onMouseLeave: closeTransient,
    onFocus: () => open(false),
    onBlur: closeTransient,
    onClick: (event: ReactMouseEvent<HTMLElement>) => {
      event.stopPropagation();
      open(true);
    },
  } as const;

  return { state, chipRef, chipHandlers, closePinned };
}

function StatRow({
  label,
  title,
  icon,
  you,
  rival,
}: {
  label: string;
  title?: string;
  icon?: ReactNode;
  you: ReactNode;
  rival: ReactNode;
}) {
  return (
    <div className={classes.schRow} title={title}>
      <span className={classes.schLabel}>
        {icon}
        {label}
      </span>
      <strong className={classes.schYou}>{you}</strong>
      <strong className={classes.schRival}>{rival}</strong>
    </div>
  );
}

function CredValue({ cred, count }: { cred: number; count: number }) {
  if (count === 0) {
    return (
      <span className={classes.schCredNull} title="No Gigs — Null Street Cred (rule 11.2.3)">
        –
      </span>
    );
  }
  return (
    <span className={classes.schCredValue}>
      {cred}
      <span className={classes.schParity} data-parity={cred % 2 === 0 ? "even" : "odd"}>
        {cred % 2 === 0 ? "even" : "odd"}
      </span>
    </span>
  );
}

/**
 * You-vs-rival gig breakdown shown when hovering (or clicking to pin) a
 * Street Cred chip. The trigger is keyboard accessible and associates this
 * non-interactive tooltip through aria-describedby while it is open.
 */
export function StreetCredHelperPopover({
  state,
  helper,
  compact = false,
}: {
  state: StreetCredHelperState | null;
  helper: GigHelperComparison;
  compact?: boolean;
}) {
  if (!state || typeof document === "undefined" || typeof window === "undefined") {
    return null;
  }

  const viewportPadding = 8;
  const estimatedWidth = compact ? 176 : 196;
  const preferredX = state.rect.left + state.rect.width / 2;
  const x = Math.min(
    window.innerWidth - viewportPadding - estimatedWidth / 2,
    Math.max(viewportPadding + estimatedWidth / 2, preferredX),
  );
  // Rival chips sit at the top of the board, friendly chips at the bottom.
  const placeBelow = state.side === "rival";
  const y = placeBelow ? state.rect.bottom + 6 : state.rect.top - 6;
  const style = {
    "--gig-popover-x": `${x}px`,
    "--gig-popover-y": `${y}px`,
    "--gig-popover-max-w": `${estimatedWidth}px`,
  } as CSSProperties;

  const { friendly, rival, credGap, credLeader } = helper;
  const countCell = (count: number) =>
    count >= WIN_GIG_THRESHOLD ? (
      <span className={classes.schWin} title="Win condition reached">
        {count}·{WIN_GIG_THRESHOLD}+
      </span>
    ) : (
      count
    );

  return createPortal(
    <div
      id={`${state.side}-street-cred-helper`}
      className={`${classes.streetCredHelper} ${classes[state.side]}`}
      data-placement={placeBelow ? "bottom" : "top"}
      data-compact={compact ? "true" : "false"}
      data-testid="street-cred-helper"
      role="tooltip"
      style={style}
    >
      <div className={classes.schHead}>
        <GigDieIcon size={compact ? 11 : 13} />
        <span>Gig breakdown</span>
      </div>
      <div>
        <div className={`${classes.schRow} ${classes.schRowHead}`}>
          <span className={classes.schLabel} />
          <strong className={classes.schYou}>You</strong>
          <strong className={classes.schRival}>Rival</strong>
        </div>
        <StatRow
          label="Street cred"
          icon={<StreetCredStarIcon size={compact ? 9 : 11} />}
          title="Sum of your gig dice (Null when you have none)"
          you={<CredValue cred={friendly.cred} count={friendly.count} />}
          rival={<CredValue cred={rival.cred} count={rival.count} />}
        />
        <StatRow
          label="Gigs"
          icon={<GigDieIcon size={compact ? 9 : 11} />}
          title={`Dice claimed — ${WIN_GIG_THRESHOLD}+ wins the game`}
          you={countCell(friendly.count)}
          rival={countCell(rival.count)}
        />
        <StatRow
          label="Min gigs"
          title="Dice on their lowest face (1)"
          you={friendly.minCount}
          rival={rival.minCount}
        />
        <StatRow
          label="Max gigs"
          title="Dice on their highest face"
          you={friendly.maxCount}
          rival={rival.maxCount}
        />
        <StatRow
          label="Even / odd"
          title="Dice with an even / odd face value"
          you={`${friendly.evenCount} · ${friendly.oddCount}`}
          rival={`${rival.evenCount} · ${rival.oddCount}`}
        />
        <StatRow
          label="Pairs"
          title="Same-value pairs — each Gig counts toward one pair"
          you={friendly.pairs}
          rival={rival.pairs}
        />
      </div>
      <div className={classes.schFoot} data-leader={credLeader ?? "null"}>
        {credLeader === null ? (
          <span>Cred gap unavailable while Street Cred is Null</span>
        ) : credLeader === "tied" ? (
          <span>Cred tied</span>
        ) : (
          <span>
            {credLeader === "friendly" ? "You" : "Rival"} lead by {credGap}
          </span>
        )}
        {credGap !== null && credGap >= 10 ? <span className={classes.schGap}>10+ gap</span> : null}
      </div>
    </div>,
    document.body,
  );
}
