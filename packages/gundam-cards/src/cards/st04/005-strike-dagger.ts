import type { UnitCardDefinition } from "@tcg/gundam-types";

export const StrikeDagger: UnitCardDefinition = {
  id: "st04-005",
  name: "Strike Dagger",
  cardNumber: "ST04-005",
  setCode: "ST04",
  cardType: "UNIT",
  rarity: "common",
  color: "white",
  level: 2,
  cost: 2,
  text: "-",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST04-005.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 3,
  hp: 2,
  zones: ["space", "earth"],
  traits: ["earth", "alliance"],
  linkRequirements: ["-"],
  effects: [
    {
      id: "st04-005-effect-1",
      description: "-",
      type: "CONSTANT",
      action: {
        type: "CUSTOM",
        text: "-",
      },
    },
  ],
};
