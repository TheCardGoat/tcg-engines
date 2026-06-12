import type { CharacterCard } from "@tcg/lorcana-types";
import { widowTweedKindlySoulI18n } from "./026-widow-tweed-kindly-soul.i18n";

export const widowTweedKindlySoul: CharacterCard = {
  id: "EI1",
  canonicalId: "ci_EI1",
  reprints: ["set11-026"],
  cardType: "character",
  name: "Widow Tweed",
  version: "Kindly Soul",
  inkType: ["amber"],
  franchise: "Fox and the Hound",
  set: "011",
  cardNumber: 26,
  rarity: "rare",
  cost: 6,
  strength: 2,
  willpower: 8,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_5d8b927e8f92419c93dd42424d44f562",
    tcgPlayer: 676191,
  },
  text: [
    {
      title: "I'VE GOT YOU",
      description:
        "When you play this character, return a character card from your discard to your hand. If that character is named Tod, you may play him for free.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "i8u-1",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "return-from-discard",
            cardType: "character",
            target: "CONTROLLER",
          },
          {
            type: "conditional",
            condition: {
              type: "returned-card-is-named",
              name: "Tod",
            },
            then: {
              type: "optional",
              chooser: "CONTROLLER",
              effect: {
                type: "play-card",
                from: "hand",
                cost: "free",
                filter: {
                  name: "Tod",
                  cardType: "character",
                },
              },
            },
          },
        ],
      },
      name: "I'VE GOT YOU",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "I'VE GOT YOU When you play this character, return a character card from your discard to your hand. If that character is named Tod, you may play him for free.",
    },
  ],
  i18n: widowTweedKindlySoulI18n,
};
