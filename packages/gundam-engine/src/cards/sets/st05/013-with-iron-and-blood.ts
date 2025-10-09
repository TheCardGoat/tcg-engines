import type { CommandCardDefinition } from "../../card-types";

export const WithIronAndBlood: CommandCardDefinition = {
  id: "st05-013",
  name: "With Iron and Blood",
  cardNumber: "ST05-013",
  setCode: "ST05",
  cardType: "COMMAND",
  rarity: "common",
  level: 2,
  cost: 1,
  text: "【Main】/【Action】Choose 1 of your Units. Deal 1 damage to it. It gets AP+3 during this turn.
",
  imageUrl: "../images/cards/card/ST05-013.webp?2510031",
  sourceTitle: "Mobile Suit Gundam IRON-BLOODED ORPHANS",
  timing: "MAIN",
  abilities: [
    {
      description: "【Main】/【Action】Choose 1 of your Units. Deal 1 damage to it. It gets AP+3 during this turn.",
      effect: {
        type: "DAMAGE",
        amount: 1,
        target: {
          type: "unknown",
          rawText: "it",
        },
      },
    },
  ],
};
