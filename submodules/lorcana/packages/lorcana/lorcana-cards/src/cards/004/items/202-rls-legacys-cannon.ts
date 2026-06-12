import type { ItemCard } from "@tcg/lorcana-types";
import { rlsLegacysCannonI18n } from "./202-rls-legacys-cannon.i18n";

export const rlsLegacysCannon: ItemCard = {
  id: "gkg",
  canonicalId: "ci_gkg",
  reprints: ["set4-202"],
  cardType: "item",
  name: "RLS Legacy's Cannon",
  inkType: ["steel"],
  franchise: "Treasure Planet",
  set: "004",
  cardNumber: 202,
  rarity: "rare",
  cost: 3,
  inkable: false,
  externalIds: {
    lorcast: "crd_d12740d7854a4ff69d2921c943454bc8",
    tcgPlayer: 548537,
  },
  text: [
    {
      title: "BA-BOOM!",
      description: "{E}, 2 {I}, Discard a card — Deal 2 damage to chosen character or location.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 2,
        discardCards: 1,
        discardChosen: true,
      },
      effect: {
        amount: 2,
        target: {
          cardTypes: ["character", "location"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "deal-damage",
      },
      id: "1rt-1",
      name: "BA-BOOM!",
      text: "BA-BOOM! {E}, 2 {I}, Discard a card — Deal 2 damage to chosen character or location.",
      type: "activated",
    },
  ],
  i18n: rlsLegacysCannonI18n,
};
