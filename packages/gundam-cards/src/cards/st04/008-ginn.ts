import type { UnitCardDefinition } from "@tcg/gundam-types";

export const Ginn: UnitCardDefinition = {
  id: "st04-008",
  name: "Ginn",
  cardNumber: "ST04-008",
  setCode: "ST04",
  cardType: "UNIT",
  rarity: "common",
  color: "red",
  level: 2,
  cost: 1,
  text: "-",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST04-008.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 2,
  hp: 2,
  zones: ["space", "earth"],
  traits: ["zaft"],
  linkRequirements: ["-"],
  effects: [
    {
      id: "eff-mhipsh32l",
      type: "CONSTANT",
      description: "-",
      restrictions: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "-",
      },
    },
  ],
};
