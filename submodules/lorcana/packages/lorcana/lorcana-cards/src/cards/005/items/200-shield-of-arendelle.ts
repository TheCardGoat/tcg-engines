import type { ItemCard } from "@tcg/lorcana-types";
import { shieldOfArendelleI18n } from "./200-shield-of-arendelle.i18n";

export const shieldOfArendelle: ItemCard = {
  id: "k2d",
  canonicalId: "ci_k2d",
  reprints: ["set5-200"],
  cardType: "item",
  name: "Shield of Arendelle",
  inkType: ["steel"],
  franchise: "Frozen",
  set: "005",
  cardNumber: 200,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c54910dbfc304bb5b4e71639858ceb82",
    tcgPlayer: 561851,
  },
  text: [
    {
      title: "DEFLECT",
      description:
        "Banish this item — Chosen character gains Resist +1 until the start of your next turn.",
    },
  ],
  abilities: [
    {
      cost: {
        banishSelf: true,
      },
      effect: {
        duration: "until-start-of-next-turn",
        keyword: "Resist",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
        value: 1,
      },
      id: "rd3-1",
      name: "DEFLECT",
      text: "DEFLECT Banish this item — Chosen character gains Resist +1 until the start of your next turn.",
      type: "activated",
    },
  ],
  i18n: shieldOfArendelleI18n,
};
