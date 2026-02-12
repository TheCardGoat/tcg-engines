import type { CharacterCard } from "@tcg/lorcana-types";

export const hadesRuthlessTyrant: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "keg-1",
      name: "SHORT ON PATIENCE When you play this character and",
      text: "SHORT ON PATIENCE When you play this character and whenever he quests, you may deal 2 damage to another chosen character of yours to draw 2 cards.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 48,
  cardType: "character",
  classifications: ["Dreamborn", "Villain", "Deity"],
  cost: 7,
  externalIds: {
    ravensburger: "498704459556a4ba90662e632e5370a2645ae1b8",
  },
  franchise: "Hercules",
  fullName: "Hades - Ruthless Tyrant",
  id: "keg",
  inkType: ["amethyst", "ruby"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Hades",
  set: "008",
  strength: 3,
  text: "SHORT ON PATIENCE When you play this character and whenever he quests, you may deal 2 damage to another chosen character of yours to draw 2 cards.",
  version: "Ruthless Tyrant",
  willpower: 6,
};
