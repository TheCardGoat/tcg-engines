import type { CharacterCard } from "@tcg/lorcana-types";

export const mrSnoopsBetrayedPartner: CharacterCard = {
  id: "1iu",
  cardType: "character",
  name: "Mr. Snoops",
  version: "Betrayed Partner",
  fullName: "Mr. Snoops - Betrayed Partner",
  inkType: ["ruby"],
  franchise: "Rescuers",
  set: "008",
  text: "DOUBLE-CROSSING CROOK! During your turn, when this character is banished, you may draw a card.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 143,
  inkable: true,
  externalIds: {
    ravensburger: "c5af45307091a364a0c0be72ecc5b3cf644ead92",
  },
  abilities: [
    {
      id: "1iu-1",
      name: "DOUBLE-CROSSING CROOK!",
      text: "DOUBLE-CROSSING CROOK! During your turn, when this character is banished, you may draw a card.",
      type: "triggered",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
