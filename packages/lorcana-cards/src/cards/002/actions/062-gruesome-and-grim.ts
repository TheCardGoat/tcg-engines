import type { ActionCard } from "@tcg/lorcana-types";

export const gruesomeAndGrim: ActionCard = {
  abilities: [
    {
      effect: {
        keyword: "Rush",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      id: "3l1-1",
      text: "Play a character with cost 4 or less for free. They gain Rush. At the end of the turn, banish them.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 62,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "0ceaf8b26eaa49286c3c303758df6db50f061901",
  },
  franchise: "Sword in the Stone",
  id: "3l1",
  inkType: ["amethyst"],
  inkable: false,
  missingTests: true,
  name: "Gruesome and Grim",
  set: "002",
  text: "Play a character with cost 4 or less for free. They gain Rush. At the end of the turn, banish them. (They can challenge the turn they're played.)",
};
