import type { LeaderCard } from "@tcg/op-types";
import { op13MonkeyDLuffy001I18n } from "./001-monkey-d-luffy.i18n.ts";

export const op13MonkeyDLuffy001: LeaderCard = {
  id: "OP13-001",
  cardType: "leader",
  color: ["green", "red"],
  rarity: "L",
  setId: "OP13",
  power: 5000,
  life: 4,
  traits: ["Straw Hat Crew Supernovas"],
  attribute: "strike",
  artVariants: [
    {
      type: "alternate-art",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP13-001_p1_ovgL62d.jpg",
      imageId: "OP13-001_p1",
    },
  ],
  effect:
    '[DON!! x1] [On Your Opponent\'s Attack] If you have 5 or less active DON!! cards, you may rest any number of your DON!! cards. For every DON!! card rested this way, this Leader or up to 1 of your "Straw Hat Crew" type Characters gains +2000 power during this battle.',
  i18n: op13MonkeyDLuffy001I18n,
};
