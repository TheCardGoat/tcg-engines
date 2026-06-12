import type { CharacterCard } from "@tcg/lorcana-types";
import { captainHookRuthlessPirateI18n } from "./107-captain-hook-ruthless-pirate.i18n";
import { rush } from "../../../helpers/abilities/rush";

export const captainHookRuthlessPirate: CharacterCard = {
  id: "eM3",
  canonicalId: "ci_eM3",
  reprints: ["set1-107"],
  cardType: "character",
  name: "Captain Hook",
  version: "Ruthless Pirate",
  inkType: ["ruby"],
  franchise: "Peter Pan",
  set: "001",
  cardNumber: 107,
  rarity: "rare",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_6b3ab2c893c34e5989908e451259e1b1",
    tcgPlayer: 508624,
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "YOU COWARD!",
      description:
        "While this character is exerted, opposing characters with Evasive gain Reckless. (They can't quest and must challenge if able.)",
    },
  ],
  classifications: ["Storyborn", "Villain", "Pirate", "Captain"],
  abilities: [
    rush,
    {
      condition: {
        type: "exerted",
      },
      effect: {
        keyword: "Reckless",
        target: {
          selector: "all",
          zones: ["play"],
          owner: "opponent",
          filter: [
            {
              type: "has-keyword",
              keyword: "Evasive",
            },
          ],
          count: "all",
        },
        type: "gain-keyword",
      },
      id: "1k7-2",
      name: "YOU COWARD!",
      text: "YOU COWARD! While this character is exerted, opposing characters with Evasive gain Reckless.",
      type: "static",
    },
  ],
  i18n: captainHookRuthlessPirateI18n,
};
