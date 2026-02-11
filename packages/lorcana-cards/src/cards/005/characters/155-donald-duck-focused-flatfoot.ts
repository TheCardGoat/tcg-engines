import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckFocusedFlatfoot: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          source: "top-of-deck",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
        chooser: "CONTROLLER",
      },
      id: "htc-1",
      name: "BAFFLING MYSTERY",
      text: "BAFFLING MYSTERY When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 155,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Detective"],
  cost: 5,
  externalIds: {
    ravensburger: "4034b1ebebc8be7b47cefd7197cffd40f1b428db",
  },
  fullName: "Donald Duck - Focused Flatfoot",
  id: "htc",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Donald Duck",
  set: "005",
  strength: 3,
  text: "BAFFLING MYSTERY When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
  version: "Focused Flatfoot",
  willpower: 4,
};
