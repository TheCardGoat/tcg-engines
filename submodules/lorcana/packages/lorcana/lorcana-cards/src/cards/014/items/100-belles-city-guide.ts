import type { ItemCard } from "@tcg/lorcana-types";
import { bellesCityGuideI18n } from "./100-belles-city-guide.i18n";

export const bellesCityGuide: ItemCard = {
  id: "h3H",
  canonicalId: "ci_h3H",
  slug: "lorcana-ci_h3H",
  printings: [
    {
      id: "set14-100",
      artId: "set14-100",
      setCode: "set14",
      collectorNumber: "100",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-100"],
  cardType: "item",
  name: "Belle's City Guide",
  inkType: ["emerald"],
  franchise: "Beauty and the Beast",
  set: "014",
  cardNumber: 100,
  rarity: "rare",
  cost: 2,
  inkable: false,
  abilities: [
    {
      id: "h3H-1",
      name: "Insider Info",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "conditional",
        condition: {
          type: "turn-metric",
          metric: "played-actions",
          comparison: { operator: "gte", value: 1 },
        },
        then: {
          type: "gain-lore",
          amount: 1,
          target: "CONTROLLER",
        },
      },
      text: "Insider Info {E} — If you played an action this turn, gain 1 lore.",
    },
  ],
  text: [
    {
      title: "Insider Info",
      description: "{E} — If you played an action this turn, gain 1 lore.",
    },
  ],
  i18n: bellesCityGuideI18n,
};
