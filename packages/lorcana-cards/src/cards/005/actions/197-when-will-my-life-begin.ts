import type { ActionCard } from "@tcg/lorcana-types";

export const whenWillMyLifeBegin: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            type: "restriction",
            restriction: "cant-challenge",
            target: "SELF",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
        type: "sequence",
      },
      id: "1ay-1",
      text: "Chosen character can't challenge during their next turn. Draw a card.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 197,
  cardType: "action",
  cost: 3,
  externalIds: {
    ravensburger: "a93a1efecc6c3e773ca5de295729482697c34e24",
  },
  franchise: "Tangled",
  id: "1ay",
  inkType: ["steel"],
  inkable: true,
  missingTests: true,
  name: "When Will My Life Begin?",
  set: "005",
  text: "Chosen character can't challenge during their next turn. Draw a card.",
};
