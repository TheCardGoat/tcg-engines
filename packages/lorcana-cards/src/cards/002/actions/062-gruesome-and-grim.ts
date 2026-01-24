import type { ActionCard } from "@tcg/lorcana-types";

export const gruesomeAndGrim: ActionCard = {
  id: "3l1",
  cardType: "action",
  name: "Gruesome and Grim",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  text: "Play a character with cost 4 or less for free. They gain Rush. At the end of the turn, banish them. (They can challenge the turn they're played.)",
  actionSubtype: "song",
  cost: 3,
  cardNumber: 62,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "0ceaf8b26eaa49286c3c303758df6db50f061901",
  },
  abilities: [
    {
      id: "3l1-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Rush",
        target: "CHOSEN_CHARACTER",
      },
      text: "Play a character with cost 4 or less for free. They gain Rush. At the end of the turn, banish them.",
    },
  ],
};
