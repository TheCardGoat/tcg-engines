import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveCard,
} from "@tcg/grand-archive-types";

import {
  createClassBonusTestChampion,
  grandArchiveDefaultFaceId,
  grandArchiveTestFace,
  requireSingleFace,
} from "./class-bonus-test-champion.ts";

export function classBonusLeveledChampion(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  classBonusEnabled: boolean,
  level: number,
): {
  readonly starter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card">;
  readonly lineage: readonly GrandArchiveCard<GrandArchiveAbilityDefinition, "card">[];
} {
  const starter = createClassBonusTestChampion(card, classBonusEnabled, "activation-discount");
  const starterFace = requireSingleFace(starter);
  if (level < 0) throw new Error("Champion level must be non-negative");
  const lineage = Array.from({ length: level }, (_, index) => {
    const championLevel = index + 1;
    const canonicalId = `${starter.canonicalId}-lv${championLevel}`;
    return {
      ...starter,
      canonicalId,
      slug: `${starter.slug}-lv${championLevel}`,
      layout: {
        kind: "single-faced" as const,
        face: {
          ...starterFace,
          id: grandArchiveDefaultFaceId(canonicalId),
          catalogId: canonicalId,
          name: `${starterFace.name} L${championLevel}`,
          stats: { level: championLevel, life: 20 },
        },
      },
    };
  });
  return { starter, lineage };
}

export function namedClassBonusChampion(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  lineageName: string,
  classBonusEnabled: boolean,
  level = 0,
) {
  const { starter, lineage } = classBonusLeveledChampion(card, classBonusEnabled, level);
  const rename = (
    faceCard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card">,
  ): GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> => {
    const face = requireSingleFace(faceCard);
    return {
      ...faceCard,
      layout: {
        kind: "single-faced",
        face: { ...face, lineageName },
      },
    };
  };
  return { starter: rename(starter), lineage: lineage.map(rename) };
}

export function printedWeaponPower(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
): number {
  const power = grandArchiveTestFace(card).stats.power;
  if (typeof power !== "number")
    throw new Error(`${grandArchiveTestFace(card).name} needs printed power`);
  return power;
}
