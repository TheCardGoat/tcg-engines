import type { CharacterCard } from "@tcg/lorcana-types";

export const tritonYoungPrince: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "si2-1",
      text: "SUPERIOR SWIMMER During your turn, this character gains Evasive.",
      type: "action",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "put-into-inkwell",
          source: "hand",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
        type: "optional",
      },
      id: "si2-2",
      name: "KEEPER OF ATLANTICA",
      text: "KEEPER OF ATLANTICA Whenever one of your locations is banished, you may put that card into your inkwell facedown and exerted.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 160,
  cardType: "character",
  classifications: ["Dreamborn", "Prince"],
  cost: 4,
  externalIds: {
    ravensburger: "02da76ce172aef8ef2082d7b7a8bfd252dcefa0c",
  },
  franchise: "Little Mermaid",
  fullName: "Triton - Young Prince",
  id: "si2",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Triton",
  set: "004",
  strength: 3,
  text: "SUPERIOR SWIMMER During your turn, this character gains Evasive. (They can challenge characters with Evasive.)\nKEEPER OF ATLANTICA Whenever one of your locations is banished, you may put that card into your inkwell facedown and exerted.",
  version: "Young Prince",
  willpower: 4,
};
