import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMousePirateLookoutP3PromoI18n } from "./p3-017-minnie-mouse-pirate-lookout-promo.i18n";

export const minnieMousePirateLookoutP3Promo: CharacterCard = {
  id: "ii5",
  canonicalId: "ci_HHx",
  slug: "lorcana-ci_HHx",
  printings: [
    {
      id: "set6-p3-017-promo",
      artId: "ci_HHx-promo",
      setCode: "set6",
      collectorNumber: "17",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set6-120"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Pirate Lookout",
  inkType: ["ruby"],
  set: "006",
  cardNumber: 17,
  rarity: "special",
  specialRarity: "promo",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_bbd9d2a6b1194759b18eb6e58a3c3d3e",
    tcgPlayer: "650215",
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
  i18n: minnieMousePirateLookoutP3PromoI18n,
};
