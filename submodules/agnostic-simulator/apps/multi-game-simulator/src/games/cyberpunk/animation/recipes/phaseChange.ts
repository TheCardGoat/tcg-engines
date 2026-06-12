import type { PhaseChangeStep } from "../types";
import classes from "../ScriptPlayer.module.css";

interface PhaseChangeOptions {
  step: PhaseChangeStep;
  overlay: HTMLElement;
  durationMs: number;
}

function formatPhaseLabel(value: string): string {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function boardCenter(): { x: number; y: number } {
  const board = document.querySelector<HTMLElement>('[data-testid="board-wrap"]');
  const rect = board?.getBoundingClientRect();
  if (!rect || rect.width === 0 || rect.height === 0) {
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  }

  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

/**
 * A short banner cue announcing the new phase. Slides in from the right
 * over the centre of the board, holds briefly, then fades out.
 */
export function phaseChange({ step, overlay, durationMs }: PhaseChangeOptions): Promise<void> {
  const banner = document.createElement("div");
  banner.className = classes.phaseBanner;
  const fromLabel = formatPhaseLabel(step.from);
  const toLabel = formatPhaseLabel(step.to);
  banner.innerHTML = `
    <span class="${classes.phaseBannerFrom}">${fromLabel}</span>
    <span class="${classes.phaseBannerArrow}">→</span>
    <span class="${classes.phaseBannerTo}">${toLabel}</span>
  `.trim();

  overlay.appendChild(banner);
  const center = boardCenter();
  banner.style.left = `${center.x}px`;
  banner.style.top = `${center.y}px`;
  banner.animate(
    [
      {
        transform: "translate(-50%, -50%) translateX(30px)",
        opacity: 0,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      { transform: "translate(-50%, -50%) translateX(0)", opacity: 1, offset: 0.18 },
      {
        transform: "translate(-50%, -50%) translateX(0)",
        opacity: 1,
        offset: 0.82,
        easing: "cubic-bezier(0.4, 0, 1, 1)",
      },
      { transform: "translate(-50%, -50%) translateX(-30px)", opacity: 0 },
    ],
    { duration: durationMs, easing: "linear", fill: "forwards" },
  );

  return new Promise((resolve) => {
    window.setTimeout(() => {
      banner.remove();
      resolve();
    }, durationMs);
  });
}
