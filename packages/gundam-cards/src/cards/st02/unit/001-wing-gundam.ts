import type { UnitCardDefinition } from "@tcg/gundam-types";

export const WingGundam: UnitCardDefinition = {
  ap: 4,
  cardNumber: "ST02-001",
  cardType: "UNIT",
  color: "green",
  cost: 4,
  hp: 5,
  id: "st02-001",
  imageUrl: "https://www.gundam-gcg.com/en/images/cards/card/ST02-001.webp?26013001",
  keywords: [
    {
      keyword: "Breach",
      value: 5,
    },
  ],
  level: 6,
  linkRequirements: ["heero-yuy"],
  name: "Wing Gundam",
  rarity: "legendary",
  setCode: "ST02",
  sourceTitle: "Mobile Suit Gundam Wing",
  text: "<Breach 5> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)\nThis Unit may choose an active enemy Unit that is Lv.4 or lower as its attack target.",
  traits: ["operation", "meteor"],
  zones: ["space", "earth"],
};
