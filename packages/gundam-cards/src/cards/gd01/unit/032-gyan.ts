import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Gyan: UnitCardDefinition = {
  id: "gd01-032",
  name: "Gyan",
  cardNumber: "GD01-032",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "rare",
  color: "green",
  level: 4,
  cost: 3,
  text: "【When Paired･(Zeon) Pilot】Choose 1 enemy Unit with <Blocker> that is Lv.2 or lower. Destroy it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-032.webp?26013001",
  sourceTitle: "Mobile Suit Gundam",
  ap: 4,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["zeon"],
  linkRequirements: ["m&#039;quve"],
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
};
