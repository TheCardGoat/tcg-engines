import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMousePirateLookoutI18n } from "./120-minnie-mouse-pirate-lookout.i18n";

export const minnieMousePirateLookout: CharacterCard = {
  id: "D2o",
  canonicalId: "ci_D2o",
  reprints: ["set6-120"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Pirate Lookout",
  inkType: ["ruby"],
  set: "006",
  cardNumber: 120,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_0e20ed4554c44df494fcf78ac9ce0239",
    tcgPlayer: 593028,
  },
  text: [
    {
      title: "LAND, HO!",
      description:
        "Once during your turn, whenever a card is put into your inkwell, you may return a location card from your discard to your hand.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Pirate"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          cardType: "location",
          target: "CONTROLLER",
          type: "return-from-discard",
        },
        type: "optional",
      },
      id: "1hl-1",
      name: "LAND, HO!",
      text: "LAND, HO! Once during your turn, whenever a card is put into your inkwell, you may return a location card from your discard to your hand.",
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
  i18n: minnieMousePirateLookoutI18n,
};
