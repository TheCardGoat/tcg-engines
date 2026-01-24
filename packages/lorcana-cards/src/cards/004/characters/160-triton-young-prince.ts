import type { CharacterCard } from "@tcg/lorcana-types";

export const tritonYoungPrince: CharacterCard = {
  id: "si2",
  cardType: "character",
  name: "Triton",
  version: "Young Prince",
  fullName: "Triton - Young Prince",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "004",
  text: "SUPERIOR SWIMMER During your turn, this character gains Evasive. (They can challenge characters with Evasive.)\nKEEPER OF ATLANTICA Whenever one of your locations is banished, you may put that card into your inkwell facedown and exerted.",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  cardNumber: 160,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "02da76ce172aef8ef2082d7b7a8bfd252dcefa0c",
  },
  abilities: [
    {
      id: "si2-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
      text: "SUPERIOR SWIMMER During your turn, this character gains Evasive.",
    },
    {
      id: "si2-2",
      type: "triggered",
      name: "KEEPER OF ATLANTICA",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          source: "hand",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
        chooser: "CONTROLLER",
      },
      text: "KEEPER OF ATLANTICA Whenever one of your locations is banished, you may put that card into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Dreamborn", "Prince"],
};
