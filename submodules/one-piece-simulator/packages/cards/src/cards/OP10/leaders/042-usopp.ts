import type { LeaderCard } from "@tcg/op-types";
import { op10Usopp042I18n } from "./042-usopp.i18n.ts";

export const op10Usopp042: LeaderCard = {
  id: "OP10-042",
  cardType: "leader",
  color: ["blue", "black"],
  rarity: "L",
  setId: "OP10",
  power: 5000,
  life: 4,
  traits: ["Straw Hat Crew Dressrosa"],
  attribute: "ranged",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-042_p1.jpg",
      imageId: "OP10-042_p1",
    },
  ],
  effect:
    'All of your "Dressrosa" type Characters with a cost of 2 or more gain +1 cost.[Opponent\'s Turn] [Once Per Turn] This effect can be activated when your "Dressrosa" type Character is removed from the field by your opponent\'s effect or K.O.\'d. If you have 5 or less cards in your hand, draw 1 card.',
  i18n: op10Usopp042I18n,
};
