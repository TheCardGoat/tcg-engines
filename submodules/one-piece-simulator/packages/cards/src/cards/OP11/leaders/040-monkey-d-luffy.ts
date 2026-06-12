import type { LeaderCard } from "@tcg/op-types";
import { op11MonkeyDLuffy040I18n } from "./040-monkey-d-luffy.i18n.ts";

export const op11MonkeyDLuffy040: LeaderCard = {
  id: "OP11-040",
  cardType: "leader",
  color: ["blue", "purple"],
  rarity: "L",
  setId: "OP11",
  power: 6000,
  life: 3,
  traits: ["Straw Hat Crew"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP11-040_p1.jpg",
      imageId: "OP11-040_p1",
    },
  ],
  effect:
    'This effect can be activated at the start of your turn. If you have 8 or more DON!! cards on your field, look at 5 cards from the top of your deck; reveal up to 1 "Straw Hat Crew" type card and add it to your hand. Then, place the rest at the top or bottom of the deck in any order.',
  i18n: op11MonkeyDLuffy040I18n,
};
