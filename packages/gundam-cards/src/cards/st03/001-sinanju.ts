import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Sinanju: UnitCardDefinition = {
  id: "st03-001",
  name: "Sinanju",
  cardNumber: "ST03-001",
  setCode: "ST03",
  cardType: "UNIT",
  rarity: "legendary",
  color: "red",
  level: 6,
  cost: 5,
  text: "【During Pair】This Unit gains <High-Maneuver>.\n\r\n(This Unit can't be blocked.)\nDuring your turn, when this Unit destroys an enemy shield area card with battle damage, choose 1 enemy Unit. Deal 2 damage to it.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST03-001.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 5,
  hp: 4,
  zones: ["space", "earth"],
  traits: ["neo", "zeon"],
  linkRequirements: ["full-frontal"],
  effects: [
    {
      id: "eff-vsktp8ff2",
      type: "CONSTANT",
      description:
        "This Unit gains <High-Maneuver>. (This Unit can't be blocked.) During your turn, when this Unit destroys an enemy shield area card with battle damage, choose 1 enemy Unit. Deal 2 damage to it.",
      restrictions: [],
      conditions: [],
      action: {
        type: "SEQUENCE",
        actions: [
          {
            type: "GAIN_KEYWORDS",
            keywords: ["High-Maneuver"],
            duration: "PERMANENT",
            target: {
              controller: "SELF",
              cardType: "UNIT",
              filters: [],
              count: {
                min: 1,
                max: 1,
              },
            },
          },
          {
            type: "CUSTOM",
            text: ") During your turn, when this Unit destroys an enemy shield area card with battle damage, choose 1 enemy Unit",
          },
          {
            type: "DAMAGE",
            value: 2,
            target: {
              controller: "SELF",
              cardType: "UNIT",
              filters: [],
              count: {
                min: 1,
                max: 1,
              },
            },
          },
        ],
      },
    },
  ],
};
