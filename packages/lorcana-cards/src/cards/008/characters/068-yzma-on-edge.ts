import type { CharacterCard } from "@tcg/lorcana";

export const yzmaOnEdge: CharacterCard = {
  id: "594",
  cardType: "character",
  name: "Yzma",
  version: "On Edge",
  fullName: "Yzma - On Edge",
  inkType: ["amethyst", "emerald"],
  franchise: "Emperors New Groove",
  set: "008",
  text: "WHY DO WE EVEN HAVE THAT LEVER? When you play this character, if you have a card named Pull the Lever! in your discard, you may search your deck for a card named Wrong Lever! and reveal that card to all players. Put that card into your hand and shuffle your deck.",
  cost: 6,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 68,
  inkable: false,
  externalIds: {
    ravensburger: "12eeb86e37f64546133910be1f491f5bd01ae282",
  },
  abilities: [
    {
      id: "594-1",
      text: "WHY DO WE EVEN HAVE THAT LEVER? When you play this character, if you have a card named Pull the Lever! in your discard, you may search your deck for a card named Wrong Lever! and reveal that card to all players. Put that card into your hand and shuffle your deck.",
      name: "WHY DO WE EVEN HAVE THAT LEVER?",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
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
      condition: {
        type: "zone",
        zone: "discard",
        controller: "you",
        cardName: "Pull the Lever!",
        hasCards: true,
      },
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};
