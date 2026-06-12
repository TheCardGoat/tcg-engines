import type { LeaderCard } from "@tcg/op-types";
import { op01MonkeyDLuffy003I18n } from "./003-monkey-d-luffy.i18n.ts";

export const op01MonkeyDLuffy003: LeaderCard = {
  id: "OP01-003",
  cardType: "leader",
  color: ["green", "red"],
  rarity: "L",
  setId: "OP01",
  power: 5000,
  life: 4,
  traits: ["Straw Hat Crew Supernovas"],
  attribute: "strike",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP01-003_p1.jpg",
      imageId: "OP01-003_p1",
    },
  ],
  effect:
    '[Activate:Main] [Once Per Turn] (4) (You may rest the specified number of DON!! cards in your cost area): Set up to 1 of your "Supernova" or "Straw Hat Crew" type Character cards with a cost of 5 or less as active. It gains +1000 power during this turn.  This card has been officially errata\'d.',
  i18n: op01MonkeyDLuffy003I18n,
};
