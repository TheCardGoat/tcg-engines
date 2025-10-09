import type { UnitCardDefinition } from "../../card-types";

export const Jegan: UnitCardDefinition = {
  id: "gd01-016",
  name: "Jegan",
  cardNumber: "GD01-016",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "blue",
  level: 3,
  cost: 2,
  text: "While you have 2 or more (Earth Federation) Units in play, this card in your hand gets cost -1.
",
  imageUrl: "../images/cards/card/GD01-016.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 2,
  hp: 3,
  zones: [
    "space",
    "earth",
  ],
  traits: [
    "earth",
    "federation",
  ],
  linkRequirements: [
    "-",
  ],
  abilities: [
    {
      description: "While you have 2 or more (Earth Federation) Units in play, this card in your hand gets cost -1.",
      effect: {
        type: "UNKNOWN",
        rawText: "While you have 2 or more (Earth Federation) Units in play, this card in your hand gets cost -1.",
      },
    },
  ],
};
