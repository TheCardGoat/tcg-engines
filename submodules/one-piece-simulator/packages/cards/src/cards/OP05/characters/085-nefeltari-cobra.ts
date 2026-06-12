import type { CharacterCard } from "@tcg/op-types";
import { op05NefeltariCobra085I18n } from "./085-nefeltari-cobra.i18n.ts";

export const op05NefeltariCobra085: CharacterCard = {
  id: "OP05-085",
  cardType: "character",
  color: ["black"],
  rarity: "UC",
  setId: "OP05",
  cost: 2,
  power: 1000,
  counter: 1000,
  traits: ["Alabasta"],
  attribute: "wisdom",
  effect:
    "[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.) [On Play] Trash 1 card from the top of your deck.",
  effects: {
    keywords: ["blocker"],
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "trashFromDeck",
            player: "self",
            amount: 1,
          },
        ],
      },
    ],
  },
  i18n: op05NefeltariCobra085I18n,
};
