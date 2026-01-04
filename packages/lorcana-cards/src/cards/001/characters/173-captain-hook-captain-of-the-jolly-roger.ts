import type { CharacterCard } from "@tcg/lorcana-types";

export const captainHookcaptainOfTheJollyRoger: CharacterCard = {
  id: "z5q",
  cardType: "character",
  name: "Captain Hook",
  version: "Captain of the Jolly Roger",
  fullName: "Captain Hook - Captain of the Jolly Roger",
  inkType: ["steel"],
  franchise: "Disney",
  set: "001",
  text: "**DOUBLE THE POWDER!** When you play this character, you may return an action card named Fire the Cannons! from your discard to your hand.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 173,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      id: "c2l-1",
      text: "**CAPTAIN HOOK** You may return target character to their player's hand.",
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["card"],
          },
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Villain", "Pirate", "Captain"],
};
