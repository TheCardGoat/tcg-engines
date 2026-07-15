import type { CharacterCard } from "@tcg/op-types";
import { op08SpeedJil049I18n } from "./049-speed-jil.i18n.ts";

export const op08SpeedJil049: CharacterCard = {
  id: "OP08-049",
  canonicalId: "OP08-049",
  slug: "speed-jil/op08-049",
  name: "Speed Jil",
  printings: [
    {
      id: "OP08-049",
      artId: "OP08-049",
      setCode: "OP08",
      collectorNumber: "049",
      rarity: "C",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP08-049.jpg",
    },
  ],
  cardType: "character",
  color: ["blue"],
  rarity: "C",
  setId: "OP08",
  cost: 4,
  power: 5000,
  counter: 1000,
  traits: ["Whitebeard Pirates"],
  attribute: "slash",
  effect:
    '[On Play] Reveal 1 card from the top of your deck and place it at the top or bottom of your deck. If the revealed card\'s type includes "Whitebeard Piratess", this Character gains [Rush] during this turn. (This card can attack on the turn in which it is played.)',
  effects: {
    effects: [
      {
        trigger: "onPlay",
        actions: [
          {
            action: "rearrangeDeck",
            player: "self",
            count: 1,
            position: "top",
          },
        ],
      },
    ],
  },
  i18n: op08SpeedJil049I18n,
};
