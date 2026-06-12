import type { CharacterCard } from "@tcg/op-types";
import { op12VinsmokeReiju063I18n } from "./063-vinsmoke-reiju.i18n.ts";

export const op12VinsmokeReiju063: CharacterCard = {
  id: "OP12-063",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP12",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["The Vinsmoke Family GERMA 66"],
  attribute: "special",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP12-063_p1_qKrPCJQ.jpg",
      imageId: "OP12-063_p1",
    },
  ],
  effect:
    "If you have 4 or more Events in your trash, this Character gains +2000 power and +5 cost.\n[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op12VinsmokeReiju063I18n,
};
