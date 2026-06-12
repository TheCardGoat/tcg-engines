import type { UnitCard } from "@tcg/gundam-types";

export const tAileStrikeGundam008: UnitCard = {
  cardNumber: "T-008",
  name: "Aile Strike Gundam",
  type: "unit",
  traits: ["earth alliance"],
  id: "T-008",
  externalId: "gundam:t-008",
  slug: "aile-strike-gundam-t-008",
  displayName: "Aile Strike Gundam",
  set: { code: "ST04", name: "SEED Strike [ST04]", packageId: "616004" },
  printNumber: "T-008",
  printings: [
    {
      id: "T-008",
      collectorNumber: "T-008",
      cardNumber: "T-008",
      set: {
        code: "ST04",
        name: "SEED Strike [ST04]",
        packageId: "616004",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/t/T-008.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/T-008.webp?260424",
      productName: "SEED Strike [ST04]",
    },
  ],
  selectedPrintingId: "T-008",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/t/T-008.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/T-008.webp?260424",
  legality: "legal",
  level: 0,
  cost: 0,
  ap: 3,
  hp: 3,
  effect: "<Blocker> (Rest this Unit to change the attack target to it.)",
  effects: [],
  keywordEffects: [{ keyword: "Blocker" }],
  rarity: "common",
};
export const st04AileStrikeGundam008 = tAileStrikeGundam008;
