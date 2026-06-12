import type { CharacterCard } from "@tcg/op-types";
import { eb01Viola052I18n } from "./052-viola.i18n.ts";

export const eb01Viola052: CharacterCard = {
  id: "EB01-052",
  cardType: "character",
  color: ["yellow"],
  rarity: "SR",
  setId: "EB01",
  cost: 2,
  power: 0,
  counter: 1000,
  traits: ["Dressrosa"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB01-052_p1.jpg",
      imageId: "EB01-052_p1",
    },
  ],
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)[On Play]Choose one:• Look at all of your opponent's Life cards and place them back in their Life area in any order.• Turn all of your Life cards face-down.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "choice",
            options: [
              [
                {
                  action: "rearrangeDeck",
                  player: "opponent",
                  count: 99,
                  position: "topOrBottom",
                },
              ],
              [
                {
                  action: "rearrangeDeck",
                  player: "self",
                  count: 99,
                  position: "top",
                },
              ],
            ],
          },
        ],
      },
    ],
  },
  i18n: eb01Viola052I18n,
};
