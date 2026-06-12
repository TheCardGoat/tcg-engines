import type { CharacterCard } from "@tcg/lorcana-types";
import { daisyDuckMultitalentedPirateI18n } from "./108-daisy-duck-multitalented-pirate.i18n";

export const daisyDuckMultitalentedPirate: CharacterCard = {
  id: "K6M",
  canonicalId: "ci_K6M",
  reprints: ["set7-108"],
  cardType: "character",
  name: "Daisy Duck",
  version: "Multitalented Pirate",
  inkType: ["emerald"],
  set: "007",
  cardNumber: 108,
  rarity: "rare",
  cost: 8,
  strength: 6,
  willpower: 5,
  lore: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_ea132f418f484b7fa0514107132a8b54",
    tcgPlayer: 619465,
  },
  text: [
    {
      title: "FOWL PLAY",
      description:
        "Once during your turn, whenever a card is put into your inkwell, chosen opponent chooses one of their characters and returns that card to their hand.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Pirate", "Captain"],
  abilities: [
    {
      id: "k6m-1",
      name: "FOWL PLAY",
      text: "FOWL PLAY Once during your turn, whenever a card is put into your inkwell, chosen opponent chooses one of their characters and returns that card to their hand.",
      trigger: {
        event: "ink",
        on: "CONTROLLER",
        timing: "whenever",
        restrictions: [
          {
            type: "during-turn",
            whose: "your",
          },
          {
            type: "once-per-turn",
          },
        ],
      },
      effect: {
        type: "choice",
        chooser: "OPPONENT",
        options: [
          {
            type: "return-to-hand",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: daisyDuckMultitalentedPirateI18n,
};
