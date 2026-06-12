import type { CharacterCard } from "@tcg/lorcana-types";
import { dawsonPuzzlingSleuthI18n } from "./161-dawson-puzzling-sleuth.i18n";

export const dawsonPuzzlingSleuth: CharacterCard = {
  id: "RK6",
  canonicalId: "ci_RK6",
  reprints: ["set7-161"],
  cardType: "character",
  name: "Dawson",
  version: "Puzzling Sleuth",
  inkType: ["sapphire"],
  franchise: "Great Mouse Detective",
  set: "007",
  cardNumber: 161,
  rarity: "rare",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_9fcd1bf3255d48ecb5f16b78512c01bb",
    tcgPlayer: 619499,
  },
  text: [
    {
      title: "BE SENSIBLE",
      description:
        "Once during your turn, whenever a card is put into your inkwell, look at the top card of your deck. You may put it on either the top or the bottom of your deck.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Detective"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "scry",
          amount: 1,
          destinations: [
            {
              zone: "deck-top",
              min: 0,
              max: 1,
            },
            {
              zone: "deck-bottom",
              remainder: true,
            },
          ],
        },
        type: "optional",
      },
      id: "1t5-1",
      name: "BE SENSIBLE",
      text: "BE SENSIBLE Once during your turn, whenever a card is put into your inkwell, look at the top card of your deck. You may put it on either the top or the bottom of your deck.",
      trigger: {
        event: "ink",
        on: "CONTROLLER",
        timing: "whenever",
        restrictions: [
          {
            type: "once-per-turn",
          },
        ],
      },
      type: "triggered",
    },
  ],
  i18n: dawsonPuzzlingSleuthI18n,
};
