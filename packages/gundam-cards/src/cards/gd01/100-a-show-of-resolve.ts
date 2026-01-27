import type { CommandCardDefinition } from "@tcg/gundam-types";

export const AShowOfResolve: CommandCardDefinition = {
  id: "gd01-100",
  name: "A Show of Resolve",
  cardNumber: "GD01-100",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "uncommon",
  color: "blue",
  level: 4,
  cost: 3,
  text: "【Main】Draw 2.",
  imageUrl:
    "https://www.gundam-gcg.com/en/images/cards/card/GD01-100.webp?2510031",
  sourceTitle: "Mobile Suit Gundam Unicorn",
  timing: "MAIN",
  effects: [
    {
      id: "gd01-100-effect-1",
      description: "【Main】Draw 2.",
      type: "CONSTANT",
      action: {
        type: "CUSTOM",
        text: "【Main】Draw 2.",
      },
    },
  ],
};
