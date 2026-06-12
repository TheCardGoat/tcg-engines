import type { CharacterCard } from "@tcg/op-types";
import { prb01VinsmokeYonjiOp06067JollyRogerFoil067I18n } from "./067-vinsmoke-yonji-op06-067-jolly-roger-foil.i18n.ts";

export const prb01VinsmokeYonjiOp06067JollyRogerFoil067: CharacterCard = {
  id: "OP06-067",
  cardType: "character",
  color: ["purple"],
  rarity: "R",
  setId: "PRB01",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["The Vinsmoke Family GERMA 66"],
  attribute: "strike",
  artVariants: [
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-067_p3.jpg",
      imageId: "OP06-067_p3",
    },
    {
      type: "other",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-067_r1.png",
      imageId: "OP06-067_r1",
    },
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP06-067_p4.jpg",
      imageId: "OP06-067_p4",
    },
  ],
  effect:
    "If the number of DON!! cards on your field is equal to or less than the number on your opponent's field, this Character gains +1000 power.[Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: prb01VinsmokeYonjiOp06067JollyRogerFoil067I18n,
};
