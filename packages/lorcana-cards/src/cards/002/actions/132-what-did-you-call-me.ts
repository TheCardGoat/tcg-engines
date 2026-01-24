import type { ActionCard } from "@tcg/lorcana-types";

export const whatDidYouCallMe: ActionCard = {
  id: "n3b",
  cardType: "action",
  name: "What Did You Call Me?",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "002",
  text: "Chosen damaged character gets +3 {S} this turn.",
  cost: 1,
  cardNumber: 132,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5339a38eed9968c3a46b91a0af5b667b76794ef5",
  },
  abilities: [
    {
      id: "n3b-1",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
      text: "Chosen damaged character gets +3 {S} this turn.",
    },
  ],
};
