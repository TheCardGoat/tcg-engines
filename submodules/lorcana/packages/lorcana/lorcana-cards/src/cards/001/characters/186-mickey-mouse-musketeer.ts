import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseMusketeerI18n } from "./186-mickey-mouse-musketeer.i18n";
import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const mickeyMouseMusketeer: CharacterCard = {
  id: "sdI",
  canonicalId: "ci_sdI",
  reprints: ["set1-186"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Musketeer",
  inkType: ["steel"],
  set: "001",
  cardNumber: 186,
  rarity: "rare",
  cost: 6,
  strength: 2,
  willpower: 7,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_94245aa3b4a241379cf9f7fbbf7f6cd7",
    tcgPlayer: 494141,
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
  i18n: mickeyMouseMusketeerI18n,
};
