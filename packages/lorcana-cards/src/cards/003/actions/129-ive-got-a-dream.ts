import type { ActionCard } from "@tcg/lorcana-types";

export const iveGotADream: ActionCard = {
  abilities: [
    {
      effect: {
        duration: "this-turn",
        restriction: "cant-quest",
        target: "SELF",
        type: "restriction",
      },
      id: "1hw-1",
      text: "Ready chosen character of yours at a location. They can't quest for the rest of this turn. Gain lore equal to that location's {L}.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 129,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "c24ba0e28c5f3a8df3686d5068b960ef77a1875b",
  },
  franchise: "Tangled",
  id: "1hw",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "I've Got a Dream",
  set: "003",
  text: "Ready chosen character of yours at a location. They can't quest for the rest of this turn. Gain lore equal to that location's {L}.",
};
