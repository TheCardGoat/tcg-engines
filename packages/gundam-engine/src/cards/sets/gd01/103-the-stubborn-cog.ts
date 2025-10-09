import type { CommandCardDefinition } from "../../card-types";

export const TheStubbornCog: CommandCardDefinition = {
  id: "gd01-103",
  name: "The Stubborn Cog",
  cardNumber: "GD01-103",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "common",
  color: "blue",
  level: 1,
  cost: 1,
  text: "【Main】Choose 1 active friendly (Earth Federation) Unit and 1 active enemy Unit. Rest them.\n【Pilot】[Daguza Mackle]",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-103.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  timing: "MAIN",
  pilotProperties: {
    name: "Daguza Mackle",
    traits: ["earth", "federation"],
    apModifier: 0,
    hpModifier: 1,
  },
  abilities: [
    {
      description:
        "【Main】Choose 1 active friendly (Earth Federation) Unit and 1 active enemy Unit. Rest them. 【Pilot】[Daguza Mackle]",
      effect: {
        type: "UNKNOWN",
        rawText:
          "【Main】Choose 1 active friendly (Earth Federation) Unit and 1 active enemy Unit. Rest them. 【Pilot】[Daguza Mackle]",
      },
    },
  ],
};
