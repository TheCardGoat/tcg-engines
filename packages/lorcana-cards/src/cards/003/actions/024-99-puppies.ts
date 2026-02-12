import type { ActionCard } from "@tcg/lorcana-types";

export const _99Puppies: ActionCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "q5l-1",
      text: "Whenever one of your characters quests this turn, gain 1 lore.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 24,
  cardType: "action",
  cost: 5,
  externalIds: {
    ravensburger: "5e43d8ea46210ff6a851a826904c6a9136ea4936",
  },
  franchise: "101 Dalmatians",
  id: "q5l",
  inkType: ["amber"],
  inkable: false,
  missingTests: true,
  name: "99 Puppies",
  set: "003",
  text: "Whenever one of your characters quests this turn, gain 1 lore.",
};
