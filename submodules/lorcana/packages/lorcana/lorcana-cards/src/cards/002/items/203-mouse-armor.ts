import type { ItemCard } from "@tcg/lorcana-types";
import { mouseArmorI18n } from "./203-mouse-armor.i18n";

export const mouseArmor: ItemCard = {
  id: "ab5",
  canonicalId: "ci_ab5",
  reprints: ["set2-203"],
  cardType: "item",
  name: "Mouse Armor",
  inkType: ["steel"],
  franchise: "Great Mouse Detective",
  set: "002",
  cardNumber: 203,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_a529727601b84e9ca6f8b5052d1d2572",
    tcgPlayer: 520862,
  },
  text: [
    {
      title: "PROTECTION",
      description: "{E} — Chosen character gains Resist +1 until the start of your next turn.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        duration: "until-start-of-next-turn",
        keyword: "Resist",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
        value: 1,
      },
      id: "1as-1",
      name: "PROTECTION",
      text: "PROTECTION {E} — Chosen character gains Resist +1 until the start of your next turn.",
      type: "activated",
    },
  ],
  i18n: mouseArmorI18n,
};
