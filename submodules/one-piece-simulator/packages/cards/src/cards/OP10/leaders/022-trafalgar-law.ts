import type { LeaderCard } from "@tcg/op-types";
import { op10TrafalgarLaw022I18n } from "./022-trafalgar-law.i18n.ts";

export const op10TrafalgarLaw022: LeaderCard = {
  id: "OP10-022",
  cardType: "leader",
  color: ["green", "yellow"],
  rarity: "L",
  setId: "OP10",
  power: 5000,
  life: 4,
  traits: ["Heart Pirates Supernovas Dressrosa"],
  attribute: "slash",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-022_p1.jpg",
      imageId: "OP10-022_p1",
    },
  ],
  effect:
    '[DON!! x1] [Activate: Main] [Once Per Turn] If the total cost of your Characters is 5 or more, you may return 1 of your Characters to the owner\'s hand: Reveal 1 card from the top of your Life cards. If that card is a "Supernovas" type Character card with a cost of 5 or less, you may play that card.',
  i18n: op10TrafalgarLaw022I18n,
};
