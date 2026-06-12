import type { ItemCard } from "@tcg/lorcana-types";
import { steelChromiconI18n } from "./202-steel-chromicon.i18n";

export const steelChromicon: ItemCard = {
  id: "Q8H",
  canonicalId: "ci_Q8H",
  reprints: ["set5-202"],
  cardType: "item",
  name: "Steel Chromicon",
  inkType: ["steel"],
  franchise: "Lorcana",
  set: "005",
  cardNumber: 202,
  rarity: "uncommon",
  cost: 6,
  inkable: false,
  externalIds: {
    lorcast: "crd_6cda288d106d4d46837a3c11690dce63",
    tcgPlayer: 560101,
  },
  text: [
    {
      title: "STEEL LIGHT",
      description: "{E} — Deal 1 damage to chosen character.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        target: "CHOSEN_CHARACTER",
        type: "deal-damage",
      },
      id: "1lw-1",
      name: "STEEL LIGHT",
      text: "STEEL LIGHT {E} — Deal 1 damage to chosen character.",
      type: "activated",
    },
  ],
  i18n: steelChromiconI18n,
};
