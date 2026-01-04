import type { CharacterCard } from "@tcg/lorcana-types";

export const drFacilieragentProvocateur: CharacterCard = {
  id: "pyt",
  cardType: "character",
  name: "Dr. Facilier",
  version: "Agent Provocateur",
  fullName: "Dr. Facilier - Agent Provocateur",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "**Shift** 5 _(You may pay 5 {I} to play this on top of one of your characters named Dr. Facilier.)_\n\n**INTO THE SHADOWS** Whenever one of your other characters is banished in a challenge, you may return that card to your hand.",
  cost: 7,
  strength: 4,
  willpower: 5,
  lore: 3,
  cardNumber: 37,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      id: "c3l-1",
      text: "**SLEIGHT OF HAND** When you play this character, you may return target character to their player's hand.",
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
  classifications: ["Floodborn", "Sorcerer", "Villain"],
};
