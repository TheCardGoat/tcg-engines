import type { CharacterCard } from "@tcg/lorcana-types";

export const donaldDuckFocusedFlatfoot: CharacterCard = {
  id: "htc",
  cardType: "character",
  name: "Donald Duck",
  version: "Focused Flatfoot",
  fullName: "Donald Duck - Focused Flatfoot",
  inkType: ["sapphire"],
  set: "005",
  text: "BAFFLING MYSTERY When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  cardNumber: 155,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "4034b1ebebc8be7b47cefd7197cffd40f1b428db",
  },
  abilities: [
    {
      id: "htc-1",
      type: "triggered",
      name: "BAFFLING MYSTERY",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
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
      text: "BAFFLING MYSTERY When you play this character, you may put the top card of your deck into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Detective"],
};
