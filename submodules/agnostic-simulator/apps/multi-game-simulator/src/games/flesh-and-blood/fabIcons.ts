/**
 * Flesh and Blood iconography catalog.
 *
 * Layering policy:
 * 1. **Official game symbols** (power, defense, resource, life, intellect, chi,
 *    tap/untap, pitch gems, cost) — assets from TheCardGoat/assets PR #87,
 *    vendored under `./assets/icons/` so local/dev works before CDN sync.
 * 2. **Keyword icons** — FAB prints keywords as bold text, not official glyphs.
 *    We map each combat-relevant keyword to a stable Lucide icon + short code
 *    so chain links stay scannable. When custom keyword art is added under
 *    `public/fab/simulator/icons/keywords/`, resolve it here first.
 * 3. **UI chrome** (steps, menus, zone drawers) — keep Lucide / Tabler as-is.
 *
 * CDN mirror (production, once R2 syncs):
 *   https://cdn.tcg.online/public/fab/simulator/icons/{name}.{svg|webp}
 */

import type { LucideIcon } from "lucide-react";
import {
  Anchor,
  Ban,
  BadgeAlert,
  Blend,
  Blocks,
  Box,
  CircleDotDashed,
  CircleGauge,
  Combine,
  Crown,
  Dices,
  Droplets,
  Eye,
  EyeOff,
  Feather,
  Flame,
  Footprints,
  Gem,
  Ghost,
  Hammer,
  Hand,
  HandCoins,
  HeartHandshake,
  KeyRound,
  Layers,
  Link2,
  Mountain,
  Orbit,
  Redo2,
  RefreshCw,
  Rocket,
  Scale,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldMinus,
  ShieldOff,
  ShieldQuestion,
  Skull,
  Snowflake,
  Sparkles,
  Split,
  Star,
  Swords,
  Timer,
  Unplug,
  Waves,
  Wind,
  Wrench,
  Zap,
  createLucideIcon,
} from "lucide-react";

/** Official / Card Vault support icons shipped with the simulator. */
export type FabOfficialIconId =
  | "power"
  | "defense"
  | "resource"
  | "life"
  | "intellect"
  | "chi"
  | "tap"
  | "untap"
  | "cost"
  | "pitch-1"
  | "pitch-2"
  | "pitch-3"
  | "pitch-4";

const OFFICIAL_ICON_EXT: Record<FabOfficialIconId, "svg" | "webp"> = {
  power: "svg",
  defense: "svg",
  resource: "svg",
  life: "svg",
  intellect: "svg",
  chi: "svg",
  tap: "svg",
  untap: "svg",
  cost: "webp",
  "pitch-1": "webp",
  "pitch-2": "webp",
  "pitch-3": "webp",
  "pitch-4": "webp",
};

/** Bundled copies for offline / onError fallback (from TheCardGoat/assets PR #87). */
const OFFICIAL_ICON_LOCAL: Record<FabOfficialIconId, string> = {
  power: new URL("./assets/icons/power.svg", import.meta.url).href,
  defense: new URL("./assets/icons/defense.svg", import.meta.url).href,
  resource: new URL("./assets/icons/resource.svg", import.meta.url).href,
  life: new URL("./assets/icons/life.svg", import.meta.url).href,
  intellect: new URL("./assets/icons/intellect.svg", import.meta.url).href,
  chi: new URL("./assets/icons/chi.svg", import.meta.url).href,
  tap: new URL("./assets/icons/tap.svg", import.meta.url).href,
  untap: new URL("./assets/icons/untap.svg", import.meta.url).href,
  cost: new URL("./assets/icons/cost.webp", import.meta.url).href,
  "pitch-1": new URL("./assets/icons/pitch-1.webp", import.meta.url).href,
  "pitch-2": new URL("./assets/icons/pitch-2.webp", import.meta.url).href,
  "pitch-3": new URL("./assets/icons/pitch-3.webp", import.meta.url).href,
  "pitch-4": new URL("./assets/icons/pitch-4.webp", import.meta.url).href,
};

/**
 * Production CDN base. Support icons (power/defense/life/resource/pitch/…) are
 * published under this path. Card art is separate and not assumed to be online.
 */
export const FAB_ICON_CDN_BASE = "https://cdn.tcg.online/public/fab/simulator/icons";

export function fabOfficialIconCdnUrl(id: FabOfficialIconId): string {
  return `${FAB_ICON_CDN_BASE}/${id}.${OFFICIAL_ICON_EXT[id]}`;
}

export function fabOfficialIconLocalUrl(id: FabOfficialIconId): string {
  return OFFICIAL_ICON_LOCAL[id];
}

/** Prefer CDN (live after assets R2 sync); callers can fall back to local. */
export function fabOfficialIconUrl(id: FabOfficialIconId): string {
  return fabOfficialIconCdnUrl(id);
}

export function fabPitchIconId(pitch: number): FabOfficialIconId | null {
  if (pitch === 1) return "pitch-1";
  if (pitch === 2) return "pitch-2";
  if (pitch === 3) return "pitch-3";
  if (pitch === 4) return "pitch-4";
  return null;
}

/**
 * Normalize engine / catalog keyword tokens to a stable slug.
 * Accepts "Go Again", "go again", "go-again", "go_again".
 */
export function normalizeFabKeyword(keyword: string): string {
  return keyword
    .trim()
    .toLocaleLowerCase()
    .replace(/[_]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export interface FabKeywordIconDef {
  /** Stable slug, e.g. `go-again`. */
  readonly id: string;
  /** Player-facing label. */
  readonly label: string;
  /** Compact code for dense mobile chips. */
  readonly shortCode: string;
  /** Lucide glyph used until/unless custom keyword art exists. */
  readonly Lucide: LucideIcon;
  /** Tooltip / aria description (rules-facing, condensed). */
  readonly hint: string;
  /**
   * Priority on the combat chain: lower = more important / shown first.
   * Unlisted keywords sort after known ones alphabetically.
   */
  readonly chainPriority: number;
  /** Whether this keyword is typically meaningful on an attack chain link. */
  readonly combatRelevant: boolean;
}

function keywordIcon(
  id: string,
  label: string,
  shortCode: string,
  Lucide: LucideIcon,
  chainPriority = 250,
  combatRelevant = true,
  hint = `${label}: see this card's rules text`,
): FabKeywordIconDef {
  return { id, label, shortCode, Lucide, hint, chainPriority, combatRelevant };
}

/** A strike crossing the target boundary and producing a triggered effect. */
const FabOnHit = createLucideIcon("fab-on-hit", [
  ["path", { d: "M3 12h8", key: "strike" }],
  ["path", { d: "m8 9 3 3-3 3", key: "strike-head" }],
  ["circle", { cx: "15", cy: "12", r: "4", key: "target" }],
  ["path", { d: "M15 5V3", key: "impact-top" }],
  ["path", { d: "m20 7 1.5-1.5", key: "impact-upper" }],
  ["path", { d: "M22 12h-2", key: "impact-right" }],
  ["path", { d: "m20 17 1.5 1.5", key: "impact-lower" }],
  ["path", { d: "M15 19v2", key: "impact-bottom" }],
]);

/**
 * Canonical keyword → icon mapping.
 * Keep in sync with glossary + combat-link keyword projection.
 */
export const FAB_KEYWORD_ICONS: Readonly<Record<string, FabKeywordIconDef>> = {
  "on-hit": {
    id: "on-hit",
    label: "On-hit effect",
    shortCode: "HIT",
    Lucide: FabOnHit,
    hint: "On-hit effect: this attack has text that applies when it hits the defending hero",
    chainPriority: 5,
    combatRelevant: true,
  },
  "go-again": {
    id: "go-again",
    label: "Go again",
    shortCode: "GA",
    Lucide: Redo2,
    hint: "Go again: gain an action point when this chain link resolves",
    chainPriority: 10,
    combatRelevant: true,
  },
  dominate: {
    id: "dominate",
    label: "Dominate",
    shortCode: "DOM",
    Lucide: Crown,
    hint: "Dominate: the defending hero cannot defend with more than one card from hand",
    chainPriority: 20,
    combatRelevant: true,
  },
  overpower: {
    id: "overpower",
    label: "Overpower",
    shortCode: "OP",
    Lucide: Hammer,
    hint: "Overpower: the defending hero cannot defend with more than one action card",
    chainPriority: 30,
    combatRelevant: true,
  },
  phantasm: {
    id: "phantasm",
    label: "Phantasm",
    shortCode: "PHA",
    Lucide: Ghost,
    hint: "Phantasm: attack is destroyed if defended by an attack action with 6+ power",
    chainPriority: 40,
    combatRelevant: true,
  },
  crush: {
    id: "crush",
    label: "Crush",
    shortCode: "CR",
    Lucide: Mountain,
    hint: "Crush: triggers when this attack deals 4 or more damage",
    chainPriority: 50,
    combatRelevant: true,
  },
  intimidate: {
    id: "intimidate",
    label: "Intimidate",
    shortCode: "INT",
    Lucide: EyeOff,
    hint: "Intimidate: banish a card from hand face down until end of turn",
    chainPriority: 60,
    combatRelevant: true,
  },
  wager: {
    id: "wager",
    label: "Wager",
    shortCode: "WAG",
    Lucide: HandCoins,
    hint: "Wager: the attack controller wins the prize if it hits; otherwise the other player wins it",
    chainPriority: 65,
    combatRelevant: true,
  },
  clash: keywordIcon(
    "clash",
    "Clash",
    "CLA",
    Scale,
    66,
    true,
    "Clash: players reveal the top card of their deck and compare power",
  ),
  ambush: keywordIcon(
    "ambush",
    "Ambush",
    "AMB",
    ShieldQuestion,
    67,
    true,
    "Ambush: this card can be declared as a defender from arsenal",
  ),
  specialization: {
    id: "specialization",
    label: "Specialization",
    shortCode: "SPE",
    Lucide: Star,
    hint: "Specialization: this card can only be included with the named hero",
    chainPriority: 190,
    combatRelevant: false,
  },
  boost: {
    id: "boost",
    label: "Boost",
    shortCode: "BST",
    Lucide: Rocket,
    hint: "Boost: optional additional cost; gain go again if the banished card is Mechanologist",
    chainPriority: 70,
    combatRelevant: true,
  },
  stealth: {
    id: "stealth",
    label: "Stealth",
    shortCode: "STL",
    Lucide: Eye,
    hint: "Stealth: attack keyword used by Assassin / Draconic stealth packages",
    chainPriority: 80,
    combatRelevant: true,
  },
  combo: {
    id: "combo",
    label: "Combo",
    shortCode: "CMB",
    Lucide: Link2,
    hint: "Combo: attack gains additional effects when the named preceding attack resolved",
    chainPriority: 90,
    combatRelevant: true,
  },
  battleworn: {
    id: "battleworn",
    label: "Battleworn",
    shortCode: "BW",
    Lucide: ShieldMinus,
    hint: "Battleworn: equipment gains a −1 defense counter after defending",
    chainPriority: 100,
    combatRelevant: true,
  },
  "blade-break": {
    id: "blade-break",
    label: "Blade Break",
    shortCode: "BB",
    Lucide: ShieldOff,
    hint: "Blade Break: destroy this equipment after it is used to defend",
    chainPriority: 110,
    combatRelevant: true,
  },
  temper: {
    id: "temper",
    label: "Temper",
    shortCode: "TMP",
    Lucide: ShieldAlert,
    hint: "Temper: equipment gains −1 defense after defending; destroyed at 0 defense",
    chainPriority: 120,
    combatRelevant: true,
  },
  ward: {
    id: "ward",
    label: "Ward",
    shortCode: "WRD",
    Lucide: Sparkles,
    hint: "Ward: destroy this card to prevent damage to your hero",
    chainPriority: 130,
    combatRelevant: false,
  },
  quell: {
    id: "quell",
    label: "Quell",
    shortCode: "QUE",
    Lucide: Hand,
    hint: "Quell: pay resources to prevent damage; may destroy this later in the end phase",
    chainPriority: 140,
    combatRelevant: false,
  },
  "arcane-barrier": {
    id: "arcane-barrier",
    label: "Arcane Barrier",
    shortCode: "AB",
    Lucide: Shield,
    hint: "Arcane Barrier: pay resources to prevent arcane damage to your hero",
    chainPriority: 150,
    combatRelevant: false,
  },
  spellvoid: {
    id: "spellvoid",
    label: "Spellvoid",
    shortCode: "SV",
    Lucide: Ban,
    hint: "Spellvoid: destroy this object to prevent arcane damage to your hero",
    chainPriority: 160,
    combatRelevant: false,
  },
  "blood-debt": {
    id: "blood-debt",
    label: "Blood Debt",
    shortCode: "BD",
    Lucide: Skull,
    hint: "Blood Debt: at the beginning of your end phase, lose 1 life if this is banished",
    chainPriority: 170,
    combatRelevant: false,
  },
  legendary: {
    id: "legendary",
    label: "Legendary",
    shortCode: "LEG",
    Lucide: Star,
    hint: "Legendary: only one copy may be included in a deck",
    chainPriority: 200,
    combatRelevant: false,
  },
  reload: {
    id: "reload",
    label: "Reload",
    shortCode: "RLD",
    Lucide: RefreshCw,
    hint: "Reload: if your arsenal is empty, you may put a card from hand into it",
    chainPriority: 180,
    combatRelevant: false,
  },
  opt: {
    id: "opt",
    label: "Opt",
    shortCode: "OPT",
    Lucide: Layers,
    hint: "Opt: look at the top cards of your deck and put each on top or bottom",
    chainPriority: 190,
    combatRelevant: false,
  },
  fusion: {
    id: "fusion",
    label: "Fusion",
    shortCode: "FUS",
    Lucide: Swords,
    hint: "Fusion: reveal cards with the specified talent(s) for this card to be fused",
    chainPriority: 195,
    combatRelevant: false,
  },
  amp: keywordIcon("amp", "Amp", "AMP", Zap, 205),
  "arcane-shelter": keywordIcon("arcane-shelter", "Arcane Shelter", "AS", ShieldCheck, 151, false),
  piercing: keywordIcon("piercing", "Piercing", "PIE", Unplug, 35),
  guardwell: keywordIcon("guardwell", "Guardwell", "GW", ShieldCheck, 125),
  mirage: keywordIcon("mirage", "Mirage", "MIR", Ghost, 42),
  spectra: keywordIcon("spectra", "Spectra", "SPC", Orbit, 43),
  ephemeral: keywordIcon("ephemeral", "Ephemeral", "EPH", Feather, 44),
  "watery-grave": keywordIcon("watery-grave", "Watery Grave", "WG", Waves, 175, false),
  suspense: keywordIcon("suspense", "Suspense", "SUS", Timer, 176, false),
  crank: keywordIcon("crank", "Crank", "CRK", Wrench, 72),
  universal: keywordIcon("universal", "Universal", "UNI", Blocks, 210, false),
  cloaked: keywordIcon("cloaked", "Cloaked", "CLK", EyeOff, 211, false),
  protect: keywordIcon("protect", "Protect", "PRO", HeartHandshake, 126),
  modular: keywordIcon("modular", "Modular", "MOD", Blocks, 212, false),
  perched: keywordIcon("perched", "Perched", "PER", Feather, 213, false),
  "rune-gate": keywordIcon("rune-gate", "Rune Gate", "RG", KeyRound, 73),
  scrap: keywordIcon("scrap", "Scrap", "SCR", Wrench, 74),
  "beat-chest": keywordIcon("beat-chest", "Beat Chest", "BC", CircleGauge, 75),
  meld: keywordIcon("meld", "Meld", "MEL", Blend, 76),
  fragment: keywordIcon("fragment", "Fragment", "FRA", Split, 77),
  usurp: keywordIcon("usurp", "Usurp", "USU", Crown, 214, false),
  decay: keywordIcon("decay", "Decay", "DEC", Skull, 215, false),
  incarnate: keywordIcon("incarnate", "Incarnate", "INC", Flame, 216, false),
  traverse: keywordIcon("traverse", "Traverse", "TRA", Footprints, 217, false),
  unique: keywordIcon("unique", "Unique", "UNQ", Gem, 218, false),
  sharpen: keywordIcon("sharpen", "Sharpen", "SHP", Swords, 78),
  awaken: keywordIcon("awaken", "Awaken", "AWK", Flame, 79),
  heave: keywordIcon("heave", "Heave", "HEA", Mountain, 80),
  unlimited: keywordIcon("unlimited", "Unlimited", "UNL", Combine, 219, false),
  essence: keywordIcon("essence", "Essence", "ESS", Droplets, 220, false),
  pairs: keywordIcon("pairs", "Pairs", "PAI", Link2, 221, false),
  "label-keyword": keywordIcon("label-keyword", "Ability label", "ABL", BadgeAlert, 222, false),

  // Authored effect / label keywords emitted by the static presentation catalog.
  transform: keywordIcon("transform", "Transform", "TRN", RefreshCw),
  charge: keywordIcon("charge", "Charge", "CHG", Rocket),
  surge: keywordIcon("surge", "Surge", "SRG", Zap),
  contract: keywordIcon("contract", "Contract", "CON", HandCoins),
  mark: keywordIcon("mark", "Mark", "MRK", CircleDotDashed),
  "the-crowd-cheers": keywordIcon("the-crowd-cheers", "The Crowd Cheers", "CHE", Star),
  "the-crowd-boos": keywordIcon("the-crowd-boos", "The Crowd Boos", "BOO", EyeOff),
  galvanize: keywordIcon("galvanize", "Galvanize", "GAL", Wrench),
  reprise: keywordIcon("reprise", "Reprise", "REP", Redo2),
  "evo-upgrade": keywordIcon("evo-upgrade", "Evo Upgrade", "EVO", Wrench),
  decompose: keywordIcon("decompose", "Decompose", "DCP", Skull),
  quickstrike: keywordIcon("quickstrike", "Quickstrike", "QST", Zap),
  starfall: keywordIcon("starfall", "Starfall", "STF", Star),
  steal: keywordIcon("steal", "Steal", "STL", Hand),
  transcend: keywordIcon("transcend", "Transcend", "TRS", Orbit),
  unity: keywordIcon("unity", "Unity", "UNT", Combine),
  "high-tide": keywordIcon("high-tide", "High Tide", "HT", Waves),
  channel: keywordIcon("channel", "Channel", "CHN", Waves),
  bond: keywordIcon("bond", "Bond", "BND", Link2),
  binds: keywordIcon("binds", "Binds", "BND", Link2, 221, false),
  flow: keywordIcon("flow", "Flow", "FLW", Wind),
  negate: keywordIcon("negate", "Negate", "NEG", Ban),
  material: keywordIcon("material", "Material", "MAT", Box),
  freeze: keywordIcon("freeze", "Freeze", "FRZ", Snowflake),
  tower: keywordIcon("tower", "Tower", "TOW", Mountain),
  retrieve: keywordIcon("retrieve", "Retrieve", "RET", Anchor),
  rupture: keywordIcon("rupture", "Rupture", "RUP", Split),
  solflare: keywordIcon("solflare", "Solflare", "SOL", Flame),
  "go-fish": keywordIcon("go-fish", "Go Fish", "GF", Dices),
};

const VALUE_SUFFIX_KEYWORDS = new Set([
  "amp",
  "arcane-barrier",
  "arcane-shelter",
  "heave",
  "opt",
  "piercing",
  "quell",
  "spellvoid",
  "ward",
]);

function canonicalFabKeywordId(slug: string): string {
  const valueMatch = slug.match(/^(.*)-(?:\d+|x)$/);
  if (valueMatch?.[1] && VALUE_SUFFIX_KEYWORDS.has(valueMatch[1])) return valueMatch[1];
  if (slug.endsWith("-specialization")) return "specialization";
  if (slug.endsWith("-fusion")) return "fusion";
  if (slug.startsWith("essence-of-")) return "essence";
  if (/^(?:earth|ice|lightning)-bond$/.test(slug)) return "bond";
  if (/^channel-(?:earth|ice|lightning)$/.test(slug)) return "channel";
  if (/^(?:earth|ice|lightning)-flow$/.test(slug)) return "flow";
  return slug;
}

function unknownKeyword(slug: string, original: string): FabKeywordIconDef {
  return {
    id: slug,
    label: original.trim() || slug,
    shortCode: slug.slice(0, 3).toUpperCase(),
    Lucide: Sparkles,
    hint: original.trim() || slug,
    chainPriority: 500,
    combatRelevant: true,
  };
}

export function resolveFabKeyword(keyword: string): FabKeywordIconDef {
  const slug = normalizeFabKeyword(keyword);
  const canonicalId = canonicalFabKeywordId(slug);
  return FAB_KEYWORD_ICONS[canonicalId] ?? unknownKeyword(slug, keyword);
}

/** Sort keywords for combat-chain display (priority, then label). */
export function sortFabKeywordsForChain(keywords: readonly string[]): FabKeywordIconDef[] {
  const seen = new Set<string>();
  const resolved: FabKeywordIconDef[] = [];
  for (const raw of keywords) {
    const def = resolveFabKeyword(raw);
    if (seen.has(def.id) || !def.combatRelevant) continue;
    seen.add(def.id);
    resolved.push(def);
  }
  return resolved.sort((a, b) => {
    if (a.chainPriority !== b.chainPriority) return a.chainPriority - b.chainPriority;
    return a.label.localeCompare(b.label);
  });
}

/** All registered keyword slugs (for tests / coverage audits). */
export function registeredFabKeywordIds(): readonly string[] {
  return Object.keys(FAB_KEYWORD_ICONS);
}
