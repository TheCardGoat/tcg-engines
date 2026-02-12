import type { CharacterCard } from "@tcg/lorcana-types";

export const rufusOrphanageCat: CharacterCard = {
  abilities: [
    {
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
      id: "1us-1",
      name: "TOO OLD TO BE CHASING MICE",
      text: "TOO OLD TO BE CHASING MICE When this character is banished, you may put this card into your inkwell facedown and exerted.",
      trigger: {
        event: "banish",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 153,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 5,
  externalIds: {
    ravensburger: "f0c41d7f687d5c9ecf723fe2abaf2249724934e9",
  },
  franchise: "Rescuers",
  fullName: "Rufus - Orphanage Cat",
  id: "1us",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Rufus",
  set: "003",
  strength: 4,
  text: "TOO OLD TO BE CHASING MICE When this character is banished, you may put this card into your inkwell facedown and exerted.",
  version: "Orphanage Cat",
  willpower: 5,
};
