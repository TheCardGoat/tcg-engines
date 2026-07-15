import type { UnitCard } from "@tcg/gundam-types";

export const tFatum00011: UnitCard = {
  cardNumber: "T-011",
  name: "Fatum-00",
  type: "unit",
  traits: ["triple ship alliance"],
  canonicalId: "T-011",
  slug: "fatum-00/t-011",
  printings: [
    {
      id: "T-011",
      artId: "T-011",
      setCode: "T",
      collectorNumber: "T-011",
      cardNumber: "T-011",
      set: {
        code: "T",
        name: "Token Cards",
      },
      rarity: "common",
      finish: "standard",
      imageUrl: "https://r2.tcg.online/public/gundam/cards/t/T-011.webp",
    },
  ],
  level: 0,
  cost: 0,
  ap: 2,
  hp: 2,
  effect: "<Blocker> (Rest this Unit to change the attack target to it.)",
  effects: [],
  keywordEffects: [{ keyword: "Blocker" }],
  rarity: "common",
};
