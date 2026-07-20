import type { Card } from "@tcg/gundam-types";

import type { BoardProjection } from "../../game/index.ts";
import type {
  ActiveEffectEntry,
  CardColor,
  CardType,
  GameCardData,
  KeywordEffectEntry,
} from "../ui/types.ts";

const CARD_COLORS: ReadonlySet<CardColor> = new Set(["blue", "green", "red", "white", "purple"]);
const KEYWORD_EFFECTS: ReadonlySet<KeywordEffectEntry["keyword"]> = new Set([
  "Repair",
  "Breach",
  "Support",
  "Blocker",
  "FirstStrike",
  "HighManeuver",
  "Suppression",
]);

/**
 * Narrow an arbitrary string to a `CardColor`, returning `undefined` for
 * unknown values. Engine card definitions already use these names, so this
 * is effectively a type guard at the UI boundary.
 */
export function asCardColor(color: string | undefined | null): CardColor | undefined {
  if (!color) return undefined;
  return CARD_COLORS.has(color as CardColor) ? (color as CardColor) : undefined;
}

type FilteredCardView = BoardProjection["zones"]["zones"][string]["cards"][number];

interface GundamGLike {
  damage?: Record<string, number>;
  continuousEffects?: ContinuousEffectLike[];
  /** Map of unitInstanceId → pairedPilotInstanceId. Used by the seat to
   *  fold paired pilots into their host unit instead of rendering them
   *  as standalone cards in the play zone. */
  pilotAssignments?: Record<string, string>;
}

interface ContinuousEffectLike {
  id: string;
  sourceId: string;
  targetId: string;
  payload: ContinuousPayloadLike;
  duration?: string;
  createdAtTurn?: number;
}

type ContinuousPayloadLike =
  | { kind: "stat-modifier"; stat?: string; modifier?: number }
  | { kind: "keyword-grant"; keyword?: string }
  | { kind: "restriction"; restriction?: string }
  | { kind: string; [key: string]: unknown };

const CONTINUOUS_EFFECT_LABELS: Record<string, (p: ContinuousPayloadLike) => string> = {
  "stat-modifier": (p) => {
    const payload = p as { stat?: string; modifier?: number };
    const stat = payload.stat === "ap" ? "AP" : payload.stat === "hp" ? "HP" : "Stat";
    const mod = payload.modifier ?? 0;
    return `${stat} ${mod >= 0 ? "+" : ""}${mod}`;
  },
  "keyword-grant": (p) => {
    const payload = p as { keyword?: string };
    return `Grant: ${payload.keyword ?? "Keyword"}`;
  },
  restriction: () => "Restriction",
  "prevent-damage": () => "Prevent Damage",
  "prevent-damage-to-zone": () => "Prevent Damage to Zone",
  "force-attack-target": () => "Force Attack Target",
  "grant-attack-target-option": () => "Grant Attack Target",
};

export function toGameCardData(view: BoardProjection, card: FilteredCardView): GameCardData {
  const g = view.G as GundamGLike;
  const damageMap = g.damage ?? {};
  const damage = damageMap[card.instanceId] ?? 0;

  if (!card.definition || card.faceDown) {
    return { id: card.instanceId, name: "?", faceDown: true, damage };
  }
  const def = card.definition as Card;
  const meta = card.meta;
  const exhausted = typeof meta?.exhausted === "boolean" ? meta.exhausted : false;
  const isUnit = def.type === "unit";
  const isBase = def.type === "base";

  const defAp = isUnit ? ((def as { ap?: number }).ap ?? null) : null;
  const defHp = isUnit || isBase ? ((def as { hp?: number }).hp ?? null) : null;

  const { effectiveAp, effectiveHp } = computeEffectiveStatsForCard({
    view,
    g,
    instanceId: card.instanceId,
    definition: def,
    meta,
    baseAp: defAp,
    baseHp: defHp,
  });

  const grantedKeywords = (meta as { grantedKeywords?: string[] } | null)?.grantedKeywords;
  const effectiveKeywordEffects = effectiveKeywordEffectsFromMeta(meta);

  const activeEffects = extractActiveEffects(view, g, card.instanceId);
  const deployedThisTurn =
    (meta as { deployedThisTurn?: boolean } | null)?.deployedThisTurn === true;
  const imageUrl = cardImageUrlOf(def);
  // Synthetic tokens have no real printing. Suppress the ordinary
  // set/card-number CDN fallback so the simulator renders its usable card
  // fallback instead of requesting a guaranteed-nonexistent token URL.
  const tokenWithoutPrintedArt = isUnprintedTokenMeta(meta);
  const cardWithoutPrintedArt = tokenWithoutPrintedArt || explicitlyDeclaresNoCardImage(def);

  const restrictions = collectRestrictions(g, card.instanceId);
  const linkCondition = (def as { linkCondition?: string }).linkCondition;
  const isLinkUnit = isUnit && Boolean(linkCondition);
  // `cantAttack` fires for both effect-driven restrictions AND the
  // deploy-sickness rule (3-2-4: a non-Link unit cannot attack the turn
  // it is deployed). Keeping the two causes merged here means the
  // `cant-attack` chip appears whenever the engine would reject an
  // attack move, and `card-tags.ts` can still disambiguate the tooltip
  // via `deployedThisTurn && !isLinkUnit`.
  const cantAttack =
    isUnit && (restrictions.has("cannot-attack") || (deployedThisTurn && !isLinkUnit));
  const cantBlock = isUnit && restrictions.has("cannot-block");
  // Mirrors `canAttack()` in packages/engine/.../derived-state.ts without
  // requiring a full CardReadAPI at the UI boundary. Sufficient for the UI
  // cue — the engine remains source of truth for actual move legality.
  const canAttackThisTurn = isUnit ? !exhausted && !cantAttack : undefined;

  return {
    id: card.instanceId,
    name: def.name,
    subtitle: subtitleForCard(def),
    color: asCardColor((def as { color?: string }).color),
    cost: def.cost,
    level: def.level,
    cardType: def.type as CardType,
    ap: effectiveAp,
    hp: effectiveHp,
    baseAp: defAp,
    baseHp: defHp,
    damage,
    effect: def.effect,
    keywords:
      effectiveKeywordEffects ?? ((def.keywordEffects ?? []) as readonly KeywordEffectEntry[]),
    grantedKeywords,
    traits: def.traits ?? [],
    battlefieldZones: def.type === "unit" || def.type === "base" ? def.battlefieldZones : undefined,
    set: cardWithoutPrintedArt ? undefined : setOf(def),
    cardNumber: def.cardNumber,
    img: cardWithoutPrintedArt ? undefined : imageUrl,
    linkRequirement: linkCondition,
    rarity: def.rarity,
    exerted: exhausted,
    activeEffects,
    deployedThisTurn,
    canAttackThisTurn,
    cantAttack,
    cantBlock,
    isLinkUnit,
    zoneId: card.zoneId,
  };
}

function effectiveKeywordEffectsFromMeta(meta: unknown): readonly KeywordEffectEntry[] | undefined {
  if (typeof meta !== "object" || meta === null || !("effectiveKeywordEffects" in meta)) {
    return undefined;
  }
  const value = meta.effectiveKeywordEffects;
  if (!Array.isArray(value)) return undefined;

  const entries: KeywordEffectEntry[] = [];
  for (const candidate of value) {
    if (typeof candidate !== "object" || candidate === null || !("keyword" in candidate)) {
      return undefined;
    }
    if (
      typeof candidate.keyword !== "string" ||
      !KEYWORD_EFFECTS.has(candidate.keyword as KeywordEffectEntry["keyword"])
    ) {
      return undefined;
    }
    if (
      "value" in candidate &&
      candidate.value !== undefined &&
      (typeof candidate.value !== "number" || !Number.isFinite(candidate.value))
    ) {
      return undefined;
    }
    entries.push({
      keyword: candidate.keyword as KeywordEffectEntry["keyword"],
      ...("value" in candidate && candidate.value !== undefined
        ? { value: candidate.value as number }
        : {}),
    });
  }
  return entries;
}

function isUnprintedTokenMeta(value: unknown): boolean {
  if (typeof value !== "object" || value === null || !("isToken" in value)) return false;
  if (value.isToken !== true || !("tokenSpec" in value)) return false;
  const tokenSpec = value.tokenSpec;
  return (
    typeof tokenSpec === "object" &&
    tokenSpec !== null &&
    (!("printedCardNumber" in tokenSpec) || typeof tokenSpec.printedCardNumber !== "string")
  );
}

function computeEffectiveStatsForCard({
  view,
  g,
  instanceId,
  definition,
  meta,
  baseAp,
  baseHp,
}: {
  readonly view: BoardProjection;
  readonly g: GundamGLike;
  readonly instanceId: string;
  readonly definition: Card;
  readonly meta: unknown;
  readonly baseAp: number | null;
  readonly baseHp: number | null;
}): { readonly effectiveAp: number | null; readonly effectiveHp: number | null } {
  let effectiveAp = baseAp;
  let effectiveHp = baseHp;

  if (definition.type === "unit") {
    const pilotId = g.pilotAssignments?.[instanceId];
    const pilotDef = pilotId ? findCardByInstanceId(view, pilotId)?.definition : undefined;
    const pilotBonus = getPairedPilotBonus(pilotDef as Card | undefined);
    if (pilotBonus) {
      effectiveAp = addNullable(effectiveAp, pilotBonus.ap);
      effectiveHp = addNullable(effectiveHp, pilotBonus.hp);
    }

    for (const effect of g.continuousEffects ?? []) {
      if (effect.targetId !== instanceId || effect.payload.kind !== "stat-modifier") continue;
      const stat = (effect.payload as { stat?: string }).stat;
      const modifier = (effect.payload as { modifier?: number }).modifier ?? 0;
      if (stat === "ap") effectiveAp = addNullable(effectiveAp, modifier);
      if (stat === "hp") effectiveHp = addNullable(effectiveHp, modifier);
    }
  }

  const apModifier = (meta as { apModifier?: number } | null)?.apModifier ?? 0;
  const hpModifier = (meta as { hpModifier?: number } | null)?.hpModifier ?? 0;
  effectiveAp = addNullable(effectiveAp, apModifier);
  effectiveHp = addNullable(effectiveHp, hpModifier);

  if (definition.type === "unit") {
    effectiveAp = effectiveAp === null ? null : Math.max(0, effectiveAp);
    effectiveHp = effectiveHp === null ? null : Math.max(1, effectiveHp);
  }

  return { effectiveAp, effectiveHp };
}

function getPairedPilotBonus(pilotDef: Card | undefined): {
  readonly ap: number;
  readonly hp: number;
} | null {
  if (!pilotDef) return null;
  if (pilotDef.type === "pilot") {
    return {
      ap: (pilotDef as { apBonus?: number }).apBonus ?? 0,
      hp: (pilotDef as { hpBonus?: number }).hpBonus ?? 0,
    };
  }
  if (pilotDef.type === "command" && pilotDef.pilotName !== undefined) {
    return {
      ap: pilotDef.apBonus ?? 0,
      hp: pilotDef.hpBonus ?? 0,
    };
  }
  return null;
}

function addNullable(value: number | null, amount: number): number | null {
  return value === null ? null : value + amount;
}

function collectRestrictions(g: GundamGLike, instanceId: string): ReadonlySet<string> {
  const effects = g.continuousEffects;
  if (!effects || effects.length === 0) return new Set();
  const out = new Set<string>();
  for (const e of effects) {
    if (e.targetId !== instanceId) continue;
    if (e.payload.kind !== "restriction") continue;
    const r = (e.payload as { restriction?: string }).restriction;
    if (r) out.add(r);
  }
  return out;
}

function extractActiveEffects(
  view: BoardProjection,
  g: GundamGLike,
  instanceId: string,
): readonly ActiveEffectEntry[] {
  const effects = g.continuousEffects;
  if (!effects || effects.length === 0) return [];

  const matched = effects.filter((e) => e.targetId === instanceId);
  if (matched.length === 0) return [];

  return matched.map((e) => {
    const labeler = CONTINUOUS_EFFECT_LABELS[e.payload.kind];
    const source = findCardByInstanceId(view, e.sourceId);
    const sourceDef = source?.definition as Card | undefined;
    const keyword =
      e.payload.kind === "keyword-grant" ? (e.payload as { keyword?: string }).keyword : undefined;
    return {
      sourceId: e.sourceId,
      kind: e.payload.kind,
      ...(keyword ? { keyword } : {}),
      description: labeler ? labeler(e.payload) : e.payload.kind,
      duration: e.duration,
      sourceLabel: sourceDef?.name,
      sourceSet: sourceDef ? setOf(sourceDef) : undefined,
      sourceCardNumber: sourceDef?.cardNumber,
    };
  });
}

function setOf(def: Card): string | undefined {
  const selectedPrinting = selectedPrintingOf(def);
  const selectedSet = selectedPrinting?.set?.code ?? def.set?.code;
  if (selectedSet) return selectedSet.toLowerCase();

  const prefix = def.cardNumber.split("-")[0];
  return prefix ? prefix.toLowerCase() : undefined;
}

export function cardImageUrlOf(def: Card): string | undefined {
  const selectedPrinting = selectedPrintingOf(def);
  return (
    printingImageUrlOf(selectedPrinting) ??
    def.imageUrl ??
    printingImageUrlOf(def.printings?.find((printing) => printingImageUrlOf(printing)))
  );
}

function explicitlyDeclaresNoCardImage(def: Card): boolean {
  // Printed T-series Unit tokens deliberately omit imageUrl in token-data,
  // but their art is published at the canonical /cards/t/T-### path.
  // Preserve the set/card-number fallback for those printed tokens.
  if (/^T-\d+$/iu.test(def.cardNumber)) return false;

  const selectedPrinting = selectedPrintingOf(def);
  const selectedImage = rawPrintingImageUrlOf(selectedPrinting);
  const definitionImage = typeof def.imageUrl === "string" ? def.imageUrl.trim() : undefined;
  const hasAlternativeArt = def.printings?.some((printing) =>
    Boolean(printingImageUrlOf(printing)),
  );

  return !hasAlternativeArt && (selectedImage === "" || definitionImage === "");
}

function selectedPrintingOf(def: Card) {
  const selectedId = def.selectedPrintingId;
  if (selectedId) {
    const selected = def.printings?.find((printing) => printingIdOf(printing) === selectedId);
    if (selected) return selected;
  }
  return def.printings?.[0];
}

function printingIdOf(printing: unknown): string | undefined {
  return typeof printing === "object" && printing !== null && "id" in printing
    ? typeof printing.id === "string"
      ? printing.id
      : undefined
    : undefined;
}

function printingImageUrlOf(printing: unknown): string | undefined {
  const imageUrl = rawPrintingImageUrlOf(printing);
  return imageUrl ? imageUrl : undefined;
}

function rawPrintingImageUrlOf(printing: unknown): string | undefined {
  return typeof printing === "object" && printing !== null && "imageUrl" in printing
    ? typeof printing.imageUrl === "string"
      ? printing.imageUrl.trim()
      : undefined
    : undefined;
}

function subtitleForCard(def: Card): string {
  const traits = (def.traits ?? []).slice(0, 2).join(" · ");
  const type = def.type.toUpperCase();
  return traits ? `${type} · ${traits}` : type;
}

export function mapZone(view: BoardProjection, zone: string, playerId: string): FilteredCardView[] {
  const z = view.zones.zones[`${zone}:${playerId}`];
  return z ? [...z.cards] : [];
}

export function zoneCount(view: BoardProjection, zone: string, playerId: string): number {
  return view.zones.zones[`${zone}:${playerId}`]?.count ?? 0;
}

export function countActiveResources(view: BoardProjection, playerId: string): number {
  const zone = view.zones.zones[`resourceArea:${playerId}`];
  if (!zone) return 0;
  return zone.cards.filter((c) => !(c.meta?.exhausted === true)).length;
}

export function resolveOpponentId(view: BoardProjection, viewerId: string): string | null {
  for (const p of view.players) {
    const pid = String(p.playerId);
    if (pid !== viewerId) return pid;
  }
  return null;
}

export function findCardByInstanceId(
  view: BoardProjection,
  instanceId: string,
): FilteredCardView | null {
  for (const zone of Object.values(view.zones.zones)) {
    for (const card of zone.cards) {
      if (card.instanceId === instanceId) return card;
    }
  }
  return null;
}
