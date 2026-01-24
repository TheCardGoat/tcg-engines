import type { ActionCard } from "@tcg/lorcana-types";

export const _99Puppies: ActionCard = {
  id: "q5l",
  cardType: "action",
  name: "99 Puppies",
  inkType: ["amber"],
  franchise: "101 Dalmatians",
  set: "003",
  text: "Whenever one of your characters quests this turn, gain 1 lore.",
  cost: 5,
  cardNumber: 24,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "5e43d8ea46210ff6a851a826904c6a9136ea4936",
  },
  abilities: [
    {
      id: "q5l-1",
      type: "triggered",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      text: "Whenever one of your characters quests this turn, gain 1 lore.",
    },
  ],
};
