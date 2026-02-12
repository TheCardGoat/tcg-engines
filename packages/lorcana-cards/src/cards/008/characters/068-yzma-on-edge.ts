import type { CharacterCard } from "@tcg/lorcana-types";

export const yzmaOnEdge: CharacterCard = {
  abilities: [
    {
      condition: {
        type: "zone",
        zone: "discard",
        controller: "you",
        cardName: "Pull the Lever!",
        hasCards: true,
      },
      effect: {
        type: "optional",
        effect: {
          type: "search-deck",
          cardName: "Wrong Lever!",
          putInto: "hand",
          reveal: true,
          shuffle: true,
        },
      },
      id: "594-1",
      name: "WHY DO WE EVEN HAVE THAT LEVER?",
      text: "WHY DO WE EVEN HAVE THAT LEVER? When you play this character, if you have a card named Pull the Lever! in your discard, you may search your deck for a card named Wrong Lever! and reveal that card to all players. Put that card into your hand and shuffle your deck.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 68,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  cost: 6,
  externalIds: {
    ravensburger: "12eeb86e37f64546133910be1f491f5bd01ae282",
  },
  franchise: "Emperors New Groove",
  fullName: "Yzma - On Edge",
  id: "594",
  inkType: ["amethyst", "emerald"],
  inkable: false,
  lore: 2,
  name: "Yzma",
  set: "008",
  strength: 3,
  text: "WHY DO WE EVEN HAVE THAT LEVER? When you play this character, if you have a card named Pull the Lever! in your discard, you may search your deck for a card named Wrong Lever! and reveal that card to all players. Put that card into your hand and shuffle your deck.",
  version: "On Edge",
  willpower: 6,
};
