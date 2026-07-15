import { useEffect, useMemo, useState, type CSSProperties, type MouseEvent } from "react";
import type { LegalCommandDescriptor } from "@tcg/op-engine/practice-st01";
import type { BoardToken, SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";
import {
  CardZone,
  DeckStackZone,
  DiscardPileZone,
  SingleCardZone,
  TabletopActionButton,
  TurnIndicator,
} from "@tcg/simulator-ui";
import type { OnePieceSeatId, OnePieceStaticBoard } from "../data/staticBoard.ts";
import classes from "./OnePieceTabletopBoard.module.css";

interface OnePieceTabletopBoardProps {
  board: OnePieceStaticBoard;
  actions?: readonly LegalCommandDescriptor[];
  onAction?: (action: LegalCommandDescriptor) => void;
  onJoKenPoTimeout?: () => void;
}

export function OnePieceTabletopBoard({
  board,
  actions = [],
  onAction,
  onJoKenPoTimeout,
}: OnePieceTabletopBoardProps) {
  const [hoveredId, setHoveredId] = useState<string | undefined>();
  const entityMap = useMemo(
    () => new Map(board.entities.map((entity) => [entity.id, entity])),
    [board.entities],
  );
  const hoveredEntity = hoveredId ? entityMap.get(hoveredId) : undefined;

  const handleCardHover = (event: MouseEvent<HTMLDivElement>) => {
    const cardElement = (event.target as Element).closest<HTMLElement>("[data-sim-entity-id]");
    if (!cardElement || !event.currentTarget.contains(cardElement)) {
      return;
    }

    const entity = entityMap.get(cardElement.dataset.simEntityId ?? "");
    setHoveredId(entity?.face === "hidden" ? undefined : entity?.id);
  };

  const handleCardOut = (event: MouseEvent<HTMLDivElement>) => {
    const cardElement = (event.target as Element).closest<HTMLElement>("[data-sim-entity-id]");
    if (!cardElement) {
      return;
    }

    const relatedTarget = event.relatedTarget;
    if (relatedTarget instanceof Node && cardElement.contains(relatedTarget)) {
      return;
    }

    if (cardElement.dataset.simEntityId === hoveredId) {
      setHoveredId(undefined);
    }
  };

  return (
    <section
      className={classes.tabletop}
      data-testid="one-piece-tabletop-board"
      aria-label="One Piece tabletop board"
    >
      <div
        className={classes.playmat}
        onMouseOver={handleCardHover}
        onMouseOut={handleCardOut}
        onMouseLeave={() => setHoveredId(undefined)}
      >
        <TurnIndicator
          className={classes.phaseRibbon}
          data-testid="one-piece-phase-ribbon"
          phase={board.table.status.phase}
          turn={board.table.status.turn}
          variant="ribbon"
        />

        <PlayerMat
          seatId="opponent"
          table={board.table}
          donTokens={board.donTokens.opponent}
          entityMap={entityMap}
        />

        <div className={classes.centerRule} aria-hidden="true" />

        <PlayerMat
          seatId="player"
          table={board.table}
          donTokens={board.donTokens.player}
          entityMap={entityMap}
        />

        <HoveredCardPreview entity={hoveredEntity} />
        <TabletopControls
          actions={actions}
          onAction={onAction}
          onJoKenPoTimeout={onJoKenPoTimeout}
          activeSeatId={board.table.status.activeSeatId}
          stateVersion={board.table.status.stateVersion}
        />
      </div>
    </section>
  );
}

interface PlayerMatProps {
  seatId: OnePieceSeatId;
  table: OnePieceStaticBoard["table"];
  donTokens: OnePieceStaticBoard["donTokens"][OnePieceSeatId];
  entityMap: Map<string, SimulatorEntity>;
}

function PlayerMat({ seatId, table, donTokens, entityMap }: PlayerMatProps) {
  const seat = table.seats.find((candidate) => candidate.id === seatId);
  const zones = {
    hand: zone(table, seatId, "hand"),
    leader: zone(table, seatId, "leader"),
    characters: zone(table, seatId, "characters"),
    stage: zone(table, seatId, "stage"),
    deck: zone(table, seatId, "deck"),
    trash: zone(table, seatId, "trash"),
    life: zone(table, seatId, "life"),
    donDeck: zone(table, seatId, "don-deck"),
    donArea: zone(table, seatId, "don-area"),
  };

  return (
    <section className={classes.playerMat} data-seat={seatId} aria-label={`${seat?.label} board`}>
      <LifeArea zone={zones.life} />
      <div className={classes.deckSlot}>
        <DeckStackZone
          zone={zones.deck}
          entities={entitiesForZone(zones.deck, entityMap)}
          entityCount={zoneCount(zones.deck)}
          label="Deck"
        />
      </div>
      <div className={classes.trashSlot}>
        <DiscardPileZone
          zone={zones.trash}
          entities={entitiesForZone(zones.trash, entityMap)}
          entityCount={zoneCount(zones.trash)}
          label="Trash"
        />
      </div>
      <div className={classes.stageSlot}>
        <SingleCardZone
          className={classes.singleZone}
          zone={zones.stage}
          entities={entitiesForZone(zones.stage, entityMap)}
          entityCount={zoneCount(zones.stage)}
          emptyLabel="Stage Card"
        />
      </div>
      <LeaderCommand seatId={seatId} zones={zones} entityMap={entityMap} />
      <div className={classes.donSlot}>
        <DonMeter
          seatId={seatId}
          donTokens={donTokens}
          donAreaCount={zoneCount(zones.donArea)}
          donDeckCount={zoneCount(zones.donDeck)}
        />
      </div>
      <div className={classes.characterSlot}>
        <CharacterArea seatLabel={seat?.label} zone={zones.characters} entityMap={entityMap} />
      </div>
      <HandDock zone={zones.hand} entityMap={entityMap} />
    </section>
  );
}

function LeaderCommand({
  seatId,
  zones,
  entityMap,
}: {
  seatId: OnePieceSeatId;
  zones: PlayerZones;
  entityMap: Map<string, SimulatorEntity>;
}) {
  const leaderEntities = entitiesForZone(zones.leader, entityMap);
  const leaderEntity = leaderEntities[0];
  const leaderPower = leaderEntity?.stats.find((stat) => stat.label === "Power")?.value;
  const attachedBadges = leaderEntity?.overlayBadges?.map((badge) => badge.label).join(" ");

  return (
    <div className={classes.commandRail} data-testid={`${seatId}-command-rail`}>
      <div className={classes.commandLeader} data-testid={`${seatId}-leader-command`}>
        <div className={classes.commandHeader}>
          <span>Leader</span>
          <strong>{zoneCount(zones.leader)}</strong>
        </div>
        <SingleCardZone
          className={`${classes.singleZone} ${classes.commandLeaderZone}`}
          zone={zones.leader}
          entities={leaderEntities}
          entityCount={zoneCount(zones.leader)}
        />
        <div className={classes.leaderMeta}>
          <span>{leaderPower ? `${leaderPower} power` : "Leader"}</span>
          {attachedBadges && <span>{attachedBadges}</span>}
        </div>
      </div>
    </div>
  );
}

function DonMeter({
  seatId,
  donTokens,
  donAreaCount,
  donDeckCount,
}: {
  seatId: OnePieceSeatId;
  donTokens: BoardToken[];
  donAreaCount: number;
  donDeckCount: number;
}) {
  const active = tokenValue(donTokens, "Active");
  const rested = tokenValue(donTokens, "Rested");
  const activeSlots = Array.from({ length: active }, () => "active");
  const restedSlots = Array.from({ length: rested }, () => "rested");

  return (
    <div className={classes.donMeter} data-testid={`${seatId}-don-area`}>
      <div className={classes.donAreaCard} data-kind="deck">
        <span className={classes.donAreaLabel}>DON!! Deck </span>
        <div className={classes.donDeckStack} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <strong className={classes.donAreaCount}>{donDeckCount}</strong>
      </div>
      <div className={classes.donAreaCard} data-kind="active">
        <div className={classes.donAreaCardHeader}>
          <span className={classes.donAreaLabel}>Active DON!! </span>
          <strong>{active}</strong>
        </div>
        <div className={classes.donCardSlots} aria-label={`${active} active DON`}>
          {activeSlots.map((state, index) => (
            <span
              key={`${seatId}-active-don-${index}`}
              className={classes.donCardSlot}
              data-state={state}
              aria-label={`Active DON ${index + 1}: ${state}`}
            />
          ))}
        </div>
      </div>
      <div className={classes.donAreaCard} data-kind="rested">
        <div className={classes.donAreaCardHeader}>
          <span className={classes.donAreaLabel}>Rested DON!! </span>
          <strong>{rested}</strong>
        </div>
        <div className={classes.donCardSlots} aria-label={`${rested} rested DON`}>
          {restedSlots.map((state, index) => (
            <span
              key={`${seatId}-rested-don-${index}`}
              className={classes.donCardSlot}
              data-state={state}
              aria-label={`Rested DON ${index + 1}: ${state}`}
            />
          ))}
        </div>
      </div>
      <span className={classes.donMeterSummary} aria-hidden="true">
        {donAreaCount}/10
      </span>
    </div>
  );
}

function CharacterArea({
  seatLabel,
  zone,
  entityMap,
}: {
  seatLabel: string | undefined;
  zone: SimulatorZone | undefined;
  entityMap: Map<string, SimulatorEntity>;
}) {
  const count = zone?.entityIds.length ?? 0;

  return (
    <div className={classes.characterZone} data-testid={`${zone?.ownerId}-character-area`}>
      <div className={classes.characterZoneHeader}>
        <span>Character Area</span>
      </div>
      <div className={classes.characterZoneCards}>
        {count > 0 ? (
          <CardZone
            zone={zone}
            entities={entitiesForZone(zone, entityMap)}
            entityCount={zone?.count ?? zone?.entityIds.length ?? 0}
            emptyLabel="No characters"
            ariaLabel={`${seatLabel} character area`}
          />
        ) : null}
      </div>
    </div>
  );
}

type PlayerZones = {
  hand: SimulatorZone | undefined;
  leader: SimulatorZone | undefined;
  characters: SimulatorZone | undefined;
  stage: SimulatorZone | undefined;
  deck: SimulatorZone | undefined;
  trash: SimulatorZone | undefined;
  life: SimulatorZone | undefined;
  donDeck: SimulatorZone | undefined;
  donArea: SimulatorZone | undefined;
};

function HandDock({
  zone,
  entityMap,
}: {
  zone: SimulatorZone | undefined;
  entityMap: Map<string, SimulatorEntity>;
}) {
  const rowZone = zone ? { ...zone, layoutHint: "row" as const } : undefined;

  return (
    <div className={classes.handDock} data-testid={`${zone?.ownerId ?? "unknown"}-hand`}>
      <CardZone
        zone={rowZone}
        entities={entitiesForZone(zone, entityMap)}
        entityCount={zone?.count ?? zone?.entityIds.length ?? 0}
        emptyLabel="Empty hand"
        ariaLabel={zone?.ownerId === "player" ? "Your hand" : "Opponent hand"}
      />
    </div>
  );
}

function LifeArea({ zone }: { zone: SimulatorZone | undefined }) {
  const count = zoneCount(zone);
  const visibleCards = Math.max(0, Math.min(count, 10));

  return (
    <div
      className={classes.lifeArea}
      data-testid={`${zone?.ownerId ?? "unknown"}-life`}
      aria-label={`Life: ${count}`}
    >
      {Array.from({ length: visibleCards }, (_, index) => (
        <span
          key={`${zone?.ownerId ?? "unknown"}-life-${index}`}
          className={classes.lifeCard}
          style={
            {
              "--life-index": index,
              "--life-total": Math.max(1, visibleCards - 1),
            } as CSSProperties
          }
          aria-hidden="true"
        />
      ))}
      <span className={classes.lifeAreaLabel}>Life</span>
      <strong className={classes.lifeAreaCount}>{count}</strong>
    </div>
  );
}

function HoveredCardPreview({ entity }: { entity: SimulatorEntity | undefined }) {
  if (!entity || entity.face === "hidden" || !entity.imageUrl) {
    return null;
  }

  return (
    <aside className={classes.hoverCardPreview} data-testid="one-piece-hover-preview">
      <img src={entity.imageUrl} alt={entity.title} className={classes.hoverCardPreviewImage} />
    </aside>
  );
}

function TabletopControls({
  actions,
  onAction,
  onJoKenPoTimeout,
  activeSeatId,
  stateVersion,
}: {
  actions: readonly LegalCommandDescriptor[];
  onAction: ((action: LegalCommandDescriptor) => void) | undefined;
  onJoKenPoTimeout: (() => void) | undefined;
  activeSeatId: string | undefined;
  stateVersion: number;
}) {
  const userActions = actions.filter((action) => action.seat === "south");
  const joKenPoActions = userActions.filter((action) => action.type === "chooseJoKenPo");
  const firstPlayerActions = userActions.filter((action) => action.type === "chooseFirstPlayer");
  const mulliganAction = userActions.find((action) => action.type === "mulligan");
  const keepHandAction = userActions.find((action) => action.type === "keepHand");
  const visibleActions = userActions.filter(
    (action) =>
      action.type !== "chooseJoKenPo" &&
      action.type !== "chooseFirstPlayer" &&
      action.type !== "mulligan" &&
      action.type !== "keepHand",
  );
  const showJoKenPoModal = joKenPoActions.length > 0;
  const showFirstPlayerModal = firstPlayerActions.length > 0;
  const showMulliganModal = Boolean(mulliganAction && keepHandAction);
  const playOrderLabel = activeSeatId === "player" ? "First to play" : "Second to play";
  const [joKenPoSecondsLeft, setJoKenPoSecondsLeft] = useState(30);
  const [joKenPoTimeoutSent, setJoKenPoTimeoutSent] = useState(false);
  const joKenPoActionKey = joKenPoActions
    .map((action) => action.options?.[0]?.value ?? action.label)
    .join(":");
  const joKenPoRoundKey = `${stateVersion}:${joKenPoActionKey}`;
  const choiceAction = (choice: string) =>
    joKenPoActions.find((action) => action.options?.[0]?.value === choice);

  useEffect(() => {
    if (!showJoKenPoModal) {
      setJoKenPoSecondsLeft(30);
      return;
    }

    setJoKenPoSecondsLeft(30);
    setJoKenPoTimeoutSent(false);
    const timer = window.setInterval(() => {
      setJoKenPoSecondsLeft((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [showJoKenPoModal, joKenPoRoundKey]);

  useEffect(() => {
    if (!showJoKenPoModal || joKenPoSecondsLeft > 0 || joKenPoTimeoutSent) {
      return;
    }

    setJoKenPoTimeoutSent(true);
    onJoKenPoTimeout?.();
  }, [joKenPoSecondsLeft, joKenPoTimeoutSent, onJoKenPoTimeout, showJoKenPoModal]);

  return (
    <>
      {showJoKenPoModal && (
        <aside
          className={classes.mulliganModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="one-piece-jo-ken-po-title"
          aria-describedby="one-piece-jo-ken-po-copy"
          data-testid="one-piece-jo-ken-po-modal"
        >
          <p className={classes.mulliganEyebrow}>{joKenPoSecondsLeft}s remaining</p>
          <h2 id="one-piece-jo-ken-po-title">Jo Ken Po</h2>
          <p id="one-piece-jo-ken-po-copy">
            Choose before the timer ends. Results reveal when both players have chosen.
          </p>
          <div className={classes.joKenPoActions}>
            {(["rock", "paper", "scissors"] as const).map((choice) => {
              const action = choiceAction(choice);
              return (
                <TabletopActionButton
                  key={choice}
                  className={classes.mulliganSecondary}
                  disabled={!action}
                  onClick={() => action && onAction?.(action)}
                >
                  {choice === "rock" ? "Rock" : choice === "paper" ? "Paper" : "Scissors"}
                </TabletopActionButton>
              );
            })}
          </div>
        </aside>
      )}
      {showFirstPlayerModal && (
        <aside
          className={classes.mulliganModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="one-piece-first-player-title"
          data-testid="one-piece-first-player-modal"
        >
          <p className={classes.mulliganEyebrow}>Jo Ken Po won</p>
          <h2 id="one-piece-first-player-title">Choose First Turn</h2>
          <div className={classes.mulliganActions}>
            {firstPlayerActions.map((action) => (
              <TabletopActionButton
                key={`${action.type}:${action.targetIds?.[0] ?? action.label}`}
                variant={action.targetIds?.[0] === "south" ? "primary" : undefined}
                className={
                  action.targetIds?.[0] === "south"
                    ? classes.mulliganPrimary
                    : classes.mulliganSecondary
                }
                onClick={() => onAction?.(action)}
              >
                {action.label}
              </TabletopActionButton>
            ))}
          </div>
        </aside>
      )}
      {showMulliganModal && (
        <aside
          className={classes.mulliganModal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="one-piece-mulligan-title"
          aria-describedby="one-piece-mulligan-copy"
          data-testid="one-piece-mulligan-modal"
        >
          <p className={classes.mulliganEyebrow}>{playOrderLabel}</p>
          <h2 id="one-piece-mulligan-title">Opening Hand</h2>
          <p id="one-piece-mulligan-copy">
            Decide whether to redraw your opening hand before the game begins.
          </p>
          <div className={classes.mulliganActions}>
            <TabletopActionButton
              variant="primary"
              className={classes.mulliganPrimary}
              onClick={() => mulliganAction && onAction?.(mulliganAction)}
            >
              Take Mulligan
            </TabletopActionButton>
            <TabletopActionButton
              className={classes.mulliganSecondary}
              onClick={() => keepHandAction && onAction?.(keepHandAction)}
            >
              Keep Hand
            </TabletopActionButton>
          </div>
        </aside>
      )}
      <div className={classes.tabletopControls} aria-label="Table controls">
        {visibleActions.length > 0 ? (
          <div className={classes.practiceActionTray}>
            {visibleActions.map((action) => (
              <TabletopActionButton
                key={`${action.type}:${action.sourceId ?? action.promptId ?? action.label}`}
                variant="primary"
                className={
                  action.type === "endTurn" || action.type === "startGame"
                    ? classes.turnEndControl
                    : classes.practiceActionControl
                }
                onClick={() => onAction?.(action)}
              >
                {action.label}
              </TabletopActionButton>
            ))}
          </div>
        ) : (
          <TabletopActionButton variant="primary" className={classes.turnEndControl} disabled>
            Turn End
          </TabletopActionButton>
        )}
      </div>
    </>
  );
}

function zone(table: OnePieceStaticBoard["table"], seatId: OnePieceSeatId, suffix: string) {
  return table.zones.find((candidate) => candidate.id === `${seatId}-${suffix}`);
}

function entitiesForZone(
  zoneValue: SimulatorZone | undefined,
  entityMap: Map<string, SimulatorEntity>,
): SimulatorEntity[] {
  return (zoneValue?.entityIds ?? [])
    .map((id) => entityMap.get(id))
    .filter((entity): entity is SimulatorEntity => Boolean(entity));
}

function zoneCount(zoneValue: SimulatorZone | undefined): number {
  return zoneValue?.count ?? zoneValue?.entityIds.length ?? 0;
}

function tokenValue(tokens: BoardToken[], label: string): number {
  const token = tokens.find((candidate) => candidate.label === label);
  return Number.parseInt(token?.value ?? "0", 10) || 0;
}
