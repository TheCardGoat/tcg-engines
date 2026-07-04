import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMousePirateLookoutP2ChallengeI18n } from "./p2-012-minnie-mouse-pirate-lookout-challenge.i18n";

export const minnieMousePirateLookoutP2Challenge: CharacterCard = {
  id: "m3E",
  canonicalId: "ci_HHx",
  slug: "lorcana-ci_HHx",
  printings: [
    {
      id: "set6-p2-012-challenge",
      artId: "ci_HHx-challenge",
      setCode: "set6",
      collectorNumber: "12",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set6-120"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Pirate Lookout",
  inkType: ["ruby"],
  set: "006",
  cardNumber: 12,
  rarity: "special",
  specialRarity: "challenge",
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
  i18n: minnieMousePirateLookoutP2ChallengeI18n,
};
