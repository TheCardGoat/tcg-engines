import type { ActionCard } from "@tcg/lorcana-types";

export const whatDidYouCallMe: ActionCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
      id: "n3b-1",
      text: "Chosen damaged character gets +3 {S} this turn.",
      type: "action",
    },
  ],
  cardNumber: 132,
  cardType: "action",
  cost: 1,
  externalIds: {
    ravensburger: "5339a38eed9968c3a46b91a0af5b667b76794ef5",
  },
  franchise: "Great Mouse Detective",
  id: "n3b",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "What Did You Call Me?",
  set: "002",
  text: "Chosen damaged character gets +3 {S} this turn.",
};
