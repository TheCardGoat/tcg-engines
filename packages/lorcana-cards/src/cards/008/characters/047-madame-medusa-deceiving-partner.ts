import type { CharacterCard } from "@tcg/lorcana-types";

export const madameMedusaDeceivingPartner: CharacterCard = {
  id: "dvp",
  cardType: "character",
  name: "Madame Medusa",
  version: "Deceiving Partner",
  fullName: "Madame Medusa - Deceiving Partner",
  inkType: ["amethyst", "ruby"],
  franchise: "Rescuers",
  set: "008",
  text: "DOUBLE-CROSS When you play this character, you may deal 2 damage to another chosen character of yours to return chosen character with cost 2 or less to their player’s hand.",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  cardNumber: 47,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "320735e6ade9a3fa1537db3f280a6ae5318ee328",
  },
  abilities: [
    {
      id: "dvp-1",
      type: "triggered",
      name: "DOUBLE-CROSS",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 2,
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
      text: "DOUBLE-CROSS When you play this character, you may deal 2 damage to another chosen character of yours to return chosen character with cost 2 or less to their player’s hand.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
