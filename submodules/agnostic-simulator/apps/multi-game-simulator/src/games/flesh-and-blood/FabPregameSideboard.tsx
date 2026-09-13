import { useFabCardArt } from "./FabPresentationCatalog";
import { useEffect, useId, useMemo, useState, type ReactNode, type CSSProperties } from "react";
import {
  basePropertiesOf,
  createDefaultFabPregameSelection,
  FAB_FORMAT_RULES,
  fabEquipmentSlotsForDefinition,
  proposeFabEquipmentSelection,
  resolveFabEquipmentSelection,
  fabHeroDeckbuildingAccess,
  isFabArenaCardDefinition,
  registerFabCardDefinition,
  validateFabPregameSelection,
  type FabEquipmentSlot,
  type FabPregameCardPool,
  type FabPregameIssue,
  type FabPregameSelection,
} from "@tcg/flesh-and-blood-engine/simulator";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import { CardImage } from "@tcg/simulator-ui";
import { Badge, Button, Group, Modal, Text } from "@mantine/core";
import { Check, ChevronDown, Clock3, Eye, Swords } from "lucide-react";
import { SupporterPlayerName } from "../../components/SupporterPlayerName";
import {
  FAB_CARD_IMAGE_ASPECT_RATIOS,
  EMPTY_FAB_CARD_ART,
  type FabCardArtResolver,
  type FabPresentationDefinition,
} from "./cardArt";
import { FabCardPreviewProvider, useFabCardPreview, useFabPreviewTarget } from "./FabCardPreview";
import { useFabCardLocale } from "./FabPresentationCatalog";
import { FabHeroIdentityMedia } from "./FabHeroIdentityMedia";
import { useFabCardPresentation } from "./useFabCardPresentation";

export interface FabPregameParticipant {
  readonly label: string;
  readonly mmr?: number;
  readonly subscriptionTier?: string;
  readonly profileHref?: string;
  readonly heroName?: string;
}

type EquipmentSlot = Exclude<FabEquipmentSlot, "weapon2">;
type GridDensity = "spacious" | "balanced" | "compact";

const GRID_DENSITY_STORAGE_KEY = "fab-sideboard-grid-density";
const GRID_DENSITIES: readonly { density: GridDensity; columns: 4 | 8 | 12 }[] = [
  { density: "spacious", columns: 4 },
  { density: "balanced", columns: 8 },
  { density: "compact", columns: 12 },
];

function initialGridDensity(): GridDensity {
  if (typeof window === "undefined") return "balanced";
  try {
    const saved = window.localStorage.getItem(GRID_DENSITY_STORAGE_KEY);
    return saved === "spacious" || saved === "balanced" || saved === "compact" ? saved : "balanced";
  } catch {
    return "balanced";
  }
}

function hasType(pool: FabPregameCardPool, cardId: string | undefined, type: string): boolean {
  if (!cardId) return false;
  const definition = pool.cardDefinitions[cardId];
  if (!definition) return false;
  const expected = type.toLowerCase();
  return fabPregameDefinitionTypes(definition).some((entry) => entry.toLowerCase() === expected);
}

export function fabPregameDefinitionTypes(
  definition: FabPregameCardPool["cardDefinitions"][string],
): readonly string[] {
  const typeBox = basePropertiesOf(registerFabCardDefinition(definition)).typeBox;
  return [...typeBox.metatypes, ...typeBox.supertypes, ...typeBox.types, ...typeBox.subtypes];
}

export function fabPregameDefinitionName(
  definition: FabPregameCardPool["cardDefinitions"][string] | undefined,
  fallback: string,
  resolver: FabCardArtResolver = EMPTY_FAB_CARD_ART,
): string {
  if (!definition) return fallback;
  const registered = registerFabCardDefinition(definition);
  return (
    resolver.nameForFabCardIdentity(registered.canonicalId, registered.slug) ??
    basePropertiesOf(registered).names[0] ??
    fallback
  );
}

function quantities(pool: FabPregameCardPool): Map<string, number> {
  const result = new Map<string, number>();
  for (const entry of pool.entries)
    result.set(entry.canonicalId, (result.get(entry.canonicalId) ?? 0) + entry.quantity);
  return result;
}

function formatNaturalList(values: readonly string[]): string {
  if (values.length <= 1) return values[0] ?? "";
  if (values.length === 2) return `${values[0]} and ${values[1]}`;
  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}

function pregameIssueSummary(
  code: FabPregameIssue["code"],
  count: number,
  fallback: string,
  heroName: string | undefined,
): string {
  switch (code) {
    case "unknown-card":
      return `${count} card ${count === 1 ? "entry could" : "entries could"} not be found.`;
    case "invalid-quantity":
      return `${count} deck ${count === 1 ? "quantity is" : "quantities are"} not a positive whole number.`;
    case "quantity-exceeded":
      return `${count} card ${count === 1 ? "quantity exceeds" : "quantities exceed"} the registered pool.`;
    case "arena-card-in-deck":
      return `${count} arena ${count === 1 ? "card is" : "cards are"} in the starting deck.`;
    case "wrong-equipment-slot":
      return `${count} equipment ${count === 1 ? "card is" : "cards are"} in the wrong slot.`;
    case "weapon-combination":
      return fallback;
    case "equip-restricted":
      return `${count} equipment ${count === 1 ? "choice is" : "choices are"} restricted for this hero.`;
    case "hero-supertype-mismatch":
      return `${count} card ${count === 1 ? "choice falls" : "choices fall"} outside ${heroName ?? "this hero"}'s class and talent access.`;
    case "specialization-mismatch":
      return `${count} specialization ${count === 1 ? "card requires" : "cards require"} a different hero.`;
    case "deck-too-small":
    case "deck-size":
    case "hero-in-card-pool":
    case "mentor-requires-young-hero":
    case "companion-not-arena-card":
    case "macro-outside-macro-object":
    case "hero_required":
    case "cc_adult_hero":
    case "blitz_young_hero":
    case "cc_minimum":
    case "blitz_size":
    case "pool_size":
    case "silver_age_rarity":
    case "copy_limit":
    case "legendary":
    case "card_pool":
    case "specialization":
    case "format_legal":
    case "ephemeral":
    case "hero-metatype":
    case "pairs":
      return fallback;
    default: {
      const exhaustive: never = code;
      return exhaustive;
    }
  }
}

function groupPregameIssues(
  issues: readonly FabPregameIssue[],
  heroName: string | undefined,
): readonly { readonly code: FabPregameIssue["code"]; readonly message: string }[] {
  const grouped = new Map<FabPregameIssue["code"], FabPregameIssue[]>();
  for (const issue of issues) {
    const current = grouped.get(issue.code);
    if (current) current.push(issue);
    else grouped.set(issue.code, [issue]);
  }
  return [...grouped].map(([code, matching]) => ({
    code,
    message: pregameIssueSummary(code, matching.length, matching[0]!.message, heroName),
  }));
}

function CompactCardImage({
  label,
  canonicalId,
  alt,
  loading,
}: {
  readonly label: string;
  readonly canonicalId?: string;
  readonly alt: string;
  readonly loading?: "eager" | "lazy";
}) {
  const locale = useFabCardLocale();
  const { resolveFabCardArt } = useFabCardArt();
  const art = resolveFabCardArt({ canonicalId, name: label, locale });
  const [boardImageFailed, setBoardImageFailed] = useState(false);
  useEffect(() => setBoardImageFailed(false), [art.boardImageUrl]);

  const imageUrl = art.boardImageUrl && !boardImageFailed ? art.boardImageUrl : undefined;
  if (!imageUrl) return <span aria-hidden="true">{label.slice(0, 1)}</span>;

  return (
    <CardImage
      src={imageUrl}
      alt={alt}
      width={546}
      height={546}
      loading={loading ?? "eager"}
      data-art-variant="no-text"
      onImageError={() => setBoardImageFailed(true)}
    />
  );
}

export function HeroPanel({
  mediaIdentity,
  participant,
  side,
  status,
}: {
  readonly mediaIdentity?: string;
  readonly participant: FabPregameParticipant;
  readonly side: "self" | "opponent";
  readonly status: "pending" | "ready";
}) {
  const locale = useFabCardLocale();
  const { resolveFabCardArt } = useFabCardArt();
  const { boardImageUrl: noTextArt, printedImageUrl: art } = resolveFabCardArt({
    name: participant.heroName,
    locale,
  });
  const heroPreview: SimulatorEntity = {
    id: `pregame-hero:${side}:${participant.heroName ?? participant.label}`,
    title: participant.heroName ?? "Hero pending",
    subtitle: "Hero",
    kind: "card",
    ownerId: side === "self" ? "local-player" : "opponent",
    face: "public",
    states: [],
    stats: [],
    traits: ["Hero"],
    imageUrl: art,
    imageAspectRatio: FAB_CARD_IMAGE_ASPECT_RATIOS.printed,
  };
  const previewTarget = useFabPreviewTarget(heroPreview);
  return (
    <section
      className={`fab-sideboard-hero fab-sideboard-hero--${side}`}
      aria-label={`${side === "self" ? "Current player" : "Opponent"}: ${participant.label}`}
    >
      <div className="fab-sideboard-hero-copy">
        {noTextArt ? (
          <CardImage
            className="fab-sideboard-hero-card-art"
            src={noTextArt}
            alt=""
            loading="eager"
            data-art-variant="no-text"
          />
        ) : null}
        <h2>
          <SupporterPlayerName
            name={participant.label}
            tier={participant.subscriptionTier}
            profileHref={participant.profileHref}
          />
        </h2>
        {participant.mmr != null ? (
          <p className="fab-sideboard-player-metrics">{participant.mmr.toLocaleString()} MMR</p>
        ) : null}
        <button
          type="button"
          className="fab-sideboard-hero-card-link"
          {...previewTarget.previewProps}
        >
          {participant.heroName ? <CompactCardImage label={participant.heroName} alt="" /> : null}
          <span>{participant.heroName ?? "Hero pending"}</span>
          <Eye size={15} strokeWidth={2.2} aria-hidden="true" />
        </button>
        <span className="fab-sideboard-player-status" data-status={status}>
          {status === "ready" ? (
            <Check size={14} strokeWidth={2.7} aria-hidden="true" />
          ) : (
            <Clock3 size={13} strokeWidth={2.4} aria-hidden="true" />
          )}
          {status}
        </span>
      </div>
      <FabHeroIdentityMedia
        heroName={mediaIdentity ?? participant.heroName}
        ownerSubscriptionTier={participant.subscriptionTier}
        fallbackPortraitUrl={noTextArt}
        className="fab-sideboard-hero-art"
        videoClassName={`fab-sideboard-hero-video fab-sideboard-hero-video--${side}`}
        videoTestId={`fab-sideboard-hero-video-${side}`}
      />
    </section>
  );
}

function WarningMark() {
  return (
    <svg className="fab-sideboard-warning-mark" viewBox="0 0 20 18" aria-hidden="true">
      <path d="M10 1 19 17H1L10 1Z" />
      <path className="fab-sideboard-warning-cutout" d="M9 6h2v5H9zM9 13h2v2H9z" />
    </svg>
  );
}

function GridDensityControl({
  value,
  onChange,
}: {
  readonly value: GridDensity;
  readonly onChange: (density: GridDensity) => void;
}) {
  return (
    <div className="fab-sideboard-density" role="group" aria-label="Card grid density">
      {GRID_DENSITIES.map(({ density, columns }, index) => (
        <button
          key={density}
          type="button"
          className="fab-sideboard-density-button"
          aria-label={`Show ${columns} columns`}
          aria-pressed={value === density}
          title={`${columns} columns`}
          onClick={() => onChange(density)}
        >
          <span
            className="fab-sideboard-density-icon"
            style={{ "--density-icon-columns": index + 2 } as CSSProperties}
            aria-hidden="true"
          >
            {Array.from({ length: index + 2 }, (_, cell) => (
              <span key={cell} />
            ))}
          </span>
          <span>{columns}</span>
        </button>
      ))}
    </div>
  );
}

function CardTile({
  pool,
  cardId,
  maximum,
  quantity,
  selected,
  onMove,
}: {
  readonly pool: FabPregameCardPool;
  readonly cardId: string;
  readonly maximum: number;
  readonly quantity: number;
  readonly selected: boolean;
  readonly onMove: (next: number) => void;
}) {
  const resolver = useFabCardArt();
  const definition = pool.cardDefinitions[cardId];
  const label = fabPregameDefinitionName(definition, cardId, resolver);
  const types = definition ? fabPregameDefinitionTypes(definition) : [];
  const locale = useFabCardLocale();
  const { resolveFabCardArt } = useFabCardArt();
  const art = resolveFabCardArt({ canonicalId: cardId, name: label, locale }).printedImageUrl;
  const preview: SimulatorEntity = {
    id: `pregame:${cardId}`,
    title: label,
    subtitle: types.join(" · ") || "Card",
    kind: "card",
    ownerId: "local-player",
    face: "public",
    states: [],
    stats: [],
    traits: [...types],
    imageUrl: art,
    imageAspectRatio: FAB_CARD_IMAGE_ASPECT_RATIOS.printed,
  };
  const previewTarget = useFabPreviewTarget(preview);
  const { pin } = useFabCardPreview();
  const nextQuantity = quantity >= maximum ? 0 : quantity + 1;
  const moveLabel = `Set ${label} deck quantity to ${nextQuantity}`;
  return (
    <article
      className={`fab-sideboard-card ${selected ? "is-selected" : ""} ${!selected ? "is-empty" : ""}`}
      {...previewTarget.previewProps}
    >
      <button
        type="button"
        className="fab-sideboard-card-face"
        disabled={maximum <= 0}
        onClick={() => onMove(nextQuantity)}
        aria-label={moveLabel}
      >
        <CompactCardImage label={label} canonicalId={cardId} alt="" loading="lazy" />
      </button>
      <button
        type="button"
        className="fab-sideboard-card-preview-button"
        aria-label={`View ${label}`}
        onClick={() => pin(preview)}
      >
        <Eye size={16} strokeWidth={2.4} aria-hidden="true" />
      </button>
      <div className="fab-sideboard-card-footer">
        <span className="fab-sideboard-card-name">{label}</span>
        <div className="fab-sideboard-card-controls" aria-label={`${label} deck quantity`}>
          <button
            type="button"
            disabled={quantity === 0}
            onClick={() => onMove(quantity - 1)}
            aria-label={`Remove one ${label} from your deck`}
          >
            −
          </button>
          <span>
            {quantity}/{maximum}
          </span>
          <button
            type="button"
            disabled={quantity >= maximum}
            onClick={() => onMove(quantity + 1)}
            aria-label={`Add one ${label} to your deck`}
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}

function EquipmentOption({
  pool,
  cardId,
  selected,
  onClick,
}: {
  readonly pool: FabPregameCardPool;
  readonly cardId: string;
  readonly selected: boolean;
  readonly onClick: () => void;
}) {
  const resolver = useFabCardArt();
  const definition = pool.cardDefinitions[cardId];
  const label = fabPregameDefinitionName(definition, cardId, resolver);
  const types = definition ? fabPregameDefinitionTypes(definition) : [];
  const locale = useFabCardLocale();
  const { resolveFabCardArt } = useFabCardArt();
  const art = resolveFabCardArt({ canonicalId: cardId, name: label, locale }).printedImageUrl;
  const preview: SimulatorEntity = {
    id: `pregame-equipment:${cardId}`,
    title: label,
    subtitle: types.join(" · ") || "Equipment",
    kind: "card",
    ownerId: "local-player",
    face: "public",
    states: [],
    stats: [],
    traits: [...types],
    imageUrl: art,
    imageAspectRatio: FAB_CARD_IMAGE_ASPECT_RATIOS.printed,
  };
  const previewTarget = useFabPreviewTarget(preview);
  return (
    <button
      type="button"
      className={selected ? "is-selected" : ""}
      {...previewTarget.previewProps}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

export type FabPregameSideboardProps = {
  readonly turnOrderDialog?: ReactNode;
  readonly turnOrderBlocking?: boolean;
  readonly pool: FabPregameCardPool;
  readonly player: FabPregameParticipant;
  readonly opponent: FabPregameParticipant;
  readonly turnOrderLabel?: string;
  readonly relaxDeckSize?: boolean;
  readonly deadline?: number;
  readonly opponentReady?: boolean;
  readonly locked?: boolean;
  readonly initialSelection?: FabPregameSelection;
  readonly onConfirm: (selection: FabPregameSelection) => void;
  readonly onLeave: () => void;
};

export function FabPregameSideboard(props: FabPregameSideboardProps) {
  return (
    <FabCardPreviewProvider>
      <FabPregameSideboardSurface {...props} />
      {props.turnOrderDialog}
    </FabCardPreviewProvider>
  );
}

function FabPregameSideboardSurface({
  pool,
  player,
  opponent,
  turnOrderLabel,
  turnOrderDialog,
  turnOrderBlocking = Boolean(turnOrderDialog),
  relaxDeckSize = false,
  deadline,
  opponentReady = false,
  locked = false,
  initialSelection,
  onConfirm,
  onLeave,
}: FabPregameSideboardProps) {
  const resolver = useFabCardArt();
  const presentationDefinitions = useMemo<readonly FabPresentationDefinition[]>(
    () => [
      ...Object.values(pool.cardDefinitions),
      ...(player.heroName
        ? [{ canonicalId: `pregame-player:${player.heroName}`, name: player.heroName }]
        : []),
      ...(opponent.heroName
        ? [{ canonicalId: `pregame-opponent:${opponent.heroName}`, name: opponent.heroName }]
        : []),
    ],
    [opponent.heroName, player.heroName, pool.cardDefinitions],
  );
  const presentationRequestKey = useMemo(
    () =>
      presentationDefinitions
        .map((definition) => `${definition.canonicalId}:${definition.name ?? ""}`)
        .sort()
        .join("|"),
    [presentationDefinitions],
  );
  const presentationLoad = useFabCardPresentation(presentationDefinitions, presentationRequestKey);
  const initial = useMemo(() => {
    const selection = initialSelection ?? createDefaultFabPregameSelection(pool);
    const resolved = resolveFabEquipmentSelection(pool, selection.equipment);
    return resolved.status === "accepted"
      ? { ...selection, equipment: resolved.equipment }
      : selection;
  }, [initialSelection, pool]);
  const [selection, setSelection] = useState<FabPregameSelection>(initial);
  const [resetConfirmationOpen, setResetConfirmationOpen] = useState(false);
  const [equipmentOpen, setEquipmentOpen] = useState(false);
  const [gridDensity, setGridDensity] = useState<GridDensity>(initialGridDensity);
  const equipmentBodyId = useId();
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (locked) setSelection(initial);
  }, [initial, locked]);
  useEffect(() => {
    if (!deadline) return;
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [deadline]);
  useEffect(() => {
    try {
      if (!window.localStorage.getItem(GRID_DENSITY_STORAGE_KEY) && window.innerWidth <= 900) {
        setGridDensity("spacious");
      }
    } catch {
      if (window.innerWidth <= 900) setGridDensity("spacious");
    }
  }, []);
  useEffect(() => {
    try {
      window.localStorage.setItem(GRID_DENSITY_STORAGE_KEY, gridDensity);
    } catch {
      // Storage can be unavailable in privacy-restricted browsers; the in-memory preference still works.
    }
  }, [gridDensity]);

  const available = useMemo(() => quantities(pool), [pool]);
  const deckById = useMemo(
    () => new Map(selection.deck.map((entry) => [entry.canonicalId, entry.quantity] as const)),
    [selection.deck],
  );
  const validation = validateFabPregameSelection(pool, selection, { relaxDeckSize });
  const selectionChanged = useMemo(
    () => fabPregameSelectionKey(selection) !== fabPregameSelectionKey(initial),
    [initial, selection],
  );
  const seconds = deadline ? Math.max(0, Math.ceil((deadline - now) / 1000)) : null;
  const format = FAB_FORMAT_RULES[pool.format];
  const deckbuildingAccess = fabHeroDeckbuildingAccess(pool.cardDefinitions[pool.heroId]);
  const printedHeroIdentity = deckbuildingAccess.printedSupertypes.join(" ") || "Generic";
  const essenceLabel = deckbuildingAccess.essenceSupertypes.length
    ? `Essence of ${formatNaturalList(deckbuildingAccess.essenceSupertypes)}`
    : null;
  const deckSizeRequirement = format.exactDeckSize
    ? `${validation.requiredDeckCount} required`
    : `${validation.requiredDeckCount} minimum`;
  const validationGroups = groupPregameIssues(validation.issues, player.heroName);
  const validationReason = validationGroups.map((group) => group.message).join(" ");
  const equipmentIds = useMemo(
    () => [...available.keys()].filter((id) => isFabArenaCardDefinition(pool.cardDefinitions[id])),
    [available, pool],
  );
  const deckIds = useMemo(
    () => [...available.keys()].filter((id) => !isFabArenaCardDefinition(pool.cardDefinitions[id])),
    [available, pool],
  );
  const equipmentCandidatesForSlot = (slot: FabEquipmentSlot): readonly string[] =>
    equipmentIds.filter(
      (id) =>
        fabEquipmentSlotsForDefinition(pool.cardDefinitions[id]).includes(slot) &&
        proposeFabEquipmentSelection(pool, selection.equipment, slot, id) !== null,
    );

  const setQuantity = (id: string, quantity: number) => {
    if (locked) return;
    const next = new Map(deckById);
    if (quantity <= 0) next.delete(id);
    else next.set(id, Math.min(quantity, available.get(id) ?? 0));
    setSelection({
      ...selection,
      deck: [...next].map(([canonicalId, selectedQuantity]) => ({
        canonicalId,
        quantity: selectedQuantity,
      })),
    });
  };
  const selectEquipment = (id: string) => {
    if (locked) return;
    const current = Object.entries(selection.equipment).find(([, selected]) => selected === id);
    if (current) {
      const equipment = { ...selection.equipment };
      delete equipment[current[0] as FabEquipmentSlot];
      setSelection({ ...selection, equipment });
      return;
    }
    const slots = fabEquipmentSlotsForDefinition(pool.cardDefinitions[id]);
    for (const slot of [...slots.filter((slot) => !selection.equipment[slot]), ...slots]) {
      const equipment = proposeFabEquipmentSelection(pool, selection.equipment, slot, id);
      if (equipment) {
        setSelection({ ...selection, equipment });
        return;
      }
    }
  };
  const cycleEquipment = (slot: FabEquipmentSlot) => {
    if (locked) return;
    const candidates = equipmentCandidatesForSlot(slot);
    const current = selection.equipment[slot];
    const currentIndex = current ? candidates.indexOf(current) : -1;
    const next = currentIndex >= candidates.length - 1 ? undefined : candidates[currentIndex + 1];
    if (!next) {
      const equipment = { ...selection.equipment };
      delete equipment[slot];
      setSelection({ ...selection, equipment });
    } else {
      const equipment = proposeFabEquipmentSelection(pool, selection.equipment, slot, next);
      if (equipment) setSelection({ ...selection, equipment });
    }
  };
  const groups: readonly { readonly slot: EquipmentSlot; readonly label: string }[] = [
    { slot: "weapon1", label: "Weapon / off-hand" },
    { slot: "head", label: "Head" },
    { slot: "chest", label: "Chest" },
    { slot: "arms", label: "Arms" },
    { slot: "legs", label: "Legs" },
  ];
  const selectedTwoHanded = hasType(pool, selection.equipment.weapon1, "2H");
  const warnings = groups.filter(({ slot }) => {
    const candidates = equipmentIds.filter((id) =>
      slot === "weapon1"
        ? fabEquipmentSlotsForDefinition(pool.cardDefinitions[id]).includes("weapon1")
        : fabEquipmentSlotsForDefinition(pool.cardDefinitions[id]).includes(slot),
    );
    if (!candidates.length) return false;
    return slot === "weapon1"
      ? !selection.equipment.weapon1 && !selection.equipment.weapon2
      : !selection.equipment[slot];
  });
  const equippedSummary = (
    [
      ["weapon1", selection.equipment.weapon1],
      ["weapon2", selection.equipment.weapon2],
      ["head", selection.equipment.head],
      ["chest", selection.equipment.chest],
      ["arms", selection.equipment.arms],
      ["legs", selection.equipment.legs],
    ] as const
  ).flatMap(([slot, id]) => (id || equipmentCandidatesForSlot(slot).length ? [{ slot, id }] : []));
  const opponentStatus = opponentReady ? "ready" : "pending";
  return (
    <main
      inert={turnOrderBlocking}
      className="fab-sideboard"
      data-testid="fab-pregame-sideboard"
      data-presentation-state={presentationLoad.kind}
    >
      <section className="fab-sideboard-matchup" aria-label="Matchup">
        <HeroPanel participant={player} side="self" status={locked ? "ready" : "pending"} />
        <div className="fab-sideboard-matchup-center">
          <span className="fab-sideboard-phase">{turnOrderLabel ?? "Game preparation"}</span>
          <strong role="timer" aria-label="Decision time">
            {seconds == null
              ? "—:—"
              : `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`}
          </strong>
          <span className="fab-sideboard-format">{format.label}</span>
          <details className="fab-sideboard-activity">
            <summary>
              <Swords size={13} strokeWidth={1.9} aria-hidden="true" /> Activity
            </summary>
            <div role="log" aria-label="Match activity">
              <p>
                <span>Now</span> Game preparation started
              </p>
              <p>
                <span>Live</span> {opponent.label} {opponentStatus.toLowerCase()}
              </p>
              <p>
                <span>Order</span> {turnOrderLabel ?? "Turn order not selected"}
              </p>
            </div>
          </details>
        </div>
        <HeroPanel participant={opponent} side="opponent" status={opponentStatus} />
      </section>
      <section className="fab-sideboard-workspace" aria-label="Starting deck and equipment">
        <div className="fab-sideboard-workspace-head">
          <div className="fab-sideboard-deck-heading">
            <h2>Starting deck</h2>
            <p>
              {validation.deckCount} cards selected · {deckSizeRequirement}
            </p>
          </div>
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {turnOrderLabel && (
              <Badge
                color="yellow"
                variant="light"
                size="lg"
                radius="sm"
                aria-label="Your starting order"
              >
                {turnOrderLabel}
              </Badge>
            )}
            <div
              className="fab-sideboard-deckbuilding-access"
              aria-label="Hero deckbuilding access"
            >
              <span>{printedHeroIdentity}</span>
              {essenceLabel ? <span>{essenceLabel}</span> : null}
            </div>
          </div>
          <GridDensityControl value={gridDensity} onChange={setGridDensity} />
          {!validation.valid ? (
            <details className="fab-sideboard-validation" open>
              <summary>
                Deck needs attention · {validationGroups.length} rule{" "}
                {validationGroups.length === 1 ? "check" : "checks"}
              </summary>
              <ul>
                {validationGroups.map((group) => (
                  <li key={group.code}>{group.message}</li>
                ))}
              </ul>
            </details>
          ) : null}
        </div>
        <section className="fab-sideboard-pool" aria-label="Starting deck choices">
          <header>
            <p>Click a card to cycle its deck quantity through every available copy.</p>
          </header>
          <div className={`fab-sideboard-grid fab-sideboard-grid--${gridDensity}`}>
            {deckIds.map((id) => (
              <CardTile
                key={id}
                pool={pool}
                cardId={id}
                maximum={available.get(id) ?? 0}
                quantity={deckById.get(id) ?? 0}
                selected={(deckById.get(id) ?? 0) > 0}
                onMove={(quantity) => setQuantity(id, quantity)}
              />
            ))}
          </div>
        </section>
        <section className={`fab-sideboard-equipment ${equipmentOpen ? "is-open" : ""}`}>
          <div className="fab-sideboard-equipment-dock">
            <div className="fab-sideboard-equipment-copy">
              <strong>
                <span className="fab-sideboard-equipment-label-desktop">Equipment loadout</span>
                <span className="fab-sideboard-equipment-label-mobile">Loadout</span>
              </strong>
              <small>
                {warnings.length
                  ? `${warnings.length} available slot${warnings.length === 1 ? "" : "s"} empty`
                  : "Loadout complete"}
              </small>
            </div>
            <div className="fab-sideboard-equipped-summary" aria-label="Equipped cards">
              {equippedSummary.map(({ slot, id }) => {
                const label = id
                  ? fabPregameDefinitionName(pool.cardDefinitions[id], id, resolver)
                  : `Empty ${slot}`;
                const candidates = equipmentCandidatesForSlot(slot);
                const currentIndex = id ? candidates.indexOf(id) : -1;
                const nextId =
                  currentIndex >= candidates.length - 1 ? undefined : candidates[currentIndex + 1];
                const nextLabel = nextId
                  ? fabPregameDefinitionName(pool.cardDefinitions[nextId], nextId, resolver)
                  : "empty";
                return (
                  <button
                    key={`${slot}:${id}`}
                    type="button"
                    className="fab-sideboard-equipped-card"
                    title={label}
                    aria-label={`Change ${slot} equipment from ${label} to ${nextLabel}`}
                    disabled={locked}
                    onClick={() => cycleEquipment(slot)}
                  >
                    {id ? (
                      <CompactCardImage label={label} canonicalId={id} alt={label} />
                    ) : (
                      <span className="fab-sideboard-equipped-empty" aria-hidden="true">
                        <WarningMark />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              className="fab-sideboard-equipment-trigger"
              aria-expanded={equipmentOpen}
              aria-controls={equipmentBodyId}
              onClick={() => setEquipmentOpen((value) => !value)}
            >
              <span className="fab-sideboard-equipment-action">
                {warnings.length ? (
                  <span className="fab-sideboard-warning">
                    <WarningMark /> Review
                  </span>
                ) : (
                  <span>Edit loadout</span>
                )}
                <ChevronDown size={18} strokeWidth={2.2} aria-hidden="true" />
              </span>
            </button>
          </div>
          {equipmentOpen ? (
            <div id={equipmentBodyId} className="fab-sideboard-equipment-body">
              {groups.map(({ slot, label }) => {
                const candidates = equipmentIds.filter((id) =>
                  slot === "weapon1"
                    ? fabEquipmentSlotsForDefinition(pool.cardDefinitions[id]).includes("weapon1")
                    : fabEquipmentSlotsForDefinition(pool.cardDefinitions[id]).includes(slot),
                );
                const warn = warnings.some((warning) => warning.slot === slot);
                return (
                  <section key={slot}>
                    <header>
                      <h3>{label}</h3>
                      {warn ? (
                        <span className="fab-sideboard-warning">
                          <WarningMark /> Empty
                        </span>
                      ) : (
                        <span>
                          {slot === "weapon1" && selectedTwoHanded
                            ? "Two-handed equipped"
                            : "Selected"}
                        </span>
                      )}
                    </header>
                    <div>
                      {candidates.map((id) => (
                        <EquipmentOption
                          key={id}
                          pool={pool}
                          cardId={id}
                          selected={Object.values(selection.equipment).includes(id)}
                          onClick={() => selectEquipment(id)}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          ) : null}
        </section>
      </section>
      <footer className="fab-sideboard-footer">
        <div>
          <strong className={validation.valid ? "is-ready" : ""}>
            {validation.deckCount}/{validation.requiredDeckCount}
          </strong>
          <span className={validation.valid ? undefined : "is-invalid"} aria-live="polite">
            {locked
              ? "Your selection is locked"
              : validation.valid
                ? "Legal selection · ready to confirm"
                : `${validationGroups.length} rule ${validationGroups.length === 1 ? "check needs" : "checks need"} attention`}
          </span>
        </div>
        <button
          type="button"
          className="fab-sideboard-reset"
          disabled={locked}
          onClick={() => {
            if (selectionChanged) setResetConfirmationOpen(true);
            else setSelection(initial);
          }}
        >
          Reset
        </button>
        <button type="button" className="fab-sideboard-leave" onClick={onLeave}>
          Leave
        </button>
        <div
          className="fab-sideboard-confirm-wrap"
          tabIndex={!validation.valid && !locked ? 0 : undefined}
          aria-describedby={
            !validation.valid && !locked ? "fab-sideboard-confirm-reason" : undefined
          }
        >
          <button
            type="button"
            className="fab-sideboard-confirm"
            disabled={!validation.valid || locked}
            onClick={() => onConfirm(selection)}
          >
            {locked ? "Selection locked" : "Confirm selection"}
          </button>
          {!validation.valid && !locked ? (
            <span
              id="fab-sideboard-confirm-reason"
              className="fab-sideboard-confirm-tooltip"
              role="tooltip"
            >
              {validationReason}
            </span>
          ) : null}
        </div>
      </footer>
      <Modal
        opened={resetConfirmationOpen}
        onClose={() => setResetConfirmationOpen(false)}
        centered
        title="Reset game preparation?"
      >
        <Text size="sm">
          This restores your original starting deck and equipment loadout. Your current changes will
          be discarded.
        </Text>
        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={() => setResetConfirmationOpen(false)}>
            Keep changes
          </Button>
          <Button
            color="red"
            onClick={() => {
              setSelection(initial);
              setResetConfirmationOpen(false);
            }}
          >
            Reset selection
          </Button>
        </Group>
      </Modal>
    </main>
  );
}

function fabPregameSelectionKey(selection: FabPregameSelection): string {
  const deck = [...selection.deck]
    .map(({ canonicalId, quantity }) => `${canonicalId}:${quantity}`)
    .sort()
    .join("|");
  const equipment = Object.entries(selection.equipment)
    .filter((entry): entry is [string, string] => typeof entry[1] === "string")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([slot, canonicalId]) => `${slot}:${canonicalId}`)
    .join("|");
  return `${deck}::${equipment}`;
}
