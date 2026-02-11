import type { CharacterCard } from "@tcg/lorcana-types";

export const maleficentSorceress: CharacterCard = {
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
      id: "1la-1",
      name: "CAST MY SPELL!",
      text: "CAST MY SPELL! When you play this character, you may draw a card.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 49,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  cost: 3,
  externalIds: {
    ravensburger: "cfeceefcaf48b610eb3bfdce490c108d8cc86302",
  },
  franchise: "Sleeping Beauty",
  fullName: "Maleficent - Sorceress",
  id: "1la",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  name: "Maleficent",
  set: "001",
  strength: 2,
  text: "CAST MY SPELL! When you play this character, you may draw a card.",
  version: "Sorceress",
  willpower: 2,
};
