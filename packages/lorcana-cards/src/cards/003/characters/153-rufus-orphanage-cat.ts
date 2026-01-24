import type { CharacterCard } from "@tcg/lorcana-types";

export const rufusOrphanageCat: CharacterCard = {
  id: "1us",
  cardType: "character",
  name: "Rufus",
  version: "Orphanage Cat",
  fullName: "Rufus - Orphanage Cat",
  inkType: ["sapphire"],
  franchise: "Rescuers",
  set: "003",
  text: "TOO OLD TO BE CHASING MICE When this character is banished, you may put this card into your inkwell facedown and exerted.",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  cardNumber: 153,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f0c41d7f687d5c9ecf723fe2abaf2249724934e9",
  },
  abilities: [
    {
      id: "1us-1",
      type: "triggered",
      name: "TOO OLD TO BE CHASING MICE",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          source: "this-card",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
        chooser: "CONTROLLER",
      },
      text: "TOO OLD TO BE CHASING MICE When this character is banished, you may put this card into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
