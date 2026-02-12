import type { ActionCard } from "@tcg/lorcana-types";

export const theGamesAfoot: ActionCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "YOUR_CHARACTERS",
        value: 2,
      },
      id: "1sa-1",
      text: "Move up to 2 of your characters to the same location for free. That location gains Resist +2 until the start of your next turn.",
      type: "action",
    },
  ],
  cardNumber: 198,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "e71eed39c3700e773eee7ce8f6904a9281f39d6a",
  },
  franchise: "Great Mouse Detective",
  id: "1sa",
  inkType: ["steel"],
  inkable: true,
  missingTests: true,
  name: "The Game's Afoot!",
  set: "010",
  text: "Move up to 2 of your characters to the same location for free. That location gains Resist +2 until the start of your next turn. (Damage dealt to it is reduced by 2.)",
};
