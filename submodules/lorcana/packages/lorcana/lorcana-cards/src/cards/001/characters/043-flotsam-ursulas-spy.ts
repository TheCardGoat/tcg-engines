import type { CharacterCard } from "@tcg/lorcana-types";
import { flotsamUrsulasSpyI18n } from "./043-flotsam-ursulas-spy.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const flotsamUrsulasSpy: CharacterCard = {
  id: "BDi",
  canonicalId: "ci_BDi",
  reprints: ["set1-043"],
  cardType: "character",
  name: "Flotsam",
  version: "Ursula’s Spy",
  inkType: ["amethyst"],
  franchise: "Little Mermaid",
  set: "001",
  cardNumber: 43,
  rarity: "rare",
  cost: 5,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_e5912655e48f42a9ab863ac2337171cc",
    tcgPlayer: 503318,
  },
  text: "Rush DEXTEROUS LUNGE Your characters named Jetsam gain Rush.",
  classifications: ["Storyborn", "Ally"],
  abilities: [
    rush,
    {
      effect: {
        keyword: "Rush",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-name",
              name: "Jetsam",
            },
          ],
        },
        type: "gain-keyword",
      },
      id: "4d0-2",
      name: "DEXTEROUS LUNGE",
      text: "DEXTEROUS LUNGE Your characters named Jetsam gain Rush.",
      type: "static",
    },
  ],
  i18n: flotsamUrsulasSpyI18n,
};
