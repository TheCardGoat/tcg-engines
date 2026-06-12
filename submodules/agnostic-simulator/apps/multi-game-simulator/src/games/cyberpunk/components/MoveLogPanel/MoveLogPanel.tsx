import { enMessages } from "@tcg/cyberpunk-engine";
import { copyTextToClipboard, safeStringify } from "@tcg/simulator-runtime/debug";
import { useStickToBottom } from "@tcg/simulator-ui";
import { useState } from "react";
import type { ReactNode } from "react";
import { useEngine, type MoveLogEntry } from "../../engine";
import { CardNameToken } from "../GameBoard/CardNameToken";
import { formatMoveLog, type FormattedMoveLog } from "./formatMoveLog";
import classes from "./MoveLogPanel.module.css";

const SPEAKER_CLASS: Record<FormattedMoveLog["chipTone"], string> = {
  player: classes.rowPlayer!,
  opponent: classes.rowOpponent!,
  system: classes.rowSystem!,
};

const SPEAKER_MARK: Record<FormattedMoveLog["chipTone"], string> = {
  player: "Y",
  opponent: "R",
  system: "S",
};

const ACTION_CARD_PARAM_KEYS = new Set([
  "attackerName",
  "blockerName",
  "cardName",
  "defenderName",
  "legendName",
  "sourceCardName",
]);

const GIG_LOG_HOVER_EVENT = "cyberpunk:gig-log-hover";
const LEGEND_LOG_HOVER_EVENT = "cyberpunk:legend-log-hover";

function logParamText(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }
  return fallback;
}

export function MoveLogPanel() {
  const { moveLogs, humanSide } = useEngine();
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const { scrollRef, onScroll } = useStickToBottom<HTMLDivElement>([moveLogs.length]);

  const copyMatchLog = async () => {
    const ok = await copyTextToClipboard(safeStringify(moveLogs));
    setCopyStatus(ok ? "Match log copied." : "Clipboard unavailable.");
  };

  return (
    <div className={classes.panel} data-testid="event-log" data-count={moveLogs.length}>
      <div className={classes.header}>
        <span className={classes.count} data-testid="event-log-count">
          {moveLogs.length} entries
        </span>
        <button
          type="button"
          className={classes.copy}
          data-testid="event-log-copy"
          onClick={copyMatchLog}
          disabled={moveLogs.length === 0}
          aria-label={
            moveLogs.length === 0 ? "No match log entries to copy" : "Copy match log entries"
          }
        >
          Copy
        </button>
      </div>
      {copyStatus ? <div className={classes.copyStatus}>{copyStatus}</div> : null}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className={classes.scroll}
        role="log"
        aria-live="polite"
        data-testid="event-log-list"
      >
        {moveLogs.length === 0 ? (
          <div className={classes.empty}>No match actions yet.</div>
        ) : (
          moveLogs.map((entry, i) => {
            const f = formatMoveLog(entry, humanSide);
            const prev = moveLogs[i - 1];
            const next = moveLogs[i + 1];

            if (entry.log.type === "turnStarted" || entry.log.type === "turnEnded") {
              return (
                <div
                  key={entry.id}
                  className={classes.turnSeparator}
                  data-testid="event-log-entry"
                  data-entry-id={entry.id}
                  data-event-type={entry.log.type}
                  data-side={entry.side}
                >
                  <span className={classes.turnSeparatorLine} />
                  <span className={classes.turnSeparatorText}>{f.sentence}</span>
                  <span className={classes.turnSeparatorLine} />
                </div>
              );
            }

            const grouped = prev !== undefined && prev.side === entry.side;
            const groupContinues = next !== undefined && next.side === entry.side;
            return (
              <div
                key={entry.id}
                className={`${classes.row} ${SPEAKER_CLASS[f.chipTone]}${
                  grouped ? ` ${classes.rowGrouped}` : ""
                }${groupContinues ? ` ${classes.rowGroupContinues}` : ""}${
                  entry.log.type === "passPhase" ? ` ${classes.rowPassPhase}` : ""
                }${entry.log.type === "phaseChanged" ? ` ${classes.rowPhaseChanged}` : ""}`}
                data-testid="event-log-entry"
                data-entry-id={entry.id}
                data-event-type={entry.log.type}
                data-side={entry.side}
              >
                <span className={classes.speakerMark} title={f.chipLabel} aria-label={f.chipLabel}>
                  {SPEAKER_MARK[f.chipTone]}
                </span>
                <span className={classes.sentence}>
                  <LogTag log={entry.log} />
                  {renderMoveLogSentence(entry, f)}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function LogTag({ log }: { log: MoveLogEntry["log"] }) {
  const tag = combatTagFor(log);
  if (!tag) {
    return null;
  }
  const isPass = log.type === "passPhase";
  const isPhaseChange = log.type === "phaseChanged";
  return (
    <span
      className={`${classes.logTag} ${classes[`tag${tag}`] ?? ""}${
        isPass ? ` ${classes.tagPass}` : ""
      }${isPhaseChange ? ` ${classes.tagPhaseChange}` : ""}`}
    >
      {isPass ? "PASS" : isPhaseChange ? "→" : tag}
    </span>
  );
}

function combatTagFor(
  log: MoveLogEntry["log"],
): "PHASE" | "FIGHT" | "STEAL" | "BLOCK" | "RESULT" | null {
  if (log.type === "passPhase" || log.type === "phaseChanged") {
    return "PHASE";
  }
  if (log.type === "attackUnit") {
    return "FIGHT";
  }
  if (log.type === "attackRival") {
    return "STEAL";
  }
  if (log.type === "useBlocker") {
    return "BLOCK";
  }
  if (log.type === "resolveStealGigs") {
    return "RESULT";
  }
  if (log.type === "action") {
    if (log.messageKey === "move.attackUnit") {
      return "FIGHT";
    }
    if (log.messageKey === "move.attackRival") {
      return "STEAL";
    }
    if (log.messageKey === "move.useBlocker") {
      return "BLOCK";
    }
    if (
      log.messageKey === "move.resolveAttack.direct" ||
      log.messageKey.startsWith("move.resolveAttack.fight.") ||
      log.messageKey === "trigger.stealGig"
    ) {
      return "RESULT";
    }
  }
  return null;
}

function renderMoveLogSentence(entry: MoveLogEntry, f: FormattedMoveLog): ReactNode {
  const log = entry.log;

  switch (log.type) {
    case "playCard":
      return (
        <>
          Played{" "}
          <CardLogToken cardId={log.cardId as unknown as string} fallbackName={log.cardName} /> for{" "}
          {log.cost} eddie{log.cost === 1 ? "" : "s"}.
        </>
      );
    case "sellCard":
      return (
        <>
          Sold <CardLogToken cardId={log.cardId as unknown as string} fallbackName={log.cardName} />
          .
        </>
      );
    case "callLegend":
      return (
        <>
          Called{" "}
          <CardLogToken cardId={log.cardId as unknown as string} fallbackName={log.legendName} />.
        </>
      );
    case "attackUnit":
      return (
        <>
          FIGHT declared:{" "}
          <CardLogToken
            cardId={log.attackerId as unknown as string}
            fallbackName={log.attackerName}
          />{" "}
          vs{" "}
          <CardLogToken
            cardId={log.defenderId as unknown as string}
            fallbackName={log.defenderName}
          />
          .
        </>
      );
    case "attackRival":
      return (
        <>
          STEAL declared:{" "}
          <CardLogToken
            cardId={log.attackerId as unknown as string}
            fallbackName={log.attackerName}
          />{" "}
          attacks directly.
        </>
      );
    case "useBlocker":
      return (
        <>
          BLOCK:{" "}
          <CardLogToken
            cardId={log.blockerId as unknown as string}
            fallbackName={log.blockerName}
          />{" "}
          redirected{" "}
          <CardLogToken
            cardId={log.attackerId as unknown as string}
            fallbackName={log.attackerName}
          />
          's attack into a fight.
        </>
      );
    case "mulligan": {
      const drawnIds = log.drawn as unknown as readonly string[] | undefined;
      if (!drawnIds || drawnIds.length === 0) {
        return f.sentence;
      }

      return (
        <>
          Mulliganed and drew {log.drawnCount} cards:{" "}
          {drawnIds.map((cardId, i) => (
            <span key={cardId}>
              <CardLogToken cardId={cardId} />
              {i === drawnIds.length - 1 ? "." : ", "}
            </span>
          ))}
        </>
      );
    }
    case "searchDeck": {
      const revealedIds = log.revealed as unknown as readonly string[] | undefined;
      if (!revealedIds || revealedIds.length === 0) {
        return f.sentence;
      }

      return (
        <>
          Revealed the top {log.revealedCount} cards of the deck:{" "}
          {revealedIds.map((cardId, i) => (
            <span key={cardId}>
              <CardLogToken cardId={cardId} />
              {i === revealedIds.length - 1 ? "." : ", "}
            </span>
          ))}
        </>
      );
    }
    case "resolveCardToPlay":
      return (
        <>
          Played{" "}
          <CardLogToken cardId={log.cardId as unknown as string} fallbackName={log.cardName} />{" "}
          (resolved choice).
        </>
      );
    case "resolveCardToMove":
      if (log.passed || !log.cardId) {
        return f.sentence;
      }
      return (
        <>
          Moved{" "}
          <CardLogToken cardId={log.cardId as unknown as string} fallbackName={log.cardName} />.
        </>
      );
    case "activateAbility":
      return (
        <>
          <CardLogToken cardId={log.cardId as unknown as string} fallbackName={log.cardName} />{" "}
          activated its ability.
        </>
      );
    case "resolveStealGigs":
      return log.attackerName ? (
        <>
          STEAL resolved: <CardLogToken fallbackName={log.attackerName} /> stole {log.stolenCount}{" "}
          Gig{log.stolenCount === 1 ? "" : "s"}
          {log.attackerPower === undefined ? "" : ` at ${log.attackerPower} power`}.
        </>
      ) : (
        f.sentence
      );
    case "action":
      return <ActionLogSentence entry={entry} />;
    default:
      return f.sentence;
  }
}

function ActionLogSentence({ entry }: { entry: MoveLogEntry }) {
  const log = entry.log;
  if (log.type !== "action") {
    return null;
  }

  const specialized = renderSpecializedActionLog(log);
  if (specialized) {
    return specialized;
  }

  const template = enMessages[log.messageKey] ?? log.messageKey;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of template.matchAll(/\{(\w+)\}/g)) {
    const [placeholder, key] = match;
    const index = match.index ?? 0;
    if (index > lastIndex) {
      nodes.push(template.slice(lastIndex, index));
    }

    const rawValue =
      key === "playerId"
        ? (log.playerId as unknown as string)
        : (log.params[key as keyof typeof log.params] ?? placeholder);
    const value = logParamText(rawValue, placeholder);
    nodes.push(
      ACTION_CARD_PARAM_KEYS.has(key) ? (
        <CardLogToken key={`${key}-${index}`} fallbackName={value} />
      ) : (
        value
      ),
    );
    lastIndex = index + placeholder.length;
  }

  if (lastIndex < template.length) {
    nodes.push(template.slice(lastIndex));
  }

  return <>{nodes}</>;
}

function renderSpecializedActionLog(
  log: Extract<MoveLogEntry["log"], { type: "action" }>,
): ReactNode {
  const cardParam = (key: string) => logParamText(log.params[key]);
  const stringParam = (key: string) => {
    const value = log.params[key];
    return value === undefined ? undefined : logParamText(value);
  };
  const count = Number(log.params.count ?? 0);
  const powerText =
    log.params.attackerPower !== undefined && log.params.defenderPower !== undefined
      ? `${logParamText(log.params.attackerPower)} vs ${logParamText(log.params.defenderPower)}. `
      : "";

  switch (log.messageKey) {
    case "move.attackUnit":
      return (
        <>
          FIGHT declared: <CardLogToken fallbackName={cardParam("attackerName")} /> vs{" "}
          <CardLogToken fallbackName={cardParam("defenderName")} />.
        </>
      );
    case "move.attackRival":
      return (
        <>
          STEAL declared: <CardLogToken fallbackName={cardParam("attackerName")} /> attacks
          directly.
        </>
      );
    case "move.useBlocker":
      return (
        <>
          BLOCK: <CardLogToken fallbackName={cardParam("blockerName")} /> redirected{" "}
          <CardLogToken fallbackName={cardParam("attackerName")} />
          's attack into a fight.
        </>
      );
    case "move.resolveAttack.fight.attackerWins":
      return (
        <>
          FIGHT resolved: {powerText}
          <CardLogToken fallbackName={cardParam("attackerName")} /> defeated{" "}
          <CardLogToken fallbackName={cardParam("defenderName")} />.
        </>
      );
    case "move.resolveAttack.fight.defenderWins":
      return (
        <>
          FIGHT resolved: {powerText}
          <CardLogToken fallbackName={cardParam("defenderName")} /> defeated{" "}
          <CardLogToken fallbackName={cardParam("attackerName")} />.
        </>
      );
    case "move.resolveAttack.fight.mutual":
      return (
        <>
          FIGHT resolved: {powerText}
          <CardLogToken fallbackName={cardParam("attackerName")} /> and{" "}
          <CardLogToken fallbackName={cardParam("defenderName")} /> were both defeated.
        </>
      );
    case "move.resolveAttack.direct":
      return (
        <>
          STEAL resolved: <CardLogToken fallbackName={cardParam("attackerName")} /> stole {count}{" "}
          Gig{count === 1 ? "" : "s"}
          {log.params.attackerPower === undefined
            ? ""
            : ` at ${logParamText(log.params.attackerPower)} power`}
          .
        </>
      );
    case "trigger.stealGig":
      return (
        <>
          <CardLogToken fallbackName={cardParam("cardName")} /> triggered, stealing {count}{" "}
          additional {cardParam("dieTypes")} Gig{count === 1 ? "" : "s"}.
        </>
      );
    case "trigger.targetResolved":
      return (
        <>
          Selected <TargetLogToken log={log} targetId={stringParam("targetId")} /> for{" "}
          <CardLogToken fallbackName={cardParam("sourceCardName")} />.
        </>
      );
    case "trigger.targetResolved.deckBottom":
      return (
        <>
          Selected <TargetLogToken log={log} targetId={stringParam("targetId")} /> for{" "}
          <CardLogToken fallbackName={cardParam("sourceCardName")} /> to move to the bottom of the
          deck.
        </>
      );
    case "trigger.defeatedTarget":
      return (
        <>
          <CardLogToken fallbackName={cardParam("sourceCardName")} /> defeated{" "}
          <TargetLogToken log={log} targetId={stringParam("targetId")} />.
        </>
      );
    case "move.resolveAdjustGig":
      return (
        <>
          Adjusted <GigLogToken dieId={stringParam("dieId")} fallbackName={cardParam("dieLabel")} />{" "}
          from {cardParam("previousValue")} to {cardParam("value")}.
        </>
      );
    case "effect.draw.resolved": {
      const drawnCount = Number(log.params.drawnCount ?? 0);
      const drawnCardIds = log.params.drawnCardIds as readonly string[] | undefined;
      if (drawnCount <= 0) {
        return null;
      }
      return (
        <>
          <CardLogToken fallbackName={cardParam("sourceCardName")} />{" "}
          <DrawEffectText count={drawnCount} cardIds={drawnCardIds} />
        </>
      );
    }
    case "effect.draw.skipped":
      return (
        <>
          <CardLogToken fallbackName={cardParam("sourceCardName")} /> did not draw:{" "}
          {cardParam("reason")}.
        </>
      );
    case "trigger.autoResolved": {
      const drawnCount = Number(log.params.drawnCount ?? 0);
      const drawnCardIds = log.params.drawnCardIds as readonly string[] | undefined;
      if (drawnCount <= 0) {
        if (Number(log.params.hasDrawEffect ?? 0) > 0) {
          return (
            <>
              Auto-resolved <CardLogToken fallbackName={cardParam("cardName")} />.
            </>
          );
        }
        return null;
      }
      return (
        <>
          Auto-resolved <CardLogToken fallbackName={cardParam("cardName")} />.{" "}
          <DrawnCardsText count={drawnCount} cardIds={drawnCardIds} />
        </>
      );
    }
    case "trigger.delayedDefeat":
      return (
        <>
          <CardLogToken fallbackName={cardParam("sourceCardName")} /> defeated{" "}
          <CardLogToken fallbackName={cardParam("targetNames")} /> at the end of the turn.
        </>
      );
    default:
      return null;
  }
}

function DrawnCardsText({ count, cardIds }: { count: number; cardIds?: readonly string[] }) {
  if (cardIds && cardIds.length > 0) {
    return (
      <>
        Drew{" "}
        {cardIds.map((cardId, index) => (
          <span key={cardId}>
            <CardLogToken cardId={cardId} />
            {index === cardIds.length - 1 ? "." : ", "}
          </span>
        ))}
      </>
    );
  }

  if (count === 1) {
    return <>Drew a card.</>;
  }

  return <>Drew {count} cards.</>;
}

function DrawEffectText({ count, cardIds }: { count: number; cardIds?: readonly string[] }) {
  if (cardIds && cardIds.length > 0) {
    return (
      <>
        drew{" "}
        {cardIds.map((cardId, index) => (
          <span key={cardId}>
            <CardLogToken cardId={cardId} />
            {index === cardIds.length - 1 ? "." : ", "}
          </span>
        ))}
      </>
    );
  }

  if (count === 1) {
    return <>drew a card.</>;
  }

  return <>drew {count} cards.</>;
}

function CardLogToken({ cardId, fallbackName }: { cardId?: string; fallbackName?: string }) {
  return <CardNameToken cardId={cardId} fallbackName={fallbackName} />;
}

function TargetLogToken({
  log,
  targetId,
}: {
  log: Extract<MoveLogEntry["log"], { type: "action" }>;
  targetId?: string;
}) {
  const { matchState } = useEngine();
  if (targetId && matchState.G.gigDice[targetId]) {
    return <GigLogToken dieId={targetId} fallbackName={logParamText(log.params.targetNames)} />;
  }
  if (isLegendLocationLog(log)) {
    return (
      <LegendLogToken
        cardId={targetId}
        fallbackName={targetId ? logParamText(log.params.targetNames) : "~a legend card~"}
        ownerId={logParamText(log.params.targetOwnerId)}
        index={Number(log.params.targetIndex)}
      />
    );
  }
  return <CardLogToken cardId={targetId} fallbackName={logParamText(log.params.targetNames)} />;
}

function GigLogToken({ dieId, fallbackName }: { dieId?: string; fallbackName?: string }) {
  const { matchState } = useEngine();
  const die = dieId ? matchState.G.gigDice[dieId] : undefined;
  const label = die?.dieType.toUpperCase() ?? fallbackName ?? dieId ?? "Gig";
  const hover = () => {
    if (!dieId) return;
    window.dispatchEvent(new CustomEvent(GIG_LOG_HOVER_EVENT, { detail: { dieId } }));
  };
  const clearHover = () => {
    window.dispatchEvent(new CustomEvent(GIG_LOG_HOVER_EVENT, { detail: { dieId: null } }));
  };

  if (!die) {
    return <span className={classes.gigTokenMissing}>{label}</span>;
  }

  return (
    <span
      className={classes.gigToken}
      tabIndex={0}
      data-testid="gig-log-token"
      data-die-id={dieId}
      onMouseEnter={hover}
      onMouseLeave={clearHover}
      onFocus={hover}
      onBlur={clearHover}
    >
      {label}
    </span>
  );
}

function isLegendLocationLog(log: Extract<MoveLogEntry["log"], { type: "action" }>): boolean {
  return (
    log.params.targetKind === "legend" &&
    log.params.targetZone === "legendArea" &&
    log.params.targetOwnerId !== undefined &&
    log.params.targetIndex !== undefined
  );
}

function LegendLogToken({
  cardId,
  fallbackName,
  ownerId,
  index,
}: {
  cardId?: string;
  fallbackName: string;
  ownerId: string;
  index: number;
}) {
  const hover = () => {
    window.dispatchEvent(
      new CustomEvent(LEGEND_LOG_HOVER_EVENT, {
        detail: { ownerId, index },
      }),
    );
  };
  const clearHover = () => {
    window.dispatchEvent(
      new CustomEvent(LEGEND_LOG_HOVER_EVENT, {
        detail: { ownerId: null, index: null },
      }),
    );
  };

  return (
    <span
      className={classes.legendToken}
      tabIndex={0}
      data-testid="legend-log-token"
      data-card-id={cardId}
      data-owner-id={ownerId}
      data-zone-index={Number.isFinite(index) ? index : undefined}
      onMouseEnter={hover}
      onMouseLeave={clearHover}
      onFocus={hover}
      onBlur={clearHover}
    >
      <CardLogToken cardId={cardId} fallbackName={fallbackName} />
    </span>
  );
}
