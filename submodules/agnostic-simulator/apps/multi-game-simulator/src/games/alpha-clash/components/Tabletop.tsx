import { getCard } from "@tcg/alpha-clash-cards";
import type { ProjectedCard, ProjectedState } from "@tcg/alpha-clash-engine";
import type { AcCardDefinition } from "@tcg/alpha-clash-types";
import styles from "./Tabletop.module.css";

type Seat = "player-one" | "player-two";

const HUMAN_SEAT: Seat = "player-one";
const BOT_SEAT: Seat = "player-two";

function definitionOf(card: ProjectedCard): AcCardDefinition | undefined {
  if (!card.definitionId) return undefined;
  try {
    return getCard(card.definitionId);
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

function phaseLabel(board: ProjectedState): string {
  switch (board.phase.name) {
    case "setup":
      return "Setup";
    case "expansion":
      return "Expansion — Resource Step";
    case "primary":
      return "Primary Phase";
    case "clash":
      return `Clash — ${board.clash?.step ?? ""}`;
    case "endOfTurn":
      return "End of Turn";
    case "complete":
      return "Match complete";
  }
}

function highlightFor(
  card: ProjectedCard,
  attackerId: string | undefined,
  targetId: string | undefined,
): string | undefined {
  if (card.instanceId === attackerId) return styles.cardAttacker;
  if (card.instanceId === targetId) return styles.cardTarget;
  return undefined;
}

/** A card in its slot; engaged cards sit sideways like tapped physical cards. */
function CardSlot({
  card,
  small = false,
  highlight,
}: {
  card: ProjectedCard;
  small?: boolean;
  highlight?: string;
}) {
  const definition = definitionOf(card);
  const engaged = !card.ready;
  const engagedClass = engaged ? ` ${styles.slotEngaged}` : "";
  const sizeClass = small ? ` ${styles.cardDim}` : "";
  if (card.faceDown) {
    return (
      <div className={styles.slot + engagedClass}>
        <div className={`${styles.cardBack}${sizeClass}`} />
      </div>
    );
  }
  const damage = card.clashDamage + card.phaseDamage;
  return (
    <div className={styles.slot + engagedClass}>
      <div className={`${styles.cardFace}${sizeClass}${highlight ? ` ${highlight}` : ""}`}>
        <div className={styles.cardName}>{card.name ?? "?"}</div>
        {damage > 0 ? <div className={styles.cardDamage}>{damage}</div> : null}
        <div className={styles.cardStats}>
          <span className={styles.cardAtk}>A {printedStat(definition, "attack") ?? "—"}</span>
          <span className={styles.cardDef}>D {printedStat(definition, "defense") ?? "—"}</span>
        </div>
      </div>
    </div>
  );
}

function seatName(board: ProjectedState, seat: Seat): string {
  return board.players[seat]?.name ?? seat;
}

interface MatProps {
  board: ProjectedState;
  seat: Seat;
  own: boolean;
}

const CLASH_STEP_LABELS: Record<string, string> = {
  attack: "Attack Step",
  counter: "Counter Step",
  obstruct: "Obstruct Step",
  attackerBuff: "Attacker's Clash Buff Step",
  defenderBuff: "Defender's Clash Buff Step",
  damage: "Damage Step",
};

/** Phases reference, printed on the physical playmat; live step highlighted. */
function PhasesPanel({ board }: { board: ProjectedState }) {
  const clashStep = board.phase.name === "clash" ? (board.clash?.step ?? "") : undefined;
  return (
    <div className={`${styles.zone} ${styles.phasesZone}`}>
      <span className={styles.zoneLabel}>Phases</span>
      <div className={styles.phaseGroup}>
        <div
          className={`${styles.phaseGroupTitle} ${board.phase.name === "expansion" ? styles.phaseGroupTitleCurrent : ""}`}
        >
          Expansion Phase
        </div>
        <div
          className={`${styles.phaseStep} ${board.phase.name === "expansion" ? styles.phaseStepCurrent : ""}`}
        >
          Draw Step
        </div>
        <div
          className={`${styles.phaseStep} ${board.phase.name === "expansion" ? styles.phaseStepCurrent : ""}`}
        >
          Resource Step
        </div>
      </div>
      <div className={styles.phaseGroup}>
        <div
          className={`${styles.phaseGroupTitle} ${board.phase.name === "primary" ? styles.phaseGroupTitleCurrent : ""}`}
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
          className={`${styles.phaseGroupTitle} ${board.phase.name === "clash" ? styles.phaseGroupTitleCurrent : ""}`}
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

/** One player's printed playmat. */
function PlayerMat({ board, seat, own }: MatProps) {
  const seatCards = board.cards.filter((card) => card.controller === seat);
  const clash = seatCards.filter((card) => card.zone === "clash");
  const accessories = seatCards.filter((card) => card.zone === "accessory");
  const resources = seatCards.filter((card) => card.zone === "resource");
  const resourceReady = resources.filter((card) => card.ready).length;
  const oblivion = seatCards.filter((card) => card.zone === "oblivion").length;
  const clashground = seatCards.find((card) => card.zone === "clashground");
  const contender = seatCards.find((card) => card.zone === "contender");
  const contenderDefinition = contender ? definitionOf(contender) : undefined;
  const player = board.players[seat];
  const healthPct =
    contender && player.maxHealth > 0
      ? Math.max(0, Math.min(100, (player.health / player.maxHealth) * 100))
      : 0;
  const clashAttackerId = board.clash?.attackerId;
  const clashTargetId = board.clash?.targetId;
  const clashgroundDefinition = clashground ? definitionOf(clashground) : undefined;

  return (
    <div className={styles.mat} role="group" aria-label={own ? "Your playmat" : "Opponent playmat"}>
      <div className={`${styles.zone} ${styles.contenderZone}`}>
        <span className={styles.zoneLabel}>Contender</span>
        {contender ? (
          <div
            className={`${styles.cardFace} ${styles.contenderCard} ${
              contender.instanceId === clashTargetId ? styles.cardTarget : ""
            }`}
          >
            <div className={styles.contenderName}>{contender.name ?? "Contender"}</div>
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
              <span className={styles.cardAtk}>
                A {printedStat(contenderDefinition, "attack") ?? "?"}
              </span>
              <span className={styles.cardDef}>
                D {printedStat(contenderDefinition, "defense") ?? "?"}
              </span>
            </div>
          </div>
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
            {accessories.map((card) =>
              card.faceDown ? (
                <div key={card.instanceId} className={styles.slot}>
                  <div className={styles.cardBack} />
                </div>
              ) : (
                <CardSlot key={card.instanceId} card={card} small />
              ),
            )}
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
        {clashground && clashgroundDefinition ? (
          <div className={styles.zoneBody}>
            <div className={`${styles.cardFace} ${styles.clashgroundCard}`}>
              <div className={styles.clashgroundName}>{clashground.name}</div>
              <div className={styles.clashgroundTag}>Clashground</div>
            </div>
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

/** The table: two facing printed playmats around the shared middle strip. */
export function Tabletop({ board }: { board: ProjectedState }) {
  const standby = board.standby;
  const humanActive = board.activePlayer === HUMAN_SEAT;
  const clash = board.clash;
  const attackerName = clash
    ? (board.cards.find((card) => card.instanceId === clash.attackerId)?.name ?? "A Clash card")
    : null;
  const targetName = clash
    ? (board.cards.find((card) => card.instanceId === clash.targetId)?.name ?? "its target")
    : null;

  const hand = board.cards.filter((card) => card.controller === HUMAN_SEAT && card.zone === "hand");

  return (
    <div className={styles.table}>
      <PlayerMat board={board} seat={BOT_SEAT} own={false} />

      <div className={styles.middleStrip}>
        <div className={styles.standbyStack}>
          <div className={styles.standbyCards}>
            {standby.slice(0, 3).map((item, index) => (
              <div
                key={item.id}
                className={styles.standbyCard}
                style={{ transform: `translate(${index * 8}px, ${-index * 3}px)` }}
              />
            ))}
          </div>
          <span className={styles.pileLabel}>
            Standby
            <br />
            {standby.length}
          </span>
        </div>

        <div
          className={`${styles.portal} ${board.portalOpen ? styles.portalOpen : ""}`}
          title={board.portalOpen ? "The Portal is open" : "The Portal is closed"}
        >
          <span className={styles.portalMark}>Portal</span>
        </div>

        <div className={styles.turnBanner}>
          <strong>
            Turn {board.turnNumber} · {phaseLabel(board)}
          </strong>
          <span>
            {board.phase.name === "complete"
              ? "The match is over"
              : humanActive
                ? `${seatName(board, HUMAN_SEAT)} to act`
                : `${seatName(board, BOT_SEAT)} to act`}
          </span>
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

      <PlayerMat board={board} seat={HUMAN_SEAT} own />

      <div className={styles.hand}>
        <span className={styles.handLabel}>Your hand</span>
        <div className={styles.handRow}>
          {hand.map((card) => (
            <div key={card.instanceId} className={styles.handCard}>
              <CardSlot card={card} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
