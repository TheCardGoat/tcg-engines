import type { ReactNode, RefObject } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { FocusTrap } from "@mantine/core";
import { useFocusReturn } from "@mantine/hooks";
import { IconMinus } from "@tabler/icons-react";
import classes from "./PostGameModal.module.css";

export interface PostGameModalProps {
  open: boolean;
  /** Compact summary with an always visible, independently scrolling detail area. */
  layout?: "versus" | "compact";
  outcome: "win" | "loss" | "draw";
  reason?: string;
  /** A neutral or game-specific result title, such as a hot-seat winner. */
  title?: string;
  className?: string;
  celebrate?: boolean;
  returnUrl?: string;
  /** Flanking identity cards for the versus header (viewer left, opponent right). */
  participants?: { left: ReactNode; right: ReactNode };
  /** Compact match metadata (format, series, duration...). */
  meta?: ReactNode;
  sections?: ReadonlyArray<{
    id: string;
    label: string;
    icon?: ReactNode;
    content: ReactNode;
  }>;
  actions?: ReactNode;
  onClose?: () => void;
  /** Stable focus target when the action that ended the game no longer exists. */
  returnFocusRef?: RefObject<HTMLElement | null>;
  testId?: string;
  dataEndReason?: string;
  dataRemote?: string;
  dataPostGameSurface?: string;
  celebrationKey?: string;
}

const WIN_CONFETTI_COLORS = ["#f5e642", "#66e8ff", "#ff7e76", "#ffffff"];

function fireWinConfetti(): () => void {
  const end = Date.now() + 3 * 1000;
  let frameId: number | null = null;

  const frame = () => {
    if (Date.now() > end) return;

    void confetti({
      angle: 60,
      colors: WIN_CONFETTI_COLORS,
      disableForReducedMotion: true,
      origin: { x: 0, y: 0.5 },
      particleCount: 2,
      spread: 55,
      startVelocity: 60,
      zIndex: 9001,
    });
    void confetti({
      angle: 120,
      colors: WIN_CONFETTI_COLORS,
      disableForReducedMotion: true,
      origin: { x: 1, y: 0.5 },
      particleCount: 2,
      spread: 55,
      startVelocity: 60,
      zIndex: 9001,
    });

    frameId = window.requestAnimationFrame(frame);
  };

  frame();

  return () => {
    if (frameId !== null) {
      window.cancelAnimationFrame(frameId);
    }
    confetti.reset();
  };
}

export function PostGameModal({
  open,
  layout = "versus",
  outcome,
  reason,
  title,
  className,
  celebrate = true,
  returnUrl,
  participants,
  meta,
  sections = [],
  actions,
  onClose,
  returnFocusRef,
  testId = "post-game-modal",
  dataEndReason,
  dataRemote,
  dataPostGameSurface,
  celebrationKey,
}: PostGameModalProps) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(sections[0]?.id ?? null);
  useFocusReturn({ opened: open, shouldReturnFocus: !returnFocusRef });
  const wasOpen = useRef(open);
  useEffect(() => {
    if (wasOpen.current && !open) returnFocusRef?.current?.focus({ preventScroll: true });
    wasOpen.current = open;
  }, [open, returnFocusRef]);
  const celebratedKeyRef = useRef<string | null>(null);

  const headline = useMemo(() => {
    if (outcome === "win") return "Victory";
    if (outcome === "loss") return "Defeat";
    return "Draw";
  }, [outcome]);

  useEffect(() => {
    if (!open) return;
    if (outcome !== "win" || !celebrate) return;
    const key = celebrationKey ?? "celebrated";
    if (key === celebratedKeyRef.current) return;
    celebratedKeyRef.current = key;
    return fireWinConfetti();
  }, [open, outcome, celebrationKey, celebrate]);

  useEffect(() => {
    if (open || celebrationKey !== undefined) return;
    celebratedKeyRef.current = null;
  }, [open, celebrationKey]);

  useEffect(() => {
    setActiveSectionId((current) => {
      if (current && sections.some((s) => s.id === current)) {
        return current;
      }
      return sections[0]?.id ?? null;
    });
  }, [sections]);

  if (!open) return null;

  const activeSection = sections.find((s) => s.id === activeSectionId);

  const detailContent = (
    <div className={classes.detailsContent}>
      <nav className={classes.tabs} aria-label="Post-game sections">
        {sections.map((section) => (
          <TabButton
            key={section.id}
            active={activeSectionId === section.id}
            icon={section.icon}
            label={section.label}
            onClick={() => setActiveSectionId(section.id)}
          />
        ))}
      </nav>
      <div key={layout === "compact" ? activeSectionId : undefined} className={classes.body}>
        {activeSection ? activeSection.content : null}
      </div>
    </div>
  );

  return (
    <FocusTrap active={open}>
      <div
        className={[classes.overlay, className].filter(Boolean).join(" ")}
        tabIndex={-1}
        onKeyDown={(event) => {
          if (event.key === "Escape" && !event.defaultPrevented && onClose) {
            event.preventDefault();
            event.stopPropagation();
            onClose();
          }
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Match ended"
        data-testid={testId}
        data-outcome={outcome}
        data-end-reason={dataEndReason}
        data-remote={dataRemote}
        data-post-game-surface={dataPostGameSurface}
      >
        <div className={classes.card} data-outcome={outcome} data-layout={layout}>
          {onClose ? (
            <button
              type="button"
              className={classes.minimizeButton}
              onClick={onClose}
              aria-label="Minimize post-game summary"
              title="Minimize"
            >
              <IconMinus size={18} aria-hidden="true" />
            </button>
          ) : null}

          <div className={classes.content}>
            <header
              className={
                participants ? `${classes.header} ${classes.headerVersus}` : classes.header
              }
            >
              <div className={classes.headerCopy}>
                <h2 className={classes.headline} data-testid="post-game-headline">
                  {title ?? headline}
                </h2>
                {reason ? (
                  <p className={classes.reason} data-testid="post-game-reason">
                    {reason}
                  </p>
                ) : null}
              </div>
              {layout === "compact" && meta ? (
                <div className={classes.headerMeta}>{meta}</div>
              ) : null}
              {participants ? (
                <>
                  <div className={classes.versusSide} data-side="left">
                    {participants.left}
                  </div>
                  <div className={classes.versusSide} data-side="right">
                    {participants.right}
                  </div>
                </>
              ) : null}
            </header>

            {layout !== "compact" && meta ? <div className={classes.headerMeta}>{meta}</div> : null}

            {sections.length > 0 ? (
              layout === "compact" ? (
                <section className={classes.details} aria-label="Match details">
                  {detailContent}
                </section>
              ) : (
                <details className={classes.details}>
                  <summary>Match details</summary>
                  {detailContent}
                </details>
              )
            ) : null}
          </div>

          <footer className={classes.footer}>
            <div className={classes.actions}>{actions}</div>
            {returnUrl ? (
              <a className={classes.returnLink} href={returnUrl} data-testid="post-game-return">
                Return
              </a>
            ) : null}
          </footer>
        </div>
      </div>
    </FocusTrap>
  );
}

function TabButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon?: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`${classes.tabButton} ${active ? classes.tabButtonActive : ""}`}
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}
