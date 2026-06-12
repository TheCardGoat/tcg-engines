import type { ItemCard } from "@tcg/lorcana-types";
import { enigmaticInkcasterI18n } from "./100-enigmatic-inkcaster.i18n";

export const enigmaticInkcaster: ItemCard = {
  id: "Nmx",
  canonicalId: "ci_Nmx",
  reprints: ["set10-100"],
  cardType: "item",
  name: "Enigmatic Inkcaster",
  inkType: ["emerald"],
  franchise: "Lorcana",
  set: "010",
  cardNumber: 100,
  rarity: "rare",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_d774288aca6149239c554da4daab38b4",
    tcgPlayer: 659453,
  },
  text: [
    {
      title: "ITS OWN REWARD",
      description: "{E} — If you've played 2 or more cards this turn, gain 1 lore.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
      },
      condition: {
        type: "turn-metric",
        metric: "played-cards",
        comparison: {
          operator: "gte",
          value: 2,
        },
      },
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "Nmx-1",
      name: "ITS OWN REWARD",
      text: "ITS OWN REWARD {E} — If you've played 2 or more cards this turn, gain 1 lore.",
      type: "activated",
    },
  ],
  i18n: enigmaticInkcasterI18n,
};
