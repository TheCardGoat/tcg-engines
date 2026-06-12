import type { ItemCard } from "@tcg/lorcana-types";
import { medalOfHeroesI18n } from "./165-medal-of-heroes.i18n";

export const medalOfHeroes: ItemCard = {
  id: "tVn",
  canonicalId: "ci_tVn",
  reprints: ["set5-165"],
  cardType: "item",
  name: "Medal of Heroes",
  inkType: ["sapphire"],
  franchise: "Wreck It Ralph",
  set: "005",
  cardNumber: 165,
  rarity: "common",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_1aea26c4e3a24196a40c9c10de33fc82",
    tcgPlayer: 559711,
  },
  text: [
    {
      title: "CONGRATULATIONS, SOLDIER",
      description:
        "{E}, 2 {I}, Banish this item — Chosen character of yours gets +2 {L} this turn.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 2,
        banishSelf: true,
      },
      effect: {
        duration: "this-turn",
        modifier: 2,
        stat: "lore",
        target: "YOUR_CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "b7p-1",
      name: "CONGRATULATIONS, SOLDIER",
      text: "CONGRATULATIONS, SOLDIER {E}, 2 {I}, Banish this item — Chosen character of yours gets +2 {L} this turn.",
      type: "activated",
    },
  ],
  i18n: medalOfHeroesI18n,
};
