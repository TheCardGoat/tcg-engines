import type { ItemCard } from "@tcg/lorcana-types";
import { fryingPanI18n } from "./202-frying-pan.i18n";

export const fryingPan: ItemCard = {
  id: "HLs",
  canonicalId: "ci_HLs",
  reprints: ["set1-202"],
  cardType: "item",
  name: "Frying Pan",
  inkType: ["steel"],
  franchise: "Tangled",
  set: "001",
  cardNumber: 202,
  rarity: "uncommon",
  cost: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_aa294faf68c14f559c22e0e79a6c101e",
    tcgPlayer: 492999,
  },
  text: [
    {
      title: "CLANG!",
      description: "Banish this item — Chosen character can't challenge during their next turn.",
    },
  ],
  abilities: [
    {
      cost: {
        banishSelf: true,
      },
      effect: {
        duration: "their-next-turn",
        restriction: "cant-challenge",
        target: "CHOSEN_CHARACTER",
        type: "restriction",
      },
      id: "1mv-1",
      name: "CLANG!",
      text: "CLANG! Banish this item — Chosen character can't challenge during their next turn.",
      type: "activated",
    },
  ],
  i18n: fryingPanI18n,
};
