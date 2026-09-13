/**
 * Shared FAB tabletop UI modules required by hero-special boards.
 *
 * UX should implement these as reusable systems, then compose them per hero
 * from {@link HERO_SPECIAL_UI_CATALOG}. Baseline zones (hand/deck/pitch/GY/
 * arsenal/equipment/weapons/combat chain) are assumed always present and are
 * not listed here.
 */

export type FabUiModuleId =
  | "asset-bar-chi"
  | "asset-bar-resources-ap-life"
  | "hero-soul"
  | "hero-counters"
  | "hero-status-flags"
  | "hero-signal-edge"
  | "permanent-token-stacks"
  | "permanent-allies"
  | "permanent-material-under"
  | "banished-inspector"
  | "banished-blood-debt"
  | "banished-playable"
  | "inventory-zone"
  | "arsenal-orientation"
  | "equipment-face-down"
  | "weapon-zone-count"
  | "turn-status-ledger"
  | "marked-status"
  | "crowd-status"
  | "agent-of-chaos"
  | "shared-deck-gy"
  | "event-deck";

export interface FabUiModule {
  readonly id: FabUiModuleId;
  readonly label: string;
  /** One-line UX summary for design handoff. */
  readonly summary: string;
  /** What must be visible to both players unless noted. */
  readonly visibility: "public" | "owner-private" | "mixed";
}

export const FAB_UI_MODULES: readonly FabUiModule[] = [
  {
    id: "asset-bar-resources-ap-life",
    label: "Asset bar (life / resources / AP)",
    summary: "Always-on player chrome: life total, resource points, action points.",
    visibility: "public",
  },
  {
    id: "asset-bar-chi",
    label: "Chi points",
    summary: "Fourth asset next to resources; required when paying {c} costs or pitching for chi.",
    visibility: "public",
  },
  {
    id: "hero-soul",
    label: "Hero soul",
    summary: "Sub-cards under the hero; count badge + inspect; support banish-from-soul costs.",
    visibility: "public",
  },
  {
    id: "hero-counters",
    label: "Counters on hero",
    summary: "Named counters on the hero object itself (e.g. energy on Blaze).",
    visibility: "public",
  },
  {
    id: "hero-status-flags",
    label: "Hero turn flags",
    summary:
      "This-turn / sticky badges: charged, boosted, played-red, drew-card, weapon-hits, mitigation, etc.",
    visibility: "public",
  },
  {
    id: "hero-signal-edge",
    label: "Hero Signal Edge",
    summary:
      "Active-only 44px dock attached to the hero edge; compact pips open a public this-turn detail popover without moving board zones.",
    visibility: "public",
  },
  {
    id: "permanent-token-stacks",
    label: "Token stacks",
    summary:
      "Stack identical aura/item tokens by name with count (Ash×3, Runechant×5, Gold×2). Expand to individual cards on inspect.",
    visibility: "public",
  },
  {
    id: "permanent-allies",
    label: "Allies / dragons / figments / zombies",
    summary:
      "Full permanent cards with power/life, attack readiness, keywords (phantasm, ward, crank).",
    visibility: "public",
  },
  {
    id: "permanent-material-under",
    label: "Material under permanents",
    summary:
      "Sub-cards under a permanent (Ash under dragons). Show under-count and material effects.",
    visibility: "public",
  },
  {
    id: "banished-inspector",
    label: "Banished inspector",
    summary:
      "Public banished zone as a first-class pile/grid, not a dumpster; face-up and face-down.",
    visibility: "mixed",
  },
  {
    id: "banished-blood-debt",
    label: "Blood debt readout",
    summary:
      "Count of public blood-debt cards in banished; projected end-phase life loss; mitigation active flag.",
    visibility: "public",
  },
  {
    id: "banished-playable",
    label: "Playable-from-banished",
    summary: "Highlight cards legal to play from banished (Rune Gate, Evos, watery grave, etc.).",
    visibility: "public",
  },
  {
    id: "inventory-zone",
    label: "Inventory",
    summary: "Side zone for starting equipment / Tomes outside the main deck.",
    visibility: "mixed",
  },
  {
    id: "arsenal-orientation",
    label: "Arsenal face-up / face-down",
    summary: "Arsenal card orientation is rules-relevant (arrows face-up, Lexi flips, etc.).",
    visibility: "mixed",
  },
  {
    id: "equipment-face-down",
    label: "Cloaked / face-down equipment",
    summary: "Equipment can be face-down (cloaked); show silhouette until revealed.",
    visibility: "public",
  },
  {
    id: "weapon-zone-count",
    label: "Weapon zone count",
    summary: "Default two weapon slots; some heroes start with one.",
    visibility: "public",
  },
  {
    id: "turn-status-ledger",
    label: "Turn status ledger",
    summary:
      "Compact this-turn facts used by hero abilities (hits, boosts, Runechants created, crank count).",
    visibility: "public",
  },
  {
    id: "marked-status",
    label: "Marked",
    summary: "Mark badge on a hero (Assassin / Draconic contracts).",
    visibility: "public",
  },
  {
    id: "crowd-status",
    label: "Crowd cheers / boos",
    summary: "Super Slam crowd state that creates tokens and enables hero abilities.",
    visibility: "public",
  },
  {
    id: "agent-of-chaos",
    label: "Agent of Chaos form",
    summary: "Hero identity / moniker swap UI when Arakni becomes a random Agent.",
    visibility: "public",
  },
  {
    id: "shared-deck-gy",
    label: "Shared deck + graveyard",
    summary: "Yorick: all heroes share one deck and one graveyard.",
    visibility: "public",
  },
  {
    id: "event-deck",
    label: "Event deck",
    summary: "Multiplayer event deck for Fightmaster Kox-style effects.",
    visibility: "public",
  },
] as const;

export function getFabUiModule(id: FabUiModuleId): FabUiModule {
  const mod = FAB_UI_MODULES.find((m) => m.id === id);
  if (!mod) throw new Error(`Unknown FAB UI module: ${id}`);
  return mod;
}
