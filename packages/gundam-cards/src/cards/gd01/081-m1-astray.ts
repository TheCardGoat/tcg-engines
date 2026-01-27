import type { UnitCardDefinition } from "@tcg/gundam-types";

export const M1Astray: UnitCardDefinition = {
  id: "gd01-081",
  name: "M1 Astray",
  cardNumber: "GD01-081",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "common",
  color: "white",
  level: 2,
  cost: 2,
  text: "While you have another (Triple Ship Alliance) Unit in play, this Unit gets AP+1 and <Blocker>.\n\n (Rest this Unit to change the attack target to it.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-081.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 2,
  hp: 2,
  zones: ["space", "earth"],
  traits: ["triple", "ship", "alliance"],
  linkRequirements: ["-"],
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  effects: [
    {
      id: "gd01-081-effect-1",
      description:
        "While you have another (Triple Ship Alliance) Unit in play, this Unit gets AP+1 and <Blocker>. (Rest this Unit to change the attack target to it.)",
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
