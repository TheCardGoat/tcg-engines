import { getCard } from "@tcg/alpha-clash-cards";
import type { AcCardDefinition } from "@tcg/alpha-clash-types";
import styles from "./Tabletop.module.css";

export type AcSeat = "player-one" | "player-two";

/**
 * Viewer-safe card line the live board renders. Mirrors the adapter's card
 * projection (hidden information is stripped server-side, rule 400.2); the
 * page parses the wire projection into this shape before it reaches the UI.
 */
export interface LiveBoardCard {
  readonly instanceId: string;
  readonly zone: string;
  readonly controller: string;
  readonly ready: boolean;
  readonly faceDown: boolean;
  readonly definitionId: string | null;
  readonly name: string | null;
  readonly clashDamage: number;
  readonly phaseDamage: number;
}

export interface LiveBoardPlayer {
  readonly name: string;
  readonly health: number;
  readonly maxHealth: number;
  readonly handSize: number;
  readonly deckSize: number;
}

/** The subset of the seated viewer projection the live board renders. */
export interface LiveBoardState {
  readonly cards: readonly LiveBoardCard[];
  readonly players: Record<AcSeat, LiveBoardPlayer>;
  readonly activePlayer: AcSeat;
  readonly turnNumber: number;
  readonly phaseName: string;
  readonly portalOpen: boolean;
  readonly clash: {
    readonly attackerId: string;
    readonly targetId: string;
    readonly step: string;
  } | null;
  readonly standbyCount: number;
}

export interface LiveBoardProps {
  board: LiveBoardState;
  viewerSeat: AcSeat;
  participantNames: { readonly p1?: string; readonly p2?: string };
  /** Cards the advertised actions may select; null when nothing is selectable. */
  selectableInstanceIds: ReadonlySet<string> | null;
  selectedInstanceIds: ReadonlySet<string>;
  onCardClick?: (instanceId: string) => void;
}

const CLASH_STEP_LABELS: Record<string, string> = {
  attack: "Attack Step",
  counter: "Counter Step",
  obstruct: "Obstruct Step",
  attackerBuff: "Attacker's Clash Buff Step",
  defenderBuff: "Defender's Clash Buff Step",
  damage: "Damage Step",
};

const PHASE_LABELS: Record<string, string> = {
  setup: "Setup",
  expansion: "Expansion — Resource Step",
  primary: "Primary Phase",
  endOfTurn: "End of Turn",
  complete: "Match complete",
};

function phaseLabel(board: LiveBoardState): string {
  if (board.phaseName === "clash") {
    const step = board.clash?.step ?? "";
    return `Clash — ${CLASH_STEP_LABELS[step] ?? step}`;
  }
  return PHASE_LABELS[board.phaseName] ?? board.phaseName;
}

function definitionOf(definitionId: string | null): AcCardDefinition | undefined {
  if (!definitionId) return undefined;
  try {
    return getCard(definitionId);
  } catch {
    return undefined;
  }
}

function printedStat(
  definition: AcCardDefinition | undefined,
  stat: "attack" | "defense",
): number | undefined {
  if (!definition) return undefined;
  return stat in definition ? (definition as unknown as Record<string, number>)[stat] : undefined;
}

function seatDisplayName(
  board: LiveBoardState,
  seat: AcSeat,
  participantNames: { readonly p1?: string; readonly p2?: string },
): string {
  const participant = seat === "player-one" ? participantNames.p1 : participantNames.p2;
  const trimmed = participant?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : (board.players[seat]?.name ?? seat);
}

function highlightFor(
  card: LiveBoardCard,
  attackerId: string | undefined,
  targetId: string | undefined,
): string | undefined {
  if (card.instanceId === attackerId) return styles.cardAttacker;
  if (card.instanceId === targetId) return styles.cardTarget;
  return undefined;
}

interface CardSlotProps {
  card: LiveBoardCard;
  small?: boolean;
  highlight?: string;
  selectable: boolean;
  selected: boolean;
  onSelect?: (instanceId: string) => void;
}

/** A card in its slot; engaged cards sit sideways like tapped physical cards. */
function CardSlot({
  card,
  small = false,
  highlight,
  selectable,
  selected,
  onSelect,
}: CardSlotProps) {
  const definition = definitionOf(card.definitionId);
  const engagedClass = card.ready ? "" : ` ${styles.slotEngaged}`;
  const sizeClass = small ? ` ${styles.cardDim}` : "";
  const pickClass = selected
    ? ` ${styles.cardSelected}`
    : selectable
      ? ` ${styles.cardSelectable}`
      : "";
  const clickable = selectable && onSelect !== undefined;
  const slotClassName = clickable
    ? `${styles.slot}${engagedClass} ${styles.slotButton}`
    : `${styles.slot}${engagedClass}`;

  if (card.faceDown) {
    const back = <div className={`${styles.cardBack}${sizeClass}${pickClass}`} />;
    return clickable ? (
      <button
        type="button"
        className={slotClassName}
        aria-label="Face-down card"
        aria-pressed={selected}
        data-testid={`ac-card:${card.instanceId}`}
        onClick={() => onSelect?.(card.instanceId)}
      >
        {back}
      </button>
    ) : (
      <div className={slotClassName} data-testid={`ac-card:${card.instanceId}`}>
        {back}
      </div>
    );
  }

  const damage = card.clashDamage + card.phaseDamage;
  const face = (
    <div
      className={`${styles.cardFace}${sizeClass}${highlight ? ` ${highlight}` : ""}${pickClass}`}
    >
      <div className={styles.cardName}>{card.name ?? "?"}</div>
      {damage > 0 ? <div className={styles.cardDamage}>{damage}</div> : null}
      <div className={styles.cardStats}>
        <span className={styles.cardAtk}>A {printedStat(definition, "attack") ?? "—"}</span>
        <span className={styles.cardDef}>D {printedStat(definition, "defense") ?? "—"}</span>
      </div>
    </div>
  );
  return clickable ? (
    <button
      type="button"
      className={slotClassName}
      aria-label={card.name ?? "Card"}
      aria-pressed={selected}
      data-testid={`ac-card:${card.instanceId}`}
      onClick={() => onSelect?.(card.instanceId)}
    >
      {face}
    </button>
  ) : (
    <div className={slotClassName} data-testid={`ac-card:${card.instanceId}`}>
      {face}
    </div>
  );
}

interface SelectionProps {
  selectableInstanceIds: ReadonlySet<string> | null;
  selectedInstanceIds: ReadonlySet<string>;
  onCardClick?: (instanceId: string) => void;
}

function cardInteraction(
  card: LiveBoardCard,
  { selectableInstanceIds, selectedInstanceIds, onCardClick }: SelectionProps,
): { selectable: boolean; selected: boolean; onSelect?: (instanceId: string) => void } {
  return {
    selectable: selectableInstanceIds?.has(card.instanceId) === true,
    selected: selectedInstanceIds.has(card.instanceId),
    onSelect: onCardClick,
  };
}

interface MatProps extends SelectionProps {
  board: LiveBoardState;
  seat: AcSeat;
  own: boolean;
  participantNames: { readonly p1?: string; readonly p2?: string };
}

/** Phases reference, printed on the physical playmat; live step highlighted. */
function PhasesPanel({ board }: { board: LiveBoardState }) {
  const clashStep = board.phaseName === "clash" ? (board.clash?.step ?? "") : undefined;
  return (
    <div className={`${styles.zone} ${styles.phasesZone}`}>
      <span className={styles.zoneLabel}>Phases</span>
      <div className={styles.phaseGroup}>
        <div
          className={`${styles.phaseGroupTitle} ${board.phaseName === "expansion" ? styles.phaseGroupTitleCurrent : ""}`}
        >
          Expansion Phase
        </div>
        <div
          className={`${styles.phaseStep} ${board.phaseName === "expansion" ? styles.phaseStepCurrent : ""}`}
        >
          Draw Step
        </div>
        <div
          className={`${styles.phaseStep} ${board.phaseName === "expansion" ? styles.phaseStepCurrent : ""}`}
        >
          Resource Step
        </div>
      </div>
      <div className={styles.phaseGroup}>
        <div
          className={`${styles.phaseGroupTitle} ${board.phaseName === "primary" ? styles.phaseGroupTitleCurrent : ""}`}
        >
          Primary Phase
        </div>
        <div className={styles.phaseStep}>
          This is when a player is allowed to play cards, activate effects, set face-down cards,
          attach Weapons, activate Portal, initiate a clash.
        </div>
      </div>
      <div className={styles.phaseGroup}>
        <div
          className={`${styles.phaseGroupTitle} ${board.phaseName === "clash" ? styles.phaseGroupTitleCurrent : ""}`}
        >
          Clash Phase
        </div>
        {Object.entries(CLASH_STEP_LABELS).map(([step, label]) => (
          <div
            key={step}
            className={`${styles.phaseStep} ${clashStep === step ? styles.phaseStepCurrent : ""}`}
          >
            {label}
          </div>
        ))}
      </div>
      <div className={styles.logoZone}>Alpha Clash</div>
    </div>
  );
}

/** The Contender card keeps its printed layout: name, health bar, stats. */
function ContenderSlot({
  card,
  player,
  highlight,
  interaction,
}: {
  card: LiveBoardCard;
  player: LiveBoardPlayer;
  highlight?: string;
  interaction: { selectable: boolean; selected: boolean; onSelect?: (instanceId: string) => void };
}) {
  const definition = definitionOf(card.definitionId);
  const healthPct =
    player.maxHealth > 0 ? Math.max(0, Math.min(100, (player.health / player.maxHealth) * 100)) : 0;
  const pickClass = interaction.selected
    ? ` ${styles.cardSelected}`
    : interaction.selectable
      ? ` ${styles.cardSelectable}`
      : "";
  const className = `${styles.cardFace} ${styles.contenderCard}${
    highlight ? ` ${highlight}` : ""
  }${pickClass}`;
  const body = (
    <>
      <div className={styles.contenderName}>{card.name ?? "Contender"}</div>
      <div className={styles.healthWrap}>
        <div className={styles.healthText}>
          <span>{player.health}</span>
          <span>/ {player.maxHealth}</span>
        </div>
        <div className={styles.healthBar}>
          <div
            className={`${styles.healthFill} ${healthPct <= 30 ? styles.healthFillLow : ""}`}
            style={{ width: `${healthPct}%` }}
          />
        </div>
      </div>
      <div className={styles.contenderStats}>
        <span className={styles.cardAtk}>A {printedStat(definition, "attack") ?? "?"}</span>
        <span className={styles.cardDef}>D {printedStat(definition, "defense") ?? "?"}</span>
      </div>
    </>
  );
  if (interaction.selectable && interaction.onSelect) {
    return (
      <button
        type="button"
        className={`${className} ${styles.slotButton}`}
        aria-pressed={interaction.selected}
        aria-label={card.name ?? "Contender"}
        onClick={() => interaction.onSelect?.(card.instanceId)}
      >
        {body}
      </button>
    );
  }
  return <div className={className}>{body}</div>;
}

/** One player's printed playmat, rendered from the seated viewer projection. */
function PlayerMat({
  board,
  seat,
  own,
  participantNames,
  selectableInstanceIds,
  selectedInstanceIds,
  onCardClick,
}: MatProps) {
  const interaction: SelectionProps = {
    selectableInstanceIds,
    selectedInstanceIds,
    onCardClick,
  };
  const seatCards = board.cards.filter((card) => card.controller === seat);
  const clash = seatCards.filter((card) => card.zone === "clash");
  const accessories = seatCards.filter((card) => card.zone === "accessory");
  const resources = seatCards.filter((card) => card.zone === "resource");
  const resourceReady = resources.filter((card) => card.ready).length;
  const oblivion = seatCards.filter((card) => card.zone === "oblivion").length;
  const clashground = seatCards.find((card) => card.zone === "clashground");
  const contender = seatCards.find((card) => card.zone === "contender");
  const player = board.players[seat];
  const clashAttackerId = board.clash?.attackerId;
  const clashTargetId = board.clash?.targetId;
  const clashgroundSelectable = clashground
    ? (selectableInstanceIds?.has(clashground.instanceId) === true && onCardClick !== undefined) ||
      selectedInstanceIds.has(clashground.instanceId)
    : false;
  const clashgroundSelected = clashground ? selectedInstanceIds.has(clashground.instanceId) : false;
  const clashgroundClassName = clashground
    ? `${styles.cardFace} ${styles.clashgroundCard}${clashgroundSelectable && !clashgroundSelected ? ` ${styles.cardSelectable}` : ""}${clashgroundSelected ? ` ${styles.cardSelected}` : ""}`
    : "";

  return (
    <div className={styles.mat} role="group" aria-label={own ? "Your playmat" : "Opponent playmat"}>
      <div className={`${styles.zone} ${styles.contenderZone}`}>
        <span className={styles.zoneLabel}>
          Contender · {seatDisplayName(board, seat, participantNames)}
        </span>
        {contender ? (
          <ContenderSlot
            card={contender}
            player={player}
            highlight={highlightFor(contender, clashAttackerId, clashTargetId)}
            interaction={cardInteraction(contender, interaction)}
          />
        ) : (
          <span className={styles.zoneEmpty}>—</span>
        )}
      </div>

      {own ? <PhasesPanel board={board} /> : null}

      <div className={`${styles.zone} ${styles.clashZone}`}>
        <span className={styles.zoneLabel}>Clash Zone</span>
        {clash.length === 0 ? (
          <span className={styles.zoneEmpty}>—</span>
        ) : (
          <div className={styles.zoneBody}>
            {clash.map((card) => (
              <CardSlot
                key={card.instanceId}
                card={card}
                highlight={highlightFor(card, clashAttackerId, clashTargetId)}
                {...cardInteraction(card, interaction)}
              />
            ))}
          </div>
        )}
      </div>

      <div className={`${styles.zone} ${styles.accessoryZone}`}>
        <span className={styles.zoneLabel}>Accessory Zone</span>
        {accessories.length === 0 ? (
          <span className={styles.zoneEmpty}>—</span>
        ) : (
          <div className={styles.zoneBody}>
            {accessories.map((card) => (
              <CardSlot
                key={card.instanceId}
                card={card}
                small
                {...cardInteraction(card, interaction)}
              />
            ))}
          </div>
        )}
      </div>

      <div className={`${styles.zone} ${styles.resourceZone}`}>
        <span className={styles.zoneLabel}>Resource Zone</span>
        <span className={styles.zoneEmpty}>
          {resources.length > 0 ? `${resourceReady} ready / ${resources.length}` : "—"}
        </span>
        {resources.length > 0 ? (
          <div className={styles.zoneBody}>
            {resources.map((card) => (
              <div
                key={card.instanceId}
                className={`${styles.cardBack} ${styles.cardBackSmall} ${styles.resourceCard} ${
                  card.ready ? styles.resourceCardReady : styles.resourceCardEngaged
                }`}
                title={card.ready ? "Ready resource" : "Engaged resource"}
              />
            ))}
          </div>
        ) : null}
      </div>

      <div className={`${styles.zone} ${styles.clashgroundZone}`}>
        <span className={styles.zoneLabel}>Clashground</span>
        {clashground ? (
          <div className={styles.zoneBody}>
            {clashgroundSelectable ? (
              <button
                type="button"
                className={`${clashgroundClassName} ${styles.slotButton}`}
                aria-label={clashground.name ?? "Clashground"}
                aria-pressed={clashgroundSelected}
                onClick={() => onCardClick?.(clashground.instanceId)}
              >
                <div className={styles.clashgroundName}>{clashground.name ?? "Clashground"}</div>
                <div className={styles.clashgroundTag}>Clashground</div>
              </button>
            ) : (
              <div className={clashgroundClassName}>
                <div className={styles.clashgroundName}>{clashground.name ?? "Clashground"}</div>
                <div className={styles.clashgroundTag}>Clashground</div>
              </div>
            )}
          </div>
        ) : (
          <span className={styles.zoneEmpty}>—</span>
        )}
      </div>

      <div className={`${styles.zone} ${styles.deckZone}`}>
        <span className={styles.zoneLabel}>Deck</span>
        <div className={styles.pileRow}>
          <div className={styles.pileStack}>
            <div className={styles.pileTop} />
          </div>
          <div className={styles.pileInfo}>
            <span className={styles.pileCount}>{player.deckSize}</span>
            <span className={styles.pileLabel}>cards</span>
            {own ? null : <span className={styles.pileLabel}>hand {player.handSize}</span>}
          </div>
        </div>
      </div>

      <div className={`${styles.zone} ${styles.oblivionZone}`}>
        <span className={styles.zoneLabel}>Oblivion</span>
        <div className={styles.pileRow}>
          <div className={styles.pileStack}>
            <div className={`${styles.pileTop} ${styles.pileTopOblivion}`} />
          </div>
          <div className={styles.pileInfo}>
            <span className={styles.pileCount}>{oblivion}</span>
            <span className={styles.pileLabel}>cards</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The live table: two facing printed playmats around the shared middle strip. */
export function LiveBoard({
  board,
  viewerSeat,
  participantNames,
  selectableInstanceIds,
  selectedInstanceIds,
  onCardClick,
}: LiveBoardProps) {
  const opponentSeat: AcSeat = viewerSeat === "player-one" ? "player-two" : "player-one";
  const viewerActive = board.activePlayer === viewerSeat;
  const clash = board.clash;
  const attackerName = clash
    ? (board.cards.find((card) => card.instanceId === clash.attackerId)?.name ?? "A Clash card")
    : null;
  const targetName = clash
    ? (board.cards.find((card) => card.instanceId === clash.targetId)?.name ?? "its target")
    : null;
  const hand = board.cards.filter((card) => card.controller === viewerSeat && card.zone === "hand");

  const matProps: Omit<MatProps, "seat" | "own"> = {
    board,
    participantNames,
    selectableInstanceIds,
    selectedInstanceIds,
    onCardClick,
  };

  return (
    <div className={styles.table}>
      <PlayerMat {...matProps} seat={opponentSeat} own={false} />

      <div className={styles.middleStrip}>
        <div className={styles.standbyStack}>
          <div className={styles.standbyCards}>
            {Array.from({ length: Math.min(3, board.standbyCount) }, (_, index) => (
              <div
                key={index}
                className={styles.standbyCard}
                style={{ transform: `translate(${index * 8}px, ${-index * 3}px)` }}
              />
            ))}
          </div>
          <span className={styles.pileLabel}>
            Standby
            <br />
            {board.standbyCount}
          </span>
        </div>

        <div
          className={`${styles.portal} ${board.portalOpen ? styles.portalOpen : ""}`}
          title={board.portalOpen ? "The Portal is open" : "The Portal is closed"}
        >
          <span className={styles.portalMark}>Portal</span>
        </div>

        <div
          className={styles.turnBanner}
          data-testid="ac-turn-banner"
          data-turn={board.turnNumber}
          data-phase={board.phaseName}
          data-active-player={board.activePlayer}
        >
          <strong>
            Turn {board.turnNumber} · {phaseLabel(board)}
          </strong>
          <span>
            {board.phaseName === "complete"
              ? "The match is over"
              : `${seatDisplayName(board, board.activePlayer, participantNames)} to act`}
          </span>
          <span>{viewerActive ? "Your decision" : "Waiting for the other player"}</span>
        </div>

        {clash ? (
          <div className={styles.clashBanner}>
            <span>
              {attackerName} <span className={styles.clashBannerArrow}>➤</span> {targetName}
            </span>
            <span className={styles.clashStep}>{clash.step}</span>
          </div>
        ) : null}
      </div>

      <PlayerMat {...matProps} seat={viewerSeat} own />

      <div className={styles.hand}>
        <span className={styles.handLabel}>Your hand</span>
        <div className={styles.handRow}>
          {hand.map((card) => (
            <div key={card.instanceId} className={styles.handCard}>
              <CardSlot
                key={card.instanceId}
                card={card}
                {...cardInteraction(card, { ...matProps })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
