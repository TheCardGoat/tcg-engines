import type { UnitCardDefinition } from "@tcg/gundam-types";

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
  text: "While you have 2 or more (Earth Federation) Units in play, this card in your hand gets cost -1.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-016.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  ap: 2,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["earth", "federation"],
  linkRequirements: ["-"],
  effects: [
    {
      id: "eff-5ixal7lkx",
      type: "CONSTANT",
      description:
        "While you have 2 or more (Earth Federation) Units in play, this card in your hand gets cost -1.",
      restrictions: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "While you have 2 or more (Earth Federation) Units in play, this card in your hand gets cost -1.",
      },
    },
  ],
};
