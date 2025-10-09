import type { UnitCardDefinition } from "../../card-types";

export const Zechs039Leo: UnitCardDefinition = {
  id: "gd01-012",
  name: "Zechs&#039; Leo",
  cardNumber: "GD01-012",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "blue",
  level: 3,
  cost: 2,
  text: "【When Paired】Choose 1 enemy Unit with 3 or less HP. Rest it.
",
  imageUrl: "../images/cards/card/GD01-012.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Wing",
  ap: 3,
  hp: 2,
  zones: [
    "space",
    "earth",
  ],
  traits: [
    "oz",
  ],
  linkRequirements: [
    "(oz)-trait",
  ],
  abilities: [
    {
      trigger: "WHEN_PAIRED",
      description: "【When Paired】 Choose 1 enemy Unit with 3 or less HP. Rest it.",
      effect: {
        type: "UNKNOWN",
        rawText: "Choose 1 enemy Unit with 3 or less HP. Rest it.",
      },
    },
  ],
};
