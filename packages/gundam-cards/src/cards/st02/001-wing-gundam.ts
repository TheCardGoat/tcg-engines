import type { UnitCardDefinition } from "@tcg/gundam-types";

export const WingGundam: UnitCardDefinition = {
  id: "st02-001",
  name: "Wing Gundam",
  cardNumber: "ST02-001",
  setCode: "ST02",
  cardType: "UNIT",
  rarity: "legendary",
  color: "green",
  level: 6,
  cost: 4,
  text: "<Breach 5> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.)\nThis Unit may choose an active enemy Unit that is Lv.4 or lower as its attack target.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST02-001.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 4,
  hp: 5,
  zones: ["space", "earth"],
  traits: ["operation", "meteor"],
  linkRequirements: ["heero-yuy"],
  keywords: [
    {
      keyword: "Breach",
      value: 5,
    },
  ],
  effects: [
    {
      id: "st02-001-effect-1",
      description:
        "<Breach 5> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.) This Unit may choose an active enemy Unit that is Lv.4 or lower as its attack target.",
      type: "CONSTANT",
      action: {
        type: "CUSTOM",
        text: "<Breach 5> (When this Unit's attack destroys an enemy Unit, deal the specified amount of damage to the first card in that opponent's shield area.) This Unit may choose an active enemy Unit that is Lv.4 or lower as its attack target.",
      },
    },
  ],
};
