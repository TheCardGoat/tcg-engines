import { type MatchStaticResources, hasMayEnterPlayExertedOption } from "@tcg/lorcana-engine";
import type { LorcanaCard, LorcanaCardDefinition } from "@tcg/lorcana-engine";
import type { Languages } from "@tcg/lorcana-types";
import type { LorcanaProjectedBoardView, LorcanaProjectedCard } from "@tcg/lorcana-engine";
import { m } from "$lib/i18n/messages.js";
import { getLocale } from "$lib/paraglide/runtime.js";
import type {
  LorcanaActiveEffectSummary,
  LorcanaCardTextEntrySnapshot,
  LorcanaCardSnapshot,
  LorcanaPlayerSide,
  LorcanaZoneId,
} from "@/features/simulator/model/contracts.js";
import { getSideForOwnerId, getZoneCardIds } from "@/features/simulator/model/contracts.js";

export type CardSnapshotMap = Record<string, LorcanaCardSnapshot>;

/**
 * Merge keyword names from derived boolean flags into the keyword list used for UI targeting.
 * Engine candidates use full derived state; snapshots must not drop simple keywords when the
 * projected list and flags could drift (e.g. optional banish "has-keyword" vs CardTargetDialog).
 */
function mergeDerivedKeywordSignals(
  baseKeywords: readonly string[] | undefined,
  projected: Pick<LorcanaProjectedCard, "hasEvasive" | "hasRush" | "hasReckless" | "hasSupport">,
): string[] {
  const set = new Set<string>(baseKeywords ?? []);
  if (projected.hasEvasive) {
    set.add("Evasive");
  }
  if (projected.hasRush) {
    set.add("Rush");
  }
  if (projected.hasReckless) {
    set.add("Reckless");
  }
  if (projected.hasSupport) {
    set.add("Support");
  }
  return [...set].sort((left, right) => left.localeCompare(right));
}

interface AuthoritativeCardStateView {
  ctx: {
    zones: {
      private: {
        cardIndex: Record<
          string,
          {
            zoneKey: string;
            ownerID: string;
            controllerID: string;
          }
        >;
        cardMeta: Record<string, Record<string, unknown>>;
      };
    };
  };
}

type LocalizedCardTextSource = string | Array<{ title: string; description?: string }>;

const CARD_I18N_LOCALE_BY_UI_LOCALE: Partial<Record<string, Languages>> = {
  en: "en",
  de: "de",
  it: "it",
  fr: "fr",
  es: "en",
  "pt-br": "en",
};

function resolveCardI18nLocale(): Languages {
  try {
    return CARD_I18N_LOCALE_BY_UI_LOCALE[getLocale()] ?? "en";
  } catch {
    return "en";
  }
}

function flattenCardText(text?: LocalizedCardTextSource): string | undefined {
  if (!text) {
    return undefined;
  }

  if (typeof text === "string") {
    return text;
  }

  return text
    .map((entry) => (entry.description ? `${entry.title} ${entry.description}` : entry.title))
    .join("\n");
}

function projectCardTextEntries(
  text?: LocalizedCardTextSource,
): LorcanaCardTextEntrySnapshot[] | undefined {
  if (!text) {
    return undefined;
  }

  if (typeof text === "string") {
    const trimmed = text.trim();
    if (!trimmed) {
      return undefined;
    }
    const lines = trimmed
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
    const entries = lines.map<LorcanaCardTextEntrySnapshot>((line) => ({
      title: line,
    }));
    return entries.length > 0 ? entries : undefined;
  }

  const entries = text
    .map<LorcanaCardTextEntrySnapshot | null>((entry) => {
      const title = entry.title.trim();
      if (!title) {
        return null;
      }

      const description = entry.description?.trim();
      return {
        title,
        ...(description ? { description } : {}),
      };
    })
    .filter((entry): entry is LorcanaCardTextEntrySnapshot => entry !== null);

  return entries.length > 0 ? entries : undefined;
}

function getLocalizedChoiceOptionTexts(definition: LorcanaCardDefinition): string[] | undefined {
  const locale = resolveCardI18nLocale();
  const localized = definition.i18n?.[locale]?.optionTexts;
  if (localized && localized.length > 0) {
    return localized;
  }

  const english = definition.i18n?.en?.optionTexts;
  if (english && english.length > 0) {
    return english;
  }

  return undefined;
}

function mergeTextEntries(
  definitionEntries: LorcanaCardTextEntrySnapshot[] | undefined,
  grantedEntries: Array<{ title: string; description?: string }> | undefined,
): LorcanaCardTextEntrySnapshot[] | undefined {
  if (!grantedEntries || grantedEntries.length === 0) {
    return definitionEntries;
  }

  const merged = [...(definitionEntries ?? []), ...grantedEntries];
  return merged.length > 0 ? merged : undefined;
}

function buildGrantSources(
  cardId: string,
  projectedCard: {
    grantedAbilityTextEntries?: Array<{
      title: string;
      sourceId?: string;
      sourceDefinitionId?: string;
    }>;
    keywordGrantSources?: Array<{ keyword: string; sourceId: string; sourceDefinitionId?: string }>;
    statModifierSources?: Array<{
      stat: string;
      amount: number;
      sourceId: string;
      sourceDefinitionId?: string;
    }>;
  },
  staticResources: MatchStaticResources,
): LorcanaCardSnapshot["grantSources"] {
  const grantedEntries = projectedCard.grantedAbilityTextEntries ?? [];
  const keywordSources = projectedCard.keywordGrantSources ?? [];
  // Filter out self-referential stat modifiers (e.g. Boost is self-applied, not a grant from another card)
  const statSources = (projectedCard.statModifierSources ?? []).filter(
    (s) => s.sourceId !== cardId,
  );
  if (grantedEntries.length === 0 && keywordSources.length === 0 && statSources.length === 0) {
    return undefined;
  }

  const bySource = new Map<string, { definitionId?: string; grants: string[] }>();

  for (const entry of grantedEntries) {
    if (!entry.sourceId) continue;
    if (entry.sourceId === cardId) continue; // filter self-grants (e.g. Boost keyword)
    const existing = bySource.get(entry.sourceId);
    if (existing) {
      existing.grants.push(entry.title);
    } else {
      bySource.set(entry.sourceId, {
        definitionId: entry.sourceDefinitionId,
        grants: [entry.title],
      });
    }
  }

  for (const entry of keywordSources) {
    const existing = bySource.get(entry.sourceId);
    if (existing) {
      if (!existing.grants.includes(entry.keyword)) {
        existing.grants.push(entry.keyword);
      }
    } else {
      bySource.set(entry.sourceId, {
        definitionId: entry.sourceDefinitionId,
        grants: [entry.keyword],
      });
    }
  }

  for (const entry of statSources) {
    const sign = entry.amount > 0 ? "+" : "";
    const statLabel = `${sign}${entry.amount} ${entry.stat.charAt(0).toUpperCase()}${entry.stat.slice(1)}`;
    const existing = bySource.get(entry.sourceId);
    if (existing) {
      existing.grants.push(statLabel);
    } else {
      bySource.set(entry.sourceId, {
        definitionId: entry.sourceDefinitionId,
        grants: [statLabel],
      });
    }
  }

  if (bySource.size === 0) return undefined;

  const sources: NonNullable<LorcanaCardSnapshot["grantSources"]> = [];
  for (const [sourceCardId, { definitionId, grants }] of bySource) {
    const sourceDef = definitionId ? staticResources.cards.get(definitionId) : undefined;
    const sourceLabel = sourceDef
      ? sourceDef.version
        ? `${sourceDef.name} - ${sourceDef.version}`
        : sourceDef.name
      : sourceCardId;
    sources.push({
      sourceCardId,
      sourceLabel,
      sourceSet: sourceDef?.set,
      sourceCardNumber: sourceDef?.cardNumber,
      sourceInkType: sourceDef?.inkType,
      grants,
    });
  }

  return sources;
}

function formatSignedAmount(value: number): string {
  return `${value >= 0 ? "+" : ""}${value}`;
}

function formatStatLabel(stat: string): string {
  return `${stat.charAt(0).toUpperCase()}${stat.slice(1)}`;
}

function formatKeywordLabel(keyword: string, value?: number): string {
  if (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value > 0 &&
    (keyword === "Resist" ||
      keyword === "Challenger" ||
      keyword === "Singer" ||
      keyword === "Boost")
  ) {
    return `${keyword} +${value}`;
  }

  return keyword;
}

function formatRestrictionLabel(restriction: string): string {
  switch (restriction) {
    case "cant-ready":
      return "Can't ready";
    case "cant-challenge":
      return "Can't challenge";
    case "cant-quest":
      return "Can't quest";
    case "cant-quest-or-challenge":
      return "Can't quest or challenge";
    case "cant-play-actions":
      return "Can't play actions";
    case "cant-play-items":
      return "Can't play items";
    case "cant-sing":
      return "Can't sing";
    default:
      return restriction
        .split("-")
        .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join(" ");
  }
}

function getEffectPriorityFromLabel(label: string): number {
  if (/^[+-]\d+\s+(Strength|Willpower|Lore)$/i.test(label)) {
    return 0;
  }
  if (/^(Strength|Willpower|Lore)\s+[+-]?\d+/i.test(label)) {
    return 0;
  }
  if (label.startsWith("Can't ")) {
    return 1;
  }
  if (
    /^(Ward|Evasive|Bodyguard|Support|Reckless|Vanish|Rush|Alert|Resist|Challenger|Singer|Sing Together|Boost|Shift)/i.test(
      label,
    )
  ) {
    return 2;
  }
  if (label.startsWith("Cost ")) {
    return 4;
  }
  return 3;
}

function formatEffectDuration(
  effect: LorcanaProjectedBoardView["activeEffects"][number],
): string | undefined {
  const payload = effect.payload;
  const rawDuration =
    payload &&
    typeof payload === "object" &&
    "duration" in payload &&
    typeof payload.duration === "string" &&
    payload.duration.trim().length > 0
      ? payload.duration.trim()
      : undefined;

  switch (rawDuration) {
    case "this-turn":
      return "This turn";
    case "until-start-of-next-turn":
      return "Until the start of next turn";
    case "until-end-of-turn":
      return "Until end of turn";
    case "while-in-play":
      return "While the source remains in play";
    case "next-play-this-turn":
      return "For the next play this turn";
    default:
      if (typeof effect.expiresAtTurn === "number") {
        return `Active through turn ${effect.expiresAtTurn}`;
      }
      return undefined;
  }
}

function getSourceDetails(
  board: LorcanaProjectedBoardView,
  staticResources: MatchStaticResources,
  sourceId: string | undefined,
): Omit<
  LorcanaActiveEffectSummary,
  | "id"
  | "type"
  | "label"
  | "description"
  | "priority"
  | "targetCardId"
  | "targetPlayerId"
  | "stat"
  | "amount"
  | "keyword"
  | "restriction"
  | "abilityTitle"
  | "startsAtTurn"
  | "expiresAtTurn"
> {
  if (!sourceId) {
    return {};
  }

  const projectedSource = board.cards[sourceId];
  const sourceDefinition = getCardDefinition(
    staticResources,
    sourceId,
    projectedSource?.definitionId,
  );
  return {
    sourceCardId: sourceId,
    sourceLabel:
      projectedSource?.fullName ?? getCardDisplayName(undefined, sourceDefinition) ?? sourceId,
    sourceSet: sourceDefinition?.set,
    sourceCardNumber: sourceDefinition?.cardNumber,
    sourceInkType: sourceDefinition?.inkType,
  };
}

function createEffectDescription(args: {
  label: string;
  sourceLabel?: string;
  duration?: string;
}): string {
  const segments = [args.label];
  if (args.sourceLabel) {
    segments.push(`From ${args.sourceLabel}`);
  }
  if (args.duration) {
    segments.push(args.duration);
  }
  return segments.join(" · ");
}

function summarizeProjectedActiveEffect(args: {
  board: LorcanaProjectedBoardView;
  staticResources: MatchStaticResources;
  effect: LorcanaProjectedBoardView["activeEffects"][number];
}): LorcanaActiveEffectSummary | null {
  const { board, staticResources, effect } = args;
  const payload = effect.payload;
  const sourceDetails = getSourceDetails(board, staticResources, effect.sourceId);
  const duration = formatEffectDuration(effect);

  if (!payload || typeof payload !== "object") {
    return null;
  }

  if (
    effect.type === "stat-modifier" &&
    "stat" in payload &&
    typeof payload.stat === "string" &&
    "modifier" in payload &&
    typeof payload.modifier === "number"
  ) {
    const label = `${formatStatLabel(payload.stat)} ${formatSignedAmount(payload.modifier)}`;
    return {
      id: effect.id,
      type: effect.type,
      label,
      description: createEffectDescription({
        label,
        sourceLabel: sourceDetails.sourceLabel,
        duration,
      }),
      priority: 0,
      ...sourceDetails,
      targetCardId: effect.targetCardId,
      targetPlayerId: effect.targetPlayerId,
      stat:
        payload.stat === "strength" || payload.stat === "willpower" || payload.stat === "lore"
          ? payload.stat
          : undefined,
      amount: payload.modifier,
      startsAtTurn: effect.startsAtTurn,
      expiresAtTurn: effect.expiresAtTurn,
    };
  }

  if (
    effect.type === "temporary-keyword" &&
    "keyword" in payload &&
    typeof payload.keyword === "string"
  ) {
    const value =
      "value" in payload && typeof payload.value === "number" ? payload.value : undefined;
    const label = formatKeywordLabel(payload.keyword, value);
    return {
      id: effect.id,
      type: effect.type,
      label,
      description: createEffectDescription({
        label,
        sourceLabel: sourceDetails.sourceLabel,
        duration,
      }),
      priority: 2,
      ...sourceDetails,
      targetCardId: effect.targetCardId,
      keyword: payload.keyword,
      amount: value,
      startsAtTurn: effect.startsAtTurn,
      expiresAtTurn: effect.expiresAtTurn,
    };
  }

  if (
    effect.type === "temporary-restriction" &&
    "restriction" in payload &&
    typeof payload.restriction === "string"
  ) {
    const label = formatRestrictionLabel(payload.restriction);
    return {
      id: effect.id,
      type: effect.type,
      label,
      description: createEffectDescription({
        label,
        sourceLabel: sourceDetails.sourceLabel,
        duration,
      }),
      priority: 1,
      ...sourceDetails,
      targetCardId: effect.targetCardId,
      restriction: payload.restriction,
      startsAtTurn: effect.startsAtTurn,
      expiresAtTurn: effect.expiresAtTurn,
    };
  }

  if (
    effect.type === "temporary-ability" &&
    "ability" in payload &&
    typeof payload.ability === "string"
  ) {
    const abilityTitle =
      "abilityName" in payload && typeof payload.abilityName === "string"
        ? payload.abilityName
        : payload.ability;
    const label = abilityTitle || "Granted ability";
    return {
      id: effect.id,
      type: effect.type,
      label,
      description: createEffectDescription({
        label,
        sourceLabel: sourceDetails.sourceLabel,
        duration,
      }),
      priority: 3,
      ...sourceDetails,
      targetCardId: effect.targetCardId,
      abilityTitle,
      startsAtTurn: effect.startsAtTurn,
      expiresAtTurn: effect.expiresAtTurn,
    };
  }

  if (
    effect.type === "player-cost-reduction" &&
    "amount" in payload &&
    typeof payload.amount === "number"
  ) {
    const cardType =
      "cardType" in payload && typeof payload.cardType === "string" ? payload.cardType : "card";
    const label = `Cost -${payload.amount}`;
    return {
      id: effect.id,
      type: effect.type,
      label,
      description: createEffectDescription({
        label: `Next ${cardType} costs ${payload.amount} less`,
        sourceLabel: sourceDetails.sourceLabel,
        duration,
      }),
      priority: 4,
      ...sourceDetails,
      targetPlayerId: effect.targetPlayerId,
      amount: payload.amount,
      startsAtTurn: effect.startsAtTurn,
      expiresAtTurn: effect.expiresAtTurn,
    };
  }

  if (
    effect.type === "player-restriction" &&
    "restriction" in payload &&
    typeof payload.restriction === "string"
  ) {
    const label = formatRestrictionLabel(payload.restriction);
    return {
      id: effect.id,
      type: effect.type,
      label,
      description: createEffectDescription({
        label,
        sourceLabel: sourceDetails.sourceLabel,
        duration,
      }),
      priority: 4,
      ...sourceDetails,
      targetPlayerId: effect.targetPlayerId,
      restriction: payload.restriction,
      startsAtTurn: effect.startsAtTurn,
      expiresAtTurn: effect.expiresAtTurn,
    };
  }

  return null;
}

function summarizeGrantEffects(card: LorcanaCardSnapshot): LorcanaActiveEffectSummary[] {
  return (card.grantSources ?? []).flatMap((source) =>
    source.grants.map((grant) => ({
      id: `grant:${card.cardId}:${source.sourceCardId}:${grant}`,
      type: "grant",
      label: grant,
      description: createEffectDescription({
        label: grant,
        sourceLabel: source.sourceLabel,
      }),
      priority: getEffectPriorityFromLabel(grant),
      sourceCardId: source.sourceCardId,
      sourceLabel: source.sourceLabel,
      sourceSet: source.sourceSet,
      sourceCardNumber: source.sourceCardNumber,
      sourceInkType: source.sourceInkType,
      targetCardId: card.cardId,
      stat: /^[+-]\d+\s+(Strength|Willpower|Lore)$/i.test(grant)
        ? ({
            Strength: "strength",
            Willpower: "willpower",
            Lore: "lore",
          }[grant.replace(/^[+-]\d+\s+/i, "") as "Strength" | "Willpower" | "Lore"] as
            | "strength"
            | "willpower"
            | "lore"
            | undefined)
        : undefined,
    })),
  );
}

function dedupeAndSortEffects(
  effects: LorcanaActiveEffectSummary[],
): LorcanaActiveEffectSummary[] | undefined {
  if (effects.length === 0) {
    return undefined;
  }

  const deduped = new Map<string, LorcanaActiveEffectSummary>();
  for (const effect of effects) {
    const key = `${effect.type}:${effect.label}:${effect.sourceCardId ?? "none"}`;
    if (!deduped.has(key)) {
      deduped.set(key, effect);
    }
  }

  return [...deduped.values()].sort((left, right) => {
    if (left.priority !== right.priority) {
      return left.priority - right.priority;
    }
    return left.label.localeCompare(right.label);
  });
}

function getHiddenCardLabel(zoneId: LorcanaZoneId): string {
  return zoneId === "deck" ? m["sim.card.hiddenDeck"]({}) : m["sim.card.hidden"]({});
}

function getCardDisplayName(
  fullName?: string,
  definition?: { name: string; version?: string },
): string | undefined {
  if (fullName) {
    return fullName;
  }

  if (!definition) {
    return undefined;
  }

  return definition.version ? `${definition.name} - ${definition.version}` : definition.name;
}

function normalizeRarity(
  rarity: LorcanaCard["rarity"] | undefined,
): LorcanaCardSnapshot["rarity"] | undefined {
  switch (rarity) {
    case "common":
    case "uncommon":
    case "rare":
    case "super_rare":
    case "legendary":
    case "enchanted":
    case "iconic":
    case "promo":
      return rarity;
    default:
      return undefined;
  }
}

function normalizeZoneId(zoneKey: string | undefined): LorcanaZoneId {
  const baseZone = zoneKey?.split(":", 1)[0];
  switch (baseZone) {
    case "deck":
    case "hand":
    case "play":
    case "inkwell":
    case "discard":
    case "limbo":
      return baseZone;
    default:
      return "deck";
  }
}

function getReadyState(
  meta: Record<string, unknown> | undefined,
): LorcanaCardSnapshot["readyState"] {
  const state = meta?.state;
  return state === "ready" || state === "exerted" ? state : "unknown";
}

function buildSupplementalCardSnapshot(args: {
  board: LorcanaProjectedBoardView;
  staticResources: MatchStaticResources;
  authoritativeState: AuthoritativeCardStateView;
  cardId: string;
}): LorcanaCardSnapshot | null {
  const { board, staticResources, authoritativeState, cardId } = args;
  const definition = getCardDefinition(staticResources, cardId);
  const indexEntry = authoritativeState.ctx.zones.private.cardIndex[cardId];
  const meta = authoritativeState.ctx.zones.private.cardMeta[cardId];
  if (!definition || !indexEntry) {
    return null;
  }

  const ownerId = indexEntry.ownerID;
  const ownerSide = getSideForOwnerId(board, ownerId) ?? "playerOne";
  const zoneId = normalizeZoneId(indexEntry.zoneKey);
  const cardText = definition.text as LocalizedCardTextSource | undefined;

  return {
    cardId,
    definitionId: definition.id ?? staticResources.instances.get(cardId)?.definitionId ?? cardId,
    isMasked: false,
    label: getCardDisplayName(undefined, definition) ?? cardId,
    ownerId,
    ownerSide,
    zoneId,
    cardType: definition.cardType,
    actionSubtype:
      definition.cardType === "action" ? (definition.actionSubtype ?? undefined) : undefined,
    cost: definition.cost,
    playCost: definition.cost,
    shiftInkCost: undefined,
    shiftPlayCost: undefined,
    inkType: definition.inkType,
    inkable: definition.inkable,
    text: flattenCardText(cardText),
    textEntries: projectCardTextEntries(cardText),
    choiceOptionTexts: getLocalizedChoiceOptionTexts(definition),
    strength: definition.cardType === "character" ? definition.strength : undefined,
    baseStrength: definition.cardType === "character" ? definition.strength : undefined,
    willpower:
      definition.cardType === "character" || definition.cardType === "location"
        ? definition.willpower
        : undefined,
    baseWillpower:
      definition.cardType === "character" || definition.cardType === "location"
        ? definition.willpower
        : undefined,
    loreValue:
      definition.cardType === "character" || definition.cardType === "location"
        ? "lore" in definition
          ? definition.lore
          : undefined
        : undefined,
    baseLoreValue:
      definition.cardType === "character" || definition.cardType === "location"
        ? "lore" in definition
          ? definition.lore
          : undefined
        : undefined,
    moveCost: definition.cardType === "location" ? definition.moveCost : undefined,
    classifications: definition.cardType === "character" ? definition.classifications : undefined,
    // Scry-revealed cards still live in the deck and have no projection yet,
    // so derive the keyword list and the entry-mode flag from the definition
    // directly. Without this, a Bodyguard / "may enter play exerted" card
    // revealed via Down in New Orleans would be missed by the simulator's
    // entry-mode detector and the play-into-zone destination toggle would
    // never appear. See PR #73 review feedback (Codex P2).
    keywords: Array.isArray(definition.abilities)
      ? definition.abilities
          .filter((ability) => ability?.type === "keyword")
          .map((ability) => (ability as { keyword: string }).keyword)
          .filter((keyword): keyword is string => typeof keyword === "string")
      : [],
    mayEnterPlayExertedOption: hasMayEnterPlayExertedOption(definition) ? true : undefined,
    damage: typeof meta?.damage === "number" ? meta.damage : 0,
    readyState: getReadyState(meta),
    isDrying: meta?.isDrying === true,
    facePresentation: "faceUp",
    set: definition.set,
    cardNumber: definition.cardNumber,
    rarity: normalizeRarity(definition.rarity),
  };
}

export function mergeSupplementalScryCardSnapshots(args: {
  board: LorcanaProjectedBoardView;
  staticResources: MatchStaticResources;
  authoritativeState: AuthoritativeCardStateView;
  snapshots: CardSnapshotMap;
  viewerPlayerId?: string | null;
}): CardSnapshotMap {
  const { board, staticResources, authoritativeState, snapshots, viewerPlayerId } = args;
  const nextSnapshots: CardSnapshotMap = { ...snapshots };
  const revealedCardIds = new Set<string>();

  for (const effect of [...board.pendingEffects, ...board.bagEffects]) {
    if (effect.selectionContext?.kind !== "scry-selection") {
      continue;
    }

    for (const cardId of effect.selectionContext.revealedCardIds) {
      revealedCardIds.add(cardId);
    }
  }

  if (viewerPlayerId) {
    const shouldRevealViewerInkwell = [...board.pendingEffects, ...board.bagEffects].some(
      (effect) => {
        const context = effect.selectionContext;
        return (
          context?.kind === "target-selection" &&
          context.chooserId === viewerPlayerId &&
          context.allowedZones.includes("inkwell")
        );
      },
    );

    if (shouldRevealViewerInkwell) {
      const viewerInkwellCards = board.players[viewerPlayerId]?.inkwell ?? [];
      for (const cardId of viewerInkwellCards) {
        if (typeof cardId === "string" && cardId.length > 0) {
          revealedCardIds.add(cardId);
        }
      }
    }
  }

  for (const cardId of revealedCardIds) {
    const existingSnapshot = nextSnapshots[cardId];
    if (existingSnapshot && !existingSnapshot.isMasked) {
      continue;
    }

    const snapshot = buildSupplementalCardSnapshot({
      board,
      staticResources,
      authoritativeState,
      cardId,
    });
    if (snapshot) {
      nextSnapshots[cardId] = snapshot;
    }
  }

  return nextSnapshots;
}

function getCardDefinition(
  staticResources: MatchStaticResources,
  cardId: string,
  definitionId?: string,
): LorcanaCardDefinition | undefined {
  const resolvedDefinitionId = definitionId ?? staticResources.instances.get(cardId)?.definitionId;
  return resolvedDefinitionId ? staticResources.cards.get(resolvedDefinitionId) : undefined;
}

export function buildCardSnapshotMap(
  board: LorcanaProjectedBoardView,
  staticResources: MatchStaticResources,
): CardSnapshotMap {
  const snapshots: CardSnapshotMap = {};

  for (const [cardId, projectedCard] of Object.entries(board.cards)) {
    const definition = getCardDefinition(staticResources, cardId, projectedCard.definitionId);
    const ownerSide = getSideForOwnerId(board, projectedCard.ownerId) ?? "playerOne";
    const zoneId = projectedCard.zone;
    const isMasked = projectedCard.hidden === true;
    const readyState =
      projectedCard.exerted === true
        ? "exerted"
        : projectedCard.exerted === false
          ? "ready"
          : "unknown";
    const facePresentation = zoneId === "inkwell" ? (isMasked ? "faceDown" : "faceUp") : "faceUp";
    const cardName = getCardDisplayName(projectedCard.fullName, definition);
    const cardText = definition?.text as LocalizedCardTextSource | undefined;
    const locationCard =
      projectedCard.atLocationId !== undefined
        ? board.cards[projectedCard.atLocationId]
        : undefined;
    const locationDefinition =
      locationCard?.hidden === true || !projectedCard.atLocationId
        ? undefined
        : getCardDefinition(
            staticResources,
            projectedCard.atLocationId,
            locationCard?.definitionId,
          );
    const atLocationLabel = getCardDisplayName(locationCard?.fullName, locationDefinition);

    snapshots[cardId] = {
      cardId,
      atLocationId: projectedCard.atLocationId,
      atLocationLabel,
      baseLoreValue:
        definition?.cardType === "character" || definition?.cardType === "location"
          ? (definition as { lore?: number }).lore
          : undefined,
      baseStrength: definition?.cardType === "character" ? definition.strength : undefined,
      baseWillpower:
        definition?.cardType === "character" || definition?.cardType === "location"
          ? definition.willpower
          : undefined,
      cardNumber: definition?.cardNumber,
      cardType: definition?.cardType,
      actionSubtype:
        definition?.cardType === "action" ? (definition.actionSubtype ?? undefined) : undefined,
      cardsUnderCount: projectedCard.cardsUnder?.length ?? 0,
      faceUpCardsUnder: projectedCard.cardsUnder?.filter(
        (underCardId) => board.cards[underCardId]?.publicFaceState === "faceUp",
      ),
      playedViaShift: projectedCard.playedViaShift === true ? true : undefined,
      classifications:
        definition?.cardType === "character" ? definition.classifications : undefined,
      cost: definition?.cost,
      playCost: projectedCard.playCost ?? definition?.cost,
      shiftInkCost: projectedCard.shiftInkCost,
      shiftPlayCost: projectedCard.shiftPlayCost,
      damage: projectedCard.damage ?? 0,
      definitionId:
        projectedCard.definitionId ??
        definition?.id ??
        staticResources.instances.get(cardId)?.definitionId ??
        cardId,
      facePresentation,
      inkType: definition?.inkType,
      inkable: definition?.inkable,
      isDrying: projectedCard.drying ?? false,
      isMasked,
      hasQuestRestriction: projectedCard.hasQuestRestriction ?? false,
      keywordValues: projectedCard.keywordValues,
      keywords: mergeDerivedKeywordSignals(projectedCard.keywords, projectedCard),
      mayEnterPlayExertedOption:
        definition !== undefined && hasMayEnterPlayExertedOption(definition) ? true : undefined,
      label: isMasked ? getHiddenCardLabel(zoneId) : (cardName ?? m["sim.card.unknown"]({})),
      loreValue:
        definition?.cardType === "character" || definition?.cardType === "location"
          ? (projectedCard.lore ?? (definition as { lore?: number }).lore)
          : undefined,
      moveCost:
        definition?.cardType === "location"
          ? (projectedCard.moveCost ?? definition.moveCost)
          : undefined,
      ownerId: String(projectedCard.ownerId),
      ownerSide,
      rarity: normalizeRarity(definition?.rarity),
      readyState,
      set: definition?.set,
      strength: definition?.cardType === "character" ? projectedCard.strength : undefined,
      temporaryRestrictions: projectedCard.temporaryRestrictions,
      grantSources: buildGrantSources(cardId, projectedCard, staticResources),
      text: flattenCardText(cardText),
      textEntries: mergeTextEntries(
        projectCardTextEntries(cardText),
        projectedCard.grantedAbilityTextEntries,
      ),
      choiceOptionTexts: definition ? getLocalizedChoiceOptionTexts(definition) : undefined,
      willpower:
        definition?.cardType === "character" || definition?.cardType === "location"
          ? projectedCard.willpower
          : undefined,
      zoneId,
    };
  }

  const cardEffectsById = new Map<string, LorcanaActiveEffectSummary[]>();
  for (const effect of board.activeEffects ?? []) {
    if (!effect.targetCardId) {
      continue;
    }

    const summary = summarizeProjectedActiveEffect({
      board,
      staticResources,
      effect,
    });
    if (!summary) {
      continue;
    }

    const targetEffects = cardEffectsById.get(effect.targetCardId) ?? [];
    targetEffects.push(summary);
    cardEffectsById.set(effect.targetCardId, targetEffects);
  }

  for (const card of Object.values(snapshots)) {
    card.activeEffects = dedupeAndSortEffects([
      ...(cardEffectsById.get(card.cardId) ?? []),
      ...summarizeGrantEffects(card),
    ]);
  }

  return snapshots;
}

export function getCardsForZone(
  cardSnapshotsById: CardSnapshotMap,
  board: LorcanaProjectedBoardView,
  playerSide: LorcanaPlayerSide,
  zoneId: LorcanaZoneId,
): LorcanaCardSnapshot[] {
  return getZoneCardIds(board, playerSide, zoneId)
    .map((cardId) => cardSnapshotsById[cardId] ?? null)
    .filter((card): card is LorcanaCardSnapshot => card !== null);
}

export function findCardById(
  cardSnapshotsById: CardSnapshotMap,
  cardId: string | null,
): LorcanaCardSnapshot | null {
  if (!cardId) {
    return null;
  }

  return cardSnapshotsById[cardId] ?? null;
}
