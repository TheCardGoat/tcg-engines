import type { CharacterCard } from "@tcg/lorcana-types";

export const nanaCanineCaregiver: CharacterCard = {
  abilities: [
    {
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
      id: "1lc-1",
      name: "HELPFUL INSTINCTS",
      text: "HELPFUL INSTINCTS When you play this character, you may choose and discard a card to return chosen character with cost 2 or less to their player's hand.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 53,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "ceb423f003d728f152e41e23d2b982872ccc8463",
  },
  franchise: "Peter Pan",
  fullName: "Nana - Canine Caregiver",
  id: "1lc",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Nana",
  set: "010",
  strength: 3,
  text: "HELPFUL INSTINCTS When you play this character, you may choose and discard a card to return chosen character with cost 2 or less to their player's hand.",
  version: "Canine Caregiver",
  willpower: 3,
};
