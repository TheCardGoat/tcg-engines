import type { ActionCard } from "@tcg/lorcana-types";

export const stealFromTheRich: ActionCard = {
  id: "ncz",
  cardType: "action",
  name: "Steal from the Rich",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "001",
  text: "Whenever one of your characters quests this turn, each opponent loses 1 lore.",
  cost: 5,
  cardNumber: 97,
  inkable: false,
  externalIds: {
    ravensburger: "54317280fda3eec0bfe9a09946029a6334cadaf3",
  },
  abilities: [
    {
      id: "ncz-1",
      text: "Whenever one of your characters quests this turn, each opponent loses 1 lore.",
      type: "triggered",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
    },
  ],
};
