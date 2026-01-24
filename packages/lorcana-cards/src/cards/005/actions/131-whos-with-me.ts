import type { ActionCard } from "@tcg/lorcana-types";

export const whosWithMe: ActionCard = {
  id: "4hv",
  cardType: "action",
  name: "Who's With Me?",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "005",
  text: "Your characters get +2 {S} this turn.\nWhenever one of your characters with Reckless challenges another character this turn, gain 2 lore.",
  cost: 3,
  cardNumber: 131,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1034a66870b0c85f4a8a50bb74815569f3ec4b74",
  },
  abilities: [
    {
      id: "4hv-1",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "YOUR_CHARACTERS",
        duration: "this-turn",
      },
      text: "Your characters get +2 {S} this turn.",
    },
    {
      id: "4hv-2",
      type: "triggered",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "gain-lore",
        amount: 2,
      },
      text: "Whenever one of your characters with Reckless challenges another character this turn, gain 2 lore.",
    },
  ],
};
