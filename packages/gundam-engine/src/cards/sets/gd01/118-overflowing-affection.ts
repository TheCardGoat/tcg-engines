import type { CommandCardDefinition } from "../../card-types";

export const OverflowingAffection: CommandCardDefinition = {
  id: "gd01-118",
  name: "Overflowing Affection",
  cardNumber: "GD01-118",
  setCode: "GD01",
  cardType: "COMMAND",
  rarity: "uncommon",
  color: "white",
  level: 2,
  cost: 1,
  text: "【Main】Draw 2. Then, discard 1.
",
  imageUrl: "../images/cards/card/GD01-118.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  timing: "MAIN",
  abilities: [
    {
      description: "【Main】Draw 2. Then, discard 1.",
      effect: {
        type: "UNKNOWN",
        rawText: "【Main】Draw 2. Then, discard 1.",
      },
    },
  ],
};
