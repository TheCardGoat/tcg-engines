import type { IarPrintedIdentity } from "./iar-cardvault-completeness.ts";

const ZOMBIE_OR_CORPSE = /zombie|corpse/iu;

export const IAR_ZOMBIE_CORPSE_LOOP_IDS = [
  "malice-graveyard-and-death-corpse",
  "vox-attack-from-graveyard-or-banished",
  "discard-or-destroy-zombie-costs",
  "decay-death-gates-and-corpses",
  "on-hit-corrupted-corpse",
] as const;

export type IarZombieCorpseLoopId = (typeof IAR_ZOMBIE_CORPSE_LOOP_IDS)[number];

export interface IarOfficialPrintedCard {
  readonly name: string;
  readonly collectorNumber: string;
  readonly pitch: string;
  readonly typeText: string;
  readonly functionalText: string;
  readonly rarity?: string;
  readonly setCode?: string;
}

export interface IarZombieCorpseInventoryRow {
  readonly name: string;
  readonly collectorNumber: string;
  readonly pitch: string;
  readonly typeText: string;
  readonly functionalText: string;
  readonly synergyClause: string;
  readonly loops: readonly IarZombieCorpseLoopId[];
  readonly inGeneratedCatalog: boolean;
}

function haystack(card: IarOfficialPrintedCard): string {
  return `${card.typeText}\n${card.functionalText}`;
}

export function isIarZombieOrCorpseCard(card: IarOfficialPrintedCard): boolean {
  return ZOMBIE_OR_CORPSE.test(haystack(card));
}

export function synergyClauseFromPrintedText(card: IarOfficialPrintedCard): string {
  const matching = card.functionalText
    .split(/\{br\}/u)
    .map((part) => part.trim())
    .filter((part) => ZOMBIE_OR_CORPSE.test(part));
  if (matching.length > 0) return matching.join(" ");
  if (ZOMBIE_OR_CORPSE.test(card.typeText)) return card.typeText;
  return card.functionalText.trim();
}

export function loopsForIarZombieCorpseCard(card: IarOfficialPrintedCard): IarZombieCorpseLoopId[] {
  const text = haystack(card);
  const loops: IarZombieCorpseLoopId[] = [];
  if (/play target zombie from your graveyard/iu.test(text)) {
    loops.push("malice-graveyard-and-death-corpse");
  }
  if (
    /zombies you've played from a graveyard or banished zone/iu.test(text) ||
    /Zombies you control get/u.test(card.functionalText)
  ) {
    loops.push("vox-attack-from-graveyard-or-banished");
  }
  if (
    /destroy up to 3 zombies|discard a zombie|discard up to 3 zombies|destroy up to 3 zombies you control/iu.test(
      text,
    )
  ) {
    loops.push("discard-or-destroy-zombie-costs");
  }
  if (
    /zombie you control with decay dies|When this dies, create a Corrupted Corpse/iu.test(text) ||
    (/Decay/u.test(text) && /Zombie Ally/iu.test(card.typeText))
  ) {
    loops.push("decay-death-gates-and-corpses");
  }
  if (
    /When this hits, create a Corrupted Corpse/iu.test(text) ||
    /When this attacks, you may discard a zombie\. If you do, create a Corrupted Corpse/iu.test(
      text,
    ) ||
    /hits a hero or dies, you may turn a card in your banished zone face-down/iu.test(text)
  ) {
    loops.push("on-hit-corrupted-corpse");
  }
  return loops;
}

export function enumerateIarZombieCorpseInventory(
  officialCards: readonly IarOfficialPrintedCard[],
  catalogIarIdentities: readonly Pick<IarPrintedIdentity, "collectorNumber">[] = [],
): IarZombieCorpseInventoryRow[] {
  const catalogCollectors = new Set(catalogIarIdentities.map((row) => row.collectorNumber));
  const rows = officialCards.filter(isIarZombieOrCorpseCard).map((card) => ({
    name: card.name,
    collectorNumber: card.collectorNumber,
    pitch: card.pitch,
    typeText: card.typeText,
    functionalText: card.functionalText,
    synergyClause: synergyClauseFromPrintedText(card),
    loops: loopsForIarZombieCorpseCard(card),
    inGeneratedCatalog: catalogCollectors.has(card.collectorNumber),
  }));
  const seen = new Map<string, IarZombieCorpseInventoryRow>();
  for (const row of rows) {
    seen.set(`${row.name}\0${row.pitch}`, row);
  }
  return [...seen.values()].sort(
    (left, right) =>
      left.collectorNumber.localeCompare(right.collectorNumber) ||
      left.pitch.localeCompare(right.pitch),
  );
}
