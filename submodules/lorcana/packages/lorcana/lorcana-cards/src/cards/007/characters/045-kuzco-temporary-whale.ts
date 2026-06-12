import type { CharacterCard } from "@tcg/lorcana-types";
import { kuzcoTemporaryWhaleI18n } from "./045-kuzco-temporary-whale.i18n";

export const kuzcoTemporaryWhale: CharacterCard = {
  id: "0mo",
  canonicalId: "ci_0mo",
  reprints: ["set7-045"],
  cardType: "character",
  name: "Kuzco",
  version: "Temporary Whale",
  inkType: ["amethyst"],
  franchise: "Emperors New Groove",
  set: "007",
  cardNumber: 45,
  rarity: "rare",
  cost: 5,
  strength: 1,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_78e4e2811167449d9b2d7a3fa7c0908b",
    tcgPlayer: 618694,
  },
  text: [
    {
      title: "DON'T YOU SAY A WORD",
      description:
        "Once during your turn, whenever a card is put into your inkwell, you may return chosen character, item, or location with cost 2 or less to their player's hand, then that player draws a card.",
    },
  ],
  classifications: ["Storyborn", "King"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "return-to-hand",
              target: {
                selector: "chosen",
                count: 1,
                owner: "any",
                zones: ["play"],
                cardTypes: ["character", "item", "location"],
                filter: [
                  {
                    type: "cost-comparison",
                    comparison: "less-or-equal",
                    value: 2,
                  },
                ],
              },
            },
            {
              type: "draw",
              amount: 1,
              target: "CARD_OWNER",
            },
          ],
        },
        type: "optional",
      },
      id: "122-1",
      name: "DON'T YOU SAY A WORD",
      text: "DON'T YOU SAY A WORD Once during your turn, whenever a card is put into your inkwell, you may return chosen character, item, or location with cost 2 or less to their player's hand, then that player draws a card.",
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
      type: "triggered",
    },
  ],
  i18n: kuzcoTemporaryWhaleI18n,
};
