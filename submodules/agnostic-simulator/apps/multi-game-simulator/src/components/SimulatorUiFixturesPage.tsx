import { useEffect, useState } from "react";
import { ClockReadout, ConnectionPanel, TurnIndicator } from "@tcg/simulator-ui";

import { buildMountedHref } from "../routes/router-paths.ts";
import { projectConnectionPanelDiagnostic } from "../simulator/connection-panel-projection";
import classes from "./SimulatorUiFixturesPage.module.css";

export type SimulatorUiFixtureState = "connected" | "reconnecting" | "disconnected";

const FIXTURE_STATES: readonly SimulatorUiFixtureState[] = [
  "connected",
  "reconnecting",
  "disconnected",
];

export default function SimulatorUiFixturesPage() {
  const [state, setState] = useState<SimulatorUiFixtureState>("connected");
  const diagnostic = fixtureDiagnostic(state);

  useEffect(() => {
    const resolvedState = readFixtureState();
    setState(resolvedState);
    document.title = `Simulator UI fixtures · ${resolvedState}`;
  }, []);

  return (
    <main className={classes.page} data-fixture-state={state}>
      <header className={classes.header}>
        <div>
          <p className={classes.eyebrow}>Game-agnostic validation</p>
          <h1>Simulator UI fixtures</h1>
          <p>Deterministic connection and clock states for desktop and mobile inspection.</p>
        </div>
        <a href={buildMountedHref("/")} className={classes.backLink}>
          Back to fixtures
        </a>
      </header>

      <nav className={classes.stateNav} aria-label="Fixture state">
        {FIXTURE_STATES.map((candidate) => (
          <a
            key={candidate}
            href={`${buildMountedHref("/simulator-ui-fixtures")}?state=${candidate}`}
            aria-current={candidate === state ? "page" : undefined}
          >
            {candidate}
          </a>
        ))}
      </nav>

      <section className={classes.viewport} aria-label={`${state} simulator chrome`}>
        <div className={classes.topRail}>
          <TurnIndicator turn={4} phase="Main" step={state === "connected" ? "Action" : "Paused"} />
          <div className={classes.clocks}>
            <ClockReadout
              label="Rival"
              value="02:08"
              active={false}
              urgency="normal"
              tone="rival"
            />
            <ClockReadout
              label="You"
              value={state === "disconnected" ? "00:09" : "01:24"}
              active={state === "connected"}
              urgency={
                state === "disconnected"
                  ? "critical"
                  : state === "reconnecting"
                    ? "warning"
                    : "normal"
              }
              tone="friendly"
            />
            <div className={classes.mobileConnection}>
              <ConnectionPanel
                embedded
                indicatorOnly
                popoverAlign="end"
                sides={[
                  {
                    side: "player",
                    label: "You",
                    self: true,
                    connection: {
                      status: state,
                      latencyMs: diagnostic.connection.latencyMs,
                    },
                  },
                ]}
                diagnostic={projectConnectionPanelDiagnostic(diagnostic)}
              />
            </div>
          </div>
        </div>

        <div className={classes.playfield}>
          <section className={classes.board} aria-label="Fixture playfield">
            <span>Opponent field</span>
            <div className={classes.centerLine} />
            <span>Your field</span>
          </section>
          <aside className={classes.sidebar} aria-label="Fixture diagnostics sidebar">
            <h2>Connection</h2>
            <div className={classes.sidebarConnection}>
              <ConnectionPanel
                embedded
                popoverAlign="end"
                sides={[
                  {
                    side: "player",
                    label: "You",
                    self: true,
                    connection: {
                      status: state,
                      latencyMs: diagnostic.connection.latencyMs,
                      disconnectCount: diagnostic.connection.disconnectCount,
                    },
                  },
                ]}
                diagnostic={projectConnectionPanelDiagnostic(diagnostic)}
              />
            </div>
            <p className={classes.hint}>Select the status dot to inspect and copy diagnostics.</p>
          </aside>
        </div>
      </section>
    </main>
  );
}

function readFixtureState(): SimulatorUiFixtureState {
  if (typeof window === "undefined") return "connected";
  const requested = new URLSearchParams(window.location.search).get("state");
  return FIXTURE_STATES.includes(requested as SimulatorUiFixtureState)
    ? (requested as SimulatorUiFixtureState)
    : "connected";
}

function fixtureDiagnostic(state: SimulatorUiFixtureState) {
  return {
    gameSlug: "fixture",
    route: `/simulator-ui-fixtures?state=${state}`,
    endpoint: { realtimeConfigured: true },
    connection: {
      status: state,
      connectionId: "fixture-connection",
      socketId: "fixture-socket",
      authModeLabel: "Session",
      authenticated: true,
      authStatus: "ok" as const,
      latencyMs: state === "connected" ? 42 : state === "reconnecting" ? 380 : undefined,
      reconnectAttempts: state === "connected" ? 0 : 2,
      disconnectCount: state === "disconnected" ? 1 : 0,
      lastHeartbeatAckAt: "2026-07-19T10:00:00.000Z",
    },
    presence: [{ side: "player", status: state }],
    events: [
      {
        at: "2026-07-19T10:00:00.000Z",
        type: state,
        message: `Fixture entered ${state} state`,
      },
    ],
  };
}
