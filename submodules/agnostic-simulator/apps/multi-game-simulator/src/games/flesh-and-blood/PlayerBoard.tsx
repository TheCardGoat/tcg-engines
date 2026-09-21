import type {
  SimulatorDeckReveal,
  SimulatorDeckRevealCard,
  SimulatorZone,
} from "@tcg/simulator-contract";
import {
  CardZone,
  DeckStackZone,
  DiscardPileZone,
  SingleCardZone,
  ViewerSafeCardImage,
  useAnimationNode,
  type CardInteractionStateResolver,
} from "@tcg/simulator-ui";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import { Layers3, Shield } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { FabAssetMeters, FabStatBadge } from "./FabIconography";
import { countPublicBloodDebt, FabBloodDebtCue } from "./FabBloodDebtCue";
import { FabCardAutomationCluster } from "./FabCardAutomationCluster";
import { effectsForEntity, toSimulatorActiveEffect } from "./activeEffects";
import { useFabPreviewTarget } from "./FabCardPreview";
import {
  entityForFabViewer,
  type FabCardMetadata,
  type FabViewerEntityOptions,
} from "./projection";
import type {
  FabPresentationCard,
  FabPresentationEffect,
  FabPresentationHeroSignal,
} from "./state";
import { FabHeroSignalEdge } from "./FabHeroSignalEdge";
import { FabPrioritySignal } from "./FabPrioritySignal";
import { FabWeaponAttacksLeft } from "./FabWeaponAttacksLeft";
import { FabHostedCards } from "./FabHostedCards";

type InspectableZone =
  | "pitch"
  | "graveyard"
  | "banished"
  | "arsenal"
  | "head"
  | "chest"
  | "arms"
  | "legs";

const FAB_ARENA_CARD_SLOT_STYLE = {
  inlineSize: "var(--fab-zone-card-width)",
  blockSize: "var(--fab-zone-card-width)",
  minInlineSize: 0,
  minBlockSize: 0,
} satisfies CSSProperties;

export interface PlayerBoardProps {
  player: {
    playerId: string;
    heroCardId: string | null;
    life: number;
    resourcePoints: number;
    chiPoints?: number;
    actionPoints: number;
    soulCount: number;
    attackActivationsByInstanceId: Readonly<
      Record<
        string,
        {
          readonly controllerId: string;
          readonly total: number;
          readonly used: number;
          readonly remaining: number;
        }
      >
    >;
    heroSignals?: readonly FabPresentationHeroSignal[];
    zones: Record<string, string[]>;
    faceDownIds: readonly string[];
    cardsById: Readonly<Record<string, FabPresentationCard>>;
  };
  viewerId: string;
  side: "top" | "bottom";
  isTurn?: boolean;
  /** Presentation focus for the player who must act, including decisions resolved without priority. */
  hasInteractionAgency?: boolean;
  isPriority?: boolean;
  cardMetadata?: Map<string, FabCardMetadata>;
  /** Opens the existing shared inspector for a public or owner-visible pile. */
  onOpenZone?: (zone: InspectableZone) => void;
  /** Number of cards in the player's banished zone with an enabled action right now. */
  banishedAvailableCount?: number;
  /** Number of cards in the player's graveyard with an enabled action right now. */
  graveyardAvailableCount?: number;
  interactionStateFor?: CardInteractionStateResolver;
  onCardSelect?: (entity: SimulatorEntity) => void;
  allEffects?: readonly FabPresentationEffect[];
  /** Public card retained at the visible deck edge for the current turn. */
  deckReveal?: SimulatorDeckReveal;
}

function singleZone(
  playerId: string,
  kind: string,
  label: string,
  ids: string[],
  role: SimulatorZone["role"] = "support",
  slotId = kind,
): SimulatorZone {
  return {
    id: `${playerId}:${slotId}`,
    label,
    role,
    ownerId: playerId,
    visibility: "public",
    entityIds: ids,
    count: ids.length,
    hint: kind,
  };
}

function InspectablePile({
  zone,
  count,
  statusLabel,
  availableCount = 0,
  onOpen,
  isEntityInteractive,
  children,
}: {
  zone: InspectableZone;
  count: number;
  /** Additional current-state detail, such as floating resources in the pitch zone. */
  statusLabel?: string;
  /** Enabled actions represented inside this pile, surfaced without opening it. */
  availableCount?: number;
  onOpen?: (zone: InspectableZone) => void;
  /** A legal board action takes precedence over inspecting its containing zone. */
  isEntityInteractive?: (entityId: string) => boolean;
  children: ReactNode;
}) {
  const label = `${zone[0]!.toUpperCase()}${zone.slice(1)}, ${count} ${count === 1 ? "card" : "cards"}${statusLabel ? `, ${statusLabel}` : ""}`;
  const clickedInteractiveEntity = (target: EventTarget | null): boolean => {
    if (!(target instanceof HTMLElement)) return false;
    const entity = target.closest<HTMLElement>("[data-sim-entity-id]");
    const entityId = entity?.dataset.simEntityId;
    return entityId !== undefined && isEntityInteractive?.(entityId) === true;
  };
  return (
    <div
      className="fab-inspectable-pile"
      data-zone={zone}
      data-zone-label={zone}
      data-available={availableCount > 0 ? "true" : undefined}
      data-sim-primary-click-owner={
        onOpen && (zone === "graveyard" || zone === "banished")
          ? "zone-exclusive"
          : onOpen
            ? "zone"
            : undefined
      }
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      aria-label={onOpen ? `Inspect ${label}` : label}
      onClickCapture={
        onOpen
          ? (event) => {
              if (!(event.target as HTMLElement).closest("[data-sim-entity-id]")) return;
              if (clickedInteractiveEntity(event.target)) return;
              event.preventDefault();
              event.stopPropagation();
              onOpen(zone);
            }
          : undefined
      }
      onClick={
        onOpen
          ? (event) => {
              if ((event.target as HTMLElement).closest("[data-sim-entity-id]")) return;
              onOpen(zone);
            }
          : undefined
      }
      onKeyDown={
        onOpen
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onOpen(zone);
              }
            }
          : undefined
      }
    >
      {children}
      {availableCount > 0 ? (
        <span className="fab-zone-availability" aria-hidden="true">
          {availableCount} playable
        </span>
      ) : null}
    </div>
  );
}

interface PermanentStack {
  readonly key: string;
  readonly ids: readonly string[];
}

function stackPermanentIds(
  permanentIds: readonly string[],
  cardsById: Readonly<Record<string, FabPresentationCard>>,
): readonly PermanentStack[] {
  const stacks = new Map<string, string[]>();
  for (const id of permanentIds) {
    const card = cardsById[id];
    const counterState = card?.counters
      ?.map((counter) => `${counter.label}:${counter.count}`)
      .sort()
      .join("|");
    const key = card?.cardId.startsWith("token:")
      ? `${card.cardId}|tapped:${card.tapped === true}|counters:${counterState ?? ""}`
      : `instance:${id}`;
    const existing = stacks.get(key);
    if (existing) existing.push(id);
    else stacks.set(key, [id]);
  }
  return [...stacks].map(([key, ids]) => ({ key, ids }));
}

export function PlayerBoard({
  player,
  viewerId,
  side,
  isTurn = false,
  hasInteractionAgency = false,
  isPriority = false,
  cardMetadata,
  onOpenZone,
  banishedAvailableCount = 0,
  graveyardAvailableCount = 0,
  interactionStateFor,
  onCardSelect,
  allEffects = [],
  deckReveal,
}: PlayerBoardProps) {
  const isSelf = player.playerId === viewerId;
  const lifeAnimationRef = useAnimationNode(
    { kind: "player", id: player.playerId },
    { presence: "present" },
  );
  const soulAnimationRef = useAnimationNode(
    { kind: "zone", id: `${player.playerId}:soul`, ownerId: player.playerId },
    { presence: "present" },
  );
  const inventoryAnimationRef = useAnimationNode(
    { kind: "zone", id: `${player.playerId}:inventory`, ownerId: player.playerId },
    { presence: "present" },
  );
  const underAnimationRef = useAnimationNode(
    { kind: "zone", id: `${player.playerId}:under`, ownerId: player.playerId },
    { presence: "present" },
  );
  const permanentAnimationRef = useAnimationNode(
    { kind: "zone", id: `${player.playerId}:permanent`, ownerId: player.playerId },
    { presence: "present" },
  );
  const ids = (zone: string) => player.zones[zone] ?? [];
  const mapEntities = (
    cardIds: string[],
    options: FabViewerEntityOptions = { frame: "tactical" },
  ) =>
    cardIds.flatMap((id) => {
      const card = player.cardsById[id];
      if (!card) return [];
      return [
        entityForFabViewer(card, cardMetadata?.get(id), viewerId, {
          ...options,
          activeEffects: effectsForEntity({ activeEffects: allEffects }, id).map((effect) =>
            toSimulatorActiveEffect(effect, { kind: "entity", id }),
          ),
        }),
      ];
    });
  const heroId = player.heroCardId;
  const weaponIds = ids("weapon");
  const weaponAttacksRemaining = Object.values(player.attackActivationsByInstanceId)
    .filter((activation) => activation.controllerId === player.playerId)
    .reduce((total, activation) => total + activation.remaining, 0);
  const hasExtendedAttackPlan = Object.values(player.attackActivationsByInstanceId).some(
    (activation) => activation.controllerId === player.playerId && activation.total > 1,
  );
  const charged = (player.heroSignals ?? []).some(
    (signal) => signal.kind === "flag" && signal.id === "charged",
  );
  const permanentIds = ids("permanent");
  const hostedIdsByHostId = Object.values(player.cardsById).reduce<Record<string, string[]>>(
    (byHost, card) => {
      if (!card.hostInstanceId) return byHost;
      (byHost[card.hostInstanceId] ??= []).push(card.id);
      return byHost;
    },
    {},
  );
  const bloodDebtCount = countPublicBloodDebt(player, cardMetadata);
  const isTopSeat = side === "top";
  const selectInteractiveCard = (entity: SimulatorEntity) => {
    const interactionState = interactionStateFor?.(entity);
    // Opponent cards are normally inspect-only. During an active rules
    // decision, however, a public opposing card (including its hero) must be
    // selectable when it is one of the engine's legal targets.
    if ((isSelf || interactionState?.kind !== "idle") && interactionState && onCardSelect) {
      onCardSelect(entity);
    }
  };
  const permanentStacks = stackPermanentIds(permanentIds, player.cardsById).flatMap((stack) => {
    if (stack.ids.some((id) => (hostedIdsByHostId[id]?.length ?? 0) > 0)) {
      return stack.ids.map((id) => ({ key: `hosted:${id}`, ids: [id] }));
    }
    if (stack.ids.length === 1 || !isSelf || !interactionStateFor) return [stack];
    const hasInteractiveInstance = mapEntities([...stack.ids]).some(
      (entity) => interactionStateFor(entity).kind !== "idle",
    );
    return hasInteractiveInstance
      ? stack.ids.map((id) => ({ key: `interactive:${id}`, ids: [id] }))
      : [stack];
  });
  const resolvedDeckReveal = deckReveal
    ? {
        ...deckReveal,
        cards: deckReveal.cards.map((card) => {
          const metadata = card.entityId ? cardMetadata?.get(card.entityId) : undefined;
          return metadata
            ? {
                ...card,
                title: card.title ?? metadata.name,
                subtitle: card.subtitle ?? metadata.typeLine ?? metadata.type,
                imageUrl: card.imageUrl ?? metadata.imageUrl,
              }
            : card;
        }),
      }
    : undefined;

  const cardSlot = (
    zone: string,
    label: string,
    role: SimulatorZone["role"] = "support",
    zoneIds = ids(zone),
    slotId = zone,
    onSelect = onCardSelect ? selectInteractiveCard : undefined,
    style?: CSSProperties,
  ) => {
    const automationCardId = zoneIds[0];
    return (
      <div className="fab-card-slot-with-automation">
        <SingleCardZone
          zone={singleZone(player.playerId, zone, label, zoneIds, role, slotId)}
          entities={mapEntities(zoneIds)}
          entityCount={zoneIds.length}
          density="compact"
          style={style}
          interactionStateFor={interactionStateFor}
          onSelect={onSelect}
        />
        {isSelf && automationCardId ? (
          <FabCardAutomationCluster
            instanceId={automationCardId}
            cardName={cardMetadata?.get(automationCardId)?.name ?? label}
            canonicalId={cardMetadata?.get(automationCardId)?.canonicalId}
          />
        ) : null}
      </div>
    );
  };

  const equipmentCardSlot = (zone: string, label: string) => {
    const zoneIds = ids(zone);
    const inspectableZone = zone as Extract<InspectableZone, "head" | "chest" | "arms" | "legs">;
    const equipmentEntity = mapEntities(zoneIds)[0];
    const equipmentInteractionState = equipmentEntity
      ? interactionStateFor?.(equipmentEntity)
      : undefined;
    const handleEquipmentSelect = (entity: SimulatorEntity) => {
      const interactionState = interactionStateFor?.(entity);
      if (interactionState && interactionState.kind !== "idle" && onCardSelect) {
        onCardSelect(entity);
        return;
      }
      if (onOpenZone) {
        onOpenZone(inspectableZone);
        return;
      }
      if (isSelf) onCardSelect?.(entity);
    };
    return (
      <div
        className="fab-equipment-slot"
        data-sim-primary-click-owner={
          onOpenZone &&
          equipmentEntity &&
          (!equipmentInteractionState || equipmentInteractionState.kind === "idle")
            ? "zone"
            : undefined
        }
        onClickCapture={(event) => {
          if (
            !onOpenZone ||
            !equipmentEntity ||
            (equipmentInteractionState && equipmentInteractionState.kind !== "idle") ||
            !(event.target as HTMLElement).closest("[data-sim-entity-id]")
          ) {
            return;
          }
          event.preventDefault();
          event.stopPropagation();
          onOpenZone(inspectableZone);
        }}
      >
        {cardSlot(
          zone,
          label,
          "support",
          zoneIds,
          zone,
          handleEquipmentSelect,
          FAB_ARENA_CARD_SLOT_STYLE,
        )}
        {zoneIds.length === 0 ? (
          <span className="fab-equipment-empty-decoration" aria-hidden="true">
            <Shield size={15} strokeWidth={1.5} />
            <span>{label}</span>
          </span>
        ) : null}
      </div>
    );
  };

  return (
    <section
      className="fab-player"
      data-seat-side={side}
      data-player-id={player.playerId}
      data-life={player.life}
      data-ap={player.actionPoints}
      data-rp={player.resourcePoints}
      data-testid={`fab-player-${side}`}
      data-turn={isTurn ? "true" : undefined}
      data-agency={hasInteractionAgency ? "true" : undefined}
      data-priority={isPriority ? "true" : undefined}
      aria-label={`${isSelf ? "Your" : "Opponent"} arena`}
    >
      <FabPrioritySignal
        active={hasInteractionAgency}
        side={side === "top" ? "bottom" : "top"}
        showPointer
      />
      <div
        className="fab-seat-grid fab-seat-layout"
        aria-label={`${isSelf ? "Your" : "Opponent"} board zones`}
      >
        <div className="fab-layout-row fab-layout-row-primary" data-layout-row="primary">
          <div className="fab-layout-cell fab-layout-single fab-zone-head">
            {isTopSeat ? equipmentCardSlot("legs", "Legs") : equipmentCardSlot("head", "Head")}
          </div>

          <div className="fab-layout-cell fab-layout-single fab-zone-graveyard">
            <InspectablePile
              zone="graveyard"
              count={ids("graveyard").length}
              statusLabel={
                graveyardAvailableCount > 0 ? `${graveyardAvailableCount} available now` : undefined
              }
              availableCount={graveyardAvailableCount}
              onOpen={onOpenZone}
            >
              <DiscardPileZone
                zone={singleZone(
                  player.playerId,
                  "graveyard",
                  "Graveyard",
                  ids("graveyard"),
                  "discard",
                )}
                entities={mapEntities(ids("graveyard"), { decorations: "none" })}
                entityCount={ids("graveyard").length}
                onSelect={onOpenZone ? () => onOpenZone("graveyard") : undefined}
              />
            </InspectablePile>
          </div>

          {permanentIds.length > 0 ? (
            <div
              ref={permanentAnimationRef}
              className="fab-layout-cell fab-zone-permanent"
              data-zone="permanent"
            >
              <div
                className="fab-permanent-stack-row"
                role="list"
                aria-label={`${isSelf ? "Your" : "Opponent"} permanents, ${permanentIds.length} ${
                  permanentIds.length === 1 ? "card" : "cards"
                }`}
              >
                {permanentStacks.map((stack) => {
                  const representativeId = stack.ids[0]!;
                  const metadata = cardMetadata?.get(representativeId);
                  const hostedCards = mapEntities(hostedIdsByHostId[representativeId] ?? [], {
                    decorations: "none",
                  });
                  return (
                    <div
                      key={stack.key}
                      className="fab-permanent-stack"
                      role="listitem"
                      data-token-count={stack.ids.length > 1 ? stack.ids.length : undefined}
                      data-hosted-count={hostedCards.length || undefined}
                      aria-label={
                        stack.ids.length > 1
                          ? `${metadata?.name ?? "Token"}, ${stack.ids.length} permanents`
                          : undefined
                      }
                    >
                      <div className="fab-card-slot-with-automation">
                        <SingleCardZone
                          className="fab-permanent-stack-zone"
                          zone={singleZone(
                            player.playerId,
                            "permanent",
                            metadata?.name ?? "Permanent",
                            [representativeId],
                            "battlefield",
                            `permanent:${representativeId}`,
                          )}
                          entities={mapEntities([representativeId], {
                            frame: "tactical",
                            tacticalBadgeMode: "permanent",
                          })}
                          entityCount={1}
                          density="compact"
                          style={FAB_ARENA_CARD_SLOT_STYLE}
                          interactionStateFor={interactionStateFor}
                          onSelect={onCardSelect ? selectInteractiveCard : undefined}
                        />
                        {isSelf ? (
                          <FabCardAutomationCluster
                            instanceId={representativeId}
                            cardName={metadata?.name ?? "Permanent"}
                            canonicalId={metadata?.canonicalId}
                          />
                        ) : null}
                      </div>
                      <FabHostedCards
                        hostName={metadata?.name ?? "Permanent"}
                        cards={hostedCards}
                      />
                      {stack.ids.length > 1 ? (
                        <span className="fab-permanent-stack-count" aria-hidden="true">
                          <Layers3 size={13} strokeWidth={2} />
                          <strong>{stack.ids.length}</strong>
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>

        <div className="fab-layout-row fab-layout-row-main" data-layout-row="main">
          <div className="fab-layout-column fab-layout-pair fab-layout-equipment">
            <div className="fab-layout-cell fab-layout-single fab-zone-chest">
              {equipmentCardSlot("chest", "Chest")}
            </div>
            <div className="fab-layout-cell fab-layout-single fab-zone-arms">
              {equipmentCardSlot("arms", "Arms")}
            </div>
          </div>

          <div className="fab-layout-column fab-layout-center">
            <div className="fab-layout-center-cards">
              <div className="fab-layout-cell fab-layout-single fab-zone-weapon fab-zone-weapon-left">
                {cardSlot("weapon", "Weapon", "support", weaponIds.slice(0, 1), "weapon1")}
                {weaponIds[0] ? (
                  <FabWeaponAttacksLeft
                    weaponName={cardMetadata?.get(weaponIds[0])?.name ?? "Weapon"}
                    remaining={player.attackActivationsByInstanceId[weaponIds[0]]?.remaining ?? 0}
                    total={player.attackActivationsByInstanceId[weaponIds[0]]?.total ?? 0}
                    side={side}
                  />
                ) : null}
              </div>
              <div
                ref={(node) => {
                  soulAnimationRef(node);
                  inventoryAnimationRef(node);
                  underAnimationRef(node);
                }}
                className="fab-layout-cell fab-layout-single fab-zone-hero"
              >
                {heroId ? cardSlot("hero", "Hero", "leader") : null}
                {heroId ? (
                  <FabHeroSignalEdge
                    signals={player.heroSignals ?? []}
                    heroName={cardMetadata?.get(heroId)?.name ?? "Hero"}
                    side={side}
                  />
                ) : null}
              </div>
              <div className="fab-layout-cell fab-layout-single fab-zone-weapon fab-zone-weapon-right">
                {cardSlot("weapon", "Weapon", "support", weaponIds.slice(1, 2), "weapon2")}
                {weaponIds[1] ? (
                  <FabWeaponAttacksLeft
                    weaponName={cardMetadata?.get(weaponIds[1])?.name ?? "Weapon"}
                    remaining={player.attackActivationsByInstanceId[weaponIds[1]]?.remaining ?? 0}
                    total={player.attackActivationsByInstanceId[weaponIds[1]]?.total ?? 0}
                    side={side}
                  />
                ) : null}
              </div>
            </div>
            {hasExtendedAttackPlan && isTurn ? (
              <div className="fab-turn-plan" aria-label="Current turn setup">
                <strong>
                  {weaponAttacksRemaining} weapon{" "}
                  {weaponAttacksRemaining === 1 ? "attack" : "attacks"}
                </strong>
                <span>{player.actionPoints} AP</span>
                {player.soulCount > 0 ? <span>{player.soulCount} Soul</span> : null}
                {charged ? <span>Charged</span> : null}
              </div>
            ) : null}
          </div>

          <div className="fab-layout-column fab-layout-pair fab-layout-piles">
            <div className="fab-layout-cell fab-layout-single fab-zone-pitch">
              <InspectablePile
                zone="pitch"
                count={ids("pitch").length}
                statusLabel={
                  player.resourcePoints > 0
                    ? `${player.resourcePoints} floating ${
                        player.resourcePoints === 1 ? "resource" : "resources"
                      }`
                    : undefined
                }
                onOpen={onOpenZone}
              >
                {player.resourcePoints > 0 ? (
                  <span className="fab-pitch-zone-mark" aria-hidden="true">
                    <FabStatBadge
                      stat="resource"
                      value={player.resourcePoints}
                      label="Resources"
                      size="sm"
                      showLabel={false}
                      testId="fab-pitch-floating-resources"
                    />
                  </span>
                ) : null}
                <DiscardPileZone
                  zone={singleZone(player.playerId, "pitch", "Pitch", ids("pitch"), "resource")}
                  entities={mapEntities(ids("pitch"), { decorations: "none" })}
                  entityCount={ids("pitch").length}
                  onSelect={onOpenZone ? () => onOpenZone("pitch") : undefined}
                />
              </InspectablePile>
            </div>
            <div className="fab-layout-cell fab-layout-single fab-zone-deck" data-zone="deck">
              <DeckStackZone
                zone={{
                  id: `${player.playerId}:deck`,
                  label: "Deck",
                  role: "deck",
                  ownerId: player.playerId,
                  visibility: "secret",
                  entityIds: ids("deck"),
                  count: ids("deck").length,
                  hint: "deck",
                  layoutHint: "stack",
                }}
                entities={mapEntities(ids("deck"))}
                entityCount={ids("deck").length}
                reveal={resolvedDeckReveal}
                revealPreferredSide={isTopSeat ? "top" : "bottom"}
                renderRevealedCard={fabRenderRevealedCard}
              />
            </div>
          </div>
        </div>

        <div className="fab-layout-row fab-layout-row-support" data-layout-row="support">
          <div className="fab-layout-cell fab-layout-single fab-zone-legs">
            {isTopSeat ? equipmentCardSlot("head", "Head") : equipmentCardSlot("legs", "Legs")}
          </div>
          <div className="fab-layout-cell fab-layout-single fab-zone-arsenal">
            <InspectablePile
              zone="arsenal"
              count={ids("arsenal").length}
              onOpen={onOpenZone}
              isEntityInteractive={(entityId) => {
                const entity = mapEntities(ids("arsenal")).find(({ id }) => id === entityId);
                // Owned arsenal cards must reach action feedback even when no move is available.
                // Empty piles and opposing hidden cards still open the zone inspector.
                return (
                  entity !== undefined &&
                  ((isSelf && onCardSelect !== undefined) ||
                    interactionStateFor?.(entity).kind !== "idle")
                );
              }}
            >
              <CardZone
                zone={{
                  ...singleZone(player.playerId, "arsenal", "Arsenal", ids("arsenal"), "custom"),
                  visibility: "owner",
                  layoutHint: "row",
                }}
                entities={mapEntities(ids("arsenal"))}
                entityCount={ids("arsenal").length}
                compact
                emptyLabel="Arsenal"
                interactionStateFor={interactionStateFor}
                onSelect={onCardSelect ? selectInteractiveCard : undefined}
                ariaLabel={`${isSelf ? "Your" : "Opponent"} arsenal, ${ids("arsenal").length} ${
                  ids("arsenal").length === 1 ? "card" : "cards"
                }`}
              />
            </InspectablePile>
          </div>
          <div className="fab-support-overlay fab-support-overlay-status">
            <div className="fab-player-header">
              <div
                ref={lifeAnimationRef}
                className="fab-life-badge"
                aria-label={`${isSelf ? "Your" : "Opponent"} assets`}
              >
                <FabAssetMeters
                  playerId={player.playerId}
                  life={player.life}
                  resourcePoints={player.resourcePoints}
                  chiPoints={player.chiPoints}
                  actionPoints={player.actionPoints}
                  density="desktop"
                />
              </div>
            </div>
          </div>
          <div className="fab-layout-cell fab-layout-single fab-zone-banished">
            <InspectablePile
              zone="banished"
              count={ids("banished").length}
              statusLabel={
                [
                  bloodDebtCount > 0 ? `${bloodDebtCount} Blood Debt` : null,
                  banishedAvailableCount > 0 ? `${banishedAvailableCount} available now` : null,
                ]
                  .filter((value): value is string => value !== null)
                  .join(", ") || undefined
              }
              availableCount={banishedAvailableCount}
              onOpen={onOpenZone}
            >
              <DiscardPileZone
                zone={singleZone(
                  player.playerId,
                  "banished",
                  "Banished",
                  ids("banished"),
                  "discard",
                )}
                entities={mapEntities(ids("banished"), { decorations: "none" })}
                entityCount={ids("banished").length}
                onSelect={onOpenZone ? () => onOpenZone("banished") : undefined}
              />
              <FabBloodDebtCue count={bloodDebtCount} ownerLabel={isSelf ? "Your" : "Opponent"} />
            </InspectablePile>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Revealed deck-edge cards present through the game-wide hover preview: the
 * same pinned/hover surface every other FAB card uses, resolved to the
 * printed card via the disclosed catalog identity.
 */
function FabDeckRevealShelfCard({
  card,
  entity,
}: {
  card: SimulatorDeckRevealCard;
  entity: SimulatorEntity;
}) {
  const canonicalId = card.definitionId;
  const previewEntity: SimulatorEntity = canonicalId
    ? {
        ...entity,
        dataAttributes: {
          ...entity.dataAttributes,
          "data-fab-canonical-id": canonicalId,
        },
      }
    : entity;
  const { previewProps } = useFabPreviewTarget(previewEntity, { pinOnClick: true });
  return (
    <span
      className="relative grid h-32 w-24 cursor-zoom-in place-items-center overflow-hidden rounded-[4px] border border-white/28 bg-slate-950 shadow-sm"
      data-testid="deck-reveal-card"
      data-card-id={card.entityId}
      data-fab-canonical-id={canonicalId}
      {...previewProps}
    >
      {card.imageUrl ? (
        <ViewerSafeCardImage
          entity={previewEntity}
          alt={card.title ?? "Revealed card"}
          className="h-full w-full object-contain"
          loading="eager"
        />
      ) : (
        <span className="line-clamp-3 px-1 text-[10px] font-bold leading-[1.15] text-white/90">
          {card.title ?? "Revealed"}
        </span>
      )}
    </span>
  );
}

function fabRenderRevealedCard(card: SimulatorDeckRevealCard, entity: SimulatorEntity): ReactNode {
  return <FabDeckRevealShelfCard card={card} entity={entity} />;
}
