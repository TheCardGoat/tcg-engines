import type { CharacterCard } from "@tcg/lorcana-types";

export const giantCobraGhostlySerpent: CharacterCard = {
  abilities: [
    {
      id: "1bh-1",
      keyword: "Vanish",
      text: "Vanish",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          type: "gain-lore",
        },
        type: "optional",
      },
      id: "1bh-2",
      name: "MYSTERIOUS ADVANTAGE",
      text: "MYSTERIOUS ADVANTAGE When you play this character, you may choose and discard a card to gain 2 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 57,
  cardType: "character",
  classifications: ["Dreamborn", "Ally", "Illusion"],
  cost: 3,
  externalIds: {
    ravensburger: "ab23bc0d0f42e3fa41a43526d6fca8f364824467",
  },
  franchise: "Aladdin",
  fullName: "Giant Cobra - Ghostly Serpent",
  id: "1bh",
  inkType: ["amethyst", "steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Giant Cobra",
  set: "007",
  strength: 4,
  text: "Vanish (When an opponent chooses this character for an action, banish them.)\nMYSTERIOUS ADVANTAGE When you play this character, you may choose and discard a card to gain 2 lore.",
  version: "Ghostly Serpent",
  willpower: 4,
};
