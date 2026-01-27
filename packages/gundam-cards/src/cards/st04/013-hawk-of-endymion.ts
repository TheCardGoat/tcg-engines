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
      id: "st04-013-effect-1",
      description:
        "【Main】/【Action】Choose 1 enemy Unit with 3 or less HP. Return it to its owner's hand. 【Pilot】[Mu La Flaga]",
      type: "CONSTANT",
      action: {
        type: "CUSTOM",
        text: "【Main】/【Action】Choose 1 enemy Unit with 3 or less HP. Return it to its owner's hand. 【Pilot】[Mu La Flaga]",
      },
    },
  ],
};
