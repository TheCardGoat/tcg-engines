import type { CharacterCard } from "@tcg/lorcana-types";

export const madameMedusaDeceivingPartner: CharacterCard = {
  abilities: [
    {
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
      id: "dvp-1",
      name: "DOUBLE-CROSS",
      text: "DOUBLE-CROSS When you play this character, you may deal 2 damage to another chosen character of yours to return chosen character with cost 2 or less to their player’s hand.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 47,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 3,
  externalIds: {
    ravensburger: "320735e6ade9a3fa1537db3f280a6ae5318ee328",
  },
  franchise: "Rescuers",
  fullName: "Madame Medusa - Deceiving Partner",
  id: "dvp",
  inkType: ["amethyst", "ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Madame Medusa",
  set: "008",
  strength: 3,
  text: "DOUBLE-CROSS When you play this character, you may deal 2 damage to another chosen character of yours to return chosen character with cost 2 or less to their player’s hand.",
  version: "Deceiving Partner",
  willpower: 3,
};
