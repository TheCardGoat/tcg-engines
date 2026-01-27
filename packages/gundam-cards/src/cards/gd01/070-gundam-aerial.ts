import type { UnitCardDefinition } from "@tcg/gundam-types";

export const GundamAerial: UnitCardDefinition = {
  id: "gd01-070",
  name: "Gundam Aerial",
  cardNumber: "GD01-070",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "rare",
  color: "white",
  level: 5,
  cost: 3,
  text: "While there are 4 or more Command cards in your trash, this card in your hand gets cost -2.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-070.webp?2510031",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  ap: 3,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["academy"],
  linkRequirements: ["suletta-mercury"],
  abilities: [
    {
      description:
        "While there are 4 or more Command cards in your trash, this card in your hand gets cost -2.",
      effect: {
        type: "UNKNOWN",
        rawText:
          "While there are 4 or more Command cards in your trash, this card in your hand gets cost -2.",
      },
    },
  ],
};
