import {
  CardImage,
  CardInteractionFrame,
  cardInteractionDescription,
  HandZone,
  AnimationAnchor,
  AnimatedZoneSlot,
  simulatorBoardCenterAnimationRef,
  useAnimationNode,
  type CardInteractionStateResolver,
} from "@tcg/simulator-ui";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import type { FabLegalCommand } from "@tcg/flesh-and-blood-engine/simulator";
import {
  Archive,
  ChevronLeft,
  ChevronRight,
  Database,
  Flame,
  Layers3,
  Shield,
  Skull,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

import { CombatChain } from "./CombatChain";
import {
  FabActiveEffectsButton,
  FabMobileActiveEffectsLedger,
  type FabOpenEffects,
} from "./FabActiveEffects";
import {
  effectsForEntity,
  toSimulatorActiveEffect,
  type FabBoardEffectGroups,
} from "./activeEffects";
import type { FabCombatChainView } from "./combatChainView";
import { FabBoardCardFace } from "./FabBoardCardFace";
import { countPublicBloodDebt, FabBloodDebtCue } from "./FabBloodDebtCue";
import { FabCardAutomationCluster } from "./FabCardAutomationCluster";
import { FabOfficialIcon, FabPitchZoneIcon } from "./FabIconography";
import type { FabCardMetadata } from "./projection";
import { entityFor, entityForFabPresentationCard, entityForFabViewer } from "./projection";
import type {
  FabPresentationCard,
  FabPresentationEffect,
  FabPresentationHeroSignal,
} from "./state";
import { FabHeroSignalEdge } from "./FabHeroSignalEdge";
import { FabWeaponAttacksLeft } from "./FabWeaponAttacksLeft";
import { FabHostedCards } from "./FabHostedCards";

export type FabInspectableZone =
  | "pitch"
  | "graveyard"
  | "banished"
  | "arsenal"
  | "head"
  | "chest"
  | "arms"
  | "legs";

export interface FabMobileSeat {
  playerId: string;
  heroCardId: string | null;
  life: number;
  resourcePoints: number;
  actionPoints: number;
  soulCount?: number;
  attackActivationsByInstanceId?: Readonly<
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
  cardsById: Readonly<Record<string, FabPresentationCard>>;
  faceDownIds: readonly string[];
}

export interface FabMobileBoardProps {
  opponent: FabMobileSeat;
  self: FabMobileSeat;
  viewerId: string;
  combatView: FabCombatChainView;
  cardMetadata?: Map<string, FabCardMetadata>;
  isOpponentTurn?: boolean;
  isSelfTurn?: boolean;
  isOpponentPriority?: boolean;
  isSelfPriority?: boolean;
  /** Player whose response currently advances the game, including rules decisions without priority. */
  interactionAgencyOwner: "self" | "opponent" | "none";
  /** When true, active chain retracts to compact rail for public board targeting. */
  publicTargeting?: boolean;
  defenderLabel?: string;
  priorityLabel?: string | null;
  actionsDisabled?: boolean;
  onPassPriority?: () => void;
  priorityActionLabel?: string;
  provisionalDefenderIds?: readonly string[];
  showDefensePrompt?: boolean;
  onRetractDefender?: (instanceId: string) => void;
  onPlayActivate?: () => void;
  onOpenZone?: (selection: { ownerId: string; zone: FabInspectableZone }) => void;
  /** Enabled actions sourced from cards in the player's banished zone. */
  banishedAvailableCount?: number;
  /** Enabled actions sourced from cards in the player's graveyard. */
  graveyardAvailableCount?: number;
  /** Engine-probed actions; inspection never guesses whether a permanent can act. */
  legalCommands?: readonly FabLegalCommand[];
  onOpenLegalActions?: () => void;
  interactionStateFor?: CardInteractionStateResolver;
  onCardSelect?: (entity: SimulatorEntity) => void;
  announcement?: string;
  effects: FabBoardEffectGroups;
  onOpenEffects: FabOpenEffects;
  resolutionOverlay?: ReactNode;
  stackControl?: ReactNode;
}

interface FabPermanentInspectionSelection {
  readonly id: string;
  readonly slotLabel: string;
  readonly metadata: FabCardMetadata;
  readonly effects: readonly FabPresentationEffect[];
}

function entityEffects(
  effects: readonly FabPresentationEffect[],
  id: string,
): SimulatorEntity["activeEffects"] {
  return effectsForEntity({ activeEffects: effects }, id).map((effect) =>
    toSimulatorActiveEffect(effect, { kind: "entity", id }),
  );
}

const PERMANENTS_DRAWER_FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function commandUsesCard(command: FabLegalCommand, cardId: string): boolean {
  return command.payload.instanceId === cardId;
}

function PermanentInspector({
  selection,
  legalCommands = [],
  onClose,
  onOpenLegalActions,
}: {
  selection: FabPermanentInspectionSelection | null;
  legalCommands?: readonly FabLegalCommand[];
  onClose: () => void;
  onOpenLegalActions?: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!selection) {
      if (wasOpenRef.current) {
        wasOpenRef.current = false;
        returnFocusRef.current?.focus({ preventScroll: true });
        returnFocusRef.current = null;
      }
      return;
    }

    if (wasOpenRef.current) return;
    wasOpenRef.current = true;
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus({ preventScroll: true });
  }, [selection]);

  if (!selection) return null;

  const { id, slotLabel, metadata, effects } = selection;
  const availableCommands = legalCommands.filter((command) => commandUsesCard(command, id));
  const hasPrintedAction = /(?:^|\n)(?:once per turn )?action\b/i.test(metadata.printedText ?? "");
  const typeLine = metadata.typeLine ?? metadata.type;
  const stats = [
    metadata.pitchValue != null ? `Pitch ${metadata.pitchValue}` : null,
    metadata.cost != null ? `Cost ${metadata.cost}` : null,
    metadata.power != null ? `Power ${metadata.power}` : null,
    metadata.defense != null ? `Defense ${metadata.defense}` : null,
  ].filter((value): value is string => value != null);

  return (
    <div className="fab-permanent-inspector-backdrop" onPointerDown={onClose}>
      <section
        className="fab-permanent-inspector"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fab-permanent-inspector-title"
        aria-describedby="fab-permanent-inspector-availability"
        data-testid="fab-permanent-inspector"
        data-card-id={id}
        onPointerDown={(event) => event.stopPropagation()}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            onClose();
            return;
          }
          if (event.key !== "Tab") return;

          const focusable = Array.from(
            event.currentTarget.querySelectorAll<HTMLElement>(PERMANENTS_DRAWER_FOCUSABLE_SELECTOR),
          ).filter((element) => !element.hasAttribute("disabled"));
          const firstFocusable = focusable[0];
          const lastFocusable = focusable.at(-1);
          if (!firstFocusable || !lastFocusable) {
            event.preventDefault();
            closeRef.current?.focus();
          } else if (event.shiftKey && document.activeElement === firstFocusable) {
            event.preventDefault();
            lastFocusable.focus();
          } else if (!event.shiftKey && document.activeElement === lastFocusable) {
            event.preventDefault();
            firstFocusable.focus();
          }
        }}
      >
        <header>
          <div>
            <span>{slotLabel}</span>
            <h2 id="fab-permanent-inspector-title">{metadata.name}</h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            aria-label={`Close ${metadata.name} inspection`}
            onClick={onClose}
          >
            Close
          </button>
        </header>
        <p className="fab-permanent-inspector-type">{typeLine}</p>
        {metadata.imageUrl ? <CardImage src={metadata.imageUrl} alt="" aria-hidden="true" /> : null}
        {stats.length > 0 ? (
          <dl
            className="fab-permanent-inspector-stats"
            aria-label={`${metadata.name} printed stats`}
          >
            {stats.map((stat) => {
              const [label, value] = stat.split(" ");
              return (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              );
            })}
          </dl>
        ) : null}
        <p className="fab-permanent-inspector-text">
          {metadata.printedText ?? "No printed rules text is available for this card."}
        </p>
        {effects.length > 0 ? (
          <section className="fab-permanent-inspector-effects" aria-label="Active effects">
            <strong>Active effects</strong>
            <ul>
              {effects.map((effect) => (
                <li key={effect.id} data-tone={effect.tone}>
                  <div>
                    <strong>{effect.label}</strong>
                    <span>{effect.durationLabel}</span>
                  </div>
                  <p>{effect.detail}</p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <section
          className="fab-permanent-inspector-availability"
          id="fab-permanent-inspector-availability"
        >
          <strong>Availability</strong>
          {availableCommands.length > 0 ? (
            <>
              <p>
                {availableCommands.length === 1
                  ? "A legal action is available now."
                  : `${availableCommands.length} legal actions are available now.`}
              </p>
              <button type="button" onClick={onOpenLegalActions}>
                Open legal actions
              </button>
            </>
          ) : hasPrintedAction ? (
            <p>
              No legal activation is available. This printed action is rules-light in practice and
              this inspector will not create a fake action.
            </p>
          ) : (
            <p>
              No direct action is legal now. Triggered effects resolve automatically when supported.
            </p>
          )}
        </section>
      </section>
    </div>
  );
}

function HeroRow({
  seat,
  side,
  viewerId,
  cardMetadata,
  allEffects,
  onInspect,
  interactionStateFor,
  onCardSelect,
}: {
  seat: FabMobileSeat;
  side: "top" | "bottom";
  viewerId: string;
  cardMetadata?: Map<string, FabCardMetadata>;
  allEffects: readonly FabPresentationEffect[];
  onInspect: (selection: FabPermanentInspectionSelection) => void;
  interactionStateFor?: CardInteractionStateResolver;
  onCardSelect?: (entity: SimulatorEntity) => void;
}) {
  const zoneAnimationRefs = {
    hero: useAnimationNode(
      { kind: "zone", id: `${seat.playerId}:hero`, ownerId: seat.playerId },
      { presence: "present" },
    ),
    weapon1: useAnimationNode(
      { kind: "zone", id: `${seat.playerId}:weapon1`, ownerId: seat.playerId },
      { presence: "present" },
    ),
    weapon2: useAnimationNode(
      { kind: "zone", id: `${seat.playerId}:weapon2`, ownerId: seat.playerId },
      { presence: "present" },
    ),
    head: useAnimationNode(
      { kind: "zone", id: `${seat.playerId}:head`, ownerId: seat.playerId },
      { presence: "present" },
    ),
    chest: useAnimationNode(
      { kind: "zone", id: `${seat.playerId}:chest`, ownerId: seat.playerId },
      { presence: "present" },
    ),
    arms: useAnimationNode(
      { kind: "zone", id: `${seat.playerId}:arms`, ownerId: seat.playerId },
      { presence: "present" },
    ),
    legs: useAnimationNode(
      { kind: "zone", id: `${seat.playerId}:legs`, ownerId: seat.playerId },
      { presence: "present" },
    ),
    soul: useAnimationNode(
      { kind: "zone", id: `${seat.playerId}:soul`, ownerId: seat.playerId },
      { presence: "present" },
    ),
    inventory: useAnimationNode(
      { kind: "zone", id: `${seat.playerId}:inventory`, ownerId: seat.playerId },
      { presence: "present" },
    ),
    under: useAnimationNode(
      { kind: "zone", id: `${seat.playerId}:under`, ownerId: seat.playerId },
      { presence: "present" },
    ),
  };
  const weaponIds = seat.zones.weapon ?? [];
  const hasOffhand = Boolean(weaponIds[1]);
  const weaponSlots = [
    { id: weaponIds[0] ?? null, label: "Weapon", kind: "weapon" },
    ...(hasOffhand ? [{ id: weaponIds[1], label: "Offhand", kind: "weapon" }] : []),
  ] as const;
  const equipmentSlots = [
    { id: seat.zones.head?.[0] ?? null, label: "Head", kind: "equipment" },
    { id: seat.zones.chest?.[0] ?? null, label: "Chest", kind: "equipment" },
    { id: seat.zones.arms?.[0] ?? null, label: "Arms", kind: "equipment" },
    { id: seat.zones.legs?.[0] ?? null, label: "Legs", kind: "equipment" },
  ] as const;
  const heroSlot = { id: seat.heroCardId, label: "Hero", kind: "hero" } as const;
  const combatSlots =
    side === "top" ? [heroSlot, ...weaponSlots] : [...[...weaponSlots].reverse(), heroSlot];
  const allSlots = [...combatSlots, ...equipmentSlots] as const;
  const arsenalIds = (seat.zones.arsenal ?? []).slice(0, 2);
  const revealArsenal = side === "bottom";

  const renderSlot = (slot: (typeof allSlots)[number], index: number) => {
    const metadata = slot.id ? cardMetadata?.get(slot.id) : undefined;
    const card = slot.id ? seat.cardsById[slot.id] : undefined;
    const entity = card
      ? entityForFabViewer(card, metadata, viewerId, {
          frame: "tactical",
          activeEffects: entityEffects(allEffects, card.id),
        })
      : null;
    const interactionState = entity ? interactionStateFor?.(entity) : undefined;
    const primaryZoneRef =
      slot.kind === "hero"
        ? zoneAnimationRefs.hero
        : slot.kind === "weapon"
          ? slot.label === "Offhand"
            ? zoneAnimationRefs.weapon2
            : zoneAnimationRefs.weapon1
          : zoneAnimationRefs[slot.label.toLocaleLowerCase() as "head" | "chest" | "arms" | "legs"];
    return (
      <div
        ref={(node) => {
          primaryZoneRef(node);
          if (slot.kind === "hero") {
            zoneAnimationRefs.soul(node);
            zoneAnimationRefs.inventory(node);
            zoneAnimationRefs.under(node);
          }
        }}
        key={`${slot.kind}-${index}`}
        role="group"
        className="fab-mobile-hero-slot-group"
        data-slot={slot.label.toLocaleLowerCase()}
        data-zone={slot.kind === "hero" ? "hero" : undefined}
        data-empty={slot.id ? undefined : "true"}
        aria-label={
          slot.id ? `${slot.label}: ${metadata?.name ?? "Unknown card"}` : `${slot.label}: empty`
        }
      >
        <button
          type="button"
          className="fab-mobile-hero-slot fab-square-tile"
          data-slot={slot.label.toLocaleLowerCase()}
          data-zone={slot.kind === "hero" ? "hero" : undefined}
          data-empty={slot.id ? undefined : "true"}
          disabled={!slot.id || !metadata}
          aria-label={
            slot.id && metadata
              ? interactionState && interactionState.kind !== "idle"
                ? `${slot.label}: ${metadata.name}, ${cardInteractionDescription(interactionState)}`
                : `Inspect ${slot.label}: ${metadata.name}`
              : `${slot.label}: empty`
          }
          aria-haspopup={slot.id && metadata ? "dialog" : undefined}
          onClick={() => {
            if (entity && onCardSelect) onCardSelect(entity);
            else if (slot.id && metadata)
              onInspect({
                id: slot.id,
                slotLabel: slot.label,
                metadata,
                effects: effectsForEntity({ activeEffects: allEffects }, slot.id),
              });
          }}
        >
          {entity ? (
            <CardInteractionFrame state={interactionState}>
              <FabBoardCardFace entity={entity} density="mini" fill />
            </CardInteractionFrame>
          ) : (
            <span className="fab-mobile-empty-slot">
              {slot.kind === "equipment" ? (
                <Shield aria-hidden="true" size={15} strokeWidth={1.5} />
              ) : null}
              <span>{slot.label}</span>
            </span>
          )}
        </button>
        {slot.kind === "hero" && slot.id ? (
          <FabHeroSignalEdge
            signals={seat.heroSignals ?? []}
            heroName={metadata?.name ?? "Hero"}
            side={side}
          />
        ) : null}
        {slot.kind === "weapon" && slot.id ? (
          <FabWeaponAttacksLeft
            weaponName={metadata?.name ?? slot.label}
            remaining={seat.attackActivationsByInstanceId?.[slot.id]?.remaining ?? 0}
            total={seat.attackActivationsByInstanceId?.[slot.id]?.total ?? 0}
            side={side}
          />
        ) : null}
        {slot.id && metadata ? (
          <FabCardAutomationCluster
            instanceId={slot.id}
            cardName={metadata.name}
            canonicalId={metadata.canonicalId}
          />
        ) : null}
      </div>
    );
  };

  return (
    <section
      className="fab-mobile-hero-row"
      data-testid={`fab-${side === "top" ? "opponent" : "player"}-hero-row`}
      data-side={side}
      data-has-offhand={hasOffhand ? "true" : undefined}
      data-zone-group="hero-row"
      aria-label={`${side === "top" ? "Opponent" : "Your"} board`}
    >
      {side === "bottom" ? (
        <div className="fab-mobile-equipment-grid">{equipmentSlots.map(renderSlot)}</div>
      ) : null}
      <div className="fab-mobile-hero-combat-slots">
        {combatSlots.map(renderSlot)}
        {arsenalIds.length > 0 ? (
          <div
            className="fab-mobile-arsenal-tray"
            aria-label={`Arsenal, ${arsenalIds.length} ${arsenalIds.length === 1 ? "card" : "cards"}`}
          >
            <div className="fab-mobile-arsenal-tray-label" aria-hidden="true">
              <span>Arsenal</span>
              <strong>{arsenalIds.length}</strong>
            </div>
            <ul className="fab-mobile-arsenal-tray-cards">
              {arsenalIds.map((id) => {
                const metadata = cardMetadata?.get(id);
                const presentationCard = seat.cardsById[id];
                const entity = presentationCard
                  ? entityForFabViewer(presentationCard, metadata, viewerId, {
                      frame: "tactical",
                      activeEffects: entityEffects(allEffects, id),
                    })
                  : null;
                const interactionState = entity ? interactionStateFor?.(entity) : undefined;
                if (!entity) return null;
                const ownerVisibleFaceDown =
                  entity.dataAttributes?.["data-fab-owner-face-down"] === "true";
                const cardFace = <FabBoardCardFace entity={entity} density="mini" fill />;
                const card = entity ? (
                  <CardInteractionFrame state={interactionState}>{cardFace}</CardInteractionFrame>
                ) : (
                  cardFace
                );

                return revealArsenal && metadata ? (
                  <li key={id} className="fab-mobile-arsenal-card">
                    <button
                      type="button"
                      className="fab-mobile-arsenal-card-button"
                      aria-label={`${
                        interactionState && interactionState.kind !== "idle"
                          ? `Arsenal: ${metadata.name}, ${cardInteractionDescription(interactionState)}`
                          : `Inspect Arsenal: ${metadata.name}`
                      }${ownerVisibleFaceDown ? ", face down, visible only to you" : ""}`}
                      aria-haspopup="dialog"
                      onClick={() => {
                        if (entity && onCardSelect) onCardSelect(entity);
                        else
                          onInspect({
                            id,
                            slotLabel: "Arsenal",
                            metadata,
                            effects: effectsForEntity({ activeEffects: allEffects }, id),
                          });
                      }}
                    >
                      {card}
                    </button>
                  </li>
                ) : (
                  <li key={id} className="fab-mobile-arsenal-card">
                    {card}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
      {side === "top" ? (
        <div className="fab-mobile-equipment-grid">{equipmentSlots.map(renderSlot)}</div>
      ) : null}
    </section>
  );
}

function PermanentRow({
  seat,
  side,
  cardMetadata,
  allEffects,
  onInspect,
  interactionStateFor,
  onCardSelect,
}: {
  seat: FabMobileSeat;
  side: "opponent" | "player";
  cardMetadata?: Map<string, FabCardMetadata>;
  allEffects: readonly FabPresentationEffect[];
  onInspect: (selection: FabPermanentInspectionSelection) => void;
  interactionStateFor?: CardInteractionStateResolver;
  onCardSelect?: (entity: SimulatorEntity) => void;
}) {
  const ids = seat.zones.permanent ?? [];
  const hostedIdsByHostId = Object.values(seat.cardsById).reduce<Record<string, string[]>>(
    (byHost, card) => {
      if (!card.hostInstanceId) return byHost;
      (byHost[card.hostInstanceId] ??= []).push(card.id);
      return byHost;
    },
    {},
  );
  const permanentStacks = ids.reduce<
    Array<{ id: string; name: string; count: number; metadata: FabCardMetadata | undefined }>
  >((stacks, id) => {
    const metadata = cardMetadata?.get(id);
    const name = metadata?.name ?? "Permanent";
    const existing =
      (hostedIdsByHostId[id]?.length ?? 0) === 0
        ? stacks.find(
            (stack) => stack.name === name && (hostedIdsByHostId[stack.id]?.length ?? 0) === 0,
          )
        : undefined;
    if (existing) {
      existing.count += 1;
    } else {
      stacks.push({ id, name, count: 1, metadata });
    }
    return stacks;
  }, []);
  const label = side === "opponent" ? "Opponent permanents" : "Your permanents";
  const permanentAnimationRef = useAnimationNode(
    { kind: "zone", id: `${seat.playerId}:permanent`, ownerId: seat.playerId },
    { presence: "present" },
  );
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({ left: false, right: false });

  const syncScrollState = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const maxScrollLeft = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    setScrollState({
      left: scroller.scrollLeft > 1,
      right: scroller.scrollLeft < maxScrollLeft - 1,
    });
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const frame = window.requestAnimationFrame(syncScrollState);
    const resizeObserver =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(syncScrollState);
    resizeObserver?.observe(scroller);

    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
    };
  }, [ids.length, syncScrollState]);

  const scrollPermanents = (direction: -1 | 1) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({
      left: direction * Math.max(160, scroller.clientWidth * 0.72),
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={permanentAnimationRef}
      className="fab-permanents-row"
      data-side={side}
      data-empty={ids.length === 0 ? "true" : undefined}
      data-testid={`fab-permanents-${side}`}
      aria-label={label}
    >
      <div className="fab-permanents-owner" aria-hidden="true">
        <span>{label}</span>
        <i />
        <strong>{ids.length}</strong>
      </div>
      <div className="fab-permanents-strip">
        <button
          type="button"
          className="fab-permanents-scroll-control"
          data-direction="previous"
          aria-label={`Scroll ${label.toLocaleLowerCase()} left`}
          disabled={!scrollState.left}
          onClick={() => scrollPermanents(-1)}
        >
          <ChevronLeft size={18} strokeWidth={1.8} aria-hidden="true" />
        </button>
        <div
          ref={scrollerRef}
          className="fab-permanents-scroller"
          data-testid={`fab-permanents-${side}-scroller`}
          data-can-scroll-left={scrollState.left ? "true" : undefined}
          data-can-scroll-right={scrollState.right ? "true" : undefined}
          onScroll={syncScrollState}
        >
          {ids.length === 0 ? (
            <span className="fab-permanents-none">No permanents in play</span>
          ) : (
            permanentStacks.map(({ id, name, count, metadata }) => {
              const liveCard = seat.cardsById[id];
              const entity =
                metadata && liveCard
                  ? entityForFabPresentationCard(
                      liveCard,
                      metadata,
                      { kind: "explicit", reveal: true },
                      {
                        frame: "tactical",
                        tacticalBadgeMode: "permanent",
                        activeEffects: entityEffects(allEffects, id),
                      },
                    )
                  : null;
              const interactionState = entity ? interactionStateFor?.(entity) : undefined;
              const hostedCards = (hostedIdsByHostId[id] ?? []).flatMap((hostedId) => {
                const hostedCard = seat.cardsById[hostedId];
                const hostedMetadata = cardMetadata?.get(hostedId);
                if (!hostedCard || !hostedMetadata) return [];
                return [
                  entityForFabPresentationCard(
                    hostedCard,
                    hostedMetadata,
                    { kind: "explicit", reveal: true },
                    { decorations: "none" },
                  ),
                ];
              });
              return (
                <div
                  key={id}
                  className="fab-permanent-tile-shell fab-square-tile"
                  data-entity-id={id}
                  data-token-count={count > 1 ? count : undefined}
                  data-hosted-count={hostedCards.length || undefined}
                >
                  <button
                    type="button"
                    className="fab-permanent-tile"
                    aria-label={`${name}${count > 1 ? `, ${count} permanents` : ""}${
                      interactionState && interactionState.kind !== "idle"
                        ? `, ${cardInteractionDescription(interactionState)}`
                        : ""
                    }`}
                    aria-haspopup={metadata ? "dialog" : undefined}
                    onClick={() => {
                      if (entity && onCardSelect) onCardSelect(entity);
                      else if (metadata)
                        onInspect({
                          id,
                          slotLabel: "Permanent",
                          metadata,
                          effects: effectsForEntity({ activeEffects: allEffects }, id),
                        });
                    }}
                  >
                    {entity ? (
                      <CardInteractionFrame state={interactionState}>
                        <FabBoardCardFace entity={entity} density="mini" fill preview={false} />
                      </CardInteractionFrame>
                    ) : (
                      <span>{name}</span>
                    )}
                    {count > 1 ? (
                      <span className="fab-permanent-stack-count" aria-hidden="true">
                        <Layers3 size={13} strokeWidth={2} />
                        <strong>{count}</strong>
                      </span>
                    ) : null}
                  </button>
                  {side === "player" && metadata ? (
                    <FabCardAutomationCluster
                      instanceId={id}
                      cardName={name}
                      canonicalId={metadata?.canonicalId}
                    />
                  ) : null}
                  <FabHostedCards hostName={name} cards={hostedCards} />
                </div>
              );
            })
          )}
        </div>
        <button
          type="button"
          className="fab-permanents-scroll-control"
          data-direction="next"
          aria-label={`Scroll ${label.toLocaleLowerCase()} right`}
          disabled={!scrollState.right}
          onClick={() => scrollPermanents(1)}
        >
          <ChevronRight size={18} strokeWidth={1.8} aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}

function PermanentsDrawer({
  opened,
  opponent,
  self,
  cardMetadata,
  allEffects,
  triggerRef,
  onInspect,
  onClose,
}: {
  opened: boolean;
  opponent: FabMobileSeat;
  self: FabMobileSeat;
  cardMetadata?: Map<string, FabCardMetadata>;
  allEffects: readonly FabPresentationEffect[];
  triggerRef: RefObject<HTMLButtonElement | null>;
  onInspect: (selection: FabPermanentInspectionSelection) => void;
  onClose: () => void;
}) {
  const titleId = useId();
  const drawerRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (!opened) {
      if (wasOpenRef.current) {
        wasOpenRef.current = false;
        triggerRef.current?.focus();
      }
      return;
    }

    // Focus the close control only on the false → true open transition.
    // Parent re-renders recreate inline onClose handlers; re-running this
    // effect must not snatch focus from a permanent the user already tabbed to.
    const justOpened = !wasOpenRef.current;
    wasOpenRef.current = true;
    if (justOpened) {
      closeButtonRef.current?.focus({ preventScroll: true });
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const drawer = drawerRef.current;
      if (!drawer) return;
      const focusable = Array.from(
        drawer.querySelectorAll<HTMLElement>(PERMANENTS_DRAWER_FOCUSABLE_SELECTOR),
      ).filter(
        (element) =>
          !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true",
      );
      const firstFocusable = focusable[0];
      const lastFocusable = focusable.at(-1);
      if (!firstFocusable || !lastFocusable) {
        event.preventDefault();
        closeButtonRef.current?.focus();
        return;
      }

      const activeElement = document.activeElement;
      if (event.shiftKey && (activeElement === firstFocusable || !drawer.contains(activeElement))) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (
        !event.shiftKey &&
        (activeElement === lastFocusable || !drawer.contains(activeElement))
      ) {
        event.preventDefault();
        firstFocusable.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, opened, triggerRef]);

  if (!opened) return null;

  const drawer = (
    <div
      className="fab-permanents-drawer-backdrop"
      data-testid="fab-permanents-drawer-backdrop"
      onPointerDown={onClose}
    >
      <section
        ref={drawerRef}
        className="fab-permanents-drawer"
        data-testid="fab-permanents-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onPointerDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <h2 id={titleId}>Permanents</h2>
            <p>Public cards in play</p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            aria-label="Close permanents"
            onClick={onClose}
          >
            <X size={18} strokeWidth={1.8} aria-hidden="true" />
          </button>
        </header>
        <div className="fab-permanents-drawer-body">
          <PermanentRow
            seat={opponent}
            side="opponent"
            cardMetadata={cardMetadata}
            allEffects={allEffects}
            onInspect={(selection) => {
              wasOpenRef.current = false;
              triggerRef.current?.focus({ preventScroll: true });
              onClose();
              onInspect(selection);
            }}
          />
          <PermanentRow
            seat={self}
            side="player"
            cardMetadata={cardMetadata}
            allEffects={allEffects}
            onInspect={(selection) => {
              wasOpenRef.current = false;
              onClose();
              onInspect(selection);
            }}
          />
        </div>
      </section>
    </div>
  );

  if (typeof document === "undefined") return drawer;
  return createPortal(drawer, document.body);
}

function ZoneInventory({
  seat,
  side,
  cardMetadata,
  onOpenZone,
  banishedAvailableCount = 0,
  graveyardAvailableCount = 0,
}: {
  seat: FabMobileSeat;
  side: "top" | "bottom";
  cardMetadata?: Map<string, FabCardMetadata>;
  onOpenZone?: (selection: { ownerId: string; zone: FabInspectableZone }) => void;
  banishedAvailableCount?: number;
  graveyardAvailableCount?: number;
}) {
  const ownerName = side === "top" ? "Opponent" : "Your";
  const ownerLabel = side === "top" ? "Opponent " : "";
  const bloodDebtCount = countPublicBloodDebt(seat, cardMetadata);
  const deckAnimationRef = useAnimationNode(
    { kind: "zone", id: `${seat.playerId}:deck`, ownerId: seat.playerId },
    { presence: "present" },
  );
  const pitchAnimationRef = useAnimationNode(
    { kind: "zone", id: `${seat.playerId}:pitch`, ownerId: seat.playerId },
    { presence: "present" },
  );
  const graveyardAnimationRef = useAnimationNode(
    { kind: "zone", id: `${seat.playerId}:graveyard`, ownerId: seat.playerId },
    { presence: "present" },
  );
  const banishedAnimationRef = useAnimationNode(
    { kind: "zone", id: `${seat.playerId}:banished`, ownerId: seat.playerId },
    { presence: "present" },
  );
  const arsenalAnimationRef = useAnimationNode(
    { kind: "zone", id: `${seat.playerId}:arsenal`, ownerId: seat.playerId },
    { presence: "present" },
  );
  const resourceAnimationRef = useAnimationNode(
    { kind: "anchor", id: `fab:${seat.playerId}:resource` },
    { presence: "present" },
  );
  const animationRefByZone = {
    deck: deckAnimationRef,
    pitch: pitchAnimationRef,
    graveyard: graveyardAnimationRef,
    banished: banishedAnimationRef,
    arsenal: arsenalAnimationRef,
  } as const;
  const zones = [
    {
      id: "deck",
      label: "Deck",
      count: (seat.zones.deck ?? []).length,
      renderIcon: () => <Database size={16} strokeWidth={1.65} aria-hidden="true" />,
    },
    {
      id: "pitch",
      label: "Pitch",
      count: (seat.zones.pitch ?? []).length,
      resourcePoints: seat.resourcePoints,
      renderIcon: () => <FabPitchZoneIcon size={16} />,
    },
    {
      id: "graveyard",
      label: "Graveyard",
      // The five-zone mobile rail cannot fit the full native noun without an
      // accidental ellipsis. Keep the complete noun in the button name, but
      // make the compact board token intentionally recognizable.
      mobileLabel: "GY",
      count: (seat.zones.graveyard ?? []).length,
      renderIcon: () => <Skull size={16} strokeWidth={1.65} aria-hidden="true" />,
    },
    {
      id: "banished",
      label: "Banish",
      count: (seat.zones.banished ?? []).length,
      renderIcon: () => <Flame size={16} strokeWidth={1.65} aria-hidden="true" />,
    },
    {
      id: "arsenal",
      label: "Arsenal",
      count: (seat.zones.arsenal ?? []).length,
      renderIcon: () => <Archive size={16} strokeWidth={1.65} aria-hidden="true" />,
    },
  ] as const;

  return (
    <section
      className="fab-mobile-zone-inventory"
      data-testid={`fab-${side === "top" ? "opponent" : "player"}-zone-inventory`}
      data-zone-group="piles"
      data-side={side}
      aria-label={`${ownerName} public zones`}
    >
      {zones.map((zone) => {
        const { id, label: zoneLabel, count, renderIcon } = zone;
        const visualLabel = "mobileLabel" in zone ? zone.mobileLabel : zoneLabel;
        const resourcePoints = "resourcePoints" in zone ? zone.resourcePoints : null;
        const hasFloatingResources = resourcePoints != null && resourcePoints > 0;
        const inspectable = id !== "deck";
        const availableCount =
          id === "banished"
            ? banishedAvailableCount
            : id === "graveyard"
              ? graveyardAvailableCount
              : 0;
        const zoneBloodDebtCount = id === "banished" ? bloodDebtCount : 0;
        const zoneKind = id as FabInspectableZone | "deck";
        const ariaLabel = `${inspectable ? "Open " : ""}${ownerLabel}${zoneLabel}, ${count} ${
          count === 1 ? "card" : "cards"
        }${hasFloatingResources ? `, ${resourcePoints} floating resources` : ""}${
          availableCount > 0 ? `, ${availableCount} available now` : ""
        }${zoneBloodDebtCount > 0 ? `, ${zoneBloodDebtCount} Blood Debt` : ""}`;
        const content = (
          <>
            {renderIcon()}
            <span aria-hidden={visualLabel !== zoneLabel ? true : undefined}>{visualLabel}</span>
            <strong>{count}</strong>
            {availableCount > 0 ? (
              <span className="fab-mobile-zone-availability" aria-hidden="true">
                {availableCount} playable
              </span>
            ) : null}
            <FabBloodDebtCue
              count={zoneBloodDebtCount}
              ownerLabel={side === "top" ? "Opponent" : "Your"}
              density="mobile"
            />
            {hasFloatingResources ? (
              <span
                ref={resourceAnimationRef}
                className="fab-mobile-zone-resource-meter"
                aria-label={`${resourcePoints} floating ${
                  resourcePoints === 1 ? "resource" : "resources"
                }`}
              >
                <FabOfficialIcon id="resource" size={11} className="fab-zone-official-icon" />
                <b>{resourcePoints}</b>
              </span>
            ) : null}
          </>
        );
        if (!inspectable) {
          return (
            <div
              ref={animationRefByZone[id]}
              key={id}
              className="fab-mobile-zone-cell"
              data-zone={id}
              data-side={side}
              role="group"
              aria-label={ariaLabel}
            >
              {content}
            </div>
          );
        }
        return (
          <button
            ref={animationRefByZone[id]}
            key={id}
            type="button"
            className="fab-mobile-zone-cell"
            data-zone={id}
            data-side={side}
            aria-label={ariaLabel}
            aria-haspopup="dialog"
            onClick={() =>
              onOpenZone?.({
                ownerId: seat.playerId,
                zone: zoneKind as FabInspectableZone,
              })
            }
          >
            {content}
          </button>
        );
      })}
    </section>
  );
}

/**
 * Portrait mobile FAB board: public zones lead each seat, while the combat
 * chain remains the sole flexible region between fixed permanent rows.
 */
export function FabMobileBoard({
  opponent,
  self,
  viewerId,
  combatView,
  cardMetadata,
  isOpponentTurn = false,
  isSelfTurn = false,
  isOpponentPriority = false,
  isSelfPriority = false,
  interactionAgencyOwner,
  publicTargeting = false,
  defenderLabel,
  priorityLabel,
  actionsDisabled = false,
  onPassPriority,
  priorityActionLabel,
  provisionalDefenderIds,
  showDefensePrompt,
  onRetractDefender,
  onPlayActivate,
  onOpenZone,
  banishedAvailableCount = 0,
  graveyardAvailableCount = 0,
  legalCommands,
  onOpenLegalActions,
  interactionStateFor,
  onCardSelect,
  announcement,
  effects,
  onOpenEffects,
  resolutionOverlay,
  stackControl,
}: FabMobileBoardProps) {
  const [selectedLinkIndex, setSelectedLinkIndex] = useState<number | null>(null);
  const liveId = useId();
  const prevAnnouncement = useRef<string | undefined>(undefined);
  const [liveMessage, setLiveMessage] = useState("");
  const [permanentInspection, setPermanentInspection] =
    useState<FabPermanentInspectionSelection | null>(null);
  const [permanentsDrawerOpen, setPermanentsDrawerOpen] = useState(false);
  const permanentsDrawerTriggerRef = useRef<HTMLButtonElement>(null);
  const closePermanentsDrawer = useCallback(() => setPermanentsDrawerOpen(false), []);

  useEffect(() => {
    if (announcement && announcement !== prevAnnouncement.current) {
      prevAnnouncement.current = announcement;
      setLiveMessage(announcement);
    }
  }, [announcement]);

  const selfHandIds = self.zones.hand ?? [];
  const mapHand = (ids: string[], reveal: boolean) =>
    ids.map((id) => {
      const card = self.cardsById[id];
      return card
        ? entityForFabPresentationCard(
            card,
            cardMetadata?.get(id),
            { kind: "explicit", reveal },
            { frame: "tactical" },
          )
        : entityFor(id, reveal ? cardMetadata?.get(id) : undefined, self.playerId, reveal, {
            frame: "tactical",
          });
    });

  const arenaMode = combatView.mode;
  const pendingAttackLayer = arenaMode === "between-links" && combatView.pendingAttack !== null;
  const showActiveOverlay = (arenaMode === "active-link" || pendingAttackLayer) && !publicTargeting;
  const showCompactChain =
    arenaMode === "closed" ||
    (arenaMode === "between-links" && !pendingAttackLayer) ||
    publicTargeting;
  const centerMode = showActiveOverlay ? "combat" : "board";
  const showEffectsLedger = arenaMode === "closed" && effects.count > 0;
  const opponentPermanentCount = opponent.zones.permanent?.length ?? 0;
  const selfPermanentCount = self.zones.permanent?.length ?? 0;
  const permanentCount = opponentPermanentCount + selfPermanentCount;

  useEffect(() => {
    if (!showActiveOverlay) {
      setPermanentsDrawerOpen(false);
    }
  }, [showActiveOverlay]);

  return (
    <div
      className="fab-board fab-board-mobile"
      data-testid="fab-board"
      data-layout="portrait-mobile"
      data-combat-mode={arenaMode}
      data-card-crop="art-square"
      data-opponent-turn={isOpponentTurn ? "true" : undefined}
      data-self-turn={isSelfTurn ? "true" : undefined}
      data-opponent-priority={isOpponentPriority ? "true" : undefined}
      data-self-priority={isSelfPriority ? "true" : undefined}
      data-turn-owner={isSelfTurn ? "self" : isOpponentTurn ? "opponent" : "none"}
      data-priority-owner={isSelfPriority ? "self" : isOpponentPriority ? "opponent" : "none"}
      data-agency-owner={interactionAgencyOwner}
    >
      {[opponent.playerId, self.playerId].map((playerId) => (
        <AnimatedZoneSlot
          key={`stack-anchor:${playerId}`}
          animationRef={{ kind: "zone", id: `${playerId}:stack`, ownerId: playerId }}
          className="fab-animation-stack-anchor"
        >
          <span aria-hidden />
        </AnimatedZoneSlot>
      ))}
      <ZoneInventory
        seat={opponent}
        side="top"
        cardMetadata={cardMetadata}
        onOpenZone={onOpenZone}
      />

      <HeroRow
        seat={opponent}
        side="top"
        viewerId={viewerId}
        cardMetadata={cardMetadata}
        allEffects={effects.all}
        onInspect={setPermanentInspection}
        interactionStateFor={interactionStateFor}
        onCardSelect={onCardSelect}
      />

      <section
        className="fab-mobile-arena-row"
        data-testid="fab-table-center"
        data-layout-row="shared-arena"
        data-center-mode={centerMode}
        aria-label="Shared arena"
      >
        <AnimationAnchor
          animationRef={simulatorBoardCenterAnimationRef}
          className="fab-animation-board-center"
        />
        {stackControl && !showActiveOverlay ? (
          <div
            className="fab-mobile-stack-control"
            data-active-overlay={showActiveOverlay ? "true" : undefined}
          >
            {stackControl}
          </div>
        ) : null}
        {centerMode === "board" ? (
          <PermanentRow
            seat={opponent}
            side="opponent"
            cardMetadata={cardMetadata}
            allEffects={effects.all}
            onInspect={setPermanentInspection}
            interactionStateFor={interactionStateFor}
            onCardSelect={onCardSelect}
          />
        ) : null}

        <div
          className="fab-shared-arena"
          data-testid="fab-shared-arena"
          data-arena-mode={arenaMode}
          data-active-overlay={showActiveOverlay ? "true" : "false"}
        >
          {showCompactChain && !showEffectsLedger ? (
            <div className="fab-shared-arena-rail" data-testid="fab-shared-arena-rail">
              <CombatChain
                view={combatView}
                density="mobile"
                retractDetail={publicTargeting && arenaMode === "active-link"}
                defenderLabel={defenderLabel}
                priorityLabel={priorityLabel}
                selectedLinkIndex={selectedLinkIndex}
                onSelectLink={setSelectedLinkIndex}
                onPassPriority={onPassPriority}
                priorityActionLabel={priorityActionLabel}
                provisionalDefenderIds={provisionalDefenderIds}
                showDefensePrompt={showDefensePrompt}
                onRetractDefender={onRetractDefender}
                onPlayActivate={onPlayActivate}
                actionsDisabled={actionsDisabled}
                showPriorityActions={false}
                interactionStateFor={interactionStateFor}
                onCardSelect={onCardSelect}
              />
            </div>
          ) : null}

          {showEffectsLedger ? (
            <FabMobileActiveEffectsLedger effects={effects} onOpen={onOpenEffects} />
          ) : null}

          {!showEffectsLedger && !showActiveOverlay ? (
            <FabActiveEffectsButton
              count={effects.count}
              className="fab-compact-effects-button"
              onOpen={onOpenEffects}
            />
          ) : null}

          <AnimatePresence initial={false}>
            {showActiveOverlay ? (
              <motion.div
                className="fab-shared-arena-combat"
                data-testid="fab-shared-arena-combat"
                aria-label="Active combat workspace"
                initial={{ opacity: 0, transform: "translate3d(0, 4px, 0)" }}
                animate={{ opacity: 1, transform: "translate3d(0, 0, 0)" }}
                exit={{ opacity: 0, transform: "translate3d(0, -4px, 0)" }}
                transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
              >
                <CombatChain
                  mobileBoardTools={
                    <>
                      {stackControl ? (
                        <div className="fab-mobile-stack-control" data-active-overlay="true">
                          {stackControl}
                        </div>
                      ) : null}
                      {permanentCount > 0 ? (
                        <button
                          ref={permanentsDrawerTriggerRef}
                          type="button"
                          data-testid="fab-open-permanents"
                          aria-haspopup="dialog"
                          aria-expanded={permanentsDrawerOpen}
                          aria-label={`Open permanents: Opponent ${opponentPermanentCount}, You ${selfPermanentCount}`}
                          onClick={() => setPermanentsDrawerOpen(true)}
                        >
                          <Layers3 size={15} strokeWidth={1.8} aria-hidden="true" />
                          <span>Permanents</span>
                          <strong>{permanentCount}</strong>
                        </button>
                      ) : null}
                      <FabActiveEffectsButton count={effects.count} onOpen={onOpenEffects} />
                    </>
                  }
                  view={combatView}
                  density="mobile"
                  defenderLabel={defenderLabel}
                  priorityLabel={priorityLabel}
                  selectedLinkIndex={selectedLinkIndex}
                  onSelectLink={setSelectedLinkIndex}
                  onPassPriority={onPassPriority}
                  priorityActionLabel={priorityActionLabel}
                  provisionalDefenderIds={provisionalDefenderIds}
                  showDefensePrompt={showDefensePrompt}
                  onRetractDefender={onRetractDefender}
                  onPlayActivate={onPlayActivate}
                  actionsDisabled={actionsDisabled}
                  showPriorityActions={false}
                  interactionStateFor={interactionStateFor}
                  onCardSelect={onCardSelect}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        {centerMode === "board" ? (
          <PermanentRow
            seat={self}
            side="player"
            cardMetadata={cardMetadata}
            allEffects={effects.all}
            onInspect={setPermanentInspection}
            interactionStateFor={interactionStateFor}
            onCardSelect={onCardSelect}
          />
        ) : null}

        {resolutionOverlay ? (
          <div className="fab-mobile-resolution-row" data-testid="fab-mobile-resolution-row">
            {resolutionOverlay}
          </div>
        ) : null}
      </section>

      <HeroRow
        seat={self}
        side="bottom"
        viewerId={viewerId}
        cardMetadata={cardMetadata}
        allEffects={effects.all}
        onInspect={setPermanentInspection}
        interactionStateFor={interactionStateFor}
        onCardSelect={onCardSelect}
      />

      <ZoneInventory
        seat={self}
        side="bottom"
        cardMetadata={cardMetadata}
        onOpenZone={onOpenZone}
        banishedAvailableCount={banishedAvailableCount}
        graveyardAvailableCount={graveyardAvailableCount}
      />

      <div
        className="fab-hand fab-mobile-hand"
        data-zone="hand"
        data-side="bottom"
        data-testid="fab-hand-bottom"
        data-turn={isSelfTurn ? "true" : undefined}
        data-priority={isSelfPriority ? "true" : undefined}
      >
        <HandZone
          zone={{
            id: `${self.playerId}:hand`,
            label: "Hand",
            role: "hand",
            ownerId: self.playerId,
            visibility: "owner",
            entityIds: selfHandIds,
            count: selfHandIds.length,
            hint: "hand",
            layoutHint: "fan",
          }}
          entities={mapHand(selfHandIds, self.playerId === viewerId)}
          interactionStateFor={interactionStateFor}
          density="compact"
          orientation="landscape"
          onSelect={actionsDisabled || !onCardSelect ? undefined : onCardSelect}
          onPlay={actionsDisabled || !onCardSelect ? undefined : onCardSelect}
        />
      </div>

      {/* Bottom priority rail is owned by SimulatorViewportShell; marker for tests */}
      <div className="fab-mobile-bottom-marker" data-testid="fab-mobile-bottom-marker" hidden />

      <div
        id={liveId}
        className="visually-hidden"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-testid="fab-combat-announcer"
      >
        {liveMessage}
      </div>
      <PermanentInspector
        selection={permanentInspection}
        legalCommands={legalCommands}
        onClose={() => setPermanentInspection(null)}
        onOpenLegalActions={onOpenLegalActions}
      />
      <PermanentsDrawer
        opened={permanentsDrawerOpen}
        opponent={opponent}
        self={self}
        cardMetadata={cardMetadata}
        allEffects={effects.all}
        triggerRef={permanentsDrawerTriggerRef}
        onInspect={setPermanentInspection}
        onClose={closePermanentsDrawer}
      />
    </div>
  );
}
