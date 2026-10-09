import type { CharacterCard } from "@tcg/op-types";
import { st29NicoRobin009I18n } from "./st29-009-nico-robin.i18n.ts";
export const st29NicoRobin009: CharacterCard = {
  id: "ST29-009",
  canonicalId: "ST29-009",
  slug: "nico-robin/st29-009",
  name: "Nico Robin",
  printings: [
    {
      id: "ST29-009",
      artId: "ST29-009",
      setCode: "ST29",
      collectorNumber: "009",
      rarity: "C",
      imageUrl: "https://en.onepiece-cardgame.com/images/cardlist/card/ST29-009.png",
    },
  ],
  cardType: "character",
  color: ["yellow"],
  rarity: "C",
  setId: "ST29",
  cost: 4,
  power: 2000,
  counter: 2000,
  traits: ["Egghead", "Straw Hat Crew"],
  attribute: "strike",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  trigger: "If your Leader is [Monkey.D.Luffy], play this card.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "trigger",
        conditions: [
          {
            condition: "leaderName",
            name: "Monkey.D.Luffy",
          },
        ],
        actions: [
          {
            action: "playThisCard",
          },
        ],
      },
    ],
  },
  i18n: st29NicoRobin009I18n,
};
