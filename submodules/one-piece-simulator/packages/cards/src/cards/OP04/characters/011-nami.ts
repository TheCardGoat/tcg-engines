import type { CharacterCard } from "@tcg/op-types";
import { op04Nami011I18n } from "./011-nami.i18n.ts";

export const op04Nami011: CharacterCard = {
  id: "OP04-011",
  cardType: "character",
  color: ["red"],
  rarity: "C",
  setId: "OP04",
  cost: 2,
  power: 3000,
  counter: 1000,
  traits: ["Alabasta Straw Hat Crew"],
  attribute: "wisdom",
  effect:
    "[When Attacking] Reveal 1 card from the top of your deck. If the revealed card is a Character card with 6000 power or more, this Character gains +3000 power during this turn. Then, place the revealed card at the bottom of your deck.",
  effects: {
    effects: [
      {
        trigger: "whenAttacking",
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
  i18n: op04Nami011I18n,
};
