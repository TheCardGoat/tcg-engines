import type { CharacterCard } from "@tcg/lorcana-types";
import { buckySquirrelSqueakTutorP1PromoI18n } from "./p1-015-bucky-squirrel-squeak-tutor-promo.i18n";

export const buckySquirrelSqueakTutorP1Promo: CharacterCard = {
  id: "ttV",
  canonicalId: "ci_q4H",
  slug: "lorcana-ci_q4H",
  printings: [
    {
      id: "set2-p1-015-promo",
      artId: "ci_q4H-promo",
      setCode: "set2",
      collectorNumber: "15",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set2-073"],
  cardType: "character",
  name: "Bucky",
  version: "Squirrel Squeak Tutor",
  inkType: ["emerald"],
  franchise: "Emperors New Groove",
  set: "002",
  cardNumber: 15,
  rarity: "special",
  specialRarity: "promo",
  cost: 3,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_b577553c749f4093b477e1ade7e52a2b",
    tcgPlayer: "519506",
  },
  text: [
    {
      title: "SQUEAK",
      description:
        "Whenever you play a Floodborn character, if you used Shift to play them, each opponent chooses and discards a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        condition: {
          expression: "you used Shift to play them",
          type: "if",
        },
        then: {
          amount: 1,
          chosen: true,
          target: "EACH_OPPONENT",
          type: "discard",
        },
        type: "conditional",
      },
      id: "tzh-1",
      name: "SQUEAK",
      text: "SQUEAK Whenever you play a Floodborn character, if you used Shift to play them, each opponent chooses and discards a card.",
      trigger: {
        event: "play",
        on: {
          cardType: "character",
          classification: "Floodborn",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: buckySquirrelSqueakTutorP1PromoI18n,
};
