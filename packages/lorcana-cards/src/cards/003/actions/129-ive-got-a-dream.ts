import type { ActionCard } from "@tcg/lorcana-types";

export const iveGotADream: ActionCard = {
  id: "1hw",
  cardType: "action",
  name: "I've Got a Dream",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "003",
  text: "Ready chosen character of yours at a location. They can't quest for the rest of this turn. Gain lore equal to that location's {L}.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 129,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c24ba0e28c5f3a8df3686d5068b960ef77a1875b",
  },
  abilities: [
    {
      id: "1hw-1",
      type: "action",
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
        duration: "this-turn",
      },
      text: "Ready chosen character of yours at a location. They can't quest for the rest of this turn. Gain lore equal to that location's {L}.",
    },
  ],
};
