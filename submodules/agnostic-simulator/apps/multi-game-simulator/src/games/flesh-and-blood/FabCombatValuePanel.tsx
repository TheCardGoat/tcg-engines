import { ChevronDown } from "lucide-react";
import {
  FAB_ANALYTICS_METHODOLOGY_URL,
  FAB_COMBAT_VALUE_FORMULA,
  type FabCombatValueReport,
} from "./FabCombatValue";

export function FabMethodologyLink() {
  return (
    <a href={FAB_ANALYTICS_METHODOLOGY_URL} target="_blank" rel="noopener noreferrer">
      Analytics methodology<span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

/** Additive highlights; keep the existing totals and detail disclosure intact. */
export function FabCombatValueHighlights({
  report,
}: {
  readonly report?: FabCombatValueReport | null;
}) {
  const average = (side: "viewer" | "opponent") =>
    report?.turns.length ? (report[side].total / report.turns.length).toFixed(1) : "—";
  const peak = (side: "viewer" | "opponent") => {
    if (!report?.turns.length) return "—";
    const turn = report.turns.reduce((best, current) =>
      current[side].total > best[side].total ? current : best,
    );
    return `${turn[side].total} · T${turn.turn}${turn.completed ? "" : "*"}`;
  };
  return (
    <>
      <div className="fab-summary-comparison-row">
        <strong>{average("viewer")}</strong>
        <a
          href={`${FAB_ANALYTICS_METHODOLOGY_URL}#turn-highlights`}
          target="_blank"
          rel="noopener noreferrer"
          title="Total combat value divided by recorded game turns, including partial turns. Calculation opens in a new tab."
        >
          Avg. combat value / turn
        </a>
        <strong>{average("opponent")}</strong>
      </div>
      <div className="fab-summary-comparison-row">
        <strong>{peak("viewer")}</strong>
        <a
          href={`${FAB_ANALYTICS_METHODOLOGY_URL}#turn-highlights`}
          target="_blank"
          rel="noopener noreferrer"
          title="Highest recorded single-turn combat value. T identifies the turn; * marks a partial turn. Ties show the earliest recorded turn. Calculation opens in a new tab."
        >
          Top turn combat value
        </a>
        <strong>{peak("opponent")}</strong>
      </div>
    </>
  );
}

export function FabCombatValuePanel({
  report,
  showTurns = false,
}: {
  readonly report?: FabCombatValueReport | null;
  readonly showTurns?: boolean;
}) {
  return (
    <details className="fab-summary-value-panel">
      <summary
        className="fab-summary-value-toggle"
        aria-label="Combat value: calculation and details"
      >
        <strong>{report?.viewer.total ?? "—"}</strong>
        <span>
          Combat value <small>{report?.source === "mock" ? "Example" : "Pilot"}</small>
          <ChevronDown aria-hidden="true" size={12} className="fab-summary-value-chevron" />
        </span>
        <strong>{report?.opponent.total ?? "—"}</strong>
      </summary>
      <div className="fab-summary-value-copy">
        <p>
          <strong>Calculation:</strong> {FAB_COMBAT_VALUE_FORMULA}.
        </p>
        <p>
          Pilot v1 measures recorded output, not skill. Blocked attacks count; setup and on-hit
          utility do not.
        </p>
        <FabMethodologyLink />
      </div>
      {!report ? (
        <p className="fab-summary-value-copy" role="status">
          Unavailable for this game: consistent backend totals and turn records are required. We do
          not estimate this from illustrative data or session logs.
        </p>
      ) : (
        <>
          {report.source === "mock" ? (
            <p className="fab-summary-value-copy">
              <strong>Illustrative example — not a played game.</strong>
            </p>
          ) : null}
          <div className="fab-summary-table-scroll">
            <table>
              <caption className="fab-summary-value-copy">
                {showTurns
                  ? "Both players’ output on each recorded game turn. These are not paired turn cycles."
                  : "Game totals and the components added together"}
              </caption>
              <thead>
                <tr>
                  <th>{showTurns ? "Game turn" : "Component"}</th>
                  <th>You</th>
                  <th>Opponent</th>
                </tr>
              </thead>
              <tbody>
                {showTurns ? (
                  report.turns.map((turn) => (
                    <tr key={turn.turn}>
                      <th>
                        {turn.turn}
                        {turn.completed ? "" : " · partial"}
                      </th>
                      <td>{turn.viewer.total}</td>
                      <td>{turn.opponent.total}</td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr>
                      <th>Attack power presented</th>
                      <td>{report.viewer.attack}</td>
                      <td>{report.opponent.attack}</td>
                    </tr>
                    <tr>
                      <th>Other damage dealt</th>
                      <td>{report.viewer.otherDamage}</td>
                      <td>{report.opponent.otherDamage}</td>
                    </tr>
                    <tr>
                      <th>Effective defense</th>
                      <td>{report.viewer.defense}</td>
                      <td>{report.opponent.defense}</td>
                    </tr>
                    <tr>
                      <th>Damage prevented</th>
                      <td>{report.viewer.prevention}</td>
                      <td>{report.opponent.prevention}</td>
                    </tr>
                  </>
                )}
              </tbody>
              <tfoot>
                <tr>
                  <th>Total observed combat value</th>
                  <td>{report.viewer.total}</td>
                  <td>{report.opponent.total}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="fab-summary-value-copy">
            <p>
              Per recorded game turn:{" "}
              <strong>{(report.viewer.total / report.turns.length).toFixed(1)}</strong> for you;{" "}
              <strong>{(report.opponent.total / report.turns.length).toFixed(1)}</strong> for your
              opponent. Includes the opening turn and any partial final turn.
            </p>
            <p>
              No per-card score yet. Three per card is a heuristic, not a benchmark for these
              totals. Current records can include damage to non-hero targets or yourself; compare
              the components, not player skill.
            </p>
          </div>
        </>
      )}
    </details>
  );
}
