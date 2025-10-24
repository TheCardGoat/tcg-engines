import type { UnitCardDefinition } from "../../card-types";

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
  keywords: [
    {
      keyword: "High-Maneuver",
    },
  ],
  abilities: [
    {
      condition: "DURING_PAIR",
      description:
        "【During Pair】 This Unit gains <High-Maneuver>. (This Unit can't be blocked.) During your turn, when this Unit destroys an enemy shield area card with battle damage, choose 1 enemy Unit. Deal 2 damage to it.",
      effect: {
        type: "DAMAGE",
        amount: 2,
        target: {
          type: "unknown",
          rawText: "it",
        },
      },
    },
  ],
};
