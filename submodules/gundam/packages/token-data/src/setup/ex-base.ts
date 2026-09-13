import type { BaseCard } from "@tcg/gundam-types";

export const exbpExBase001: BaseCard = {
  cardNumber: "EXBP-001",
  name: "EX Base",
  type: "base",
  cost: 0,
  hp: 3,
  traits: [],
  canonicalId: "EXBP-001",
  slug: "ex-base-exbp-001",
  printings: [
    {
      id: "EXBP-001",
      artId: "EXBP-001",
      setCode: "EXBP",
      collectorNumber: "EXBP-001",
      cardNumber: "EXBP-001",
      set: {
        code: "EXBP",
        name: "Edition Beta Early Trial Event, other events",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/exbp/EXBP-001.webp",
    },
  ],
  level: 0,
  keywordEffects: [],
  rarity: "common",
};

/**
 * Booster-pack EX Base token (`EXB-001`), the free host default for the
 * `ex-base` setup slot. Mirrors the authored card in
 * `@tcg/gundam-cards` (`cards/exb/base/001-ex-base.ts`); token-data is a
 * leaf package and cannot import the cards pool, so the gameplay fields are
 * duplicated here. Keep both definitions in sync.
 */
export const exbExBase001: BaseCard = {
  cardNumber: "EXB-001",
  name: "EX Base",
  type: "base",
  cost: 0,
  hp: 3,
  traits: [],
  canonicalId: "EXB-001",
  slug: "ex-base-exb-001",
  printings: [
    {
      id: "EXB-001_p6",
      artId: "EXB-001_p6",
      setCode: "EXB",
      collectorNumber: "EXB-001_p6",
      cardNumber: "EXB-001",
      set: {
        code: "EXB",
        name: "Included in Booster Packs",
        packageId: "616801",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/exb/EXB-001_p6.webp",
    },
  ],
  level: 0,
  keywordEffects: [],
  rarity: "common",
};
