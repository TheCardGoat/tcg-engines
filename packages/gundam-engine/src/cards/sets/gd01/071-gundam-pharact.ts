import type { UnitCardDefinition } from "../../card-types";

export const GundamPharact: UnitCardDefinition = {
  id: "gd01-071",
  name: "Gundam Pharact",
  cardNumber: "GD01-071",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "rare",
  color: "white",
  level: 4,
  cost: 3,
  text: "【During Link】【Attack】Choose 1 enemy Unit. It gets AP-2 during this battle.
",
  imageUrl: "../images/cards/card/GD01-071.webp?2510031",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  ap: 3,
  hp: 4,
  zones: [
    "space",
    "earth",
  ],
  traits: [
    "academy",
  ],
  linkRequirements: [
    "(academy)-trait",
  ],
  abilities: [
    {
      trigger: "ON_ATTACK",
      description: "【Attack】 Choose 1 enemy Unit. It gets AP-2 during this battle.",
      effect: {
        type: "MODIFY_STATS",
        attribute: "ap",
        modifier: -2,
        duration: "turn",
      },
    },
  ],
};
