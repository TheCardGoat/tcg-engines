import type { UnitCard } from "@tcg/gundam-types";

export const tGundnode026: UnitCard = {
  cardNumber: "T-026",
  name: "Gundnode",
  type: "unit",
  traits: ["quiet zero"],
  id: "T-026",
  canonicalId: "T-026",
  externalIds: { bandai: "gundam:t-026" },
  slug: "gundnode-t-026",
  displayName: "Gundnode",
  rulesText:
    "<Breach 1> (During your turn, when this Unit destroys an enemy Unit with battle damage, deal the specified amount of damage to the first card in that opponent's shield area.)",
  set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
  printNumber: "T-026",
  printings: [
    {
      id: "T-026",
      artId: "T-026",
      setCode: "GD05",
      collectorNumber: "T-026",
      cardNumber: "T-026",
      set: { code: "GD05", name: "Freedom Ascension [GD05]", packageId: "616105" },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/t/T-026.webp",
      productName: "Freedom Ascension [GD05]",
    },
  ],
  selectedPrintingId: "T-026",
  imageUrl: "https://cdn.tcg.online/public/gundam/cards/t/T-026.webp",
  legality: "legal",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  level: 0,
  cost: 0,
  ap: 2,
  hp: 2,
  effect:
    "<Breach 1> (During your turn, when this Unit destroys an enemy Unit with battle damage, deal the specified amount of damage to the first card in that opponent's shield area.)",
  effects: [],
  keywordEffects: [{ keyword: "Breach", value: 1 }],
  rarity: "common",
};
export const gd05Gundnode026 = tGundnode026;
