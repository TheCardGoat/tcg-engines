import type { CharacterCard } from "@tcg/lorcana-types";
import { pongoDeterminedFatherEnchantedI18n } from "./223-pongo-determined-father-enchanted.i18n";

export const pongoDeterminedFatherEnchanted: CharacterCard = {
  id: "o1w",
  canonicalId: "ci_4Yx",
  slug: "lorcana-ci_4Yx",
  printings: [
    {
      id: "set9-223-enchanted",
      artId: "ci_4Yx-enchanted",
      setCode: "set9",
      collectorNumber: "223",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set3-019", "set9-002"],
  cardType: "character",
  name: "Pongo",
  version: "Determined Father",
  inkType: ["amber"],
  franchise: "101 Dalmatians",
  set: "009",
  cardNumber: 223,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c233fd3627b24b02bd616aa62bbdc83a",
    tcgPlayer: "651110",
  },
  text: [
    {
      title: "TWILIGHT BARK",
      description:
        "Once during your turn, you may pay 2 {I} to reveal the top card of your deck. If it's a character card, put it into your hand. Otherwise, put it on the bottom of your deck.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      cost: {
        ink: 2,
      },
      effect: {
        type: "scry",
        amount: 1,
        target: "CONTROLLER",
        revealAll: true,
        destinations: [
          {
            zone: "hand",
            min: 0,
            max: 1,
            filter: {
              type: "card-type",
              cardType: "character",
            },
          },
          {
            zone: "deck-bottom",
            remainder: true,
          },
        ],
      },
      id: "1ve-1",
      name: "TWILIGHT BARK",
      text: "TWILIGHT BARK Once during your turn, you may pay 2 {I} to reveal the top card of your deck. If it's a character card, put it into your hand. Otherwise, put it on the bottom of your deck.",
      type: "activated",
      restrictions: [
        {
          type: "once-per-turn",
        },
      ],
    },
  ],
  i18n: pongoDeterminedFatherEnchantedI18n,
};
