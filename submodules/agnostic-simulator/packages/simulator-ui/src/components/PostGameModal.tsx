import type { ReactNode } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import confetti from "canvas-confetti";
import classes from "./PostGameModal.module.css";

export interface PostGameModalProps {
  open: boolean;
  outcome: "win" | "loss" | "draw";
  reason?: string;
  returnUrl?: string;
  sections?: ReadonlyArray<{
    id: string;
    label: string;
    icon?: ReactNode;
    content: ReactNode;
  }>;
  actions?: ReactNode;
  onClose?: () => void;
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
  outcome,
  reason,
  returnUrl,
  sections = [],
  actions,
  onClose,
  testId = "post-game-modal",
  dataEndReason,
  dataRemote,
  dataPostGameSurface,
  celebrationKey,
}: PostGameModalProps) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const celebratedKeyRef = useRef<string | null>(null);

  const headline = useMemo(() => {
    if (outcome === "win") return "You win";
    if (outcome === "loss") return "Rival wins";
    return "Match ended";
  }, [outcome]);

  useEffect(() => {
    if (!open) return;
    if (outcome !== "win") return;
    const key = celebrationKey ?? "celebrated";
    if (key === celebratedKeyRef.current) return;
    celebratedKeyRef.current = key;
    return fireWinConfetti();
  }, [open, outcome, celebrationKey]);

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

  return (
    <div
      className={classes.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Match ended"
      data-testid={testId}
      data-outcome={outcome}
      data-end-reason={dataEndReason}
      data-remote={dataRemote}
      data-post-game-surface={dataPostGameSurface}
    >
      <div className={classes.card} data-outcome={outcome}>
        {onClose ? (
          <button
            type="button"
            className={classes.minimizeButton}
            onClick={onClose}
            aria-label="Minimize post-game summary"
            title="Minimize"
          >
            <span>Minimize</span>
          </button>
        ) : null}

        <header className={classes.header}>
          <p className={classes.eyebrow}>Match ended</p>
          <h2 className={classes.headline} data-testid="post-game-headline">
            {headline}
          </h2>
          {reason ? (
            <p className={classes.reason} data-testid="post-game-reason">
              {reason}
            </p>
          ) : null}
        </header>

        {sections.length > 0 ? (
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
        ) : null}

        <main className={classes.body}>{activeSection ? activeSection.content : null}</main>

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
