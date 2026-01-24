import type { ActionCard } from "@tcg/lorcana-types";

export const theGamesAfoot: ActionCard = {
  id: "1sa",
  cardType: "action",
  name: "The Game's Afoot!",
  inkType: ["steel"],
  franchise: "Great Mouse Detective",
  set: "010",
  text: "Move up to 2 of your characters to the same location for free. That location gains Resist +2 until the start of your next turn. (Damage dealt to it is reduced by 2.)",
  cost: 2,
  cardNumber: 198,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e71eed39c3700e773eee7ce8f6904a9281f39d6a",
  },
  abilities: [
    {
      id: "1sa-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "YOUR_CHARACTERS",
        value: 2,
      },
      text: "Move up to 2 of your characters to the same location for free. That location gains Resist +2 until the start of your next turn.",
    },
  ],
};
