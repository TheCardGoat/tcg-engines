import type { CharacterCard } from "@tcg/op-types";
import { op07Sanji064I18n } from "./064-sanji.i18n.ts";

export const op07Sanji064: CharacterCard = {
  id: "OP07-064",
  cardType: "character",
  color: ["purple"],
  rarity: "SR",
  setId: "OP07",
  cost: 6,
  power: 6000,
  counter: 2000,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP07-064_p1.jpg",
      imageId: "OP07-064_p1",
    },
  ],
  effect:
    "If the number of DON!! cards on your field is at least 2 less than the number on your opponent's field, give this card in your hand -3 cost. [Blocker] (After your opponent declares an attack, you may rest this card to make it the new target of the attack.)",
  effects: {
    keywords: ["blocker"],
  },
  i18n: op07Sanji064I18n,
};
