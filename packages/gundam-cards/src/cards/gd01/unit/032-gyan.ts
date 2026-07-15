import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Gyan: UnitCardDefinition = {
  ap: 4,
  cardNumber: "GD01-032",
  cardType: "UNIT",
  color: "green",
  cost: 3,
  hp: 3,
  id: "gd01-032",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/GD01-032.webp?26013001",
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  level: 4,
  linkRequirements: ["m&#039;quve"],
  name: "Gyan",
  rarity: "rare",
  setCode: "GD01",
  sourceTitle: "Mobile Suit Gundam",
  text: "【When Paired･(Zeon) Pilot】Choose 1 enemy Unit with <Blocker> that is Lv.2 or lower. Destroy it.",
  traits: ["zeon"],
  zones: ["space", "earth"],
};
