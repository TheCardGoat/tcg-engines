import type { CharacterCard } from "@tcg/lorcana-types";

export const maleficentsorceress: CharacterCard = {
  id: "1la",
  cardType: "character",
  name: "Maleficent",
  version: "Sorceress",
  fullName: "Maleficent - Sorceress",
  inkType: ["amethyst"],
  franchise: "Sleeping Beauty",
  set: "001",
  text: "CAST MY SPELL! When you play this character, you may draw a card.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 49,
  inkable: true,
  externalIds: {
    ravensburger: "cfeceefcaf48b610eb3bfdce490c108d8cc86302",
  },
  abilities: [
    {
      id: "1la-1",
      name: "CAST MY SPELL!",
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
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};
