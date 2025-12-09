import type { CharacterCard } from "@tcg/lorcana";

export const judyHoppsOptimisticOfficer: CharacterCard = {
  id: "142",
  cardType: "character",
  name: "Judy Hopps",
  version: "Optimistic Officer",
  fullName: "Judy Hopps - Optimistic Officer",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "009",
  text: "DON'T CALL ME CUTE When you play this character, you may banish chosen item. If you do, its player draws a card.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 157,
  inkable: true,
  externalIds: {
    ravensburger: "939cd97703bd3991f17d78942c5d5c9e4db17b28",
  },
  abilities: [
    {
      id: "142-1",
      text: "DON'T CALL ME CUTE When you play this character, you may banish chosen item. If you do, its player draws a card.",
      name: "DON'T CALL ME CUTE",
      type: "triggered",
      trigger: {
        event: "play",
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
  classifications: ["Storyborn", "Hero"],
};
