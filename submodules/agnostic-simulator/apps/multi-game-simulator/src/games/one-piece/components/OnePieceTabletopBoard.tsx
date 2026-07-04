import { useMemo, useState, type CSSProperties, type MouseEvent } from "react";
import type { LegalCommandDescriptor } from "@tcg/op-engine/practice-st01";
import type { BoardToken, SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";
import {
  CardZone,
  DeckStackZone,
  DiscardPileZone,
  SingleCardZone,
  TabletopActionButton,
  TabletopCounterBadge,
  TurnIndicator,
} from "@tcg/simulator-ui";
import type { OnePieceSeatId, OnePieceStaticBoard } from "../data/staticBoard.ts";
import classes from "./OnePieceTabletopBoard.module.css";

interface OnePieceTabletopBoardProps {
  board: OnePieceStaticBoard;
  actions?: readonly LegalCommandDescriptor[];
  onAction?: (action: LegalCommandDescriptor) => void;
}

export function OnePieceTabletopBoard({
  board,
  actions = [],
  onAction,
}: OnePieceTabletopBoardProps) {
  const [hoveredId, setHoveredId] = useState<string | undefined>();
  const entityMap = useMemo(
    () => new Map(board.entities.map((entity) => [entity.id, entity])),
    [board.entities],
  );
  const hoveredEntity = hoveredId ? entityMap.get(hoveredId) : undefined;

  const handleCardHover = (event: MouseEvent<HTMLDivElement>) => {
    const cardElement = (event.target as Element).closest<HTMLElement>("[data-entity-id]");
    if (!cardElement || !event.currentTarget.contains(cardElement)) {
      return;
    }

    const entity = entityMap.get(cardElement.dataset.entityId ?? "");
    setHoveredId(entity?.face === "hidden" ? undefined : entity?.id);
  };

  const handleCardOut = (event: MouseEvent<HTMLDivElement>) => {
    const cardElement = (event.target as Element).closest<HTMLElement>("[data-entity-id]");
    if (!cardElement) {
      return;
    }

    const relatedTarget = event.relatedTarget;
    if (relatedTarget instanceof Node && cardElement.contains(relatedTarget)) {
      return;
    }

    if (cardElement.dataset.entityId === hoveredId) {
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
        <TabletopControls actions={actions} onAction={onAction} />
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
  const used = Math.min(10, active + rested);
  const slots = Array.from({ length: 10 }, (_, index) =>
    index < active ? "active" : index < used ? "rested" : "empty",
  );

  return (
    <div className={classes.donMeter} data-testid={`${seatId}-don-area`}>
      <div className={classes.donMeterHeader}>
        <span>DON!!</span>
        <strong>{donAreaCount}/10</strong>
      </div>
      <div className={classes.donPips} aria-label={`${donAreaCount} DON available`}>
        {slots.map((state, index) => (
          <span
            key={`${seatId}-don-${index}`}
            className={classes.donPip}
            data-state={state}
            aria-label={`DON ${index + 1}: ${state}`}
          />
        ))}
      </div>
      <div className={classes.donMeterStats}>
        <span data-state="active">Active {active}</span>
        <span data-state="rested">Rested {rested}</span>
        <span>Deck {donDeckCount}</span>
      </div>
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
        <TabletopCounterBadge label="Characters" value={count} variant="compact" />
      </div>
      <div className={classes.characterZoneCards}>
        <CardZone
          zone={zone}
          entities={entitiesForZone(zone, entityMap)}
          entityCount={zone?.count ?? zone?.entityIds.length ?? 0}
          emptyLabel="No characters"
          ariaLabel={`${seatLabel} character area`}
        />
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
  if (!entity || entity.face === "hidden") {
    return null;
  }

  const power = entity.stats.find((stat) => stat.label === "Power")?.value;
  const cost = entity.stats.find((stat) => stat.label === "Cost")?.value;
  const details = [
    entity.subtitle,
    power ? `${power} power` : null,
    cost ? `${cost} cost` : null,
  ].filter(Boolean);

  return (
    <aside className={classes.hoverCardPreview} data-testid="one-piece-hover-preview">
      {entity.imageUrl ? (
        <img src={entity.imageUrl} alt="" className={classes.hoverCardPreviewImage} />
      ) : null}
      <div className={classes.hoverCardPreviewText}>
        <span>Card details</span>
        <strong>{entity.title}</strong>
        {details.length > 0 ? <p>{details.join(" / ")}</p> : null}
        {entity.traits.length > 0 ? <small>{entity.traits.join(" • ")}</small> : null}
      </div>
    </aside>
  );
}

function TabletopControls({
  actions,
  onAction,
}: {
  actions: readonly LegalCommandDescriptor[];
  onAction: ((action: LegalCommandDescriptor) => void) | undefined;
}) {
  const visibleActions = actions.filter((action) => action.seat === "south");

  return (
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
