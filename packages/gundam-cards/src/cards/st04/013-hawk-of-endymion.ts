import type { CommandCardDefinition } from "@tcg/gundam-types";

export const HawkOfEndymion: CommandCardDefinition = {
  id: "st04-013",
  name: "Hawk of Endymion",
  cardNumber: "ST04-013",
  setCode: "ST04",
  cardType: "COMMAND",
  rarity: "common",
  color: "white",
  level: 2,
  cost: 1,
  text: "【Main】/【Action】Choose 1 enemy Unit with 3 or less HP. Return it to its owner's hand.\n【Pilot】[Mu La Flaga]",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/ST04-013.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  timing: "MAIN",
  pilotProperties: {
    name: "Mu La Flaga",
    traits: ["earth", "alliance"],
    apModifier: 1,
    hpModifier: 0,
  },
  effects: [
    {
      id: "eff-32cthrab9",
      type: "CONSTANT",
      description: "/",
      restrictions: [],
      conditions: [],
      action: {
        type: "CUSTOM",
        text: "/",
      },
    },
    {
      id: "eff-xlkwl2o5o",
      type: "CONSTANT",
      description:
        "Choose 1 enemy Unit with 3 or less HP. Return it to its owner's hand. 【Pilot】[Mu La Flaga]",
      restrictions: [],
      conditions: [],
      action: {
        type: "ADD_TO_HAND",
        target: {
          controller: "OPPONENT",
          cardType: "UNIT",
          count: {
            min: 1,
            max: 1,
          },
          filters: [
            {
              type: "hp",
              comparison: "lte",
              value: 3,
            },
          ],
        },
      },
    },
  ],
};
