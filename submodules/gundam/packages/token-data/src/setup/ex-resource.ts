import type { ResourceCard } from "@tcg/gundam-types";

export const exrpExResource003: ResourceCard = {
  cardNumber: "EXRP-003",
  name: "EX Resource",
  type: "resource",
  cost: 0,
  traits: [],
  canonicalId: "EXRP-003",
  slug: "ex-resource-exrp-003",
  printings: [
    {
      id: "EXRP-003",
      artId: "EXRP-003",
      setCode: "EXRP",
      collectorNumber: "EXRP-003",
      cardNumber: "EXRP-003",
      set: {
        code: "EXRP",
        name: "EX Resources",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/exrp/EXRP-003.webp",
    },
  ],
  level: 0,
  effect:
    "(At the start of the game, the second-turn player places 1 active EX Resource into their resource area.)\n(Rest an EX Resource then exile it from the game when paying a cost.)",
  keywordEffects: [],
  rarity: "common",
};

/**
 * Booster-pack EX Resource token (`EXR-001`), the free host default for the
 * `ex-resource` setup slot. Mirrors the authored card in
 * `@tcg/gundam-cards` (`cards/exr/resource/001-ex-resource.ts`); token-data
 * is a leaf package and cannot import the cards pool, so the gameplay fields
 * are duplicated here. Keep both definitions in sync.
 */
export const exrExResource001: ResourceCard = {
  cardNumber: "EXR-001",
  name: "EX Resource",
  type: "resource",
  cost: 0,
  traits: [],
  canonicalId: "EXR-001",
  slug: "ex-resource-exr-001",
  printings: [
    {
      id: "EXR-001_p6",
      artId: "EXR-001_p6",
      setCode: "EXR",
      collectorNumber: "EXR-001_p6",
      cardNumber: "EXR-001",
      set: {
        code: "EXR",
        name: "Included in Booster Packs",
        packageId: "616801",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/exr/EXR-001_p6.webp",
    },
  ],
  level: 0,
  effect:
    "(At the start of the game, the second-turn player places 1 active EX Resource into their resource area.)\n(Rest an EX Resource then exile it from the game when paying a cost.)",
  keywordEffects: [],
  rarity: "common",
};
