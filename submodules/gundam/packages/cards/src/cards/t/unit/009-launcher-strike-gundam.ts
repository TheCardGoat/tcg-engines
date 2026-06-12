import type { UnitCard } from "@tcg/gundam-types";

export const tLauncherStrikeGundam009: UnitCard = {
  cardNumber: "T-009",
  name: "Launcher Strike Gundam",
  type: "unit",
  traits: ["earth alliance"],
  id: "T-009",
  externalId: "gundam:t-009",
  slug: "launcher-strike-gundam-t-009",
  displayName: "Launcher Strike Gundam",
  set: { code: "ST04", name: "SEED Strike [ST04]", packageId: "616004" },
  printNumber: "T-009",
  printings: [
    {
      id: "T-009",
      collectorNumber: "T-009",
      cardNumber: "T-009",
      set: {
        code: "ST04",
        name: "SEED Strike [ST04]",
        packageId: "616004",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/t/T-009.webp",
      sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/T-009.webp?260424",
      productName: "SEED Strike [ST04]",
    },
  ],
  selectedPrintingId: "T-009",
  imageUrl: "https://r2.tcg.online/public/gundam/cards/t/T-009.webp",
  sourceImageUrl: "https://www.gundam-gcg.com/en/images/cards/card/T-009.webp?260424",
  legality: "legal",
  level: 0,
  cost: 0,
  ap: 2,
  hp: 4,
  effect: "<Blocker> (Rest this Unit to change the attack target to it.)",
  effects: [],
  keywordEffects: [{ keyword: "Blocker" }],
  rarity: "common",
};
export const st04LauncherStrikeGundam009 = tLauncherStrikeGundam009;
