import { m } from "../../lib/i18n/messages.ts";
import { useAutoDismissSubmitError, useSubmitError } from "../containers/submit-error-context.tsx";

/**
 * Top-anchored error toast surfaced when `adapter.submit` returns a
 * failed `SubmitOutcome`. Visual language mirrors `GamePrompt` (hud
 * clip, surface-panel-strong) but swaps the cyan accent for the danger
 * red used by `MatchOverviewModal` defeat tone and the opponent-turn
 * banner (`rgba(255,45,122,…)`) so the player reads it as an error at a
 * glance.
 *
 * Auto-dismiss runs inside the same component so the provider stays
 * free of side-effects — `useAutoDismissSubmitError` is a thin
 * effect hook that clears the error after 3s.
 */
export function SubmitErrorToast() {
  const { lastError } = useSubmitError();
  useAutoDismissSubmitError(3000);

  if (!lastError) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      data-testid="submit-error-toast"
      className="gd-display absolute z-[140] left-1/2 top-6 -translate-x-1/2 flex items-center gap-hud-sm py-2.5 pr-3 pl-hud-md min-h-[44px] max-w-[min(780px,92vw)] surface-panel-strong clip-hud-10 [animation:gd-fade-in_.18s_ease]"
      style={{
        borderColor: "rgba(255,45,122,.55)",
        boxShadow:
          "0 0 18px rgba(255,45,122,.25),0 6px 18px rgba(0,0,0,.55),inset 0 0 14px rgba(255,45,122,.12)",
      }}
    >
      <span
        className="w-1 self-stretch flex-shrink-0 rounded-sm"
        style={{
          background: "linear-gradient(180deg,#d7263d,rgba(255,45,122,.2))",
        }}
      />
      <div className="flex flex-col flex-shrink min-w-0">
        <span
          className="gd-mono text-hud-2xs font-semibold tracking-hud-wide"
          style={{ color: "#ff6b7a" }}
        >
          {m["sim.error.submitRejected.tag"]()}
        </span>
        <span className="font-body text-sm text-hud-text font-semibold tracking-hud-body leading-[1.25] truncate">
          {lastError.message}
        </span>
      </div>
    </div>
  );
}
