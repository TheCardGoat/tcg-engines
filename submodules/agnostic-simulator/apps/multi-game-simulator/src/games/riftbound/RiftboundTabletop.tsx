import { SimulatorSettingsButton } from "../../simulator/settings/SimulatorSettingsButton";
import {
  STANDARD_CARD_IMAGE_ASPECT_RATIO,
  type SimulatorEntity,
  type SimulatorZone,
} from "@tcg/simulator-contract";
import {
  AnimatedEntityCollection,
  AnimatedEntitySlot,
  AnimatedZoneSlot,
  AnimationInteractionBoundary,
  createSimulatorAnimationScope,
  DefaultSimulatorEntityVisual,
  DeckStackZone,
  PointerDraggable,
  PointerDragDropSurface,
  PointerDroppable,
  SimulatorEntityVisual,
  SimulatorViewportShell,
  TabletopStatementsPanel,
} from "@tcg/simulator-ui";
import { useCallback, useEffect, useRef, type CSSProperties, type ReactNode } from "react";

import { riftboundActionToAnimationPlan } from "./animation";
import type {
  RiftboundClientCardV1,
  RiftboundClientMatchActionInputV1,
  RiftboundClientMatchActionV1,
  RiftboundClientMatchStateV1,
  RiftboundZone,
} from "./state";
import { reduceRiftboundClientMatchStateV1 } from "./state";
import "./riftbound.css";

export interface RiftboundTabletopProps {
  sessionKey?: string;
  state: RiftboundClientMatchStateV1;
  viewerId: string;
  readOnly?: boolean;
  pending?: boolean;
  conflict?: string | null;
  sidebarExtra?: ReactNode;
  replayControls?: ReactNode;
  renderActionControls?: (
    dispatch: (action: RiftboundClientMatchActionInputV1) => void,
  ) => ReactNode;
  onAction?: (action: RiftboundClientMatchActionV1) => void;
}

export function RiftboundTabletop({
  sessionKey,
  state,
  viewerId,
  ...props
}: RiftboundTabletopProps) {
  const animationSessionKey = sessionKey ?? `riftbound:${state.players.join(":")}:${viewerId}`;
  return (
    <RiftboundAnimation.Root
      sessionKey={animationSessionKey}
      initialState={state}
      initialVersion={0}
      projection={{
        getEntity: (projectedState, entityId, face) => {
          const card = projectedState.cards[entityId];
          return card ? entityFor(card, projectedState, face === "public") : null;
        },
        getZone: (projectedState, ref) => {
          const [ownerId, zone] = ref.id.split(":") as [string, RiftboundZone];
          return zone ? zoneModel(ownerId, zone, cardsIn(projectedState, ownerId, zone)) : null;
        },
      }}
      entityRenderer={DefaultSimulatorEntityVisual}
      viewerSeatId={viewerId}
      animationSpeed="normal"
    >
      <RiftboundAnimationBridge state={state} viewerId={viewerId} {...props} />
    </RiftboundAnimation.Root>
  );
}

const RiftboundAnimation = createSimulatorAnimationScope<RiftboundClientMatchStateV1>();

function RiftboundAnimationBridge({ state, viewerId, onAction, ...props }: RiftboundTabletopProps) {
  const snapshot = RiftboundAnimation.useState();
  const { enqueue, replaceFromSync } = RiftboundAnimation.useActions();
  const versionRef = useRef(0);
  const previousStateRef = useRef(state);
  const locallyAnimatedActionIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (previousStateRef.current === state) return;
    previousStateRef.current = state;
    const localActionId = locallyAnimatedActionIdRef.current;
    if (localActionId && state.activity.at(-1)?.id === localActionId) {
      locallyAnimatedActionIdRef.current = null;
      return;
    }
    replaceFromSync({ state, version: ++versionRef.current });
  }, [replaceFromSync, state]);

  const dispatch = useCallback(
    (action: RiftboundClientMatchActionV1) => {
      const fromState = snapshot.authoritativeState ?? state;
      const toState = reduceRiftboundClientMatchStateV1(fromState, action);
      const fromVersion = snapshot.authoritativeVersion ?? versionRef.current;
      const toVersion = Math.max(versionRef.current, fromVersion) + 1;
      const plan = riftboundActionToAnimationPlan({
        fromState,
        toState,
        action,
        viewerId,
        transitionId: action.actionId,
      });
      locallyAnimatedActionIdRef.current = action.actionId;
      versionRef.current = toVersion;
      enqueue({
        correlationId: action.actionId,
        source: "local",
        state: toState,
        version: toVersion,
        plan,
      });
      onAction?.(action);
    },
    [
      enqueue,
      onAction,
      snapshot.authoritativeState,
      snapshot.authoritativeVersion,
      state,
      viewerId,
    ],
  );

  return (
    <RiftboundTabletopContent
      state={snapshot.presentationState ?? state}
      viewerId={viewerId}
      {...props}
      onAction={dispatch}
    />
  );
}

function RiftboundTabletopContent({
  state,
  viewerId,
  readOnly = false,
  pending = false,
  conflict,
  sidebarExtra,
  replayControls,
  renderActionControls,
  onAction,
}: RiftboundTabletopProps) {
  const animationStatus = RiftboundAnimation.useStatus();
  const opponentId = state.players.find((id) => id !== viewerId) ?? state.players[1];
  const controlsDisabled = readOnly || pending || animationStatus.isAnimating;
  const status = readOnly ? "Replay · read only" : pending ? "Saving…" : (conflict ?? "Synced");
  const dispatch = (action: RiftboundClientMatchActionInputV1) => {
    if (controlsDisabled) return;
    onAction?.({
      ...action,
      actorId: viewerId,
      actionId: crypto.randomUUID(),
      at: Date.now(),
    } as RiftboundClientMatchActionV1);
  };

  const matchActions =
    !readOnly && !state.terminal ? (
      <RiftboundMatchActions
        onDraw={() => dispatch({ type: "draw", ownerId: viewerId, count: 1 })}
        onConcede={() => dispatch({ type: "end_game", winnerId: opponentId, reason: "concession" })}
        disabled={pending}
      />
    ) : null;

  const sidebar = (
    <div className="riftbound-sidebar">
      <header className="riftbound-sidebar-header">
        <div>
          <strong>Riftbound private match</strong>
          <span>Client authoritative · trusted players</span>
        </div>
        <div className="riftbound-status" aria-live="polite">
          {status}
        </div>
      </header>
      <SimulatorSettingsButton />
      <TabletopStatementsPanel
        className="riftbound-statements"
        state={state}
        viewerId={viewerId}
        readOnly={readOnly}
        disabled={pending}
        onAction={dispatch}
      />
      {sidebarExtra ? <section className="riftbound-sidebar-extra">{sidebarExtra}</section> : null}
      {renderActionControls ? (
        <section className="riftbound-sidebar-extra">{renderActionControls(dispatch)}</section>
      ) : null}
      <div className="riftbound-sidebar-actions">{replayControls ?? matchActions}</div>
    </div>
  );

  const tabletop = (
    <PointerDragDropSurface
      id="riftbound-tabletop-dnd"
      decodeSource={(id) => (id.startsWith("card:") ? id.slice(5) : null)}
      renderOverlay={(cardId) => (
        <SimulatorEntityVisual entity={entityFor(state.cards[cardId]!, state)} density="compact" />
      )}
      onDragEnd={(cardId, overId) => {
        if (!cardId || !overId?.startsWith("zone:")) return;
        dispatch({ type: "move_card", cardId, zone: overId.split(":").at(-1) as RiftboundZone });
      }}
    >
      <div className="riftbound-board">
        <PlayerBoard
          state={state}
          playerId={opponentId}
          viewerId={viewerId}
          dispatch={dispatch}
          readOnly
        />
        <section className="riftbound-center">
          <DropZone id="play" ownerId="shared" disabled={controlsDisabled}>
            <h2>Shared play area</h2>
            <RiftboundZoneCards
              zone={zoneModel("shared", "play", cardsIn(state, undefined, "play"))}
              cards={cardsIn(state, undefined, "play")}
              state={state}
              disabled={controlsDisabled}
            />
          </DropZone>
        </section>
        <PlayerBoard
          state={state}
          playerId={viewerId}
          viewerId={viewerId}
          dispatch={dispatch}
          readOnly={controlsDisabled}
        />
      </div>
    </PointerDragDropSurface>
  );

  return (
    <AnimationInteractionBoundary active={animationStatus.isAnimating}>
      <SimulatorViewportShell
        className="riftbound-tabletop"
        tabletop={tabletop}
        sidebar={sidebar}
        mobilePanel={sidebar}
        mobileTopRail={({ openSidebar }) => (
          <div className="riftbound-mobile-top-rail">
            <div>
              <small>Opponent</small>
              <strong>{opponentId}</strong>
            </div>
            <span>{status}</span>
            <button type="button" onClick={openSidebar} aria-label="Open match panel">
              Panel
            </button>
          </div>
        )}
        mobileBottomRail={
          <div className="riftbound-mobile-bottom-rail">
            <div>
              <small>You</small>
              <strong>{viewerId}</strong>
            </div>
            {replayControls ?? matchActions}
          </div>
        }
      />
    </AnimationInteractionBoundary>
  );
}

function RiftboundMatchActions({
  onDraw,
  onConcede,
  disabled,
}: {
  readonly onDraw: () => void;
  readonly onConcede: () => void;
  readonly disabled: boolean;
}) {
  return (
    <div className="riftbound-actions">
      <button type="button" disabled={disabled} onClick={onDraw}>
        Draw
      </button>
      <button type="button" disabled={disabled} onClick={onConcede}>
        Concede
      </button>
    </div>
  );
}

function PlayerBoard({
  state,
  playerId,
  viewerId,
  dispatch,
  readOnly,
}: {
  state: RiftboundClientMatchStateV1;
  playerId: string;
  viewerId: string;
  readOnly: boolean;
  dispatch: (action: RiftboundClientMatchActionInputV1) => void;
}) {
  const deck = cardsIn(state, playerId, "deck").map((card) => entityFor(card, state));
  const hand = cardsIn(state, playerId, "hand").map((card) =>
    entityFor(card, state, card.ownerId === viewerId),
  );
  const zones: RiftboundZone[] = ["legend", "battlefields", "runes", "discard"];
  return (
    <section className="riftbound-player" data-player-id={playerId}>
      <div className="riftbound-player-label">{playerId === viewerId ? "You" : "Opponent"}</div>
      <div className="riftbound-fixed-zones" data-bounded-scroller="true">
        <DeckStackZone
          zone={zoneModel(playerId, "deck", cardsIn(state, playerId, "deck"))}
          entities={deck}
          entityCount={deck.length}
        />
        {zones.map((zone) => {
          const cards = cardsIn(state, playerId, zone);
          const model = zoneModel(playerId, zone, cards);
          return (
            <DropZone id={zone} ownerId={playerId} key={zone} disabled={readOnly}>
              <RiftboundZoneCards zone={model} cards={cards} state={state} disabled={readOnly} />
            </DropZone>
          );
        })}
      </div>
      <DropZone id="hand" ownerId={playerId} disabled={readOnly}>
        <RiftboundZoneCards
          cards={cardsIn(state, playerId, "hand")}
          state={state}
          zone={zoneModel(playerId, "hand", cardsIn(state, playerId, "hand"))}
          entities={hand}
          disabled={readOnly}
          hand
          onPlay={
            readOnly
              ? undefined
              : (entity) => dispatch({ type: "move_card", cardId: entity.id, zone: "play" })
          }
        />
      </DropZone>
    </section>
  );
}

function RiftboundZoneCards({
  zone,
  cards,
  state,
  entities = cards.map((card) => entityFor(card, state)),
  disabled,
  hand = false,
  onPlay,
}: {
  readonly zone: SimulatorZone;
  readonly cards: readonly RiftboundClientCardV1[];
  readonly state: RiftboundClientMatchStateV1;
  readonly entities?: readonly SimulatorEntity[];
  readonly disabled: boolean;
  readonly hand?: boolean;
  readonly onPlay?: (entity: SimulatorEntity) => void;
}) {
  const entityById = new Map(entities.map((entity) => [entity.id, entity]));
  return (
    <AnimatedZoneSlot
      animationRef={{ kind: "zone", id: zone.id, ownerId: zone.ownerId }}
      className={hand ? "riftbound-hand flex gap-2 overflow-x-auto" : "card-grid grid gap-2"}
    >
      <AnimatedEntityCollection>
        {cards.map((card) => {
          const entity = entityById.get(card.id) ?? entityFor(card, state);
          return (
            <AnimatedEntitySlot
              key={card.id}
              entity={entity}
              zoneRef={{ kind: "zone", id: zone.id, ownerId: zone.ownerId }}
              density="compact"
              className="min-w-0"
            >
              <DraggableCard
                card={card}
                entity={entity}
                disabled={disabled}
                onPlay={onPlay ? () => onPlay(entity) : undefined}
              />
            </AnimatedEntitySlot>
          );
        })}
      </AnimatedEntityCollection>
    </AnimatedZoneSlot>
  );
}

function DraggableCard({
  card,
  entity,
  disabled,
  onPlay,
}: {
  card: RiftboundClientCardV1;
  entity: SimulatorEntity;
  disabled: boolean;
  onPlay?: () => void;
}) {
  const style: CSSProperties = { rotate: `${card.rotation}deg` };
  return (
    <PointerDraggable
      id={`card:${card.id}`}
      disabled={disabled}
      style={style}
      onDoubleClick={onPlay}
      className="riftbound-card-button"
    >
      {({ isDragging }) => (
        <div style={{ opacity: isDragging ? 0.25 : 1 }}>
          <SimulatorEntityVisual entity={entity} density="compact" />
        </div>
      )}
    </PointerDraggable>
  );
}

function DropZone({
  id,
  ownerId,
  disabled,
  children,
}: {
  id: RiftboundZone;
  ownerId: string;
  disabled: boolean;
  children: ReactNode;
}) {
  return (
    <PointerDroppable
      id={`zone:${ownerId}:${id}`}
      disabled={disabled}
      data-zone={id}
      className="riftbound-drop-wrap"
    >
      {({ isOver }) => (
        <div className={isOver ? "riftbound-drop is-over" : "riftbound-drop"}>{children}</div>
      )}
    </PointerDroppable>
  );
}

function cardsIn(
  state: RiftboundClientMatchStateV1,
  ownerId: string | undefined,
  zone: RiftboundZone,
): RiftboundClientCardV1[] {
  return Object.values(state.cards).filter(
    (card) => card.zone === zone && (ownerId === undefined || card.ownerId === ownerId),
  );
}

function entityFor(
  card: RiftboundClientCardV1,
  state: RiftboundClientMatchStateV1,
  reveal = true,
): SimulatorEntity {
  const definition = state.cardDefinitions[card.cardId];
  return {
    id: card.id,
    title: reveal ? (definition?.name ?? "Unknown card") : "Hidden card",
    subtitle: reveal ? (definition?.cardType ?? "Riftbound") : "Private information",
    kind: "card",
    ownerId: card.ownerId,
    face: reveal && card.face === "up" ? "public" : "hidden",
    states: card.rotation === 90 ? ["rested"] : ["ready"],
    stats: Object.entries(card.counters).map(([label, value]) => ({ label, value: String(value) })),
    traits: definition?.domains ? [...definition.domains] : [],
    imageUrl: reveal ? definition?.imageUrl : undefined,
    imageAspectRatio: STANDARD_CARD_IMAGE_ASPECT_RATIO,
  };
}

function zoneModel(
  ownerId: string,
  zone: RiftboundZone,
  cards: RiftboundClientCardV1[],
): SimulatorZone {
  const role =
    zone === "play"
      ? "battlefield"
      : zone === "runes"
        ? "resource"
        : zone === "battlefields"
          ? "support"
          : zone === "legend"
            ? "leader"
            : zone;
  return {
    id: `${ownerId}:${zone}`,
    label: zone[0]!.toUpperCase() + zone.slice(1),
    role,
    ownerId,
    visibility: zone === "hand" ? "owner" : "public",
    entityIds: cards.map((card) => card.id),
    hint: zone,
    layoutHint: zone === "deck" || zone === "discard" ? "stack" : zone === "hand" ? "fan" : "row",
  };
}
