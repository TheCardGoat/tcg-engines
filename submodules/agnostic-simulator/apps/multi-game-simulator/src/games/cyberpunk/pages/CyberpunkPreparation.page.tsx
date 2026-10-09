import { useEffect, useState, useRef, type ReactNode } from "react";
import { Alert, Button, Modal, Popover } from "@mantine/core";
import {
  cards as cyberpunkCards,
  getCardBySlug,
  getCyberpunkCanonicalForCardId,
} from "@tcg/cyberpunk-cards";
import {
  buildCyberpunkShareStats,
  type CyberpunkShareStats,
} from "@tcg/cyberpunk-server-adapter/deck-share-stats";
import { Check, Clock3, Code2, Cog, Layers3, UserRound } from "lucide-react";
import { z } from "zod";
import type { MatchSession } from "@tcg/game-page-contract";
import { CYBERPUNK_SIDEBOARD_SIZE } from "@tcg/shared/cyberpunk/deck-validation";
import { SimulatorRouteStatus } from "@tcg/simulator-ui";
import { useMatchSession } from "../../../simulator/MatchSessionProvider";
import { MatchSessionRecovery } from "../../../simulator/MatchSessionRecovery";
import { SupporterPlayerName } from "../../../components/SupporterPlayerName";
import { useHasHover } from "../../../lib/media-query";
import { CardNameText } from "../components/CardDisplay/CardNameToken";
import { MatchSeriesMeta } from "../components/EndGameModal/MatchSeriesMeta";
import styles from "./CyberpunkPreparation.module.css";

const quantity = z.object({
  cardId: z.string(),
  quantity: z.number().int().positive(),
  printingId: z.string().optional(),
});
const card = quantity.extend({
  card: z.object({ name: z.string(), type: z.string().optional() }).passthrough(),
});
export const poolSchema = z.object({
  stage: z.enum(["game-one", "between-games"]).optional(),
  legends: z.array(card),
  main: z.array(card).optional(),
  sideboard: z.array(card).optional(),
  sideboardLocked: z.boolean().optional(),
});
export const selectionSchema = z.object({
  legends: z.array(quantity),
  main: z.array(quantity),
  sideboard: z.array(quantity).optional(),
  sideboardLocked: z.boolean().optional(),
});
type Quantity = z.infer<typeof quantity>;
type Card = z.infer<typeof card>;
type Selection = { legends: Quantity[]; main: Quantity[]; sideboard: Quantity[] };
const publicLegendsSchema = z.object({ legends: z.array(card).optional() });
const cardTypeOrder = ["Unit", "Gear", "Program"];
const cardTypeFilters = [
  { value: "all", label: "All", Icon: Layers3 },
  { value: "Unit", label: "Unit", Icon: UserRound },
  { value: "Gear", label: "Gear", Icon: Cog },
  { value: "Program", label: "Program", Icon: Code2 },
] as const;
type CardTypeFilter = (typeof cardTypeFilters)[number]["value"];

function total(entries: readonly Quantity[]): number {
  return entries.reduce((sum, entry) => sum + entry.quantity, 0);
}

function sameQuantities(left: readonly Quantity[], right: readonly Quantity[]): boolean {
  const quantities = (entries: readonly Quantity[]) => {
    const counts = new Map<string, number>();
    for (const entry of entries) {
      const key = JSON.stringify([entry.cardId, entry.printingId ?? null]);
      counts.set(key, (counts.get(key) ?? 0) + entry.quantity);
    }
    return counts;
  };
  const a = quantities(left);
  const b = quantities(right);
  return a.size === b.size && [...a].every(([key, count]) => b.get(key) === count);
}

function cardImage(cardId: string): string | undefined {
  const canonicalId = getCyberpunkCanonicalForCardId(cardId) ?? cardId;
  return (
    getCardBySlug(canonicalId)?.imageUrl ??
    cyberpunkCards.find((candidate) => candidate.slug === canonicalId)?.imageUrl
  );
}

function CardPreviewTrigger({
  cardId,
  name,
  className,
  children,
}: {
  cardId: string;
  name: string;
  className: string;
  children: ReactNode;
}) {
  const [opened, setOpened] = useState(false);
  const hasHover = useHasHover();
  const canonicalId = getCyberpunkCanonicalForCardId(cardId) ?? cardId;
  const card =
    getCardBySlug(canonicalId) ??
    cyberpunkCards.find((candidate) => candidate.slug === canonicalId);
  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="right"
      offset={12}
      withArrow
      zIndex={6000}
      middlewares={{ flip: true, shift: true }}
      classNames={{ dropdown: styles.previewPopover, arrow: styles.previewArrow }}
    >
      <Popover.Target>
        <button
          type="button"
          className={className}
          aria-label={`Preview ${name}`}
          aria-expanded={opened}
          onMouseEnter={() => {
            if (hasHover) setOpened(true);
          }}
          onMouseLeave={() => {
            if (hasHover) setOpened(false);
          }}
          onFocus={() => setOpened(true)}
          onBlur={() => setOpened(false)}
          onClick={() => {
            if (!hasHover) setOpened((current) => !current);
          }}
        >
          {children}
        </button>
      </Popover.Target>
      <Popover.Dropdown>
        <div className={styles.previewImage}>
          {card?.imageUrl ? <img src={card.imageUrl} alt={`${name} card`} /> : <span>{name}</span>}
        </div>
        <div className={styles.previewCaption}>
          <strong>{name}</strong>
          <span>
            {card?.type ? card.type.charAt(0).toUpperCase() + card.type.slice(1) : "Card"}
            {card?.cost != null ? ` · ${card.cost} €$` : ""}
          </span>
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}

function PreparationDeckStats({
  stats,
  activeMobile,
}: {
  stats: CyberpunkShareStats | null;
  activeMobile: boolean;
}) {
  const curveBuckets = stats
    ? (() => {
        const highCostBuckets = stats.curve.filter(
          (bucket) => Number.parseInt(bucket.cost, 10) >= 7,
        );
        const highCostColors = new Map<string, number>();
        for (const bucket of highCostBuckets) {
          for (const segment of bucket.colors) {
            highCostColors.set(
              segment.color,
              (highCostColors.get(segment.color) ?? 0) + segment.count,
            );
          }
        }
        return [
          ...Array.from({ length: 6 }, (_, index) => {
            const cost = String(index + 1);
            return (
              stats.curve.find((bucket) => bucket.cost === cost) ?? {
                cost,
                count: 0,
                colors: [],
              }
            );
          }),
          {
            cost: "7+",
            count: highCostBuckets.reduce((total, bucket) => total + bucket.count, 0),
            colors: [...highCostColors].map(([color, count]) => ({ color, count })),
          },
        ];
      })()
    : [];
  const curveMax = Math.max(1, ...curveBuckets.map((bucket) => bucket.count));
  const sellPercent =
    stats && stats.mainDeckCount > 0
      ? Math.round((stats.sellTagCount / stats.mainDeckCount) * 100)
      : 0;
  return (
    <section
      className={styles.statsPanel}
      aria-label="Main deck statistics"
      data-mobile-active={activeMobile}
    >
      {stats ? (
        <div className={styles.statsContent}>
          <div className={styles.sellSummary}>
            <span className={styles.statHeader}>Sell tags</span>
            <span className={styles.sellValues}>
              <strong>{sellPercent}%</strong>
              <span>
                {stats.sellTagCount} / {stats.mainDeckCount}
              </span>
            </span>
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statHeader}>Card types</div>
            <div className={styles.typeDetail}>
              {stats.types.map((type) => (
                <span key={type.label}>
                  <i aria-hidden="true" style={{ backgroundColor: type.color }} />
                  {type.label} {type.count}
                </span>
              ))}
            </div>
            <div className={styles.statTrack}>
              {stats.types.map((type) => (
                <span
                  key={type.label}
                  style={{
                    width: `${(type.count / stats.mainDeckCount) * 100}%`,
                    backgroundColor: type.color,
                  }}
                />
              ))}
            </div>
          </div>
          <div className={styles.curveHeading}>
            <span>Cost curve</span>
            <span className={styles.curveAverages}>
              <span>
                Avg. Eddies <strong>{stats.averageCost.toFixed(1)}</strong>
              </span>
              <span>
                Avg. power <strong>{stats.averagePower?.toFixed(1) ?? "—"}</strong>
              </span>
            </span>
          </div>
          <div className={styles.curve} role="list" aria-label="Cost curve by Eddies">
            {curveBuckets.map((bucket) => (
              <div
                className={styles.curveBucket}
                role="listitem"
                aria-label={`${bucket.cost} cost: ${bucket.count} cards`}
                key={bucket.cost}
              >
                <span className={styles.curveCount}>{bucket.count || ""}</span>
                <div className={styles.curveTrack}>
                  {bucket.count > 0 && (
                    <div
                      className={styles.curveFill}
                      style={{ height: `${Math.max(6, (bucket.count / curveMax) * 100)}%` }}
                    >
                      {bucket.colors.map((segment) => (
                        <span
                          key={segment.color}
                          style={{ flexGrow: segment.count, backgroundColor: segment.color }}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <span className={styles.curveCost}>{bucket.cost}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className={styles.statsUnavailable}>Deck stats are unavailable for these cards.</p>
      )}
    </section>
  );
}

function usePreparationClock(deadlineAt: string, serverTime: string) {
  const anchor = useRef({ serverTime, receivedAt: performance.now() });
  if (anchor.current.serverTime !== serverTime)
    anchor.current = { serverTime, receivedAt: performance.now() };
  const [now, setNow] = useState(() => performance.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(performance.now()), 250);
    return () => window.clearInterval(timer);
  }, []);
  const serverNow = Date.parse(serverTime) + Math.max(0, now - anchor.current.receivedAt);
  const seconds = Math.max(0, Math.ceil((Date.parse(deadlineAt) - serverNow) / 1000));
  return {
    label: `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`,
    expired: seconds === 0,
  };
}

function moveOne(
  selection: Selection,
  from: "main" | "sideboard",
  cardId: string,
  printingId?: string,
): Selection {
  const next = {
    legends: selection.legends.map((entry) => ({ ...entry })),
    main: selection.main.map((entry) => ({ ...entry })),
    sideboard: selection.sideboard.map((entry) => ({ ...entry })),
  };
  const source = next[from];
  const destination = next[from === "main" ? "sideboard" : "main"];
  const index = source.findIndex(
    (entry) => entry.cardId === cardId && entry.printingId === printingId,
  );
  const chosen = source[index];
  if (!chosen) return selection;
  if (chosen.quantity === 1) source.splice(index, 1);
  else chosen.quantity -= 1;
  const existing = destination.find(
    (entry) => entry.cardId === chosen.cardId && entry.printingId === chosen.printingId,
  );
  if (existing) existing.quantity += 1;
  else destination.push({ ...chosen, quantity: 1 });
  return next;
}

export function CyberpunkPreparationPage({
  session,
}: {
  session: Extract<MatchSession, { phase: "preparation" }>;
}) {
  const { submitPreparation } = useMatchSession();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const view = session.preparation;
  const poolResult = poolSchema.safeParse(view.pool);
  const selectionResult = selectionSchema.safeParse(view.selection);
  if (view.kind !== "cyberpunk" || !poolResult.success || !selectionResult.success) {
    return (
      <SimulatorRouteStatus
        title="Preparation unavailable"
        message="The server returned an invalid preparation view."
      />
    );
  }
  const pool = poolResult.data;
  const initial = selectionResult.data;
  return (
    <CyberpunkPreparationDialog
      key={view.gameId}
      session={session}
      pool={pool}
      initial={initial}
      busy={busy}
      error={error}
      onSubmit={async (_suffix, body) => {
        setBusy(true);
        setError(null);
        try {
          const result = await submitPreparation(
            "firstPlayerId" in body
              ? { type: "choose_preparation_first_player", firstPlayerId: body.firstPlayerId }
              : { type: "confirm_preparation", selection: body.selection },
          );
          if (result.status === "rejected") throw new Error(result.message);
        } catch (cause) {
          setError(cause instanceof Error ? cause.message : "Could not save preparation.");
        } finally {
          setBusy(false);
        }
      }}
    />
  );
}

function DeckSection({
  title,
  entries,
  counterpart,
  expected,
  cards,
  editable,
  activeMobile,
  busy,
  direction,
  onMove,
}: {
  title: string;
  entries: Quantity[];
  counterpart: Quantity[];
  expected: number;
  cards: Map<string, Card>;
  editable: boolean;
  activeMobile: boolean;
  busy: boolean;
  direction: "main" | "sideboard";
  onMove: (from: "main" | "sideboard", entry: Quantity) => void;
}) {
  const [typeFilter, setTypeFilter] = useState<CardTypeFilter>("all");
  const groups = new Map<string, Quantity[]>();
  entries.forEach((entry) => {
    const rawType = cards.get(entry.cardId)?.card.type;
    const type = rawType
      ? rawType.charAt(0).toUpperCase() + rawType.slice(1).toLowerCase()
      : "Other";
    const group = groups.get(type) ?? [];
    group.push(entry);
    groups.set(type, group);
  });
  const orderedGroups = [...groups].sort(([left], [right]) => {
    const leftIndex = cardTypeOrder.indexOf(left);
    const rightIndex = cardTypeOrder.indexOf(right);
    return (
      (leftIndex < 0 ? cardTypeOrder.length : leftIndex) -
        (rightIndex < 0 ? cardTypeOrder.length : rightIndex) || left.localeCompare(right)
    );
  });
  const typeCounts = new Map(
    orderedGroups.map(([type, group]) => [
      type,
      group.reduce((sum, entry) => sum + entry.quantity, 0),
    ]),
  );
  const visibleEntries = orderedGroups
    .filter(([type]) => typeFilter === "all" || type === typeFilter)
    .flatMap(([, group]) => group);
  const count = total(entries);
  const countValid = count === expected;
  return (
    <section className={styles.deckSection} aria-label={title} data-mobile-active={activeMobile}>
      <header className={styles.deckSectionHeader}>
        <div className={styles.deckHeading}>
          <h3>{title}</h3>
          <div
            className={styles.typeFilters}
            role="group"
            aria-label={`Filter ${title} by card type`}
          >
            {cardTypeFilters.map(({ value, label, Icon }) => {
              const cardCount = value === "all" ? count : (typeCounts.get(value) ?? 0);
              return (
                <button
                  type="button"
                  className={styles.typeFilter}
                  aria-label={`Filter ${title} by ${label}`}
                  aria-pressed={typeFilter === value}
                  title={label}
                  key={value}
                  onClick={() => setTypeFilter(value)}
                >
                  <Icon size={13} aria-hidden="true" />
                  {direction === "main" && (
                    <>
                      <span>{label}</span>
                      {value !== "all" && <small>{cardCount}</small>}
                    </>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <span className={countValid ? styles.count : styles.countInvalid}>
          {count}
          {` / ${expected}`}
        </span>
      </header>
      <div className={styles.cardList}>
        {visibleEntries.length === 0 ? (
          <p className={styles.emptyFilter}>No cards in this type.</p>
        ) : (
          visibleEntries.map((entry, index) => {
            const name = cards.get(entry.cardId)?.card.name ?? entry.cardId;
            const image = cardImage(entry.cardId);
            const canonicalId = getCyberpunkCanonicalForCardId(entry.cardId) ?? entry.cardId;
            const cardColor =
              getCardBySlug(canonicalId)?.color ??
              cyberpunkCards.find((candidate) => candidate.slug === canonicalId)?.color;
            const otherCount =
              counterpart.find(
                (candidate) =>
                  candidate.cardId === entry.cardId && candidate.printingId === entry.printingId,
              )?.quantity ?? 0;
            const mainQuantity = direction === "main" ? entry.quantity : otherCount;
            const sideQuantity = direction === "sideboard" ? entry.quantity : otherCount;
            const renderMoveButton = (action: "side-in" | "side-out") => {
              const isSideOut = action === "side-out";
              const available = isSideOut ? mainQuantity > 0 : sideQuantity > 0;
              if (!available) return null;
              return (
                <button
                  type="button"
                  className={styles.moveButton}
                  disabled={busy}
                  onClick={(event) => {
                    event.stopPropagation();
                    onMove(isSideOut ? "main" : "sideboard", entry);
                  }}
                  aria-label={`Move one ${name} to ${isSideOut ? "sideboard" : "main deck"}`}
                  key={action}
                >
                  {isSideOut ? "Side out" : "Side in"}
                </button>
              );
            };
            const firstAction = direction === "main" ? "side-in" : "side-out";
            const lastAction = direction === "main" ? "side-out" : "side-in";
            return (
              <div
                className={styles.cardRow}
                key={`${entry.cardId}:${entry.printingId ?? ""}`}
                role="group"
                tabIndex={editable && !busy ? 0 : undefined}
                aria-label={`${name}, click to ${direction === "main" ? "side out" : "side in"}`}
                onClick={editable && !busy ? () => onMove(direction, entry) : undefined}
                onKeyDown={
                  editable && !busy
                    ? (event) => {
                        if (
                          event.target === event.currentTarget &&
                          (event.key === "Enter" || event.key === " ")
                        ) {
                          event.preventDefault();
                          onMove(direction, entry);
                        }
                      }
                    : undefined
                }
              >
                <span className={styles.cardBody}>
                  <CardPreviewTrigger cardId={entry.cardId} name={name} className={styles.cardArt}>
                    {image ? (
                      <img src={image} alt="" loading={index < 4 ? "eager" : "lazy"} />
                    ) : (
                      <span aria-hidden="true">{name.slice(0, 1)}</span>
                    )}
                  </CardPreviewTrigger>
                  <span className={styles.cardText}>
                    <CardPreviewTrigger
                      cardId={entry.cardId}
                      name={name}
                      className={styles.cardNameTrigger}
                    >
                      <CardNameText name={name} color={cardColor} className={styles.cardName} />
                    </CardPreviewTrigger>
                    <span
                      className={styles.cardCounts}
                      aria-label={`${mainQuantity} in main deck, ${sideQuantity} in sideboard`}
                    >
                      {mainQuantity} main · {sideQuantity} side
                    </span>
                  </span>
                </span>
                {editable && (
                  <span className={styles.moveButtons}>
                    {renderMoveButton(firstAction)}
                    {renderMoveButton(lastAction)}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

function ParticipantPanel({
  side,
  participant,
  legends,
  ready,
  pendingLabel,
}: {
  side: "player" | "opponent";
  participant: Extract<MatchSession, { phase: "preparation" }>["preparation"]["player"];
  legends: Card[];
  ready: boolean;
  pendingLabel: string;
}) {
  return (
    <section
      className={styles.participant}
      aria-label={side === "player" ? "Your Legends" : "Rival Legends"}
    >
      <div className={styles.participantHeading}>
        <div className={styles.participantIdentity}>
          <h3>
            <SupporterPlayerName
              name={participant.label}
              tier={participant.subscriptionTier}
              profileHref={participant.profileHref}
            />
          </h3>
          {participant.mmr != null && (
            <span className={styles.mmr}>{Math.round(participant.mmr).toLocaleString()} MMR</span>
          )}
        </div>
        <div className={styles.participantMeta}>
          <span className={ready ? styles.playerReady : styles.playerPending}>
            {ready ? (
              <Check size={14} aria-hidden="true" />
            ) : (
              <Clock3 size={14} aria-hidden="true" />
            )}
            {ready ? "Confirmed" : pendingLabel}
          </span>
        </div>
      </div>
      <div className={styles.legendList}>
        {legends.map((entry) => {
          const image = cardImage(entry.cardId);
          return (
            <CardPreviewTrigger
              cardId={entry.cardId}
              name={entry.card.name}
              className={styles.legendArt}
              key={entry.cardId}
            >
              {image ? (
                <img src={image} alt="" />
              ) : (
                <span aria-hidden="true">{entry.card.name.slice(0, 1)}</span>
              )}
            </CardPreviewTrigger>
          );
        })}
        {legends.length === 0 && (
          <span className={styles.legendUnavailable}>Legends unavailable</span>
        )}
      </div>
    </section>
  );
}

export function CyberpunkPreparationDialog({
  session,
  pool,
  initial,
  busy,
  error,
  onSubmit,
  showRecovery = true,
}: {
  session: Extract<MatchSession, { phase: "preparation" }>;
  pool: z.infer<typeof poolSchema>;
  initial: z.infer<typeof selectionSchema>;
  busy: boolean;
  error: string | null;
  onSubmit: (
    suffix: string,
    body: { firstPlayerId: string } | { selection: Selection },
  ) => Promise<void>;
  showRecovery?: boolean;
}) {
  const view = session.preparation;
  const [draft, setDraft] = useState<Selection>(() => ({
    legends: initial.legends,
    main: initial.main,
    sideboard: initial.sideboard ?? [],
  }));
  const [activeTab, setActiveTab] = useState<"sideboard" | "status">("sideboard");
  const [activeDeck, setActiveDeck] = useState<"main" | "sideboard" | "stats">("main");
  const gameIndex = session.match.gameIds.indexOf(view.gameId);
  const gameNumber = gameIndex >= 0 ? gameIndex + 1 : session.match.gameIds.length + 1;
  const scores = session.match.scores;
  const scoreLabel = scores
    ? `${scores[view.playerId] ?? 0}–${scores[view.opponent.playerId] ?? 0}`
    : gameNumber === 1
      ? "0–0"
      : "Score pending";
  const { label: clock, expired } = usePreparationClock(view.deadlineAt, view.serverTime);
  const starting = view.phase === "starting";
  const sideboardAvailable = pool.stage !== "game-one";
  const canSideboard = view.phase === "selecting" && !view.locked && !expired && sideboardAvailable;
  const bothReady = view.locked && view.opponentReady;
  const chooser =
    view.phase === "choosing-first-player" &&
    view.turnOrder.stage === "choosing" &&
    view.turnOrder.chooserId === view.playerId;
  const phaseLabel = starting
    ? "Shuffling Legends and deck"
    : view.turnOrder.stage === "chosen"
      ? view.turnOrder.firstPlayerId === view.playerId
        ? "You go first · shuffling"
        : "Rival goes first · shuffling"
      : view.phase === "choosing-first-player"
        ? chooser
          ? "You decide who goes first"
          : "Rival decides who goes first"
        : "Prepare your deck";
  const draftReplaced =
    view.locked &&
    view.selectionOutcome === "confirmed" &&
    (!sameQuantities(draft.legends, initial.legends) ||
      !sameQuantities(draft.main, initial.main) ||
      (initial.sideboard !== undefined && !sameQuantities(draft.sideboard, initial.sideboard)));
  const cards = new Map(
    [...pool.legends, ...(pool.main ?? []), ...(pool.sideboard ?? [])].map((entry) => [
      entry.cardId,
      entry,
    ]),
  );
  const opponentLegends = publicLegendsSchema.safeParse(view.opponent);
  const mainCount = total(pool.main ?? initial.main);
  const sideCount = CYBERPUNK_SIDEBOARD_SIZE;
  const draftMainCount = total(draft.main);
  const draftSideCount = total(draft.sideboard);
  // Card moves preserve the server-validated pool, Legends, RAM and copy limits.
  const countsValid = draftMainCount === mainCount && draftSideCount === sideCount;
  const remaining = Math.abs(draftMainCount - mainCount);
  const moveHint = countsValid
    ? "Click Confirm deck to send your selection."
    : `Side ${draftMainCount > mainCount ? "out" : "in"} ${remaining} more ${remaining === 1 ? "card" : "cards"} to restore the registered counts.`;
  const submissionLabel =
    view.selectionOutcome === "timeout"
      ? "Time ended · edits not sent"
      : view.locked
        ? pool.stage === "game-one"
          ? "Registered deck locked"
          : "Deck sent · confirmed"
        : busy
          ? "Sending deck…"
          : error
            ? "Deck not sent · submission failed"
            : "Deck not sent";
  const deckStats = buildCyberpunkShareStats(
    draft.main.map((entry) => ({
      canonicalId: getCyberpunkCanonicalForCardId(entry.cardId) ?? entry.cardId,
      quantity: entry.quantity,
    })),
  );
  return (
    <Modal
      opened
      onClose={() => {}}
      closeOnEscape={false}
      closeOnClickOutside={false}
      withCloseButton={false}
      centered
      size="min(96vw, 72rem)"
      title={
        <div className={styles.titleContents}>
          <span className={styles.titleSummary} tabIndex={-1} data-autofocus>
            Game {gameNumber} {sideboardAvailable ? "Sideboard" : "Deck review"}
            <span className={styles.titleScore}>{scoreLabel}</span>
          </span>
          <span className={styles.phaseStatus} role="status">
            {phaseLabel}
          </span>
          <span
            className={styles.clock}
            aria-label={starting ? "Starting game" : `Preparation time remaining ${clock}`}
          >
            <Clock3 size={18} aria-hidden="true" />
            {starting ? "Starting game" : clock}
          </span>
        </div>
      }
      overlayProps={{ backgroundOpacity: 0.56, blur: 3 }}
      classNames={{
        content: styles.modal,
        header: styles.modalHeader,
        title: styles.modalTitle,
        body: styles.modalBody,
      }}
    >
      <div className={styles.layout}>
        <div className={styles.scrollContent}>
          <div className={styles.matchup}>
            <ParticipantPanel
              side="player"
              participant={view.player}
              legends={pool.legends}
              ready={view.locked}
              pendingLabel={canSideboard ? "Sideboarding" : "Reviewing"}
            />
            <ParticipantPanel
              side="opponent"
              participant={view.opponent}
              legends={opponentLegends.success ? (opponentLegends.data.legends ?? []) : []}
              ready={view.opponentReady}
              pendingLabel={canSideboard ? "Sideboarding" : "Reviewing"}
            />
          </div>

          <div className={styles.tabs} role="tablist" aria-label="Preparation views">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "sideboard"}
              onClick={() => setActiveTab("sideboard")}
            >
              Sideboard
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "status"}
              onClick={() => setActiveTab("status")}
            >
              Match status
            </button>
          </div>
          {activeTab === "sideboard" && pool.main && pool.sideboard ? (
            <div className={styles.decks} role="tabpanel" aria-label="Sideboard">
              <div className={styles.mobileDeckTabs} aria-label="Deck sections">
                <button
                  type="button"
                  aria-pressed={activeDeck === "main"}
                  onClick={() => setActiveDeck("main")}
                >
                  Main deck <span>{total(draft.main)}</span>
                </button>
                <button
                  type="button"
                  aria-pressed={activeDeck === "sideboard"}
                  onClick={() => setActiveDeck("sideboard")}
                >
                  Sideboard <span>{total(draft.sideboard)}</span>
                </button>
                <button
                  type="button"
                  aria-pressed={activeDeck === "stats"}
                  onClick={() => setActiveDeck("stats")}
                >
                  Deck stats
                </button>
              </div>
              <DeckSection
                title="Main deck"
                entries={draft.main}
                counterpart={draft.sideboard}
                expected={mainCount}
                cards={cards}
                editable={canSideboard && !view.locked}
                activeMobile={activeDeck === "main"}
                busy={busy}
                direction="main"
                onMove={(from, entry) =>
                  setDraft((current) => moveOne(current, from, entry.cardId, entry.printingId))
                }
              />
              <div className={styles.sideboardColumn}>
                <PreparationDeckStats stats={deckStats} activeMobile={activeDeck === "stats"} />
                <DeckSection
                  title="Sideboard"
                  entries={draft.sideboard}
                  counterpart={draft.main}
                  expected={sideCount}
                  cards={cards}
                  editable={canSideboard && !view.locked}
                  activeMobile={activeDeck === "sideboard"}
                  busy={busy}
                  direction="sideboard"
                  onMove={(from, entry) =>
                    setDraft((current) => moveOne(current, from, entry.cardId, entry.printingId))
                  }
                />
              </div>
            </div>
          ) : activeTab === "sideboard" ? (
            <div className={styles.waiting} role="status">
              <div className={styles.deckStack} aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <div>
                <strong>
                  {starting
                    ? "Both decks are locked"
                    : bothReady
                      ? "Both decks are ready"
                      : "Deck confirmed"}
                </strong>
                <p>
                  {starting
                    ? "The game is being prepared."
                    : bothReady
                      ? "Turn order is next."
                      : "Waiting for your Rival to confirm their deck…"}
                </p>
              </div>
            </div>
          ) : (
            <section className={styles.matchStatus} role="tabpanel" aria-label="Match status">
              <div className={styles.statusMeta}>
                <div>
                  <MatchSeriesMeta
                    formatLabel={session.match.format === "best_of_3" ? "Best of 3" : "Best of 1"}
                    gameNumber={gameNumber}
                    seriesScore={scoreLabel}
                  />
                </div>
                <span>
                  {view.player.label} · {view.opponent.label}
                </span>
              </div>
              <div className={styles.statusDetails}>
                <div className={styles.statusCard}>
                  <span>Your deck</span>
                  <strong>{view.locked ? "Confirmed" : "Sideboarding"}</strong>
                </div>
                <div className={styles.statusCard}>
                  <span>Rival deck</span>
                  <strong>{view.opponentReady ? "Confirmed" : "Sideboarding"}</strong>
                </div>
                <div className={styles.statusCard}>
                  <span>Next step</span>
                  <strong>{bothReady ? "Choose who goes first" : "Wait for both decks"}</strong>
                </div>
              </div>
              <p className={styles.statusNote}>
                Both players confirm their decks before turn order is chosen. Hands stay hidden
                during preparation.
              </p>
            </section>
          )}
        </div>
        <div className={styles.actionArea}>
          {error && (
            <Alert color="red" role="alert">
              {error}
            </Alert>
          )}
          {view.selectionOutcome === "timeout" && (
            <Alert role="status">
              Sideboarding time ended. The server kept your last saved deck. Unsubmitted edits were
              not saved.
            </Alert>
          )}
          {draftReplaced && (
            <Alert role="status">
              Your deck was confirmed in another session. Unsubmitted edits in this tab were not
              saved.
            </Alert>
          )}
          <footer className={styles.footer} aria-label="Deck confirmation">
            <div
              className={styles.footerStatus}
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className={styles.statusSummary}>
                <strong>{submissionLabel}</strong>
                {!view.locked && (
                  <span className={countsValid ? styles.count : styles.countInvalid}>
                    {countsValid ? "Deck valid" : "Deck invalid"}
                  </span>
                )}
              </div>
              {!view.locked && (
                <div className={styles.deckCounts}>
                  Main deck {draftMainCount} / {mainCount} · Sideboard {draftSideCount} /{" "}
                  {sideCount}
                </div>
              )}
              <span>
                {expired && !starting
                  ? "Time ended. Waiting for the server…"
                  : pool.stage === "game-one" && !starting
                    ? "Review your registered deck. Sideboarding opens after Game 1."
                    : view.turnOrder.stage === "chosen"
                      ? `${view.turnOrder.firstPlayerId === view.playerId ? "You go first." : "You go second."} Shuffling Legends and deck…`
                      : bothReady && !chooser
                        ? `Waiting for ${view.opponent.label} to choose who goes first…`
                        : bothReady
                          ? "Choose who goes first."
                          : view.locked
                            ? "Waiting for your Rival to confirm their deck…"
                            : busy
                              ? "Waiting for server confirmation…"
                              : moveHint}
              </span>
            </div>
            {view.phase === "selecting" && !view.locked && (
              <Button
                className={styles.primaryButton}
                disabled={!countsValid || busy || expired}
                loading={busy}
                onClick={() => void onSubmit("", { selection: draft })}
              >
                Confirm deck
              </Button>
            )}
            {bothReady && chooser && (
              <div className={styles.choiceButtons}>
                <Button
                  className={styles.primaryButton}
                  disabled={busy || expired}
                  onClick={() => void onSubmit("/first-player", { firstPlayerId: view.playerId })}
                >
                  Go first
                </Button>
                <Button
                  className={styles.secondaryButton}
                  disabled={busy || expired}
                  onClick={() =>
                    void onSubmit("/first-player", { firstPlayerId: view.opponent.playerId })
                  }
                >
                  Go second
                </Button>
              </div>
            )}
          </footer>
        </div>
        {showRecovery && (
          <div className={styles.recovery}>
            <MatchSessionRecovery />
          </div>
        )}
      </div>
    </Modal>
  );
}
