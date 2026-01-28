import type { UnitCardDefinition } from "@tcg/gundam-types";

export const AegisGundam: UnitCardDefinition = {
  id: "st04-006",
  name: "Aegis Gundam",
  cardNumber: "ST04-006",
  setCode: "ST04",
  cardType: "UNIT",
  rarity: "legendary",
  color: "red",
  level: 4,
  cost: 3,
  text: "【Attack】If this Unit has 5 or more AP, choose 1 enemy Unit that is Lv.5 or higher. Deal 3 damage to it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST04-006.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 4,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["zaft"],
  linkRequirements: ["athrun-zala"],
  effects: [
    {
      id: "eff-gp2oo3tgm",
      type: "TRIGGERED",
      timing: "ATTACK",
      description:
        "If this Unit has 5 or more AP, choose 1 enemy Unit that is Lv.5 or higher. Deal 3 damage to it.",
      restrictions: [],
      costs: [],
      conditions: [],
      action: {
        type: "CONDITIONAL",
        conditions: [],
        trueAction: {
          type: "DAMAGE",
          value: 3,
        },
      },
    },
  ],
};
