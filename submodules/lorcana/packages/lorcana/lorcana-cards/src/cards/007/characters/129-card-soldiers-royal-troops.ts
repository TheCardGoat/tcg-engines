import type { CharacterCard } from "@tcg/lorcana-types";
import { cardSoldiersRoyalTroopsI18n } from "./129-card-soldiers-royal-troops.i18n";

export const cardSoldiersRoyalTroops: CharacterCard = {
  id: "HaH",
  canonicalId: "ci_HaH",
  reprints: ["set7-129"],
  cardType: "character",
  name: "Card Soldiers",
  version: "Royal Troops",
  inkType: ["ruby"],
  franchise: "Alice in Wonderland",
  set: "007",
  cardNumber: 129,
  rarity: "common",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_ae70cf678a1f47fe9082e2b769fe2a3c",
    tcgPlayer: 618707,
  },
  text: [
    {
      title: "TAKE POINT",
      description: "While a damaged character is in play, this character gets +2 {S}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      condition: {
        type: "resource-count",
        what: "damaged-characters",
        controller: "any",
        comparison: "greater-or-equal",
        value: 1,
      },
      id: "1p8-1",
      name: "TAKE POINT",
      text: "TAKE POINT While a damaged character is in play, this character gets +2 {S}.",
      type: "static",
    },
  ],
  i18n: cardSoldiersRoyalTroopsI18n,
};
