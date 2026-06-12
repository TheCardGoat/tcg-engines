import { useMemo, useState } from "react";
import {
  PLAYER_SIDE_TO_ID,
  WIN_GIG_THRESHOLD,
  listScenarios,
  useEngine,
  useSideZones,
  type ScenarioId,
  type Side,
} from "../../engine";
import { copyTextToClipboard, safeStringify } from "@tcg/simulator-runtime/debug";
import classes from "./DebugPanel.module.css";

type CopyTarget = "state" | "interactions";

interface CopyFeedback {
  target: CopyTarget;
  ok: boolean;
  message: string;
}

const SIDES: readonly Side[] = ["player", "opponent"] as const;

export function DebugPanel() {
  const engine = useEngine();
  const playerZones = useSideZones("player");
  const opponentZones = useSideZones("opponent");
  const [copyFeedback, setCopyFeedback] = useState<CopyFeedback | null>(null);

  const { matchState, interactionViews, scenarioId, activeSide, humanSide } = engine;

  const scenarios = listScenarios();

  const serializedState = useMemo(() => safeStringify(matchState), [matchState]);
  const serializedInteractions = useMemo(() => safeStringify(interactionViews), [interactionViews]);

  const playerActiveId = PLAYER_SIDE_TO_ID.player;
  const activePlayerId = matchState.G.turnMetadata.activePlayerId;
  const expectedActiveSide: Side = activePlayerId === playerActiveId ? "player" : "opponent";

  const anomalies = useMemo(() => {
    const out: string[] = [];
    if (activeSide !== expectedActiveSide) {
      out.push(
        `activeSide (${activeSide}) does not match turnMetadata.activePlayerId (${String(activePlayerId)})`,
      );
    }

    for (const side of SIDES) {
      const zones = side === "player" ? playerZones : opponentZones;
      const expectedCred = zones.gigArea.reduce((sum, d) => sum + d.faceValue, 0);
      if (zones.streetCred !== expectedCred) {
        out.push(
          `${side}: streetCred (${zones.streetCred}) != sum(gigArea.faceValue) (${expectedCred})`,
        );
      }
      if (zones.gigCount !== zones.gigArea.length) {
        out.push(
          `${side}: gigCount (${zones.gigCount}) != gigArea.length (${zones.gigArea.length})`,
        );
      }
    }

    const seen = new Map<string, string>();
    for (const side of SIDES) {
      const playerId = PLAYER_SIDE_TO_ID[side];
      const player = matchState.G.players[playerId];
      if (!player) {
        continue;
      }
      for (const [zoneName, ids] of Object.entries(player.zones)) {
        for (const rawId of ids as readonly { toString(): string }[]) {
          const id = String(rawId);
          const prior = seen.get(id);
          if (prior) {
            out.push(`Duplicate cardId ${id} in ${prior} and ${side}.${zoneName}`);
          } else {
            seen.set(id, `${side}.${zoneName}`);
          }
          if (!matchState.G.cardIndex[id]) {
            out.push(`${side}.${zoneName} references missing cardIndex entry ${id}`);
          }
        }
      }
    }

    return out;
  }, [activeSide, expectedActiveSide, activePlayerId, playerZones, opponentZones, matchState]);

  const recentLog = engine.eventLog.slice(-5).reverse();
  const aiTakeoverTarget =
    engine.aiTakeover?.side ??
    SIDES.find((side) => side !== humanSide && engine.aiStrategies[side]) ??
    SIDES.find((side) => engine.aiStrategies[side]) ??
    null;

  async function handleCopy(target: CopyTarget, payload: string): Promise<void> {
    const ok = await copyTextToClipboard(payload);
    setCopyFeedback({
      target,
      ok,
      message: ok ? "Copied JSON to clipboard." : "Clipboard unavailable.",
    });
  }

  function handleTakeControl(): void {
    if (engine.aiTakeover) {
      engine.releaseAiTakeover();
      return;
    }
    if (aiTakeoverTarget) {
      engine.takeOverAiSide(aiTakeoverTarget);
      return;
    }
    engine.toggleHumanSide();
  }

  return (
    <div className={classes.panel}>
      <section className={classes.section}>
        <h3 className={classes.heading}>Match Context</h3>
        <div className={classes.kvGrid}>
          <KV label="Scenario" value={scenarioId} />
          <KV label="Phase" value={matchState.G.gamePhase} />
          <KV label="Turn" value={String(matchState.G.turnMetadata.turnNumber)} />
          <KV label="Active" value={`${activeSide} (${String(activePlayerId)})`} />
          <KV label="Human" value={humanSide} />
          <KV label="Game Ended" value={matchState.G.gameEnded ? "yes" : "no"} />
          <KV label="Winner" value={matchState.G.winnerId ? String(matchState.G.winnerId) : "—"} />
          <KV label="Win Reason" value={matchState.G.winReason ?? "—"} />
          <KV label="Player Interaction" value={interactionViews.player.status} />
          <KV label="Opponent Interaction" value={interactionViews.opponent.status} />
          <KV label="Effect Bag" value={String(matchState.G.effectBag.length)} />
          <KV label="Active Effects" value={String(matchState.G.activeEffects.length)} />
          <KV label="State ID" value={String(matchState.ctx.stateID)} />
          <KV label="Pending Choice" value={matchState.G.turnMetadata.pendingChoice?.type ?? "—"} />
          <KV
            label="Attack"
            value={matchState.G.attackState ? matchState.G.attackState.step : "—"}
          />
          <KV label="Overtime" value={matchState.G.overtime ? "yes" : "no"} />
        </div>
      </section>

      <section className={classes.section}>
        <h3 className={classes.heading}>Scenario · View</h3>
        <div className={classes.actions}>
          <select
            className={classes.select}
            value={scenarioId}
            onChange={(e) => engine.setScenario(e.currentTarget.value as ScenarioId)}
          >
            {scenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <div className={classes.btnRow}>
            <button
              type="button"
              className={classes.btn}
              onClick={engine.resetScenario}
              disabled={!engine.canResetScenario}
            >
              Reset Fixture
            </button>
            <button
              type="button"
              className={`${classes.btn} ${classes.btnAccent}`}
              onClick={handleTakeControl}
            >
              {engine.aiTakeover ? "Release Control" : "Take Control"}
            </button>
          </div>
        </div>
      </section>

      <section className={classes.section}>
        <h3 className={classes.heading}>Player Totals</h3>
        <table className={classes.table}>
          <thead>
            <tr>
              <th>Side</th>
              <th>Eddies</th>
              <th>Cred</th>
              <th>Gigs</th>
              <th>Hand</th>
              <th>Deck</th>
              <th>Field</th>
              <th>Trash</th>
              <th>Legend</th>
              <th>Fixer</th>
            </tr>
          </thead>
          <tbody>
            {SIDES.map((side) => {
              const zones = side === "player" ? playerZones : opponentZones;
              const reachedWin = zones.gigCount >= WIN_GIG_THRESHOLD;
              return (
                <tr key={side}>
                  <td>{side}</td>
                  <td>{zones.eddies}</td>
                  <td>{zones.streetCred}</td>
                  <td className={reachedWin ? classes.tableHighlight : undefined}>
                    {zones.gigCount}/{WIN_GIG_THRESHOLD}
                  </td>
                  <td>{zones.hand.length}</td>
                  <td>{zones.deckCount}</td>
                  <td>{zones.field.length}</td>
                  <td>{zones.trashCount}</td>
                  <td>{zones.legendArea.length}</td>
                  <td>{zones.fixerArea.length}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className={classes.section}>
        <h3 className={classes.heading}>Interaction Inspector</h3>
        <table className={classes.table}>
          <thead>
            <tr>
              <th>Side</th>
              <th>Status</th>
              <th>Actions</th>
              <th>Request</th>
            </tr>
          </thead>
          <tbody>
            {SIDES.map((side) => {
              const view = interactionViews[side];
              const requestIds = view.actions
                .filter((action) => action.enabled)
                .map((action) => action.requestId);
              return (
                <tr key={side}>
                  <td>{side}</td>
                  <td>{view.status}</td>
                  <td>{view.actions.length}</td>
                  <td>{requestIds[0] ?? "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className={classes.section}>
        <h3 className={classes.heading}>Recent AI Steps</h3>
        {recentLog.length === 0 ? (
          <p className={classes.empty}>No AI activity yet.</p>
        ) : (
          <div className={classes.miniLog}>
            {recentLog.map((entry) => {
              const sideClass =
                entry.side === "player" ? classes.miniLogSidePlayer : classes.miniLogSideOpponent;
              const summary = summarizeStep(entry.result);
              const kindClass =
                entry.result.kind === "illegal"
                  ? classes.miniLogIllegal
                  : entry.result.kind === "stuck"
                    ? classes.miniLogStuck
                    : undefined;
              return (
                <div key={entry.id} className={classes.miniLogEntry}>
                  <span className={sideClass}>{entry.side === "player" ? "P1" : "P2"}</span>
                  <span className={kindClass}>{summary}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className={classes.section}>
        <h3 className={classes.heading}>Consistency Checks</h3>
        {anomalies.length === 0 ? (
          <p className={classes.ok}>All checks passed.</p>
        ) : (
          <ol className={classes.anomaly}>
            {anomalies.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ol>
        )}
      </section>

      <details className={classes.section}>
        <summary className={classes.rawSummary}>
          <span>Raw State JSON</span>
          <button
            type="button"
            className={classes.copyBtn}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void handleCopy("state", serializedState);
            }}
          >
            Copy
          </button>
        </summary>
        <div className={classes.rawBody}>
          {copyFeedback?.target === "state" && (
            <p
              className={`${classes.copyFeedback} ${
                copyFeedback.ok ? "" : classes.copyFeedbackError
              }`}
            >
              {copyFeedback.message}
            </p>
          )}
          <pre className={classes.rawPre}>{serializedState}</pre>
        </div>
      </details>

      <details className={classes.section}>
        <summary className={classes.rawSummary}>
          <span>Raw Interactions JSON</span>
          <button
            type="button"
            className={classes.copyBtn}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              void handleCopy("interactions", serializedInteractions);
            }}
          >
            Copy
          </button>
        </summary>
        <div className={classes.rawBody}>
          {copyFeedback?.target === "interactions" && (
            <p
              className={`${classes.copyFeedback} ${
                copyFeedback.ok ? "" : classes.copyFeedbackError
              }`}
            >
              {copyFeedback.message}
            </p>
          )}
          <pre className={classes.rawPre}>{serializedInteractions}</pre>
        </div>
      </details>
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className={classes.kvCell}>
      <span className={classes.kvLabel}>{label}</span>
      <span className={classes.kvValue}>{value}</span>
    </div>
  );
}

function summarizeStep(result: import("@tcg/cyberpunk-engine").StepResult): string {
  switch (result.kind) {
    case "acted":
      return result.decision.kind === "command" ? result.decision.move : "acted";
    case "idle":
      return "idle";
    case "stuck":
      return `stuck: ${result.reason}`;
    case "illegal":
      return `illegal: ${result.errorCode}`;
  }
}
