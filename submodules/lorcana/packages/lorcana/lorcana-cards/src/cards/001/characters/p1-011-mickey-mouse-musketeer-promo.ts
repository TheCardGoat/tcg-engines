import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseMusketeerP1PromoI18n } from "./p1-011-mickey-mouse-musketeer-promo.i18n";

import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const mickeyMouseMusketeerP1Promo: CharacterCard = {
  id: "Un6",
  canonicalId: "ci_4nt",
  slug: "lorcana-ci_4nt",
  printings: [
    {
      id: "set1-p1-011-promo",
      artId: "ci_4nt-promo",
      setCode: "set1",
      collectorNumber: "11",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set1-186"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Musketeer",
  inkType: ["steel"],
  set: "001",
  cardNumber: 11,
  rarity: "special",
  specialRarity: "promo",
  cost: 6,
  strength: 2,
  willpower: 7,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_94245aa3b4a241379cf9f7fbbf7f6cd7",
    tcgPlayer: "494141",
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "ALL FOR ONE",
      description: "Your other Musketeer characters get +1 {S}.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Musketeer"],
  abilities: [
    bodyguard,
    {
      effect: {
        modifier: 1,
        stat: "strength",
        target: {
          count: "all",
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Musketeer",
            },
          ],
          excludeSelf: true,
        },
        type: "modify-stat",
      },
      id: "9h9-2",
      name: "ALL FOR ONE",
      text: "ALL FOR ONE Your other Musketeer characters get +1 {S}.",
      type: "static",
    },
  ],
  i18n: mickeyMouseMusketeerP1PromoI18n,
};
