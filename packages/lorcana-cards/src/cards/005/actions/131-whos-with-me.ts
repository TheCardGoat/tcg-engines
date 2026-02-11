import type { ActionCard } from "@tcg/lorcana-types";

export const whosWithMe: ActionCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "YOUR_CHARACTERS",
        duration: "this-turn",
      },
      id: "4hv-1",
      text: "Your characters get +2 {S} this turn.",
      type: "static",
    },
    {
      effect: {
        type: "gain-lore",
        amount: 2,
      },
      id: "4hv-2",
      text: "Whenever one of your characters with Reckless challenges another character this turn, gain 2 lore.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      type: "triggered",
    },
  ],
  cardNumber: 131,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "1034a66870b0c85f4a8a50bb74815569f3ec4b74",
  },
  franchise: "Beauty and the Beast",
  id: "4hv",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "Who's With Me?",
  set: "005",
  text: "Your characters get +2 {S} this turn.\nWhenever one of your characters with Reckless challenges another character this turn, gain 2 lore.",
};
