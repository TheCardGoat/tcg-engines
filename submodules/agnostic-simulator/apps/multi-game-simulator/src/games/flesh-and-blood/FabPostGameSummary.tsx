import { FabCombatValuePanel, FabCombatValueHighlights } from "./FabCombatValuePanel";
import * as HoverCard from "@radix-ui/react-hover-card";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import { FabCardPreviewSurface } from "./FabCardPreview";
import { useFabCardArt } from "./FabPresentationCatalog";
import { Tooltip } from "@mantine/core";
import { BarChart3, ChevronRight, Eye, Home, Info, Sparkles, Swords } from "lucide-react";
import { motion } from "motion/react";
import { Fragment, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { usePrefersReducedMotion } from "../../lib/media-query";

import type {
  FabCardSummary,
  FabHandActionSummary,
  FabLifeByTurn,
  FabMatchSummary,
  FabPostGameSummaryModel,
  FabSummaryComparison,
  FabSummaryParticipant,
} from "./FabPostGameSummary.model";
import { useFabCardLocale } from "./FabPresentationCatalog";
import { FabHeroIdentityMedia } from "./FabHeroIdentityMedia";
import "./FabPostGameSummary.css";

type SummaryScope = "game" | "match";
type GameTab = "overview" | "turns" | "hands" | "cards";
type MatchTab = "overview" | "games" | "cards";

interface FabPostGameSummaryProps {
  readonly summary: FabPostGameSummaryModel;
  readonly initialScope?: SummaryScope;
  readonly initialGameTab?: GameTab;
  readonly initialMatchTab?: MatchTab;
  readonly onInspectBoard: () => void;
  readonly onMainMenu: () => void;
  readonly onPlayAgain: () => void;
  readonly onWatchReplay?: () => void;
  readonly onSaveReplay?: () => void;
  readonly onDownloadReplay?: () => void;
  readonly replayStatus?: string | null;
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
}

function MockBadge({ label = "Illustrative data" }: { readonly label?: string }) {
  return (
    <span className="fab-summary-source-badge" title="Mock data awaiting backend analytics">
      <Sparkles aria-hidden="true" size={13} strokeWidth={1.8} />
      {label}
    </span>
  );
}

/** Analytics falls back to `name:` keys when a printing was never resolved. */
function summaryCardCanonicalId(id: string | null | undefined): string | undefined {
  return id && !id.startsWith("name:") ? id : undefined;
}

const AGGREGATED_NAME_HINT_LABEL = (name: string) =>
  `${name}: this entry covers every color (pitch) of the card, not one specific printing`;

const AGGREGATED_NAME_HINT_TOOLTIP = (name: string) =>
  `Only the card name was recorded — this entry covers all colors of ${name} (red, yellow, and blue) rather than one specific printing.`;

/**
 * Helper icon for references recorded by name only. FAB printings share one
 * name across colors, so a name-only mention stands for the card as a whole.
 */
function FabAggregatedNameHint({ name }: { readonly name: string }) {
  return (
    <Tooltip label={AGGREGATED_NAME_HINT_TOOLTIP(name)} withArrow multiline position="top">
      <span
        className="fab-summary-card-reference-hint"
        role="img"
        aria-label={AGGREGATED_NAME_HINT_LABEL(name)}
      >
        <Info aria-hidden="true" size={13} strokeWidth={2} />
      </span>
    </Tooltip>
  );
}

function summaryCardEntity(
  key: string,
  name: string,
  canonicalId: string | undefined,
  imageUrl: string | undefined,
  imageAspectRatio: number,
): SimulatorEntity {
  return {
    id: key,
    title: name,
    subtitle: "",
    kind: "card",
    ownerId: "summary",
    face: "public",
    states: [],
    stats: [],
    traits: [],
    imageUrl,
    imageAspectRatio,
    dataAttributes: canonicalId ? { "data-fab-canonical-id": canonicalId } : undefined,
  };
}

function FabSummaryPreviewCard({
  open,
  onOpenChange,
  trigger,
  entity,
  name,
}: {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly trigger: ReactNode;
  readonly entity: SimulatorEntity;
  readonly name: string;
}) {
  return (
    <HoverCard.Root open={open} onOpenChange={onOpenChange} openDelay={150} closeDelay={100}>
      <HoverCard.Trigger asChild>{trigger}</HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className="fab-summary-card-preview"
          side="right"
          align="center"
          sideOffset={12}
          onEscapeKeyDown={(event) => event.stopPropagation()}
          collisionPadding={16}
          aria-label={`${name} card preview`}
        >
          <FabCardPreviewSurface entity={entity} onClose={() => onOpenChange(false)} />
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}

/** Inline card-name reference: underlined, hover/activatable printed preview. */
function FabSummaryCardReference({
  id,
  name,
}: {
  readonly id: string | null;
  readonly name: string;
}) {
  const [open, setOpen] = useState(false);
  const locale = useFabCardLocale();
  const { resolveFabCardArt } = useFabCardArt();
  const canonicalId = summaryCardCanonicalId(id);
  const art = resolveFabCardArt({ ...(canonicalId ? { canonicalId } : {}), name, locale });
  const entity = summaryCardEntity(
    `fab-summary-ref:${canonicalId ?? name}`,
    name,
    canonicalId,
    art.boardImageUrl,
    art.printedImageAspectRatio,
  );

  return (
    <span className="fab-summary-card-reference">
      <FabSummaryPreviewCard
        open={open}
        onOpenChange={setOpen}
        entity={entity}
        name={name}
        trigger={
          <button
            type="button"
            className="fab-summary-card-reference-name"
            aria-label={`Preview ${name}`}
            onClick={() => setOpen(true)}
          >
            {name}
          </button>
        }
      />
      {canonicalId === undefined ? <FabAggregatedNameHint name={name} /> : null}
    </span>
  );
}

/** Comma-separated hand card references; empty hands read as "None". */
function FabSummaryCardReferenceList({
  cards,
}: {
  readonly cards: readonly { readonly id: string | null; readonly name: string }[];
}) {
  if (cards.length === 0) return <>None</>;
  return (
    <>
      {cards.map((card, index) => (
        <Fragment key={`${card.id ?? "name"}:${card.name}:${index}`}>
          {index > 0 ? ", " : null}
          <FabSummaryCardReference id={card.id} name={card.name} />
        </Fragment>
      ))}
    </>
  );
}

function Participant({ participant, side }: { participant: FabSummaryParticipant; side: string }) {
  const locale = useFabCardLocale();
  const { resolveFabCardArt } = useFabCardArt();
  const fallbackPortrait = resolveFabCardArt({ name: participant.heroName, locale }).boardImageUrl;
  const mediaSide = side === "You" ? "viewer" : "opponent";

  return (
    <section
      className="fab-summary-participant"
      data-result={participant.result}
      data-side={mediaSide}
    >
      <FabHeroIdentityMedia
        heroName={participant.heroName}
        ownerSubscriptionTier={participant.subscriptionTier}
        fallbackPortraitUrl={fallbackPortrait}
        className="fab-summary-participant-media"
        videoClassName="fab-summary-participant-video"
        videoTestId={`fab-summary-hero-video-${mediaSide}`}
      />
      <div className="fab-summary-participant-copy">
        <span>{side}</span>
        <strong>{participant.heroName}</strong>
        <small>{participant.label}</small>
        <b>{participant.life} life</b>
      </div>
    </section>
  );
}

function ComparisonRows({
  rows,
  combatValue,
}: {
  readonly rows: readonly FabSummaryComparison[];
  readonly combatValue?: FabPostGameSummaryModel["combatValue"];
}) {
  return (
    <div className="fab-summary-comparison-rows">
      <div className="fab-summary-comparison-heading" aria-hidden="true">
        <span>You</span>
        <span />
        <span>Opponent</span>
      </div>
      {rows.map((row) => (
        <div className="fab-summary-comparison-row" key={row.id}>
          <strong>{row.viewer}</strong>
          <span>{row.label}</span>
          <strong>{row.opponent}</strong>
        </div>
      ))}
      {combatValue !== undefined ? <FabCombatValueHighlights report={combatValue} /> : null}
    </div>
  );
}

function LifeChart({ data }: { readonly data: FabLifeByTurn }) {
  const maxValue = Math.ceil(Math.max(10, ...data.viewer, ...data.opponent) / 10) * 10;
  const width = Math.max(320, data.turns.length * 56 + 64);
  const xFor = (index: number) => 44 + (index / Math.max(1, data.turns.length - 1)) * (width - 72);
  const yFor = (value: number) => 200 - (value / maxValue) * 156;
  const pathFor = (values: readonly number[]) =>
    values
      .map((value, index) =>
        index === 0 ? `M ${xFor(index)} ${yFor(value)}` : `H ${xFor(index)} V ${yFor(value)}`,
      )
      .join(" ");

  return (
    <figure className="fab-summary-life-chart">
      <figcaption>
        <span>
          <strong>Life totals</strong>
          <small>Turn-by-turn pressure</small>
        </span>
        {data.source === "mock" ? <MockBadge /> : null}
      </figcaption>
      <div className="fab-summary-chart-scroll">
        <svg
          viewBox={`0 0 ${width} 254`}
          style={{ minWidth: data.turns.length > 6 ? width : undefined }}
          role="img"
          aria-label="Life totals by turn"
        >
          {[0, 1, 2, 3, 4].map((tick) => {
            const value = (maxValue / 4) * tick;
            return (
              <g key={tick}>
                <line
                  x1="44"
                  x2={width - 28}
                  y1={yFor(value)}
                  y2={yFor(value)}
                  className="fab-summary-chart-grid"
                />
                <text
                  x="30"
                  y={yFor(value) + 4}
                  textAnchor="end"
                  className="fab-summary-chart-axis"
                >
                  {value}
                </text>
              </g>
            );
          })}
          {data.turns.map((turn, index) => (
            <g key={turn}>
              <line
                x1={xFor(index)}
                x2={xFor(index)}
                y1="36"
                y2="206"
                className="fab-summary-chart-grid"
              />
              <text x={xFor(index)} y="230" textAnchor="middle" className="fab-summary-chart-axis">
                {turn === 0 ? "Start" : `T${turn}`}
              </text>
            </g>
          ))}
          <path
            d={pathFor(data.viewer)}
            className="fab-summary-chart-line fab-summary-chart-line--viewer"
          />
          <path
            d={pathFor(data.opponent)}
            className="fab-summary-chart-line fab-summary-chart-line--opponent"
          />
          {(["viewer", "opponent"] as const).map((series) =>
            data[series].map((value, index) => {
              const otherValue = data[series === "viewer" ? "opponent" : "viewer"][index] ?? value;
              const labelAbove =
                value > otherValue || (value === otherValue && series === "viewer");
              return (
                <g key={`${series}-${index}`}>
                  <circle
                    cx={xFor(index)}
                    cy={yFor(value)}
                    r={series === "viewer" ? 5 : 3}
                    className={`fab-summary-chart-dot--${series}`}
                  />
                  <text
                    x={xFor(index)}
                    y={yFor(value) + (labelAbove ? -12 : 19)}
                    textAnchor="middle"
                    className={`fab-summary-chart-value fab-summary-chart-dot--${series}`}
                  >
                    {value}
                  </text>
                </g>
              );
            }),
          )}
        </svg>
      </div>
      <div className="fab-summary-chart-legend">
        <span>
          <i data-series="viewer" />
          You
        </span>
        <span>
          <i data-series="opponent" />
          Opponent
        </span>
      </div>
    </figure>
  );
}

function GameOverview({ summary }: { readonly summary: FabPostGameSummaryModel }) {
  const closingTurn = summary.turns.at(-1);
  return (
    <div className="fab-summary-overview-grid">
      <section className="fab-summary-panel" aria-labelledby="fab-summary-comparison-heading">
        <header>
          <span>
            <h2 id="fab-summary-comparison-heading">Head-to-head</h2>
            <p>The exchanges that shaped this game.</p>
          </span>
          {summary.comparison.some((row) => row.source === "mock") ? <MockBadge /> : null}
        </header>
        <ComparisonRows rows={summary.comparison} combatValue={summary.combatValue ?? null} />
        <FabCombatValuePanel report={summary.combatValue} />
      </section>
      <LifeChart data={summary.lifeByTurn} />
      <section className="fab-summary-turning-point">
        <span className="fab-summary-turning-point-icon">
          <Swords aria-hidden="true" size={19} />
        </span>
        <span>
          <strong>Closing turn</strong>
          <p>
            {closingTurn
              ? `Turn ${closingTurn.turn} dealt ${closingTurn.damageDealt} attack damage and committed ${closingTurn.cardsDefended} defending cards.`
              : "Turn analysis will appear when analytics are available."}
          </p>
        </span>
        {closingTurn?.source === "mock" ? <MockBadge /> : null}
      </section>
    </div>
  );
}

function TurnBreakdown({ summary }: { readonly summary: FabPostGameSummaryModel }) {
  return (
    <>
      <section
        className="fab-summary-panel fab-summary-table-panel"
        aria-labelledby="fab-summary-turns-heading"
      >
        <header>
          <span>
            <h2 id="fab-summary-turns-heading">Turn breakdown</h2>
            <p>Your recorded plays, pitches, damage and defenses on each game turn.</p>
          </span>
          {summary.turns.some((turn) => turn.source === "mock") ? <MockBadge /> : null}
        </header>
        <div className="fab-summary-table-scroll">
          <table>
            <thead>
              <tr>
                <th>Turn</th>
                <th>Played</th>
                <th>From Arsenal</th>
                <th>Pitched</th>
                <th>Pitch resources</th>
                <th>Damage</th>
                <th>Defended</th>
              </tr>
            </thead>
            <tbody>
              {summary.turns.map((turn) => (
                <tr key={turn.turn}>
                  <th>{turn.turn}</th>
                  <td>{turn.cardsPlayed}</td>
                  <td>{turn.cardsPlayedFromArsenal}</td>
                  <td>{turn.cardsPitched}</td>
                  <td>{turn.resourcesGenerated}</td>
                  <td>{turn.damageDealt}</td>
                  <td>{turn.cardsDefended}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <FabCombatValuePanel report={summary.combatValue} showTurns />
      </section>
    </>
  );
}

const handActionLabels: Record<FabHandActionSummary["kind"], string> = {
  drawn: "Drew",
  played: "Played",
  pitched: "Pitched",
  defended: "Defended",
  arsenaled: "Put in Arsenal",
  "moved-from-hand": "Moved from hand",
  "returned-to-hand": "Returned to hand",
};

function zoneLabel(zone: string): string {
  return zone.replaceAll("-", " ").replace(/^./, (character) => character.toUpperCase());
}

function HandBreakdown({ summary }: { readonly summary: FabPostGameSummaryModel }) {
  return (
    <section className="fab-summary-panel" aria-labelledby="fab-summary-hands-heading">
      <header>
        <span>
          <h2 id="fab-summary-hands-heading">Hand-by-hand</h2>
          <p>How each opening or refill hand was used, including cards carried forward.</p>
        </span>
        {summary.hands.some((hand) => hand.source === "mock") ? <MockBadge /> : null}
      </header>
      {summary.hands.length === 0 ? (
        <p className="fab-summary-empty">Hand lifecycle data is not available for this game.</p>
      ) : (
        <ol className="fab-summary-hand-list">
          {summary.hands.map((hand) => (
            <li key={hand.cycle}>
              <header>
                <strong>Hand {hand.cycle}</strong>
                <span>
                  {hand.openedBy === "opening-hand"
                    ? "Opening hand"
                    : `Refilled after turn ${hand.openedAfterTurn ?? "?"}`}
                </span>
              </header>
              <dl>
                <div>
                  <dt>Started with</dt>
                  <dd>
                    <FabSummaryCardReferenceList cards={hand.startingCards} />
                  </dd>
                </div>
                <div>
                  <dt>Carried in</dt>
                  <dd>
                    <FabSummaryCardReferenceList cards={hand.carriedCards} />
                  </dd>
                </div>
                <div>
                  <dt>Held at close</dt>
                  <dd>
                    <FabSummaryCardReferenceList cards={hand.endingCards} />
                  </dd>
                </div>
              </dl>
              {hand.actions.length > 0 ? (
                <ol className="fab-summary-hand-actions">
                  {hand.actions.map((action) => (
                    <li key={`${action.sequence}:${action.cardName}`}>
                      <span>Turn {action.turn}</span>
                      <strong>
                        <FabSummaryCardReference id={action.cardId} name={action.cardName} />
                      </strong>
                      <span>{handActionLabels[action.kind]}</span>
                      {action.origin ? <small>from {zoneLabel(action.origin)}</small> : null}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="fab-summary-empty">No recorded actions from this hand.</p>
              )}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function SummaryCardIdentity({ card }: { readonly card: FabCardSummary }) {
  const [open, setOpen] = useState(false);
  const locale = useFabCardLocale();
  const { resolveFabCardArt } = useFabCardArt();
  const canonicalId = summaryCardCanonicalId(card.id);
  const art = resolveFabCardArt({
    ...(canonicalId ? { canonicalId } : {}),
    name: card.name,
    locale,
  });
  const imageUrl = art.boardImageUrl;
  const entity = summaryCardEntity(
    card.id,
    card.name,
    canonicalId,
    imageUrl,
    art.printedImageAspectRatio,
  );

  return (
    <div className="fab-summary-card-identity">
      <FabSummaryPreviewCard
        open={open}
        onOpenChange={setOpen}
        entity={entity}
        name={card.name}
        trigger={
          <button
            type="button"
            className="fab-summary-card-trigger"
            aria-label={`Preview ${card.name}`}
            onClick={() => setOpen(true)}
          >
            <span className="fab-summary-card-art">
              {imageUrl ? (
                <img src={imageUrl} alt="" />
              ) : (
                <BarChart3 aria-hidden="true" size={20} />
              )}
            </span>
            <strong className="fab-summary-card-name">{card.name}</strong>
          </button>
        }
      />
      {canonicalId === undefined ? <FabAggregatedNameHint name={card.name} /> : null}
    </div>
  );
}

function CardRows({
  cards,
  showOwner,
}: {
  readonly cards: readonly (FabCardSummary & { readonly side: "You" | "Opponent" })[];
  readonly showOwner: boolean;
}) {
  if (cards.length === 0) {
    return (
      <p className="fab-summary-empty">
        Card analytics will appear when card event data is available.
      </p>
    );
  }
  return (
    <div className="fab-summary-table-scroll">
      <table className="fab-summary-card-table">
        <thead>
          <tr>
            <th scope="col">Card</th>
            <th scope="col">Played</th>
            <th scope="col">Pitched</th>
            <th scope="col">Defended</th>
            <th scope="col">Hits</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <tr key={`${card.side}:${card.id}`}>
              <th scope="row">
                <SummaryCardIdentity card={card} />
                {showOwner ? <span className="fab-summary-card-owner">{card.side}</span> : null}
              </th>
              <td>{card.played}</td>
              <td>{card.pitched}</td>
              <td>{card.defended}</td>
              <td>{card.hits}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CardBreakdown({
  summary,
  matchMode,
}: {
  readonly summary: FabPostGameSummaryModel;
  readonly matchMode: boolean;
}) {
  const [filter, setFilter] = useState<"You" | "Opponent" | "All">("You");
  const cards = [
    ...(filter === "Opponent"
      ? []
      : summary.cards.map((card) => ({ ...card, side: "You" as const }))),
    ...(filter === "You"
      ? []
      : summary.opponentCards.map((card) => ({ ...card, side: "Opponent" as const }))),
  ];
  const hasMockCards = cards.some((card) => card.source === "mock");
  return (
    <section className="fab-summary-panel" aria-labelledby="fab-summary-cards-heading">
      <header>
        <span>
          <h2 id="fab-summary-cards-heading">
            {matchMode ? "Cards across the match" : "Card usage"}
          </h2>
          <p>
            {matchMode
              ? hasMockCards
                ? "Illustrative usage across the previewed series."
                : "Usage summed across completed games."
              : "Only publicly revealed card activity is included."}
          </p>
        </span>
        {hasMockCards ? <MockBadge /> : null}
      </header>
      <div className="fab-summary-card-filters" role="group" aria-label="Card owner">
        {(["You", "Opponent", "All"] as const).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={filter === option}
            onClick={() => setFilter(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <CardRows cards={cards} showOwner={filter === "All"} />
    </section>
  );
}

function MatchGames({ match }: { readonly match: FabMatchSummary }) {
  return (
    <div className="fab-summary-match-games">
      {match.games.map((game) => (
        <article key={game.game} data-result={game.result}>
          <span>Game {game.game}</span>
          <strong>
            {game.result === "win" ? "Victory" : game.result === "loss" ? "Defeat" : "Draw"}
          </strong>
          <p>
            Turn {game.turnCount} · {game.ending}
          </p>
          <small>
            {game.lifeRemaining === null ? "—" : `${game.lifeRemaining} life remaining`}
          </small>
        </article>
      ))}
    </div>
  );
}

function MatchOverview({ match }: { readonly match: FabMatchSummary }) {
  const isAuthoritative = match.source === "backend";
  const gameCountLabel = `${match.games.length} ${match.games.length === 1 ? "game" : "games"}`;
  return (
    <div className="fab-summary-match-overview">
      <section className="fab-summary-series-score">
        <span>
          <strong>Series score</strong>
          <small>{isAuthoritative ? gameCountLabel : "Best of three preview"}</small>
        </span>
        <b>
          {match.viewerWins}
          <i>—</i>
          {match.opponentWins}
        </b>
        {isAuthoritative ? null : <MockBadge label="Illustrative match" />}
      </section>
      <MatchGames match={match} />
      <div className="fab-summary-overview-grid">
        <section className="fab-summary-panel">
          <header>
            <span>
              <h2>Across the match</h2>
              <p>Aggregate pressure and defense.</p>
            </span>
            {isAuthoritative ? null : <MockBadge />}
          </header>
          <ComparisonRows rows={match.comparison} />
        </section>
        {match.observations.length > 0 ? (
          <section className="fab-summary-panel fab-summary-observations">
            <header>
              <span>
                <h2>Match pattern</h2>
                <p>
                  {isAuthoritative
                    ? "Patterns across completed games."
                    : "Where the illustrative series changed."}
                </p>
              </span>
            </header>
            <ol>
              {match.observations.map((observation) => (
                <li key={observation}>{observation}</li>
              ))}
            </ol>
          </section>
        ) : null}
      </div>
    </div>
  );
}

export function FabPostGameSummary({
  summary,
  initialScope = "game",
  initialGameTab = "overview",
  initialMatchTab = "overview",
  onInspectBoard,
  onMainMenu,
  onPlayAgain,
  onWatchReplay,
  onSaveReplay,
  onDownloadReplay,
  replayStatus,
}: FabPostGameSummaryProps) {
  const [scope, setScope] = useState<SummaryScope>(initialScope);
  const [gameTab, setGameTab] = useState<GameTab>(initialGameTab);
  const [matchTab, setMatchTab] = useState<MatchTab>(initialMatchTab);
  const reduceMotion = usePrefersReducedMotion();
  const dialogRef = useRef<HTMLElement>(null);
  const tabs =
    scope === "game"
      ? (["overview", "turns", "hands", "cards"] as const)
      : (["overview", "games", "cards"] as const);
  const activeTab = scope === "game" ? gameTab : matchTab;
  const hasMockGameData =
    summary.durationSeconds.source === "mock" ||
    summary.comparison.some((row) => row.source === "mock") ||
    summary.lifeByTurn.source === "mock" ||
    summary.turns.some((turn) => turn.source === "mock") ||
    summary.cards.some((card) => card.source === "mock");
  const outcomeMeta = useMemo(
    () => [
      summary.reason.value,
      `Turn ${summary.turnNumber.value}`,
      formatDuration(summary.durationSeconds.value),
      summary.formatLabel.value,
    ],
    [summary],
  );

  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  useEffect(() => {
    const inspectOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onInspectBoard();
    };
    window.addEventListener("keydown", inspectOnEscape);
    return () => window.removeEventListener("keydown", inspectOnEscape);
  }, [onInspectBoard]);

  return (
    <motion.section
      className="fab-post-game-summary"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fab-summary-outcome"
      data-testid="fab-post-game-summary"
      data-outcome={summary.outcome}
      data-reduced-motion={reduceMotion ? "true" : undefined}
      tabIndex={-1}
      ref={dialogRef}
      initial={{
        opacity: 0,
        transform: reduceMotion ? "translate3d(0, 0, 0)" : "translate3d(0, 12px, 0)",
      }}
      animate={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
      transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
    >
      <header className="fab-summary-app-header">
        <a className="fab-summary-brand" href="/" aria-label="The Card Goat home">
          <img
            src="https://cdn.tcg.online/public/thecardgoat/branding/icon-square-72.webp"
            alt=""
            width="32"
            height="32"
          />
          <strong aria-hidden="true">The Card Goat</strong>
        </a>
        <div className="fab-summary-scope-switch" aria-label="Summary scope">
          <button type="button" aria-pressed={scope === "game"} onClick={() => setScope("game")}>
            Post-game
          </button>
          <button type="button" aria-pressed={scope === "match"} onClick={() => setScope("match")}>
            Post-match
          </button>
        </div>
        <button type="button" className="fab-summary-header-action" onClick={onInspectBoard}>
          <Eye aria-hidden="true" size={17} />
          Inspect board
        </button>
      </header>

      <div className="fab-summary-scroll-region">
        {summary.hasMockData ? (
          <aside className="fab-summary-disclosure" data-testid="fab-summary-mock-disclosure">
            <Sparkles aria-hidden="true" size={15} />
            {hasMockGameData
              ? "Unmarked game statistics come from persisted match receipts. Marked game statistics and the post-match series remain illustrative until those records are available."
              : "Game statistics come from persisted authoritative match receipts. The post-match series remains illustrative until series records are available."}
          </aside>
        ) : null}

        <main>
          <section className="fab-summary-outcome">
            <Participant participant={summary.viewer} side="You" />
            <div className="fab-summary-outcome-copy">
              <span>{scope === "game" ? "Game complete" : "Match summary"}</span>
              <h1 id="fab-summary-outcome">
                {scope === "game"
                  ? summary.outcomeTitle
                  : `${summary.match.viewerWins}–${summary.match.opponentWins}`}
              </h1>
              <p>
                {scope === "game"
                  ? summary.outcomeDetail
                  : summary.match.source === "backend"
                    ? `${summary.match.games.length} completed ${summary.match.games.length === 1 ? "game" : "games"}`
                    : "Illustrative best-of-three summary"}
              </p>
              <ul>
                {outcomeMeta.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <Participant participant={summary.opponent} side="Opponent" />
          </section>

          <nav
            className="fab-summary-tabs"
            aria-label={`${scope === "game" ? "Game" : "Match"} summary sections`}
          >
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab}
                aria-pressed={activeTab === tab}
                onClick={() =>
                  scope === "game" ? setGameTab(tab as GameTab) : setMatchTab(tab as MatchTab)
                }
              >
                {tab === "overview"
                  ? scope === "game"
                    ? "Overview"
                    : "Match"
                  : tab[0].toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>

          <div className="fab-summary-content">
            {scope === "game" && gameTab === "overview" ? <GameOverview summary={summary} /> : null}
            {scope === "game" && gameTab === "turns" ? <TurnBreakdown summary={summary} /> : null}
            {scope === "game" && gameTab === "hands" ? <HandBreakdown summary={summary} /> : null}
            {scope === "game" && gameTab === "cards" ? (
              <CardBreakdown summary={summary} matchMode={false} />
            ) : null}
            {scope === "match" && matchTab === "overview" ? (
              <MatchOverview match={summary.match} />
            ) : null}
            {scope === "match" && matchTab === "games" ? (
              <MatchGames match={summary.match} />
            ) : null}
            {scope === "match" && matchTab === "cards" ? (
              <CardBreakdown
                summary={{
                  ...summary,
                  cards: summary.match.cards ?? summary.cards,
                  opponentCards: summary.match.opponentCards ?? summary.opponentCards,
                }}
                matchMode
              />
            ) : null}
          </div>
        </main>
      </div>

      <footer className="fab-summary-actions">
        {onWatchReplay ? (
          <button type="button" onClick={onWatchReplay}>
            Watch replay
          </button>
        ) : null}
        {onSaveReplay ? (
          <button type="button" onClick={onSaveReplay}>
            Save on this device
          </button>
        ) : null}
        {onDownloadReplay ? (
          <button type="button" onClick={onDownloadReplay}>
            Download replay
          </button>
        ) : null}
        {replayStatus ? <span role="status">{replayStatus}</span> : null}
        <button type="button" onClick={onMainMenu}>
          <Home aria-hidden="true" size={17} />
          Main menu
        </button>
        <button type="button" onClick={onInspectBoard}>
          <Eye aria-hidden="true" size={17} />
          Inspect board
        </button>
        <button
          type="button"
          className="fab-summary-primary-action"
          data-testid="fab-practice-new-game"
          onClick={onPlayAgain}
        >
          Play again
          <ChevronRight aria-hidden="true" size={17} />
        </button>
      </footer>
    </motion.section>
  );
}
