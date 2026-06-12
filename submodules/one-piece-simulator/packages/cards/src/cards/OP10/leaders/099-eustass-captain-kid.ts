import type { LeaderCard } from "@tcg/op-types";
import { op10EustassCaptainKid099I18n } from "./099-eustass-captain-kid.i18n.ts";

export const op10EustassCaptainKid099: LeaderCard = {
  id: "OP10-099",
  cardType: "leader",
  color: ["yellow"],
  rarity: "L",
  setId: "OP10",
  power: 5000,
  life: 5,
  traits: ["Kid Pirates Supernovas"],
  attribute: "special",
  artVariants: [
    {
      type: "parallel",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP10-099_p1.jpg",
      imageId: "OP10-099_p1",
    },
  ],
  effect:
    '[End of Your Turn] You may turn 1 card from the top of your Life cards face-up: Set up to 1 of your "Supernovas" type Characters with a cost of 3 to 8 as active. That Character gains [Blocker] until the end of your opponent\'s next turn.',
  i18n: op10EustassCaptainKid099I18n,
};
