import type { GreedyWeights } from "./strategies/greedy.ts";

/**
 * Deck-specific mulligan tuning. All thresholds are optional; missing values
 * fall back to the strategy's {@link GreedyWeights} mulligan fields.
 *
 * The generic heuristic keeps a hand on "cheap card count + sell tag count".
 * A deck profile sharpens this with the deck's actual opening plan:
 * development counts *Units* (a hand of cheap Programs with no board
 * development is the classic brick), named engine pieces can relieve one
 * slot of the curve requirement, and congestion vetoes bounce hands that
 * hold too many copies of expensive payoffs before the deck can deploy them.
 */
export interface DeckMulliganTuning {
  /** Printed-cost cutoff for a "cheap development Unit". */
  readonly cheapUnitCost?: number;
  /** Minimum cheap Units required to keep a hand without an engine piece. */
  readonly minCheapUnits?: number;
  /** Minimum Sell-Tag cards required to keep. */
  readonly minSellable?: number;
  /** Engine pieces (printed names); a hit keeps the plan's opening honest. */
  readonly engineNames?: readonly string[];
  /** When an engine piece is in hand, it counts as this many curve slots. */
  readonly engineRelief?: number;
  /** Congestion veto names (printed names of expensive payoffs). */
  readonly congestionNames?: readonly string[];
  /** Mulligan when this many copies across `congestionNames` are in hand. */
  readonly congestionMinCopies?: number;
}

/** Preferred carrier kind for a named Gear. */
export type GearHostPreferType = "legend" | "unit";

/**
 * How well a visible carrier matches a profile's Gear-host plan.
 *
 * `preferred` is a named host of the requested kind (or named when no kind
 * is set). `typed` is the right kind without a name hit — used so Relic
 * still prefers a cheap Unit over a named Legend, and Overwatch still
 * prefers an unnamed face-up Legend over a named Unit.
 */
export type GearHostMatch = "preferred" | "named" | "typed" | "none";

/**
 * A deck strategy profile carries the authored deck's plan into greedy and
 * tactical: what the deck is trying to do, which cards are central to that
 * plan, how to evaluate the opening hand, which Gear belongs on which host,
 * and any pacing overrides for the weight maps.
 *
 * Card names are matched against {@link FilteredCardView.cardName} — the
 * engine-visible printed name. Profiles authored against display names
 * (`Name: Subtitle`) must translate to the engine-visible base name before
 * being bound to a strategy.
 */
export interface DeckStrategyProfile {
  /** Deck id this profile serves (matches the authored deck id). */
  readonly deckId: string;
  /** One-line strategy summary for diagnostics and logs. */
  readonly plan: string;
  /**
   * Printed names of the deck's payoffs and engines. The heuristic never
   * volunteers these to `sellCard` (unless every sellable candidate is
   * core), prefers playing them over generic cards when both are legal, and
   * Gear host preferences keep them paired with their intended carrier.
   */
  readonly coreCards: readonly string[];
  /** Mulligan tuning over the generic curve/sellable thresholds. */
  readonly mulligan?: DeckMulliganTuning;
  /** Gear printed name → preferred host printed names; falls back to strongest. */
  readonly gearHosts?: Readonly<Record<string, readonly string[]>>;
  /**
   * Gear printed name → carrier kind. Combined with {@link gearHosts} so a
   * Relic line can demand a Unit host while Overwatch demands a Legend,
   * even when Unit and Legend share an engine-visible name.
   */
  readonly gearHostTypes?: Readonly<Record<string, GearHostPreferType>>;
  /**
   * Chump-block direct attacks that would steal at least this many Gigs,
   * even when the block is not otherwise urgent. Default 2 preserves the
   * generic behavior; control decks set 1 to trade a cheap body for a
   * denied steal against gig-race aggro.
   */
  readonly blockDirectStealsAtLeast?: number;
  /**
   * Opening-turn pacing. `develop-first` re-ranks greedy so engine cards
   * and Calls land before speculative attacks. `attack-first` keeps the
   * generic combat-first map. Weight overrides still win when present.
   */
  readonly pacing?: "develop-first" | "attack-first";
  /**
   * Engine-visible Unit names whose Spend activations outrank attacking.
   * Judy Nothing-to-Doubt is the canonical case: the reveal-and-play-for-free
   * line is the deck's core, so a ready copy spends before she (or anyone)
   * attacks — unless the gig race is already closing.
   */
  readonly preferSpendOverAttack?: readonly string[];
  /** Weight overrides merged over the strategy's weights (profile wins). */
  readonly weights?: Partial<GreedyWeights>;
}

export function gearHostMatch(
  gearName: string | null | undefined,
  host: { cardName: string | null; type: string | null } | null,
  profile: DeckStrategyProfile | undefined,
): GearHostMatch {
  if (!profile || !gearName || !host?.cardName) return "none";
  const preferredHosts = profile.gearHosts?.[gearName];
  const typePref = profile.gearHostTypes?.[gearName];
  const named = preferredHosts?.includes(host.cardName) === true;
  const typed = typePref ? host.type === typePref : false;
  if (named && (typed || !typePref)) return "preferred";
  if (named) return "named";
  if (typed) return "typed";
  return "none";
}

export function isCoreCardName(
  cardName: string | null | undefined,
  profile: DeckStrategyProfile | undefined,
): boolean {
  if (!profile || !cardName) return false;
  return profile.coreCards.includes(cardName);
}

/** Ready Unit whose Spend the plan wants before attacks. Legend names are ignored. */
export function isPreferSpendUnit(
  card: { cardName: string | null; type: string | null } | null | undefined,
  profile: DeckStrategyProfile | undefined,
): boolean {
  if (!profile?.preferSpendOverAttack?.length || !card?.cardName) return false;
  if (card.type !== "unit") return false;
  return profile.preferSpendOverAttack.includes(card.cardName);
}

/**
 * Legend names the plan wants to keep in the Legend area as Gear carriers.
 * Overwatch Control's Goro is the canonical case: Go Solo turns him into a
 * body and strands the rifle.
 */
export function preferredLegendHostNames(
  profile: DeckStrategyProfile | undefined,
): ReadonlySet<string> {
  const names = new Set<string>();
  if (!profile?.gearHosts) return names;
  for (const [gear, hosts] of Object.entries(profile.gearHosts)) {
    if (profile.gearHostTypes?.[gear] === "unit") continue;
    for (const host of hosts) names.add(host);
  }
  return names;
}
