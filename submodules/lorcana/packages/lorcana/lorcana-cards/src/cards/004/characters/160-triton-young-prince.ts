import type { CharacterCard } from "@tcg/lorcana-types";
import { tritonYoungPrinceI18n } from "./160-triton-young-prince.i18n";

export const tritonYoungPrince: CharacterCard = {
  id: "A80",
  canonicalId: "ci_A80",
  reprints: ["set4-160"],
  cardType: "character",
  name: "Triton",
  version: "Young Prince",
  inkType: ["sapphire"],
  franchise: "Little Mermaid",
  set: "004",
  cardNumber: 160,
  rarity: "uncommon",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_ba5d06b298f545f8a2df2df6accd3294",
    tcgPlayer: 550612,
  },
  text: [
    {
      title: "SUPERIOR SWIMMER",
      description:
        "During your turn, this character gains Evasive. (They can challenge characters with Evasive.)",
    },
    {
      title: "KEEPER OF ATLANTICA",
      description:
        "Whenever one of your locations is banished, you may put that card into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Dreamborn", "Prince"],
  abilities: [
    {
      condition: {
        type: "turn",
        whose: "your",
      },
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "si2-1",
      name: "SUPERIOR SWIMMER",
      text: "SUPERIOR SWIMMER During your turn, this character gains Evasive.",
      type: "static",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          exerted: true,
          facedown: true,
          source: {
            ref: "trigger-source",
          },
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
        type: "optional",
      },
      id: "si2-2",
      name: "KEEPER OF ATLANTICA",
      text: "KEEPER OF ATLANTICA Whenever one of your locations is banished, you may put that card into your inkwell facedown and exerted.",
      trigger: {
        event: "banish",
        on: "YOUR_LOCATIONS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: tritonYoungPrinceI18n,
};
