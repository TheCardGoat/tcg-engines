import type { CharacterCard } from "@tcg/op-types";
import { eb03Perona045I18n } from "./045-perona.i18n.ts";

export const eb03Perona045: CharacterCard = {
  id: "EB03-045",
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "EB03",
  cost: 4,
  power: 6000,
  traits: ["Thriller Bark Pirates Muggy Kingdom"],
  attribute: "special",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-045_p2_FebtrFt.jpg",
      imageId: "EB03-045_p2",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB03-045_p1_t1FYjF7.jpg",
      imageId: "EB03-045_p1",
    },
  ],
  effect:
    "[Blocker]\n[On Play] Give up to 1 rested DON!! card to your Leader or 1 of your Characters. Then, if you have 10 or more cards in your trash, play up to 1 {Thriller Bark Pirates} type Character card with a cost of 2 or less from your trash rested.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "giveDon",
            target: {
              player: "self",
              zones: ["leader", "character"],
              count: {
                amount: 1,
              },
            },
            count: {
              amount: 1,
              upTo: true,
            },
            donState: "rested",
          },
        ],
      },
    ],
  },
  i18n: eb03Perona045I18n,
};
