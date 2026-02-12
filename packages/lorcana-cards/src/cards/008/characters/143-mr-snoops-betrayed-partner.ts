import type { CharacterCard } from "@tcg/lorcana-types";

export const mrSnoopsBetrayedPartner: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      id: "1iu-1",
      name: "DOUBLE-CROSSING CROOK!",
      text: "DOUBLE-CROSSING CROOK! During your turn, when this character is banished, you may draw a card.",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 143,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "c5af45307091a364a0c0be72ecc5b3cf644ead92",
  },
  franchise: "Rescuers",
  fullName: "Mr. Snoops - Betrayed Partner",
  id: "1iu",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  name: "Mr. Snoops",
  set: "008",
  strength: 3,
  text: "DOUBLE-CROSSING CROOK! During your turn, when this character is banished, you may draw a card.",
  version: "Betrayed Partner",
  willpower: 3,
};
