import { phaseLabel, RIBBON_PHASES, stepLabel, useStatus } from "../../game/index.ts";

/**
 * Centerline pill that shows the standard turn phases in order, with
 * the current phase highlighted. Reads phase + step directly from the
 * engine status snapshot.
 *
 * `battle-phase` is intentionally excluded from the pill: the ribbon
 * represents the standard turn flow, and battle is entered out-of-band
 * via `enterBattle`. When the engine's current phase isn't in the
 * ribbon list (battle-phase, setup, pending-decision, etc.), the
 * matching pill highlight goes away and we fall back to a label-only
 * indicator on the right side so the ribbon never goes blank.
 */
export function PhaseRibbon() {
  const status = useStatus();
  const currentPhase = status.phase;
  const currentStep = status.step;
  const inRibbon = currentPhase !== undefined && RIBBON_PHASES.includes(currentPhase);

  return (
    <div className="absolute left-1/2 -translate-x-1/2 -top-1/2 z-10 pointer-events-none flex items-center gap-2">
      <div
        className="font-mono flex items-center gap-1 px-3 py-[3px] tracking-hud-wide text-hud-2xs font-bold clip-hud-tag-l"
        style={{
          background: "linear-gradient(90deg, rgba(248,250,254,.92), rgba(248,250,254,.7))",
          border: "1px solid rgba(45,107,255,.25)",
        }}
      >
        {RIBBON_PHASES.map((phase, i) => {
          const isCurrent = phase === currentPhase;
          return (
            <span key={phase} className="flex items-center gap-1">
              {i > 0 && <span className="text-[#334155]">·</span>}
              <span
                style={{
                  color: isCurrent ? "#2d6bff" : "#475569",
                  textShadow: isCurrent ? "0 0 8px rgba(45,107,255,.55)" : "none",
                }}
              >
                {isCurrent && "●"}
                {phaseLabel(phase)}
              </span>
            </span>
          );
        })}
      </div>

      {!inRibbon && currentPhase !== undefined && (
        <span
          className="font-mono px-2 py-[3px] text-hud-2xs font-bold tracking-hud-label clip-hud-tag-l"
          style={{
            background: "rgba(255,45,122,.18)",
            border: "1px solid rgba(255,45,122,.45)",
            color: "#ff8095",
          }}
        >
          {phaseLabel(currentPhase)}
        </span>
      )}

      {currentStep && (
        <span
          className="font-mono text-hud-2xs text-hud-text-dim tracking-hud-label"
          style={{ color: "#4cc3ff" }}
        >
          / {stepLabel(currentStep)}
        </span>
      )}
    </div>
  );
}
