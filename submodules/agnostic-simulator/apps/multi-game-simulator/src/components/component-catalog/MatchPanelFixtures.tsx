import { useMemo, useState } from "react";
import type {
  SimulatorEntity,
  SimulatorEventLogEntry,
  SimulatorMatchHistoryRow,
  SimulatorStatementsState,
} from "@tcg/simulator-contract";
import { composeDropEligibility, unsupportedTimeoutChannel } from "@tcg/protocol";
import { reduceSimulatorStatements } from "@tcg/simulator-runtime/statements";
import {
  AiControlPanel,
  ChatPanel,
  ConnectionPanel,
  DropClaimControl,
  EventLogPanel,
  MatchHistoryPanel,
  PostGameModal,
  TabletopStatementsPanel,
  type AiControlPanelProps,
  type ChatMessage,
  type ConnectionPanelConnectionStatus,
} from "@tcg/simulator-ui";
import { LiveFixtureFrame as Frame } from "./LiveFixtureFrame";
import classes from "./LiveFixtures.module.css";

export const matchPanelComponents = [
  "AiControlPanel",
  "ChatPanel",
  "ConnectionPanel",
  "DropClaimControl",
  "EventLogPanel",
  "MatchHistoryPanel",
  "PostGameModal",
  "TabletopStatementsPanel",
] as const;
const timestamp = "2026-10-03T12:00:00Z";
const initialMessages: ChatMessage[] = [
  {
    id: "welcome",
    senderSide: "system",
    senderLabel: "Table",
    text: "Local preview. Messages stay in this fixture.",
    timestamp,
  },
];
export default function MatchPanelFixtures({ entities }: { entities: readonly SimulatorEntity[] }) {
  const [messages, setMessages] = useState(initialMessages);
  const [canSend, setCanSend] = useState(true);
  const [freeText, setFreeText] = useState(true);
  const [compact, setCompact] = useState(false);
  const [connection, setConnection] = useState<ConnectionPanelConnectionStatus>("connected");
  const [now, setNow] = useState(Date.now);
  const [dropReady, setDropReady] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [historyStyle, setHistoryStyle] = useState<"grouped" | "journal">("grouped");
  const [outcome, setOutcome] = useState<"win" | "loss" | "draw">("draw");
  const [postGame, setPostGame] = useState(false);
  const [mode, setMode] = useState<AiControlPanelProps["mode"]>("step");
  const [speed, setSpeed] = useState<AiControlPanelProps["speed"]>("balanced");
  const [aiStatus, setAiStatus] = useState<AiControlPanelProps["status"]>("paused");
  const [steps, setSteps] = useState(0);
  const [strategy, setStrategy] = useState<string | null>("preview");
  const [statements, setStatements] = useState<SimulatorStatementsState>({
    statements: [
      {
        id: "sample",
        authorId: "opponent",
        text: "Ready for the next action.",
        createdAt: now,
        acknowledgements: [],
      },
    ],
    activity: [],
  });
  const [result, setResult] = useState("Try a panel control.");
  const card = entities.find((entity) => entity.face === "public");
  const entries: SimulatorEventLogEntry[] = [
    { id: "start", turn: 1, phase: "setup", timestamp, message: "Match started", tags: ["system"] },
    {
      id: "card",
      turn: 1,
      phase: "main",
      seatId: "player",
      timestamp,
      message: card ? `${card.title} entered the preview zone` : "A card entered the preview zone",
      tags: ["move"],
      entityIds: card ? [card.id] : [],
    },
    {
      id: "pass",
      turn: 2,
      phase: "main",
      seatId: "opponent",
      timestamp,
      message: "Opponent passed priority",
      tags: ["move"],
    },
  ];
  const history: SimulatorMatchHistoryRow[] = entries.map((entry, index) => ({
    id: entry.id,
    turn: entry.turn,
    timestamp,
    actorSeatId: entry.seatId,
    turnOwnerSeatId: entry.seatId,
    kind: index === 0 ? "match-start" : "activity",
    title: entry.message,
    entityIds: entry.entityIds,
  }));
  const send = (text: string) =>
    setMessages((previous) => [
      ...previous,
      {
        id: `message-${previous.length}`,
        senderSide: "player",
        senderLabel: "You",
        text,
        timestamp,
      },
    ]);
  const drop = useMemo(
    () =>
      composeDropEligibility({
        nowMs: now,
        timeout: unsupportedTimeoutChannel(),
        disconnect: {
          connected: connection === "connected",
          disconnectedAtMs: now - (dropReady ? 30_000 : 20_000),
        },
      }),
    [now, dropReady, connection],
  );
  return (
    <>
      <p>Panel messages, claims, and AI controls affect only this local preview.</p>
      <div className={classes.controls}>
        <label>
          <input
            type="checkbox"
            checked={compact}
            onChange={(event) => setCompact(event.target.checked)}
          />{" "}
          Compact panels
        </label>
        <label>
          <input
            type="checkbox"
            checked={empty}
            onChange={(event) => setEmpty(event.target.checked)}
          />{" "}
          Empty logs and history
        </label>
        <button
          onClick={() => {
            setMessages(initialMessages);
            setClaimed(false);
            setSteps(0);
            setCanSend(true);
            setFreeText(true);
            setCompact(false);
            setConnection("connected");
            setNow(Date.now());
            setDropReady(false);
            setEmpty(false);
            setHistoryStyle("grouped");
            setOutcome("draw");
            setPostGame(false);
            setMode("step");
            setSpeed("balanced");
            setAiStatus("paused");
            setStrategy("preview");
            setStatements({
              statements: [
                {
                  id: "sample",
                  authorId: "opponent",
                  text: "Ready for the next action.",
                  createdAt: Date.now(),
                  acknowledgements: [],
                },
              ],
              activity: [],
            });
            setResult("Panels reset.");
          }}
        >
          Reset panels
        </button>
      </div>
      <div className={classes.grid}>
        <Frame title="Chat and preset messages" components={["ChatPanel"]}>
          <div className={classes.controls}>
            <label>
              <input
                type="checkbox"
                checked={canSend}
                onChange={(event) => setCanSend(event.target.checked)}
              />{" "}
              Allow preview messages
            </label>
            <label>
              <input
                type="checkbox"
                checked={freeText}
                onChange={(event) => setFreeText(event.target.checked)}
              />{" "}
              Free text enabled
            </label>
          </div>
          <ChatPanel
            messages={messages}
            presets={[
              { id: "ready", label: "Ready" },
              { id: "good-game", label: "Good game" },
            ]}
            compact={compact}
            canSend={canSend}
            freeTextEnabled={freeText}
            canRequestFreeText={!freeText}
            onRequestFreeText={() => setFreeText(true)}
            onSendText={send}
            onSendPreset={(id) => send(id === "ready" ? "Ready" : "Good game")}
          />
        </Frame>
        <Frame
          title="Connection and drop recovery"
          components={["ConnectionPanel", "DropClaimControl"]}
        >
          <label>
            Opponent connection{" "}
            <select
              aria-label="Opponent connection"
              value={connection}
              onChange={(event) => {
                const value = event.target.value;
                if (
                  value === "connected" ||
                  value === "reconnecting" ||
                  value === "disconnected" ||
                  value === "unknown"
                ) {
                  setConnection(value);
                  setNow(Date.now());
                  if (value === "connected") setDropReady(false);
                }
              }}
            >
              <option>connected</option>
              <option>reconnecting</option>
              <option>disconnected</option>
              <option>unknown</option>
            </select>
          </label>
          <ConnectionPanel
            embedded
            sides={[
              {
                side: "player",
                label: "You",
                self: true,
                connection: { status: "connected", latencyMs: 24 },
              },
              {
                side: "opponent",
                label: "Opponent",
                connection: {
                  status: connection,
                  latencyMs: connection === "connected" ? 60 : undefined,
                  disconnectCount: connection === "connected" ? 0 : 1,
                },
              },
            ]}
          />
          <label>
            <input
              type="checkbox"
              checked={dropReady}
              onChange={(event) => {
                setDropReady(event.target.checked);
                setConnection("disconnected");
                setNow(Date.now());
                setClaimed(false);
              }}
            />{" "}
            Drop claim eligible
          </label>
          <DropClaimControl
            eligibility={drop}
            serverNowMs={now}
            disabled={claimed}
            onClaim={() => {
              setClaimed(true);
              setResult("Preview drop claimed. No match was changed.");
            }}
          />
        </Frame>
        <Frame title="Event log" components={["EventLogPanel"]}>
          <EventLogPanel
            entries={empty ? [] : entries}
            embedded
            availableEntityIds={card ? [card.id] : []}
            onHighlightEntity={(ids) => setResult(`Preview highlight: ${ids.join(", ")}`)}
            seatLabels={{ player: "You", opponent: "Opponent" }}
          />
        </Frame>
        <Frame title="Match history" components={["MatchHistoryPanel"]}>
          <label>
            History layout{" "}
            <select
              value={historyStyle}
              onChange={(event) =>
                setHistoryStyle(event.target.value === "journal" ? "journal" : "grouped")
              }
            >
              <option>grouped</option>
              <option>journal</option>
            </select>
          </label>
          <MatchHistoryPanel
            rows={empty ? [] : history}
            appearance={historyStyle}
            viewerSeatId="player"
            turnOwnerLabel={(turn) => (turn === 1 ? "You" : "Opponent")}
            embedded
          />
        </Frame>
        <Frame title="AI and practice controls" components={["AiControlPanel"]}>
          <AiControlPanel
            embedded
            compact={compact}
            mode={mode}
            speed={speed}
            status={aiStatus}
            strategies={[{ id: "preview", label: "Preview strategy" }]}
            selectedStrategyId={strategy}
            canStep={mode === "step" && aiStatus !== "you-control"}
            isTakeover={aiStatus === "you-control"}
            onChangeMode={(value) => {
              setMode(value);
              setAiStatus(value === "auto" ? "thinking" : "paused");
            }}
            onChangeSpeed={setSpeed}
            onChangeStrategy={setStrategy}
            onStep={() => {
              setSteps((value) => value + 1);
              setResult("Preview AI step. No game action was executed.");
            }}
            onTakeControl={() => setAiStatus("you-control")}
            onReleaseControl={() => setAiStatus("paused")}
          />
          <p>Preview steps: {steps}</p>
        </Frame>
        <Frame title="Tabletop announcements" components={["TabletopStatementsPanel"]}>
          <TabletopStatementsPanel
            state={statements}
            viewerId="player"
            onAction={(action) =>
              setStatements((previous) =>
                reduceSimulatorStatements(previous, {
                  ...action,
                  actorId: "player",
                  actionId: crypto.randomUUID(),
                  at: Date.now(),
                }),
              )
            }
          />
        </Frame>
        <Frame title="Post-game summary" components={["PostGameModal"]}>
          <label>
            Preview outcome{" "}
            <select
              value={outcome}
              onChange={(event) => {
                const value = event.target.value;
                if (value === "win" || value === "loss" || value === "draw") setOutcome(value);
              }}
            >
              <option>draw</option>
              <option>win</option>
              <option>loss</option>
            </select>
          </label>
          <button onClick={() => setPostGame(true)}>Open post-game summary</button>
          <PostGameModal
            open={postGame}
            outcome={outcome}
            layout={compact ? "compact" : "versus"}
            reason="Local component preview"
            participants={{ left: <strong>You</strong>, right: <strong>Opponent</strong> }}
            sections={[
              {
                id: "history",
                label: "History",
                content: (
                  <MatchHistoryPanel rows={history} turnOwnerLabel={() => "Preview"} embedded />
                ),
              },
            ]}
            onClose={() => setPostGame(false)}
          />
        </Frame>
      </div>
      <p role="status">{result}</p>
    </>
  );
}
