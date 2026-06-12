import type { CharacterCard } from "@tcg/lorcana-types";
import { hadesHotheadedRulerI18n } from "./174-hades-hotheaded-ruler.i18n";

export const hadesHotheadedRuler: CharacterCard = {
  id: "3Tj",
  canonicalId: "ci_3Tj",
  reprints: ["set3-174"],
  cardType: "character",
  name: "Hades",
  version: "Hotheaded Ruler",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "003",
  cardNumber: 174,
  rarity: "rare",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_380dc3639d7349c28a244b65ed675fcb",
    tcgPlayer: 539106,
  },
  text: [
    {
      title: "CALL THE TITANS",
      description: "{E} — Ready your Titan characters.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Deity"],
  abilities: [
    {
      id: "3Tj-1",
      name: "CALL THE TITANS",
      text: "CALL THE TITANS {E} — Ready your Titan characters.",
      type: "activated",
      cost: {
        exert: true,
      },
      effect: {
        type: "ready",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Titan",
            },
          ],
        },
      },
    },
  ],
  i18n: hadesHotheadedRulerI18n,
};
