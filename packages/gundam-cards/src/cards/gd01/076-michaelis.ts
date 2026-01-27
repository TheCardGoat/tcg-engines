import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Michaelis: UnitCardDefinition = {
  id: "gd01-076",
  name: "Michaelis",
  cardNumber: "GD01-076",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "white",
  level: 3,
  cost: 2,
  text: "While there are 4 or more Command cards in your trash, this Unit gets AP+1 and HP+1.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-076.webp?2510031",
  sourceTitle: "Mobile Suit Gundam the Witch from Mercury",
  ap: 3,
  hp: 3,
  zones: ["space", "earth"],
  traits: ["academy"],
  linkRequirements: ["(academy)-trait"],
  effects: [
    {
      id: "gd01-076-effect-1",
      description:
        "While there are 4 or more Command cards in your trash, this Unit gets AP+1 and HP+1.",
      type: "CONSTANT",
      action: {
        type: "MODIFY_STATS",
        parameters: {
          attribute: "ap",
          modifier: 1,
          duration: "turn",
        },
      },
    },
  ],
};
