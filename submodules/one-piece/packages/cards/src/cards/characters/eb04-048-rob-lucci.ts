import type { CharacterCard } from "@tcg/op-types";
import { eb04RobLucci048I18n } from "./eb04-048-rob-lucci.i18n.ts";

export const eb04RobLucci048: CharacterCard = {
  id: "EB04-048",
  canonicalId: "EB04-048",
  slug: "rob-lucci/eb04-048",
  name: "Rob Lucci",
  printings: [
    {
      id: "EB04-048",
      artId: "EB04-048",
      setCode: "EB04",
      collectorNumber: "048",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-048_kr3745G.jpg",
    },
    {
      id: "EB04-048_p1",
      artId: "EB04-048_p1",
      setCode: "EB04",
      collectorNumber: "048",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/EB04-048_p1_f9OEOVs.jpg",
      label: "Rob Lucci (Alternate Art)",
    },
  ],
  cardType: "character",
  color: ["black"],
  rarity: "SR",
  setId: "EB04",
  cost: 4,
  power: 6000,
  traits: ["CP0 Egghead"],
  attribute: "strike",
  effect:
    'If your Leader\'s type includes "CP", this Character gains +1000 power and -2 cost for every 5 cards in your trash.\n[On Play] You may trash 1 of your Characters: Draw 1 card.',
  effects: {},

  i18n: eb04RobLucci048I18n,
};
