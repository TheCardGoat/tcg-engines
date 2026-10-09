import type { CharacterCard } from "@tcg/op-types";
import { st08NefeltariVivi007I18n } from "./st08-007-nefeltari-vivi.i18n.ts";
export const st08NefeltariVivi007: CharacterCard = {
  id: "ST08-007",
  canonicalId: "ST08-007",
  slug: "nefeltari-vivi/st08-007",
  name: "Nefeltari Vivi",
  printings: [
    {
      id: "ST08-007",
      artId: "ST08-007",
      setCode: "ST08",
      collectorNumber: "007",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST08-007.png",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "C",
  setId: "ST08",
  traits: ["Alabasta"],
  cost: 3,
  power: 1000,
  counter: 1000,
  attribute: "slash",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  trigger: "Play this card.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "trigger",
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: st08NefeltariVivi007I18n,
};
