import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Moebius: UnitCardDefinition = {
  id: "st04-004",
  name: "Moebius",
  cardNumber: "ST04-004",
  setCode: "ST04",
  cardType: "UNIT",
  rarity: "common",
  color: "white",
  level: 1,
  cost: 1,
  text: "<Blocker> (Rest this Unit to change the attack target to it.)",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST04-004.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 1,
  hp: 1,
  zones: ["space"],
  traits: ["earth", "alliance"],
  linkRequirements: ["-"],
  keywords: [
    {
      keyword: "Blocker",
    },
  ],
  effects: [
    {
      id: "st04-004-effect-1",
      description:
        "<Blocker> (Rest this Unit to change the attack target to it.)",
      type: "CONSTANT",
      action: {
        type: "CUSTOM",
        text: "<Blocker> (Rest this Unit to change the attack target to it.)",
      },
    },
  ],
};
