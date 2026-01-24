import type { CharacterCard } from "@tcg/lorcana-types";

export const nanaCanineCaregiver: CharacterCard = {
  id: "1lc",
  cardType: "character",
  name: "Nana",
  version: "Canine Caregiver",
  fullName: "Nana - Canine Caregiver",
  inkType: ["amethyst"],
  franchise: "Peter Pan",
  set: "010",
  text: "HELPFUL INSTINCTS When you play this character, you may choose and discard a card to return chosen character with cost 2 or less to their player's hand.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 53,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "ceb423f003d728f152e41e23d2b982872ccc8463",
  },
  abilities: [
    {
      id: "1lc-1",
      type: "triggered",
      name: "HELPFUL INSTINCTS",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "HELPFUL INSTINCTS When you play this character, you may choose and discard a card to return chosen character with cost 2 or less to their player's hand.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
