import {
  STANDARD_CARD_IMAGE_ASPECT_RATIO,
  type SimulatorDeckReveal,
  type SimulatorDeckRevealCard,
  type SimulatorEntity,
  type SimulatorZone,
} from "@tcg/simulator-contract";
import {
  FAB_FACE_DOWN,
  type FabRegisteredCardDefinition,
  type FabViewer,
  type FabViewerResources,
  type FabViewerState,
  type FabViewerTurnReveal,
  type FabZoneKind,
} from "@tcg/flesh-and-blood-engine/simulator";
import { fixturePresentationCanonicalId } from "./fixture-presentation";

type EngineChainLink = NonNullable<NonNullable<FabViewerState["combat"]>["activeLink"]>;
type EngineClosedChainLink = NonNullable<
  NonNullable<FabViewerState["combat"]>["closedLinks"]
>[number];

function presentationAttackTarget(
  target: EngineChainLink["attackTargetRef"],
  departedTargetCardIds?: Readonly<Record<string, string>>,
): import("./state").FabPresentationAttackTarget {
  return target.kind === "hero"
    ? { kind: "hero", playerId: target.playerId }
    : {
        kind: "object",
        instanceId: target.ref.instanceId,
        controllerIdAtDeclaration: target.controllerIdAtDeclaration,
        departedCardId:
          departedTargetCardIds?.[`${target.ref.instanceId}:${target.ref.incarnation}`],
      };
}

/**
 * Defenders are tracked per declared attack target in the rules snapshot.
 * The presentation treats the active combat link as one public lane, so it
 * intentionally flattens that target-keyed state at this adapter boundary.
 */
function defenderInstanceIds(
  link: Pick<EngineChainLink, "defendingInstanceIdsByTarget">,
): readonly string[] {
  return Object.values(link.defendingInstanceIdsByTarget).flat();
}

function attackSourceInstanceId(link: Pick<EngineChainLink, "activeAttack">): string {
  return link.activeAttack.sourceObjectId;
}

function primaryAttackDidHit(link: Pick<EngineChainLink, "attackTargetRef" | "damage">): boolean {
  return (
    (link.damage.outcomes.find(
      (outcome) =>
        outcome.target.kind === link.attackTargetRef.kind &&
        (outcome.target.kind === "hero"
          ? outcome.target.playerId ===
            (link.attackTargetRef.kind === "hero" ? link.attackTargetRef.playerId : undefined)
          : link.attackTargetRef.kind === "object" &&
            outcome.target.ref.instanceId === link.attackTargetRef.ref.instanceId &&
            outcome.target.ref.incarnation === link.attackTargetRef.ref.incarnation),
    )?.damageDealtByActiveAttack ?? 0) > 0
  );
}

function resolvedLinkDamage(link: Pick<EngineClosedChainLink, "damage">): number {
  return link.damage.outcomes.reduce(
    (total, outcome) => total + outcome.damageDealtByActiveAttack,
    0,
  );
}

import type {
  FabPresentationCard,
  FabCardDefinition as FabPresentationCardDefinition,
  FabPresentationCombat,
  FabPresentationCounter,
  FabPresentationState,
  FabPresentationZone,
} from "./state";
import { fabEndReasonForViewer } from "./end-reason";
import { EMPTY_FAB_CARD_ART, type FabCardArtResolver } from "./cardArt";
import { projectFabPresentationEffect } from "./activeEffects";

/** Viewer-safe standard card back used for hidden FAB cards, including opponent hands. */
export const FAB_CARD_BACK_URL =
  "https://cdn.tcg.online/public/fab/simulator/card-back/fab-card-back.webp";

/** Square board-back treatment used only where the layout reserves a square tile. */
export const FAB_SQUARE_CARD_BACK_URL =
  "https://cdn.tcg.online/public/fab/simulator/card-back/fab-card-back-square.webp";

export interface FabCardMetadata {
  canonicalId?: string;
  /** Chosen atelier printing; printing-keyed CDN art wins over shard defaults. */
  printingId?: string;
  name: string;
  type: string;
  typeLine?: string;
  printedText?: string;
  imageUrl?: string;
  pitchValue?: number;
  cost?: number;
  power?: number;
  defense?: number;
  life?: number;
  isBloodDebt?: boolean;
}

/**
 * Canonical metadata projection for a live FAB card instance.
 *
 * Every live surface should start here and then call `entityForFabViewer` so
 * printing identity, current numerics, counters, tapped state, privacy, and
 * artwork all share one contract. Catalog-only and synthetic layers may still
 * call `entityFor` directly because they do not represent a live card object.
 */
export function metadataForFabPresentationCard(
  card: FabPresentationCard,
  definition: FabPresentationCardDefinition | undefined,
  existing?: FabCardMetadata,
): FabCardMetadata {
  const name = existing?.name ?? definition?.presentationName ?? definition?.name ?? "Unknown";
  const printingId = existing?.printingId ?? card.printingId;
  return {
    canonicalId: existing?.canonicalId ?? definition?.presentationCanonicalId ?? card.cardId,
    ...(printingId ? { printingId } : {}),
    name,
    type: existing?.type ?? definition?.cardType ?? "card",
    typeLine: existing?.typeLine ?? definition?.typeLine,
    printedText: existing?.printedText ?? definition?.printedText,
    imageUrl: existing?.imageUrl ?? definition?.imageUrl,
    pitchValue: existing?.pitchValue ?? definition?.pitchValue,
    cost: existing?.cost ?? definition?.cost,
    power: existing?.power ?? definition?.power,
    defense: existing?.defense ?? definition?.defense,
    life: existing?.life ?? definition?.life,
    isBloodDebt: existing?.isBloodDebt ?? definition?.isBloodDebt,
  };
}

/** Read one numeric value from the normalized entity used by every card face. */
export function numericStatForFabEntity(
  entity: SimulatorEntity,
  stat: "power" | "defense" | "life" | "cost" | "pitch",
): number | null {
  const value = entity.stats.find(
    (candidate) => candidate.label.toLocaleLowerCase() === stat,
  )?.value;
  if (value === undefined) return null;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
}

const FAB_PITCH_FRAME_COLORS: Readonly<Partial<Record<number, string>>> = {
  1: "#d82938",
  2: "#e6b72d",
  3: "#347fd7",
  4: "#8b5cf6",
};

/**
 * FAB can opt an on-board card into a compact, image-first stat frame. The
 * inspector intentionally does not use it: that surface already shows the
 * complete printed card.
 */
export type FabCardFrame = "tactical";
export type FabCardDecorations = "none";
export type FabTacticalBadgeMode = "permanent";

export interface FabEntityPresentationOptions {
  art?: FabCardArtResolver;
  frame?: FabCardFrame;
  decorations?: FabCardDecorations;
  /**
   * Permanents use their counters as their compact board readout. Allies keep
   * their combat stats because they can participate in combat.
   */
  tacticalBadgeMode?: FabTacticalBadgeMode;
  /** The projection retained this card's position but withheld its identity. */
  hidden?: boolean;
  /** Use the square board card back for a hidden card outside the hand. */
  hiddenBackLayout?: "square";
  ownerVisibleFaceDown?: boolean;
  activeEffects?: SimulatorEntity["activeEffects"];
  tapped?: boolean;
  counters?: readonly FabCardVisualCounter[];
  /** Engine-evaluated values override printed values for the live board. */
  currentNumeric?: FabPresentationCard["currentNumeric"];
}

export function hiddenCardPresentationForFabLayout(
  layout: SimulatorEntity["hiddenBackLayout"],
): Pick<SimulatorEntity, "backImageUrl" | "hiddenBackLayout" | "imageAspectRatio"> {
  return layout === "square"
    ? {
        backImageUrl: FAB_SQUARE_CARD_BACK_URL,
        hiddenBackLayout: "square",
        imageAspectRatio: 1,
      }
    : {
        backImageUrl: FAB_CARD_BACK_URL,
        hiddenBackLayout: undefined,
        imageAspectRatio: STANDARD_CARD_IMAGE_ASPECT_RATIO,
      };
}

type FabCardVisualCounter = FabPresentationCounter;

type FabNumericCounterProperty = NonNullable<FabPresentationCounter["modifier"]>["property"];

interface FabNumericCounterModifier {
  readonly property: FabNumericCounterProperty;
  readonly value: number;
}

function numericCounterModifier(
  counter: FabCardVisualCounter,
): FabNumericCounterModifier | undefined {
  if (!counter.modifier) return undefined;

  return {
    property: counter.modifier.property,
    value: counter.modifier.value * counter.count,
  };
}

function modifiedNumericProperty(
  baseValue: number | undefined,
  counters: readonly FabCardVisualCounter[] | undefined,
  property: FabNumericCounterProperty,
): number | undefined {
  if (baseValue == null) return undefined;

  return (counters ?? []).reduce((value, counter) => {
    const modifier = numericCounterModifier(counter);
    return modifier?.property === property ? value + modifier.value : value;
  }, baseValue);
}

function displayValueForCounter(counter: FabCardVisualCounter): string {
  if (!counter.modifier) return counter.count > 1 ? `×${counter.count}` : "1";

  const value =
    counter.modifier.value > 0 ? `+${counter.modifier.value}` : String(counter.modifier.value);
  return counter.count > 1 ? `${value} ×${counter.count}` : value;
}

function groupedDisplayCounters(
  counters: readonly FabCardVisualCounter[] | undefined,
): readonly FabCardVisualCounter[] {
  const grouped = new Map<string, FabCardVisualCounter>();

  for (const counter of counters ?? []) {
    const modifierKey = counter.modifier
      ? `${counter.modifier.property}:${counter.modifier.value}`
      : "named";
    const key = `${counter.label}\u0000${modifierKey}`;
    const existing = grouped.get(key);
    grouped.set(key, existing ? { ...existing, count: existing.count + counter.count } : counter);
  }

  return [...grouped.values()];
}

export function entityFor(
  instanceId: string,
  metadata: FabCardMetadata | undefined,
  ownerId: string,
  reveal: boolean,
  options?: FabEntityPresentationOptions,
): SimulatorEntity {
  const art = options?.art ?? EMPTY_FAB_CARD_ART;
  const isHidden = !reveal || instanceId === FAB_FACE_DOWN || options?.hidden === true;
  const hiddenCardPresentation = isHidden
    ? hiddenCardPresentationForFabLayout(options?.hiddenBackLayout)
    : undefined;
  const boardImageUrl = isHidden
    ? undefined
    : art.boardImageUrlForFabCard({
        canonicalId: metadata?.canonicalId,
        printingId: metadata?.printingId,
        name: metadata?.name,
      });
  const printedImageUrl = isHidden
    ? undefined
    : art.imageUrlForFabCard({
        canonicalId: metadata?.canonicalId,
        printingId: metadata?.printingId,
        name: metadata?.name,
      });
  const pitch = isHidden ? undefined : metadata?.pitchValue;
  const displayedPower =
    options?.currentNumeric?.power ??
    modifiedNumericProperty(metadata?.power, options?.counters, "power");
  const displayedDefense =
    options?.currentNumeric?.defense ??
    modifiedNumericProperty(metadata?.defense, options?.counters, "defense");
  const displayedLife =
    options?.currentNumeric?.life ??
    modifiedNumericProperty(metadata?.life, options?.counters, "life");
  // Resource costs are evaluated by the rules engine, just like combat
  // numerics. In particular, play-static cost reductions apply while a card
  // is still in hand, so never make players infer their payable cost from its
  // printed value.
  const displayedCost = options?.currentNumeric?.cost ?? metadata?.cost;
  const useTacticalFrame = !isHidden && options?.frame === "tactical";
  const isPermanentTacticalCard = useTacticalFrame && options?.tacticalBadgeMode === "permanent";
  const isAlly = /\bally\b/iu.test(`${metadata?.type ?? ""} ${metadata?.typeLine ?? ""}`);
  const showCombatStats = !isPermanentTacticalCard || isAlly;
  const pitchLabel =
    pitch === 1
      ? "Red"
      : pitch === 2
        ? "Yellow"
        : pitch === 3
          ? "Blue"
          : pitch === 4
            ? "Purple"
            : "Pitch";
  const frameDecorations =
    options?.decorations === "none"
      ? undefined
      : useTacticalFrame
        ? [
            ...(!isPermanentTacticalCard && pitch != null
              ? [
                  {
                    id: `fab-pitch-${pitch}`,
                    slot: "top-start" as const,
                    ariaLabel: `${pitchLabel} pitch: ${pitch}`,
                    // The official icon communicates both color and value; the
                    // accessible label retains the numeric pitch value.
                    content: { kind: "text" as const, text: "" },
                    tone:
                      pitch === 1
                        ? ("negative" as const)
                        : pitch === 2
                          ? ("warning" as const)
                          : ("neutral" as const),
                  },
                ]
              : []),
            ...(!isPermanentTacticalCard && displayedCost != null
              ? [
                  {
                    id: "fab-frame-cost",
                    slot: "top-end" as const,
                    ariaLabel: `Cost: ${displayedCost}`,
                    content: { kind: "text" as const, text: String(displayedCost) },
                  },
                ]
              : []),
            ...(showCombatStats && displayedPower != null && displayedPower > 0
              ? [
                  {
                    id: "fab-frame-power",
                    slot: "bottom-start" as const,
                    ariaLabel: `Power: ${displayedPower}`,
                    content: { kind: "text" as const, text: String(displayedPower) },
                  },
                ]
              : []),
            ...(showCombatStats && (!isAlly || displayedLife == null) && displayedDefense != null
              ? [
                  {
                    id: "fab-frame-defense",
                    slot: "bottom-end" as const,
                    ariaLabel: `Defense: ${displayedDefense}`,
                    content: { kind: "text" as const, text: String(displayedDefense) },
                  },
                ]
              : []),
            ...(showCombatStats && isAlly && displayedLife != null
              ? [
                  {
                    id: "fab-frame-life",
                    slot: "bottom-end" as const,
                    ariaLabel: `Life: ${displayedLife}`,
                    content: { kind: "text" as const, text: String(displayedLife) },
                  },
                ]
              : []),
          ]
        : pitch != null
          ? [
              {
                id: `fab-pitch-${pitch}`,
                slot: "top-start" as const,
                ariaLabel: `${pitch === 1 ? "Red" : pitch === 2 ? "Yellow" : "Blue"} pitch: ${pitch}`,
                content: { kind: "text" as const, text: String(pitch) },
                tone:
                  pitch === 1
                    ? ("negative" as const)
                    : pitch === 2
                      ? ("warning" as const)
                      : ("neutral" as const),
              },
            ]
          : undefined;
  const displayCounters = groupedDisplayCounters(options?.counters);
  const counterDecorations = displayCounters.map((counter, index) => ({
    id: `fab-counter-${index}`,
    slot: "top-end" as const,
    ariaLabel: counter.label.replace(/\{([pdhi])\}/gu, " $1").trim(),
    content: { kind: "text" as const, text: displayValueForCounter(counter) },
    tone: "warning" as const,
  }));
  const decorations = [...(frameDecorations ?? []), ...(counterDecorations ?? [])];
  return {
    id: instanceId,
    title: isHidden ? "Hidden card" : (metadata?.name ?? "Unknown card"),
    subtitle: isHidden
      ? "Private information"
      : (metadata?.typeLine ?? metadata?.type ?? "Flesh and Blood"),
    kind: metadata?.type === "hero" ? "leader" : "card",
    ownerId,
    face: isHidden ? "hidden" : "public",
    accessibilityDescription: options?.ownerVisibleFaceDown
      ? "Face down, visible only to you"
      : undefined,
    backImageUrl: hiddenCardPresentation?.backImageUrl,
    hiddenBackLayout: hiddenCardPresentation?.hiddenBackLayout,
    frameStyle:
      !isHidden && !isPermanentTacticalCard && pitch != null && FAB_PITCH_FRAME_COLORS[pitch]
        ? { color: FAB_PITCH_FRAME_COLORS[pitch] }
        : undefined,
    states: [],
    stats: isHidden
      ? []
      : [
          ...(metadata?.pitchValue != null
            ? [{ label: "Pitch", value: String(metadata.pitchValue) }]
            : []),
          ...(displayedCost != null ? [{ label: "Cost", value: String(displayedCost) }] : []),
          ...(displayedPower != null ? [{ label: "Power", value: String(displayedPower) }] : []),
          ...(displayedDefense != null
            ? [{ label: "Defense", value: String(displayedDefense) }]
            : []),
          ...(displayedLife != null ? [{ label: "Life", value: String(displayedLife) }] : []),
        ],
    traits: [],
    imageUrl: isHidden ? undefined : (boardImageUrl ?? printedImageUrl),
    imageAspectRatio:
      hiddenCardPresentation?.imageAspectRatio ??
      (boardImageUrl ? 1 : STANDARD_CARD_IMAGE_ASPECT_RATIO),
    details:
      !isHidden && metadata?.printedText
        ? {
            rules: [
              {
                id: "printed-card-text",
                kind: "text",
                text: metadata.printedText,
              },
            ],
          }
        : undefined,
    decorations: decorations.length > 0 ? decorations : undefined,
    activeEffects: isHidden ? undefined : options?.activeEffects,
    dataAttributes:
      (!isHidden && metadata?.canonicalId) ||
      (!isHidden && boardImageUrl) ||
      useTacticalFrame ||
      options?.ownerVisibleFaceDown ||
      options?.tapped ||
      (options?.counters?.length ?? 0) > 0
        ? {
            ...(!isHidden && metadata?.canonicalId
              ? { "data-fab-canonical-id": metadata.canonicalId }
              : {}),
            ...(!isHidden && metadata?.printingId
              ? { "data-fab-printing-id": metadata.printingId }
              : {}),
            ...(!isHidden && boardImageUrl
              ? {
                  "data-art-variant": boardImageUrl ? "no-text" : "printed-fallback",
                }
              : {}),
            ...(useTacticalFrame
              ? {
                  "data-fab-card-frame": "tactical",
                  ...(!isPermanentTacticalCard ? { "data-fab-pitch": pitch } : {}),
                }
              : {}),
            ...(options?.ownerVisibleFaceDown
              ? {
                  "data-fab-owner-face-down": "true",
                  title: "Face down — visible only to you",
                }
              : {}),
            ...(options?.tapped ? { "data-fab-tapped": "true" } : {}),
            ...(displayCounters.length > 0
              ? {
                  "data-fab-counter-summary": displayCounters
                    .map((counter) =>
                      `${counter.label.replace(/\{([pdhi])\}/gu, " $1")} ×${counter.count}`.trim(),
                    )
                    .join(" · "),
                }
              : {}),
          }
        : undefined,
  };
}

/**
 * The FAB tabletop is an image-first square system, so every known zone uses
 * the same square card back. Keeping this exhaustive makes a new FAB zone
 * choose its hidden-card footprint at compile time instead of silently
 * falling back to a differently cropped asset.
 */
export function hiddenBackLayoutForFabZone(
  zone: FabPresentationZone,
): SimulatorEntity["hiddenBackLayout"] {
  switch (zone) {
    case "deck":
    case "hand":
    case "graveyard":
    case "banished":
    case "arsenal":
    case "pitch":
    case "soul":
    case "hero":
    case "head":
    case "chest":
    case "arms":
    case "legs":
    case "weapon":
    case "permanent":
    case "combat-chain":
    case "stack":
    case "hosted":
      return "square";
    default: {
      const unhandledZone: never = zone;
      return unhandledZone;
    }
  }
}

export type FabViewerEntityOptions = Omit<
  FabEntityPresentationOptions,
  "hidden" | "hiddenBackLayout" | "ownerVisibleFaceDown" | "tapped" | "counters"
>;

export type FabCardVisibility =
  | { readonly kind: "viewer"; readonly viewerId: string }
  | { readonly kind: "explicit"; readonly reveal: boolean };

/**
 * Single live-card entity projection. Callers choose viewer-aware privacy or
 * an explicit reveal state, while this boundary always supplies the live
 * tapped, counter, and engine-evaluated numeric values.
 */
export function entityForFabPresentationCard(
  card: FabPresentationCard,
  metadata: FabCardMetadata | undefined,
  visibility: FabCardVisibility,
  options?: FabViewerEntityOptions,
): SimulatorEntity {
  const ownerMayLook =
    card.cardId !== FAB_FACE_DOWN &&
    visibility.kind === "viewer" &&
    card.ownerId === visibility.viewerId &&
    card.zone !== "deck";
  // A viewing seat cannot unredact an authoritative spectator placeholder.
  // In particular, render bottom-seat private cards as backs, not missing art
  // marked "visible only to you".
  const reveal =
    card.cardId !== FAB_FACE_DOWN &&
    (visibility.kind === "explicit" ? visibility.reveal : card.face === "up" || ownerMayLook);
  const ownerVisibleFaceDown = visibility.kind === "viewer" && card.face === "down" && ownerMayLook;

  return entityFor(card.id, reveal ? metadata : undefined, card.ownerId, reveal, {
    ...options,
    hidden: !reveal,
    hiddenBackLayout: reveal ? undefined : hiddenBackLayoutForFabZone(card.zone),
    ownerVisibleFaceDown,
    tapped: card.tapped,
    counters: card.counters,
    currentNumeric: card.currentNumeric,
  });
}

/**
 * Single viewer-aware path for rendering a FAB card from presentation state.
 *
 * Face-down objects remain private to opponents. Their owner may look at them
 * unless they are in the deck, so owner-visible private cards keep their face
 * art and receive the explicit face-down marker instead of masquerading as a
 * public card or an unknown card back.
 */
export function entityForFabViewer(
  card: FabPresentationCard,
  metadata: FabCardMetadata | undefined,
  viewerId: string,
  options?: FabViewerEntityOptions,
): SimulatorEntity {
  return entityForFabPresentationCard(card, metadata, { kind: "viewer", viewerId }, options);
}

const PRESENTATION_ZONE_LABELS: Record<string, string> = {
  deck: "Deck",
  hand: "Hand",
  graveyard: "Graveyard",
  pitch: "Pitch",
  banished: "Banished",
  arsenal: "Arsenal",
  hero: "Hero",
  head: "Head",
  chest: "Chest",
  arms: "Arms",
  legs: "Legs",
  weapon: "Weapon",
  permanent: "Permanent",
  "combat-chain": "Combat Chain",
  stack: "Stack",
};

export function zoneFor(ownerId: string, zoneKind: FabZoneKind, cardIds: string[]): SimulatorZone {
  const role =
    zoneKind === "hand"
      ? "hand"
      : zoneKind === "deck"
        ? "deck"
        : zoneKind === "graveyard"
          ? "discard"
          : zoneKind === "pitch"
            ? "resource"
            : zoneKind === "banished"
              ? "discard"
              : zoneKind === "combatChain"
                ? "battlefield"
                : zoneKind === "heroZone"
                  ? "leader"
                  : "custom";

  const visibility =
    zoneKind === "deck"
      ? "secret"
      : zoneKind === "hand" || zoneKind === "arsenal"
        ? "owner"
        : "public";

  const layoutHint =
    zoneKind === "hand"
      ? "fan"
      : zoneKind === "deck" || zoneKind === "graveyard" || zoneKind === "pitch"
        ? "stack"
        : zoneKind === "banished"
          ? "grid"
          : zoneKind === "combatChain"
            ? "row"
            : "stack";

  const label =
    zoneKind === "deck"
      ? "Deck"
      : zoneKind === "hand"
        ? "Hand"
        : zoneKind === "graveyard"
          ? "Graveyard"
          : zoneKind === "pitch"
            ? "Pitch"
            : zoneKind === "banished"
              ? "Banished"
              : zoneKind === "combatChain"
                ? "Combat Chain"
                : zoneKind === "heroZone"
                  ? "Hero"
                  : zoneKind === "weapon1" || zoneKind === "weapon2"
                    ? "Weapon"
                    : zoneKind[0]!.toUpperCase() + zoneKind.slice(1);

  return {
    id: `${ownerId}:${zoneKind}`,
    label,
    role,
    ownerId,
    visibility,
    entityIds: cardIds,
    count: cardIds.length,
    hint: zoneKind,
    layoutHint,
  };
}

export function projectFabTabletop(
  state: FabViewerState,
  viewerId: string,
): { zones: SimulatorZone[]; entities: SimulatorEntity[] } {
  const zones: SimulatorZone[] = [];
  const entities: SimulatorEntity[] = [];

  const zoneKinds: FabZoneKind[] = [
    "deck",
    "hand",
    "graveyard",
    "banished",
    "arsenal",
    "pitch",
    "combatChain",
    "stack",
    "head",
    "chest",
    "arms",
    "legs",
    "weapon1",
    "weapon2",
    "heroZone",
  ];

  for (const playerId of state.playerIds) {
    const player = state.players[playerId];
    if (!player) continue;

    for (const kind of zoneKinds) {
      const cardIds = player.zones[kind] ?? [];
      zones.push(zoneFor(playerId, kind, cardIds));
    }

    for (const kind of zoneKinds) {
      const cardIds = player.zones[kind] ?? [];
      const isSelf = playerId === viewerId;
      const reveal =
        kind === "deck" ? false : kind === "hand" || kind === "arsenal" ? isSelf : true;

      for (const id of cardIds) {
        entities.push(entityFor(id, undefined, playerId, reveal));
      }
    }
  }

  return { zones, entities };
}

/**
 * Reaction membership is a per-link engine fact. Printed card type cannot infer
 * that role because an Attack or Defense Reaction may instead have been declared
 * as an ordinary defending card on an earlier link of the same combat chain.
 */
export function deriveReactionInstanceIds(link: EngineChainLink): string[] {
  return [...(link.reactionInstanceIds ?? [])];
}

function reactionChainRole(
  resources: FabViewerPresentationResources,
  instanceId: string,
): "attack-reaction" | "defense-reaction" | "other" {
  const canonical = resources.cardInstances[instanceId];
  const def = canonical ? resources.cardDefinitions[canonical] : undefined;
  const types = def ? typeTokens(def) : [];
  if (types.some((t) => /attack reaction/i.test(t))) return "attack-reaction";
  if (types.some((t) => /defense reaction/i.test(t))) return "defense-reaction";
  return "other";
}

/** Map engine viewer combat into presentation combat (for live/practice wiring). */
export function projectCombatToPresentation(
  combat: FabViewerState["combat"],
  options: { reactionInstanceIds?: readonly string[]; stackInstanceIds?: readonly string[] } = {},
): FabPresentationCombat | null {
  if (!combat || !combat.open) return null;
  const link = combat.activeLink;
  const projectTarget = (target: EngineChainLink["attackTargetRef"]) =>
    presentationAttackTarget(target, combat.departedTargetCardIds);
  const defenders = link ? defenderInstanceIds(link) : [];
  return {
    open: combat.open,
    step: combat.step,
    defenseDeclarationPending: combat.defenseDeclarationPending,
    chainLinkNumber: combat.chainLinkNumber,
    resolvedLinks: (combat.closedLinks ?? []).map((closedLink) => ({
      attackInstanceId: attackSourceInstanceId(closedLink),
      attackingPlayerId: closedLink.attackingPlayerId,
      defendingPlayerId: closedLink.defendingPlayerId,
      attackTarget: projectTarget(closedLink.attackTargetRef),
      additionalAttackTargets: (closedLink.additionalAttackTargetRefs ?? []).map(projectTarget),
      defendingInstanceIdsByTarget: Object.fromEntries(
        Object.entries(closedLink.defendingInstanceIdsByTarget).map(([targetId, ids]) => [
          targetId,
          [...ids],
        ]),
      ),
      defendingInstanceIds: [...defenderInstanceIds(closedLink)],
      reactionInstanceIds: [...(closedLink.reactionInstanceIds ?? [])],
      attackPower: closedLink.resolvedAttackLki?.power ?? 0,
      totalDefense: closedLink.resolvedAttackLki?.totalDefense ?? 0,
      damage: resolvedLinkDamage(closedLink),
      didHit: closedLink.damage.outcomes.some((outcome) => outcome.damageDealtByActiveAttack > 0),
    })),
    stackInstanceIds: options.stackInstanceIds,
    activeLink: link
      ? {
          attackInstanceId: attackSourceInstanceId(link),
          attackingPlayerId: link.attackingPlayerId,
          defendingPlayerId: link.defendingPlayerId,
          attackTarget: projectTarget(link.attackTargetRef),
          additionalAttackTargets: (link.additionalAttackTargetRefs ?? []).map(projectTarget),
          defendingInstanceIdsByTarget: Object.fromEntries(
            Object.entries(link.defendingInstanceIdsByTarget).map(([targetId, ids]) => [
              targetId,
              [...ids],
            ]),
          ),
          defendingInstanceIds: [...defenders],
          reactionInstanceIds: [...(options.reactionInstanceIds ?? [])],
          attackPower: link.attackPower,
          keywords: [...link.keywords],
          damageResolved: link.damage.status === "resolved",
          damage: resolvedLinkDamage(link),
          didHit: primaryAttackDidHit(link),
          defenseReactionsBlocked: false,
        }
      : null,
  };
}

export function presentationZoneLabel(zone: string): string {
  return PRESENTATION_ZONE_LABELS[zone as FabPresentationZone] ?? zone;
}

function projectFabResult(
  viewer: FabViewerState,
  viewerId: string,
): FabPresentationState["result"] {
  if (!viewer.gameEnded) return null;
  const reason = viewer.endReason
    ? fabEndReasonForViewer(viewer.endReason, viewer.winnerId, viewerId)
    : "Game ended";
  if (!viewer.winnerId) return { kind: "draw", reason };
  const loserId = viewer.playerIds.find((playerId) => playerId !== viewer.winnerId);
  if (!loserId) return { kind: "draw", reason };
  return { kind: "win", winnerId: viewer.winnerId, loserId, reason };
}

/**
 * Build presentation-zone card lists from engine viewer state for seat rendering.
 * Combat chain is shared — cards appear under each owner still on the chain zone.
 */
export function viewerZonesToPresentationCards(
  state: FabViewerState,
  _viewerId: string,
  options: {
    /** Resolve instance id → presentation cardId (canonical id when known). */
    resolveCardId?: (instanceId: string) => string;
  } = {},
): FabPresentationState["cards"] {
  const cards: FabPresentationState["cards"] = {};
  const zoneMap: Array<{ kind: FabZoneKind; zone: FabPresentationZone }> = [
    { kind: "deck", zone: "deck" },
    { kind: "hand", zone: "hand" },
    { kind: "graveyard", zone: "graveyard" },
    { kind: "banished", zone: "banished" },
    { kind: "arsenal", zone: "arsenal" },
    { kind: "pitch", zone: "pitch" },
    { kind: "soul", zone: "soul" },
    { kind: "combatChain", zone: "combat-chain" },
    { kind: "stack", zone: "stack" },
    { kind: "arena", zone: "permanent" },
    { kind: "head", zone: "head" },
    { kind: "chest", zone: "chest" },
    { kind: "arms", zone: "arms" },
    { kind: "legs", zone: "legs" },
    { kind: "weapon1", zone: "weapon" },
    { kind: "weapon2", zone: "weapon" },
    { kind: "heroZone", zone: "hero" },
  ];

  const resolveCardId = options.resolveCardId ?? ((id: string) => id);

  for (const playerId of state.playerIds) {
    const player = state.players[playerId];
    if (!player) continue;
    for (const { kind, zone } of zoneMap) {
      const ids = player.zones[kind] ?? [];
      ids.forEach((id, index) => {
        const faceUp = id !== FAB_FACE_DOWN && !state.faceDownInstanceIds.includes(id);
        const instanceId = id === FAB_FACE_DOWN ? `${playerId}:${kind}:hidden:${index}` : id;
        cards[instanceId] = {
          id: instanceId,
          cardId: id === FAB_FACE_DOWN ? "face-down" : resolveCardId(id),
          ownerId: playerId,
          zone,
          face: faceUp ? "up" : "down",
          ...(kind === "weapon1" || kind === "weapon2" ? { equipmentSlot: kind } : {}),
        };
      });
    }
  }

  for (const [hostInstanceId, subcardIds] of Object.entries(state.subcardsByHostId)) {
    const host = cards[hostInstanceId];
    if (!host || host.zone === "hero") continue;
    subcardIds.forEach((id) => {
      if (id === FAB_FACE_DOWN) return;
      cards[id] = {
        id,
        cardId: resolveCardId(id),
        ownerId: host.ownerId,
        zone: "hosted",
        face: state.faceDownInstanceIds.includes(id) ? "down" : "up",
        hostInstanceId,
      };
    });
  }
  return cards;
}

function typeTokens(definition: FabRegisteredCardDefinition): readonly string[] {
  const typeBox = definition.base.typeBox;
  return [...typeBox.metatypes, ...typeBox.supertypes, ...typeBox.types, ...typeBox.subtypes];
}

export function engineDefToPresentation(
  def: FabRegisteredCardDefinition,
  resolver: FabCardArtResolver = EMPTY_FAB_CARD_ART,
): FabPresentationCardDefinition {
  const types = typeTokens(def);
  const presentationCanonicalId = fixturePresentationCanonicalId(def.canonicalId);
  const displayName =
    resolver.nameForFabCardIdentity(def.canonicalId, def.slug) ?? def.base.names[0];
  const art = resolver.resolveFabCardArt({
    canonicalId: presentationCanonicalId ?? def.canonicalId,
    slug: def.slug,
    name: displayName,
  });
  const primaryType =
    types.find((t) => /hero/i.test(t)) ??
    types.find((t) => /weapon/i.test(t)) ??
    types.find((t) => /equipment/i.test(t)) ??
    types.find((t) => /defense reaction/i.test(t)) ??
    types.find((t) => /attack reaction/i.test(t)) ??
    types.find((t) => /action/i.test(t)) ??
    types[0] ??
    "card";
  const pitchValue = def.base.numeric.pitch;
  const printedText = [
    ...new Set(
      def.base.abilities.flatMap((ability) => {
        if (!ability || typeof ability !== "object") return [];
        const text = (ability as { text?: unknown }).text;
        return typeof text === "string" && text.trim() ? [text.trim()] : [];
      }),
    ),
  ].join("\n\n");
  const keywords = [
    ...new Set([
      ...def.base.keywords.map((keyword) => keyword.name),
      ...resolver.keywordsForFabCard({
        canonicalId: def.canonicalId,
        slug: def.slug,
        name: displayName,
      }),
    ]),
  ];
  return {
    name: displayName ?? def.canonicalId,
    cardType: primaryType.toLowerCase(),
    slug: def.slug,
    ...(presentationCanonicalId ? { presentationCanonicalId } : {}),
    typeLine: types.join(" "),
    printedText: printedText || undefined,
    imageUrl: art.boardImageUrl ?? art.printedImageUrl,
    pitchValue,
    cost: def.base.numeric.cost,
    power: def.base.numeric.power,
    defense: def.base.numeric.defense,
    life: def.base.numeric.life,
    keywords,
    isBloodDebt: def.base.keywords.some(
      (keyword) => keyword.name.toLocaleLowerCase() === "blood-debt",
    ),
  };
}

function activeFaceToPresentation(
  definition: FabRegisteredCardDefinition,
  activeFaceId: string,
  resolver: FabCardArtResolver,
): FabPresentationCardDefinition | null {
  const layout = definition.layout;
  if (!isPairedLayout(layout)) {
    return null;
  }
  const face =
    layout.front.faceId === activeFaceId
      ? layout.front
      : layout.back.faceId === activeFaceId
        ? layout.back
        : null;
  if (!face) return null;

  const primaryType =
    face.types.find((type) => /hero/i.test(type)) ??
    face.types.find((type) => /weapon/i.test(type)) ??
    face.types.find((type) => /equipment/i.test(type)) ??
    face.types.find((type) => /ally/i.test(type)) ??
    face.types.find((type) => /action/i.test(type)) ??
    face.types[0] ??
    "card";
  const keywords = [
    ...new Set([
      ...face.keywords.map((keyword) => keyword.name),
      ...resolver.keywordsForFabCard(face.name),
    ]),
  ];
  return {
    name: face.name,
    cardType: primaryType.toLowerCase(),
    typeLine: face.typeText,
    printedText: face.text || undefined,
    imageUrl: resolver.imageUrlForFabCard(activeFaceId),
    pitchValue: face.numeric?.pitch,
    cost: face.numeric?.cost,
    power: face.numeric?.power,
    defense: face.numeric?.defense,
    life: face.numeric?.life,
    keywords,
  };
}

type FabPairedLayout = Extract<
  FabRegisteredCardDefinition["layout"],
  { readonly kind: "flip" | "twin" | "transcend" }
>;

function isPairedLayout(layout: FabRegisteredCardDefinition["layout"]): layout is FabPairedLayout {
  return layout?.kind === "flip" || layout?.kind === "twin" || layout?.kind === "transcend";
}

function applyActiveFacePresentation(
  cards: FabPresentationState["cards"],
  cardDefinitions: FabPresentationState["cardDefinitions"],
  activeFaceIdsByInstanceId: FabViewerState["activeFaceIdsByInstanceId"],
  resources: FabViewerPresentationResources,
  resolver: FabCardArtResolver,
): void {
  for (const [instanceId, activeFaceIds] of Object.entries(activeFaceIdsByInstanceId)) {
    const card = cards[instanceId];
    const faceId = activeFaceIds.length === 1 ? activeFaceIds[0] : undefined;
    if (!card || !faceId) continue;
    const canonicalId = resources.cardInstances[instanceId];
    const definition = canonicalId ? resources.cardDefinitions[canonicalId] : undefined;
    if (!definition) continue;
    const face = activeFaceToPresentation(definition, faceId, resolver);
    if (!face) continue;
    cardDefinitions[faceId] = face;
    cards[instanceId] = { ...card, cardId: faceId, printingId: undefined };
  }
}

/**
 * Project authoritative match state into tabletop presentation state for a viewer.
 * Uses production {@link projectFabViewerState} for privacy, then maps zones/cards.
 */
export function matchStateToPresentation(
  viewer: FabViewerState,
  viewerId: string,
  resources: FabViewerPresentationResources,
  matchArt?: Readonly<Record<string, string>>,
  resolver: FabCardArtResolver = EMPTY_FAB_CARD_ART,
): FabPresentationState {
  // Game end freezes the authoritative rules snapshot immediately. Pending
  // layers may therefore remain in that audit state, but they are no longer
  // actionable and must not be projected as a live stack or combat after the
  // result.
  const visibleRulesStack = viewer.gameEnded ? [] : viewer.rulesStack;
  const visibleCombat = viewer.gameEnded ? null : viewer.combat;
  const cards = viewerZonesToPresentationCards(viewer, viewerId, {
    resolveCardId: (instanceId) => resources.cardInstances[instanceId] ?? instanceId,
  });
  if (matchArt) {
    for (const [instanceId, printingId] of Object.entries(matchArt)) {
      const card = cards[instanceId];
      if (card && card.face === "up") cards[instanceId] = { ...card, printingId };
    }
  }
  for (const [instanceId, currentNumeric] of Object.entries(
    viewer.currentNumericByInstanceId ?? {},
  )) {
    const card = cards[instanceId];
    if (card) cards[instanceId] = { ...card, currentNumeric };
  }
  const tappedIds = new Set(viewer.tappedInstanceIds ?? []);
  for (const [instanceId, counters] of Object.entries(viewer.countersByInstanceId ?? {})) {
    const card = cards[instanceId];
    if (!card) continue;
    const rulesCounters = counters.filter(
      (counter): counter is Exclude<(typeof counters)[number], { readonly kind: "damage" }> =>
        counter.kind !== "damage",
    );
    cards[instanceId] = {
      ...card,
      tapped: tappedIds.has(instanceId) || undefined,
      counters: rulesCounters.map((counter) => ({
        label:
          counter.kind === "named"
            ? counter.name
            : `${counter.value > 0 ? "+" : ""}${counter.value}{${
                counter.property === "power" ? "p" : counter.property === "defense" ? "d" : "h"
              }}`,
        count: counter.count,
        ...(counter.kind === "numeric"
          ? { modifier: { property: counter.property, value: counter.value } }
          : {}),
      })),
    };
  }
  for (const instanceId of tappedIds) {
    const card = cards[instanceId];
    if (card && !card.tapped) cards[instanceId] = { ...card, tapped: true };
  }
  if (viewer.gameEnded) {
    for (const [instanceId, card] of Object.entries(cards)) {
      if (card.zone === "stack") delete cards[instanceId];
    }
  }

  // A payable card remains publicly announced on the stack while its owner
  // chooses pitch cards. Keep that engine-owned zone visible even if a
  // viewer projection omits the card from its normalized zone map.
  for (const playerId of viewer.gameEnded ? [] : viewer.playerIds) {
    for (const instanceId of viewer.players[playerId]?.zones.stack ?? []) {
      if (instanceId === FAB_FACE_DOWN) continue;
      const existing = cards[instanceId];
      cards[instanceId] = existing
        ? { ...existing, zone: "stack" }
        : {
            id: instanceId,
            cardId: resources.cardInstances[instanceId] ?? instanceId,
            ownerId: playerId,
            zone: "stack",
            face: "up",
          };
    }
  }

  // Stamp combat-chain roles from engine combat when present (including reactions).
  const engineLink = visibleCombat?.activeLink ?? null;
  const reactionIds = engineLink ? deriveReactionInstanceIds(engineLink) : [];
  const stackInstanceIds = rulesStackPresentationIds(cards, visibleRulesStack);
  const combat = projectCombatToPresentation(visibleCombat, {
    reactionInstanceIds: reactionIds,
    // `rulesStack` is bottom-to-top, while the combat presentation explicitly
    // exposes index 0 as the next layer to resolve.
    stackInstanceIds,
  });
  if (combat?.activeLink) {
    const link = combat.activeLink;
    const defenders = link.defendingInstanceIds;
    const attack = cards[link.attackInstanceId];
    if (attack) {
      cards[link.attackInstanceId] = { ...attack, chainRole: "attack", zone: "combat-chain" };
    }
    for (const id of defenders) {
      const card = cards[id];
      // The chain-link record deliberately retains declared defender ids, but
      // the live zone map is authoritative after an effect moves one away.
      // Re-stamping a banished, returned, or destroyed defender onto the chain
      // leaves a ghost card on the tabletop and masks the transfer destination.
      if (card?.zone === "combat-chain") cards[id] = { ...card, chainRole: "defend" };
    }
    for (const id of link.reactionInstanceIds) {
      const card = cards[id];
      if (!card) continue;
      const role = reactionChainRole(resources, id);
      // Only real AR/DR are in reactionInstanceIds; skip if type is missing.
      if (role === "other") continue;
      cards[id] = {
        ...card,
        chainRole: role,
        zone: "combat-chain",
      };
    }
  }

  // Surface seated hero identity even when heroZone is empty (test harness seats via heroCardId).
  for (const playerId of viewer.playerIds) {
    const player = viewer.players[playerId];
    if (!player?.heroCardId) continue;
    const hasHero = Object.values(cards).some((c) => c.ownerId === playerId && c.zone === "hero");
    if (hasHero) continue;
    const syntheticId = `${playerId}:hero-seat`;
    cards[syntheticId] = {
      id: syntheticId,
      cardId: player.heroCardId,
      ownerId: playerId,
      zone: "hero",
      face: "up",
    };
  }

  const cardDefinitions: FabPresentationState["cardDefinitions"] = {
    "face-down": { name: "Hidden card", cardType: "card" },
  };
  for (const [canonicalId, def] of Object.entries(resources.cardDefinitions)) {
    const presentationDef = engineDefToPresentation(def, resolver);
    cardDefinitions[canonicalId] = presentationDef;
    // Fixture definitions can be keyed by a local alias while a seated hero
    // references its stable canonical id. Preserve both public lookups.
    cardDefinitions[def.canonicalId] ??= presentationDef;
  }
  applyActiveFacePresentation(
    cards,
    cardDefinitions,
    viewer.activeFaceIdsByInstanceId,
    resources,
    resolver,
  );
  addRulesStackPresentation(cards, cardDefinitions, visibleRulesStack);

  const life: Record<string, number> = {};
  const resourcePoints: Record<string, number> = {};
  const chiPoints: Record<string, number> = {};
  const actionPoints: Record<string, number> = {};
  const intellect: Record<string, number> = {};
  const soulCounts: Record<string, number> = {};
  for (const playerId of viewer.playerIds) {
    const player = viewer.players[playerId];
    life[playerId] = player?.life ?? 20;
    resourcePoints[playerId] = player?.resourcePoints ?? 0;
    chiPoints[playerId] = player?.chiPoints ?? 0;
    actionPoints[playerId] = player?.actionPoints ?? 0;
    intellect[playerId] = player?.intellect ?? 4;
    soulCounts[playerId] = player?.zones.soul?.length ?? 0;
  }

  const deckRevealsByOwnerId = projectViewerDeckEdgeReveals(
    viewer,
    cardDefinitions,
    resolver,
    matchArt,
  );
  const handRevealsByOwnerId = projectViewerHandReveals(
    viewer,
    cardDefinitions,
    resolver,
    matchArt,
  );

  return {
    players: [...viewer.playerIds],
    cards,
    cardDefinitions,
    life,
    resourcePoints,
    chiPoints,
    actionPoints,
    attackActivationsByInstanceId: viewer.attackActivationsByInstanceId ?? {},
    soulCounts,
    intellect,
    heroSignals: Object.fromEntries(
      viewer.playerIds.map((playerId) => [
        playerId,
        (viewer.players[playerId]?.heroSignals ?? []).map((signal) =>
          signal.kind === "count"
            ? { kind: signal.kind, id: signal.id, value: signal.value }
            : signal.id === "marked"
              ? { kind: "flag", id: "marked", duration: "until-hit" }
              : { kind: "flag", id: signal.id },
        ),
      ]),
    ),
    firstTurnPlayerId: viewer.firstTurnPlayerId,
    activePlayerId: viewer.activePlayerId,
    priorityPlayerId: viewer.priorityPlayerId,
    turnNumber: viewer.turnNumber,
    phase: viewer.phase,
    activeEffects: viewer.effects.map(projectFabPresentationEffect),
    optionalTriggerAutomation: Object.fromEntries(
      viewer.optionalTriggerAutomation.map((entry) => [entry.sourceInstanceId, entry.mode]),
    ),
    priorityAutomation: viewer.automation?.priorityMode ?? null,
    priorityManualOnly: viewer.priorityManualOnly ?? null,
    priorityWindow: viewer.priorityWindow ?? null,
    priorityHoldArmed: viewer.priorityHoldArmed ?? null,
    scopedAutoPass: viewer.scopedAutoPass ?? null,
    stackInstanceIds,
    combat,
    ...(deckRevealsByOwnerId ? { deckRevealsByOwnerId } : {}),
    ...(handRevealsByOwnerId ? { handRevealsByOwnerId } : {}),
    prompt: null,
    terminal: viewer.gameEnded,
    result: projectFabResult(viewer, viewerId),
  };
}

/**
 * Turn-scoped public reveals (CR 8.5.17) from the engine viewer state become
 * presentation recalls: deck-edge reveals render on the owner's deck shelf and
 * hand reveals in the recall strip, until the turn ledger resets. Art resolves
 * from the same viewer-disclosed definitions the log references use.
 */
function revealedRecallCard(
  reveal: FabViewerTurnReveal,
  cardDefinitions: FabPresentationState["cardDefinitions"],
  resolver: FabCardArtResolver,
  matchArt?: Readonly<Record<string, string>>,
): SimulatorDeckRevealCard {
  const canonicalId = reveal.canonicalId;
  const definition = canonicalId ? cardDefinitions[canonicalId] : undefined;
  const name = definition?.presentationName ?? definition?.name ?? "Revealed card";
  const printingId = matchArt?.[reveal.instanceId];
  const art = canonicalId
    ? resolver.resolveFabCardArt({
        canonicalId,
        name,
        ...(printingId ? { printingId } : {}),
      })
    : undefined;
  return {
    entityId: reveal.instanceId,
    ...(canonicalId ? { definitionId: canonicalId } : {}),
    title: name,
    subtitle: definition?.typeLine ?? definition?.cardType ?? "Flesh and Blood",
    ...(art?.boardImageUrl ? { imageUrl: art.boardImageUrl } : {}),
  };
}

function projectViewerDeckEdgeReveals(
  viewer: FabViewerState,
  cardDefinitions: FabPresentationState["cardDefinitions"],
  resolver: FabCardArtResolver,
  matchArt?: Readonly<Record<string, string>>,
): Record<string, SimulatorDeckReveal | undefined> | undefined {
  const edges = new Map<string, { position: "top" | "bottom"; cards: SimulatorDeckRevealCard[] }>();
  for (const reveal of viewer.turnReveals ?? []) {
    if (reveal.kind !== "deck-edge") continue;
    const entry = edges.get(reveal.ownerId) ?? { position: reveal.position, cards: [] };
    // A top-edge reveal wins the shelf direction when both edges were revealed.
    if (reveal.position === "top") entry.position = "top";
    entry.cards.push(revealedRecallCard(reveal, cardDefinitions, resolver, matchArt));
    edges.set(reveal.ownerId, entry);
  }
  if (edges.size === 0) return undefined;
  return Object.fromEntries(
    [...edges.entries()].map(([ownerId, edge]) => [
      ownerId,
      {
        id: `fab-turn-reveal:${ownerId}`,
        zoneId: `${ownerId}:deck`,
        ownerId,
        position: edge.position,
        visibility: "public",
        turnNumber: viewer.turnNumber,
        count: edge.cards.length,
        cards: edge.cards,
      } satisfies SimulatorDeckReveal,
    ]),
  );
}

function projectViewerHandReveals(
  viewer: FabViewerState,
  cardDefinitions: FabPresentationState["cardDefinitions"],
  resolver: FabCardArtResolver,
  matchArt?: Readonly<Record<string, string>>,
): Record<string, readonly SimulatorDeckRevealCard[] | undefined> | undefined {
  const byOwner: Record<string, SimulatorDeckRevealCard[]> = {};
  for (const reveal of viewer.turnReveals ?? []) {
    if (reveal.kind !== "hand") continue;
    (byOwner[reveal.ownerId] ??= []).push(
      revealedRecallCard(reveal, cardDefinitions, resolver, matchArt),
    );
  }
  return Object.keys(byOwner).length > 0 ? byOwner : undefined;
}

export function presentRuntime(
  runtime: {
    viewer(viewer: FabViewer): FabViewerState;
    viewerResources(viewer: FabViewer): FabViewerResources;
  },
  viewerId: string,
  resolver: FabCardArtResolver = EMPTY_FAB_CARD_ART,
  bindings?: Readonly<Record<string, string>>,
): FabPresentationState {
  const actor = { role: "player" as const, actorId: viewerId };
  return matchStateToPresentation(
    runtime.viewer(actor),
    viewerId,
    runtime.viewerResources(actor),
    bindings,
    resolver,
  );
}

export interface FabViewerPresentationResources {
  readonly cardInstances: Readonly<Record<string, string>>;
  readonly cardDefinitions: Readonly<Record<string, FabRegisteredCardDefinition>>;
}

/** Convert a server-projected viewer state plus viewer-safe visible-card resources for the table. */
export function viewerStateToPresentation(
  viewer: FabViewerState,
  viewerId: string,
  resources: FabViewerPresentationResources,
  matchArt?: Readonly<Record<string, string>>,
  resolver: FabCardArtResolver = EMPTY_FAB_CARD_ART,
): FabPresentationState {
  return matchStateToPresentation(viewer, viewerId, resources, matchArt, resolver);
}

function isFabPresentationStateShape(raw: unknown): raw is FabPresentationState {
  if (!raw || typeof raw !== "object") return false;
  const obj = raw as Record<string, unknown>;
  return Array.isArray(obj.players) && typeof obj.cards === "object" && obj.cards !== null;
}

function isFabViewerStateShape(raw: unknown): raw is FabViewerState {
  if (!raw || typeof raw !== "object") return false;
  const obj = raw as Record<string, unknown>;
  return (
    Array.isArray(obj.playerIds) &&
    !Array.isArray(obj.players) &&
    typeof obj.activePlayerId === "string"
  );
}

export function isFabViewerResourcesShape(raw: unknown): raw is FabViewerPresentationResources {
  if (!raw || typeof raw !== "object") return false;
  const obj = raw as Record<string, unknown>;
  return (
    typeof obj.cardInstances === "object" &&
    obj.cardInstances !== null &&
    typeof obj.cardDefinitions === "object" &&
    obj.cardDefinitions !== null
  );
}

/**
 * Accept either a presentation state (practice/local runtimes) or a raw engine
 * viewer state plus viewer resources (live gateway payloads) so every FAB
 * surface funnels through matchStateToPresentation exactly once. Malformed
 * payloads that pass the shape checks but break projection coerce to null
 * instead of throwing into gateway handlers.
 * @param matchArt Per-instance chosen-printing art (instanceId → printingId)
 * forwarded into the projection; same shape as matchStateToPresentation's
 * matchArt.
 */
export function coerceFabPresentationState(
  raw: unknown,
  viewerId: string | null,
  resources?: unknown,
  matchArt?: Readonly<Record<string, string>>,
  resolver: FabCardArtResolver = EMPTY_FAB_CARD_ART,
): FabPresentationState | null {
  if (isFabPresentationStateShape(raw)) return raw;
  if (!viewerId || !isFabViewerStateShape(raw)) return null;
  if (!isFabViewerResourcesShape(resources)) return null;
  try {
    return viewerStateToPresentation(raw, viewerId, resources, matchArt, resolver);
  } catch {
    return null;
  }
}

/** Map engine bottom-to-top layers to public presentation entries, top first. */
function rulesStackPresentationIds(
  cards: FabPresentationState["cards"],
  rulesStack: FabViewerState["rulesStack"],
): readonly string[] {
  return rulesStack
    .map((layer) =>
      cards[layer.sourceInstanceId]?.zone === "stack"
        ? layer.sourceInstanceId
        : `rules-stack:${layer.layerId}`,
    )
    .reverse();
}

function addRulesStackPresentation(
  cards: FabPresentationState["cards"],
  cardDefinitions: FabPresentationState["cardDefinitions"],
  rulesStack: FabViewerState["rulesStack"],
): void {
  for (const layer of rulesStack) {
    const physicalSource = cards[layer.sourceInstanceId];
    if (physicalSource?.zone === "stack") continue;

    const instanceId = `rules-stack:${layer.layerId}`;
    const definitionId = `rules-stack-definition:${layer.layerId}`;
    const sourceDefinition = layer.sourceCanonicalId
      ? cardDefinitions[layer.sourceCanonicalId]
      : undefined;
    const presentationCanonicalId = layer.sourceCanonicalId ?? undefined;
    cardDefinitions[definitionId] = sourceDefinition
      ? {
          ...sourceDefinition,
          name: layer.label,
          ...(presentationCanonicalId ? { presentationCanonicalId } : {}),
          presentationName: sourceDefinition.name,
        }
      : {
          name: layer.label,
          cardType: layer.kind,
          ...(presentationCanonicalId ? { presentationCanonicalId } : {}),
        };
    cards[instanceId] = {
      id: instanceId,
      cardId: definitionId,
      ownerId: layer.controllerId,
      zone: "stack",
      face: "up",
      sourceInstanceId: layer.sourceInstanceId,
      ...(physicalSource?.printingId ? { printingId: physicalSource.printingId } : {}),
      // Seated sources (weapons) never move onto the stack; copy live stats onto
      // the synthetic attack-layer so Layer Step does not show printed power.
      ...(physicalSource?.currentNumeric ? { currentNumeric: physicalSource.currentNumeric } : {}),
      ...(physicalSource?.counters && physicalSource.counters.length > 0
        ? { counters: physicalSource.counters }
        : {}),
    };
  }
}
