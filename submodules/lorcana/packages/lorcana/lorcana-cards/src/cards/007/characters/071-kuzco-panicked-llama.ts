import type { CharacterCard } from "@tcg/lorcana-types";
import { kuzcoPanickedLlamaI18n } from "./071-kuzco-panicked-llama.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const kuzcoPanickedLlama: CharacterCard = {
  id: "Zdf",
  canonicalId: "ci_Zdf",
  reprints: ["set7-071"],
  cardType: "character",
  name: "Kuzco",
  version: "Panicked Llama",
  inkType: ["amethyst", "emerald"],
  franchise: "Emperors New Groove",
  set: "007",
  cardNumber: 71,
  rarity: "uncommon",
  cost: 4,
  strength: 2,
  willpower: 2,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_4b09d3e4c16c4e0d8b579d090a021dd5",
    tcgPlayer: 618136,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "WE CAN FIGURE THIS OUT",
      description: "At the start of your turn, choose one:",
    },
    {
      title: "• Each player draws a card.",
    },
    {
      title: "• Each player chooses and discards a card.",
    },
  ],
  classifications: ["Storyborn", "King"],
  abilities: [
    evasive,
    {
      id: "Zdf-2",
      name: "WE CAN FIGURE THIS OUT",
      text: "WE CAN FIGURE THIS OUT At the start of your turn, choose one: • Each player draws a card. • Each player chooses and discards a card.",
      type: "triggered",
      trigger: {
        event: "start-turn",
        on: "YOU",
        timing: "at",
      },
      effect: {
        type: "choice",
        optionLabels: ["Each player draws a card.", "Each player chooses and discards a card."],
        options: [
          {
            type: "sequence",
            steps: [
              {
                type: "draw",
                amount: 1,
                target: "CONTROLLER",
              },
              {
                type: "draw",
                amount: 1,
                target: "OPPONENT",
              },
            ],
          },
          {
            type: "sequence",
            steps: [
              {
                type: "discard",
                amount: 1,
                target: "CONTROLLER",
                chosen: true,
              },
              {
                type: "discard",
                amount: 1,
                target: "OPPONENT",
                chosen: true,
              },
            ],
          },
        ],
      },
    },
  ],
  i18n: kuzcoPanickedLlamaI18n,
};
