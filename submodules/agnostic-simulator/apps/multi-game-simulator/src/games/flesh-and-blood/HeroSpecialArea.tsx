import {
  ArchiveRestore,
  Bird,
  CircleDollarSign,
  Flame,
  Gem,
  Ghost,
  Layers3,
  Sparkles,
} from "lucide-react";

import {
  HERO_SPECIAL_UI_CATALOG,
  getHeroSpecialUi,
  type FabHeroSpecialUiRequirement,
} from "./hero-special-ui";
import type { FabCardMetadata } from "./projection";

export interface FabHeroSpecialProjection {
  /** Public chi points. Omit until the engine projects chi for this player. */
  readonly chi?: number;
  /** Public cards stored under the hero. */
  readonly soul?: readonly string[];
  /** Public card names with Blood Debt in the banished zone. */
  readonly bloodDebt?: readonly string[];
  /** Publicly playable cards in the banished zone. */
  readonly playableFromBanished?: readonly string[];
  /** Public named counters and their values. */
  readonly counters?: Readonly<Record<string, number>>;
  /** Public turn/state facts, e.g. "Charged" or "Played red". */
  readonly statuses?: readonly string[];
  /** Public materials underneath a permanent, keyed by its visible name. */
  readonly materialUnder?: Readonly<Record<string, readonly string[]>>;
}

export interface HeroSpecialAreaProps {
  readonly heroName?: string;
  readonly permanentIds: readonly string[];
  readonly banishedIds: readonly string[];
  readonly cardMetadata?: Map<string, FabCardMetadata>;
  readonly projection?: FabHeroSpecialProjection;
  readonly side: "top" | "bottom";
}

export function resolveFabHeroSpecialRequirement(
  heroName: string | undefined,
): FabHeroSpecialUiRequirement | undefined {
  if (!heroName) return undefined;
  const normalized = heroName.toLocaleLowerCase();
  const heroTerms = new Set(normalized.match(/[a-z0-9]+/g) ?? []);
  const ignoredTerms = new Set(["of", "the", "and", "a", "an", "classic"]);
  return (
    getHeroSpecialUi(normalized) ??
    // Printed hero names can include a moniker, while catalog families use the base name.
    // This is presentation-only lookup; engine card ids remain the authority for rules.
    HERO_SPECIAL_UI_CATALOG.map((requirement) => {
      const score = (requirement.hero.toLocaleLowerCase().match(/[a-z0-9]+/g) ?? []).reduce(
        (total, term) => total + (ignoredTerms.has(term) || !heroTerms.has(term) ? 0 : 1),
        0,
      );
      return { requirement, score };
    })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)[0]?.requirement
  );
}

function TokenStack({ name, count }: { name: string; count: number }) {
  return (
    <span className="fab-special-token" data-token={name.toLocaleLowerCase()}>
      <Layers3 size={12} aria-hidden="true" />
      {name}
      <strong>×{count}</strong>
    </span>
  );
}

function requiredModules(requirement: FabHeroSpecialUiRequirement) {
  return new Set(requirement.modules);
}

/**
 * Game-owned permanent-lane chrome for all cataloged FAB hero families.
 *
 * The component intentionally consumes a small public projection rather than
 * reaching into engine internals. It can therefore render live counts today
 * and become fully rules-backed as the engine adds soul, chi, materials, and
 * turn flags to its viewer projection.
 */
export function HeroSpecialArea({
  heroName,
  permanentIds,
  banishedIds,
  cardMetadata,
  projection,
  side,
}: HeroSpecialAreaProps) {
  const requirement = resolveFabHeroSpecialRequirement(heroName);
  if (!requirement) return null;

  const modules = requiredModules(requirement);
  const permanentNames = permanentIds.map((id) => cardMetadata?.get(id)?.name ?? "Permanent");
  const stacks = permanentNames.reduce<Record<string, number>>((counts, name) => {
    counts[name] = (counts[name] ?? 0) + 1;
    return counts;
  }, {});
  const bloodDebt =
    projection?.bloodDebt ??
    banishedIds.filter((id) => cardMetadata?.get(id)?.isBloodDebt).map((id) => id);
  const status = projection?.statuses ?? [];
  const hasBanished = modules.has("banished-inspector") || modules.has("banished-blood-debt");

  return (
    <section
      className="fab-hero-special"
      data-testid={`fab-hero-special-${side}`}
      data-hero-special={requirement.id}
      aria-label={`${requirement.hero} special board`}
    >
      <header className="fab-hero-special-header">
        <div>
          <Sparkles size={13} aria-hidden="true" />
          <strong>{requirement.hero}</strong>
        </div>
        <span>Tier {requirement.tier}</span>
      </header>

      <div className="fab-hero-special-content">
        {modules.has("asset-bar-chi") ? (
          <div className="fab-special-readout" data-special="chi">
            <Gem size={14} aria-hidden="true" />
            <span>Chi</span>
            <strong>{projection?.chi ?? 0}</strong>
          </div>
        ) : null}
        {modules.has("hero-soul") ? (
          <div className="fab-special-readout" data-special="soul">
            <Ghost size={14} aria-hidden="true" />
            <span>Soul</span>
            <strong>{projection?.soul?.length ?? 0}</strong>
          </div>
        ) : null}
        {hasBanished ? (
          <div className="fab-special-readout" data-special="banished">
            <ArchiveRestore size={14} aria-hidden="true" />
            <span>Banished</span>
            <strong>{banishedIds.length}</strong>
          </div>
        ) : null}
        {modules.has("banished-blood-debt") ? (
          <div className="fab-special-readout fab-special-blood-debt" data-special="blood-debt">
            <Flame size={14} aria-hidden="true" />
            <span>Blood debt</span>
            <strong>{bloodDebt.length}</strong>
          </div>
        ) : null}
        {modules.has("inventory-zone") ? (
          <div className="fab-special-readout" data-special="inventory">
            <CircleDollarSign size={14} aria-hidden="true" />
            <span>Inventory</span>
          </div>
        ) : null}
      </div>

      {modules.has("permanent-token-stacks") || modules.has("permanent-allies") ? (
        <div className="fab-special-stacks" aria-label="Permanent tokens and allies">
          {Object.entries(stacks).map(([name, count]) => (
            <TokenStack key={name} name={name} count={count} />
          ))}
          {Object.keys(stacks).length === 0 ? (
            <span className="fab-special-empty">
              <Bird size={12} aria-hidden="true" /> Arena ready for{" "}
              {requirement.signatureTokens[0] ?? "tokens"}
            </span>
          ) : null}
        </div>
      ) : null}

      {status.length > 0 || modules.has("hero-status-flags") ? (
        <div className="fab-special-statuses" aria-label="Hero status">
          {(status.length > 0 ? status : requirement.mustShow.slice(0, 2)).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
