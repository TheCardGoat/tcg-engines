import type { CharacterCard } from "@tcg/lorcana-types";
import { kuzcoImpulsiveLlamaI18n } from "./067-kuzco-impulsive-llama.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const kuzcoImpulsiveLlama: CharacterCard = {
  id: "uQg",
  canonicalId: "ci_7bS",
  reprints: ["set8-067"],
  cardType: "character",
  name: "Kuzco",
  version: "Impulsive Llama",
  inkType: ["amethyst", "emerald"],
  franchise: "Emperors New Groove",
  set: "008",
  cardNumber: 67,
  rarity: "rare",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_7f8ab8154a444fb69a3eed9c7647b623",
    tcgPlayer: 632245,
  },
  text: [
    {
      title: "Shift 4",
    },
    {
      title: "WHAT DOES THIS DO?",
      description:
        "When you play this character, each opponent chooses one of their characters and puts that card on the bottom of their deck. Then, each opponent may draw a card.",
    },
  ],
  classifications: ["Floodborn", "King"],
  abilities: [
    shift(4),
    {
      effect: {
        type: "sequence",
        steps: [
          {
            type: "put-on-bottom",
            chosenBy: "opponent",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "optional",
            chooser: "EACH_OPPONENT",
            effect: {
              type: "draw",
              amount: 1,
              target: "EACH_OPPONENT",
            },
          },
        ],
      },
      id: "1p1-2",
      name: "WHAT DOES THIS DO?",
      text: "WHAT DOES THIS DO? When you play this character, each opponent chooses one of their characters and puts that card on the bottom of their deck. Then, each opponent may draw a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: kuzcoImpulsiveLlamaI18n,
};
