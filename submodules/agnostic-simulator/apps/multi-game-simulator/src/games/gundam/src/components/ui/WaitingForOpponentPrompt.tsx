import { m } from "../../lib/i18n/messages.ts";

export interface WaitingForOpponentPromptProps {
  readonly message: string;
}

/**
 * Non-interactive "engine is waiting on the opponent" status, intended for
 * setup-flow moments when the viewer has no decision to make — e.g. during
 * mulligan after the viewer handed priority to the opponent by choosing
 * them as the first player. Rendered as `role="status"` (polite live region)
 * instead of `role="region"` so screen readers announce it without stealing
 * focus, and so it's clearly distinct from the interactive
 * `ChooseFirstPlayerPrompt` / `MulliganPrompt` modals.
 */
export function WaitingForOpponentPrompt({ message }: WaitingForOpponentPromptProps) {
  return (
    <div
      role="status"
      aria-label={m["sim.setup.waiting.label"]()}
      aria-live="polite"
      className="gd-display fixed left-1/2 top-1/2 z-[200] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 w-[min(420px,92vw)] surface-panel clip-hud-10 px-6 py-5 text-hud-text [box-shadow:0_0_30px_rgba(76,195,255,.18),0_8px_30px_rgba(0,0,0,.55)] [animation:gd-fade-in_.18s_ease]"
    >
      <span className="gd-mono text-hud-xs text-hud-info font-bold tracking-hud-label gd-blink">
        ◆ {m["sim.setup.waiting.label"]()}
      </span>
      <p className="font-body text-hud-sm text-hud-text-muted text-center">{message}</p>
    </div>
  );
}
