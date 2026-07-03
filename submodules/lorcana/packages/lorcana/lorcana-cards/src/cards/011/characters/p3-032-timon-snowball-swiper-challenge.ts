import type { CharacterCard } from "@tcg/lorcana-types";
import { timonSnowballSwiperP3ChallengeI18n } from "./p3-032-timon-snowball-swiper-challenge.i18n";

export const timonSnowballSwiperP3Challenge: CharacterCard = {
  id: "yDQ",
  canonicalId: "ci_jn6",
  slug: "lorcana-ci_jn6",
  printings: [
    {
      id: "set11-p3-032-challenge",
      artId: "ci_jn6-challenge",
      setCode: "set11",
      collectorNumber: "32",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set11-016"],
  cardType: "character",
  name: "Timon",
  version: "Snowball Swiper",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "011",
  cardNumber: 32,
  rarity: "special",
  specialRarity: "challenge",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_4b2cd621705743f38c49fee9f610bdec",
    tcgPlayer: "673339",
  },
  text: [
    {
      title: "GET RID OF THAT",
      description:
        "When you play this character, chosen opponent reveals their hand and discards a non-character card of your choice.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "owY-1",
      type: "triggered",
      name: "GET RID OF THAT",
      text: "GET RID OF THAT When you play this character, chosen opponent reveals their hand and discards a non-character card of your choice.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "reveal-hand",
            target: "OPPONENT",
          },
          {
            type: "discard",
            amount: 1,
            target: "OPPONENT",
            from: "hand",
            chosen: true,
            chosenBy: "you",
            filter: {
              notCardType: "character",
            },
          },
        ],
      },
    },
  ],
  i18n: timonSnowballSwiperP3ChallengeI18n,
};
