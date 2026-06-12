import { useState } from "react";
import type { ReactNode } from "react";
import { useEngine, type GameEvent, type MoveLog, type RawEngineEventEntry } from "../../engine";
import { copyTextToClipboard, safeStringify } from "@tcg/simulator-runtime/debug";
import { useStickToBottom } from "@tcg/simulator-ui";
import classes from "./RawEngineEventsPanel.module.css";

const SIDE_LABEL: Record<RawEngineEventEntry["side"], string> = {
  player: "P1",
  opponent: "P2",
  system: "SYS",
};

const SIDE_CLASS: Record<RawEngineEventEntry["side"], string> = {
  player: classes.sidePlayer!,
  opponent: classes.sideOpponent!,
  system: classes.sideSystem!,
};

export function RawEngineEventsPanel() {
  const { rawEngineEvents, clearRawEngineEvents } = useEngine();
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const { scrollRef, onScroll } = useStickToBottom<HTMLDivElement>([rawEngineEvents.length]);

  const copyEngineEvents = async () => {
    const ok = await copyTextToClipboard(safeStringify(rawEngineEvents));
    setCopyStatus(ok ? "Engine trace copied." : "Clipboard unavailable.");
  };

  return (
    <div className={classes.panel}>
      <div className={classes.header}>
        <span className={classes.count}>{rawEngineEvents.length} commands</span>
        <div className={classes.tools}>
          <button
            type="button"
            className={classes.clear}
            onClick={copyEngineEvents}
            disabled={rawEngineEvents.length === 0}
          >
            Copy
          </button>
          <button
            type="button"
            className={classes.clear}
            onClick={clearRawEngineEvents}
            disabled={rawEngineEvents.length === 0}
          >
            Clear
          </button>
        </div>
      </div>
      {copyStatus ? <div className={classes.copyStatus}>{copyStatus}</div> : null}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className={classes.scroll}
        role="log"
        aria-label="Verbose engine trace"
      >
        {rawEngineEvents.length === 0 ? (
          <div className={classes.empty}>No engine trace yet.</div>
        ) : (
          rawEngineEvents.map((entry, i) => {
            const prev = rawEngineEvents[i - 1];
            const grouped = prev !== undefined && prev.side === entry.side;
            return <RawEventRow key={entry.id} entry={entry} grouped={grouped} />;
          })
        )}
      </div>
    </div>
  );
}

function RawEventRow({ entry, grouped }: { entry: RawEngineEventEntry; grouped: boolean }) {
  return (
    <details className={`${classes.row} ${grouped ? classes.rowGrouped : ""}`}>
      <summary className={classes.summary}>
        <span className={`${classes.side} ${SIDE_CLASS[entry.side]}`}>
          {SIDE_LABEL[entry.side]}
        </span>
        <span className={classes.type}>{entry.move}</span>
        <span className={classes.brief}>
          state {entry.stateID} · {entry.events.length} event{entry.events.length === 1 ? "" : "s"}{" "}
          · {summarizeCommand(entry)}
        </span>
      </summary>
      <div className={classes.details}>
        <TraceSection title="Input">
          <pre className={classes.raw}>{safeStringify(entry.input)}</pre>
        </TraceSection>
        <TraceSection title="Move logs">
          {entry.moveLogs.length === 0 ? (
            <div className={classes.detailEmpty}>No move logs emitted.</div>
          ) : (
            <ol className={classes.eventList}>
              {entry.moveLogs.map((log, index) => (
                <li key={`${log.type}-${index}`}>
                  <span className={classes.eventType}>{log.type}</span>
                  <span className={classes.eventBrief}>{summarizeMoveLog(log)}</span>
                </li>
              ))}
            </ol>
          )}
        </TraceSection>
        <TraceSection title="Events">
          {entry.events.length === 0 ? (
            <div className={classes.detailEmpty}>No engine events emitted.</div>
          ) : (
            <ol className={classes.eventList}>
              {entry.events.map((event, index) => (
                <li key={`${event.type}-${index}`}>
                  <span className={classes.eventType}>{event.type}</span>
                  <span className={classes.eventBrief}>{summarizeEvent(event)}</span>
                  <pre className={classes.raw}>{safeStringify(event)}</pre>
                </li>
              ))}
            </ol>
          )}
        </TraceSection>
      </div>
    </details>
  );
}

function TraceSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className={classes.traceSection}>
      <h4>{title}</h4>
      {children}
    </section>
  );
}

function summarizeCommand(entry: RawEngineEventEntry): string {
  const actionLog = entry.events.find((event) => event.type === "actionLog");
  if (actionLog?.type === "actionLog") {
    return actionLog.messageKey;
  }
  return entry.events.map((event) => event.type).join(", ") || "no events";
}

function summarizeMoveLog(log: MoveLog): string {
  switch (log.type) {
    case "playCard":
      return `${log.cardName} for ${log.cost}`;
    case "sellCard":
      return log.cardName;
    case "callLegend":
      return log.legendName;
    case "attackUnit":
      return `${log.attackerName} vs ${log.defenderName}`;
    case "attackRival":
      return log.attackerName;
    case "useBlocker":
      return `${log.blockerName} blocks ${log.attackerName}`;
    case "passPhase":
      return `${log.fromPhase}->${log.toPhase}`;
    case "phaseChanged":
      return `${log.fromPhase}->${log.toPhase}`;
    case "gainGig":
      return `${log.dieType}=${log.faceValue}`;
    case "mulligan":
      return `${log.drawnCount} drawn`;
    case "keepHand":
      return "hand kept";
    case "resolveCardToPlay":
      return log.cardName;
    case "resolveCardToMove":
      return log.passed ? "passed" : (log.cardName ?? "card moved");
    case "resolveDiscardFromHand":
      return `${log.discardedCount} discarded`;
    case "resolveStealGigs":
      return `${log.stolenCount} stolen`;
    case "concede":
      return "conceded";
    case "undo":
      return log.scope === "turnStart" ? "rewound to turn start" : "undid last move";
    case "activateAbility":
      return log.cardName;
    case "searchDeck":
      return `${log.revealedCount} revealed`;
    case "resolveSearchDeck":
      return `${log.lookedAt} looked, ${log.found} found`;
    case "turnStarted":
    case "turnEnded":
      return `turn ${log.turnNumber}`;
    case "gameEnded":
      return log.reason;
    case "action":
      return log.messageKey;
  }
  if (import.meta.env.DEV) {
    console.warn("[RawEngineEventsPanel] Missing move log summary", log);
  }
  return "unknown move log";
}

function summarizeEvent(event: GameEvent): string {
  switch (event.type) {
    case "cardMoved":
      return `${String(event.cardId)} ${event.fromZone}->${event.toZone}`;
    case "cardsDrawn":
      return `${event.count} card${event.count === 1 ? "" : "s"}`;
    case "cardPlayed":
      return `${String(event.cardId)} for ${event.cost}`;
    case "cardDefeated":
      return `${String(event.cardId)} defeated`;
    case "cardSpent":
    case "cardReadied":
    case "legendFlipped":
    case "legendCalled":
    case "cardSold":
      return String(event.cardId);
    case "eddiesSpent":
      return `${event.amount} for ${event.forWhat}`;
    case "eddiesGained":
      return `+${event.amount}`;
    case "gigDieRolled":
      return `${event.dieType}=${event.result}`;
    case "gigDieMoved":
      return `${String(event.dieId)} ${event.from}->${event.to}`;
    case "gigStolen":
      return `${String(event.dieId)} stolen`;
    case "gigValueChanged":
      return `${String(event.dieId)} ${event.previousValue}->${event.newValue}`;
    case "attackDeclared":
      return `${String(event.attackerId)} ${event.attackKind}`;
    case "attackResolved":
      return `${event.result}${event.gigsStolen ? `, ${event.gigsStolen} gigs` : ""}`;
    case "blockerActivated":
      return String(event.blockerId);
    case "turnStarted":
    case "turnEnded":
      return `turn ${event.turnNumber}`;
    case "phaseChanged":
      return `${event.from}->${event.to}`;
    case "gameEnded":
      return event.reason;
    case "cardAttached":
      return `${String(event.gearId)} -> ${String(event.hostId)}`;
    case "cardDetached":
      return `${String(event.gearId)} from ${String(event.hostId)}`;
    case "effectTriggered":
      return `${String(event.sourceCardId)} ${event.effectType}`;
    case "effectTargeted":
      return `${String(event.sourceCardId)} -> ${event.targets.length} target${event.targets.length === 1 ? "" : "s"}`;
    case "deckShuffled":
      return "deck";
    case "statModified":
      return `${String(event.cardId)} ${event.stat} ${event.modifier}`;
    case "ruleGranted":
      return `${String(event.cardId)} ${event.rule}`;
    case "searchPerformed":
      return `${event.zone}, found ${event.found}`;
    case "cardsRevealed":
      return `${event.cardIds.length} revealed`;
    case "actionLog":
      return event.messageKey;
  }
}
