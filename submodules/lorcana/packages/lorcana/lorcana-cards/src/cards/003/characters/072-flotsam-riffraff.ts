import type { CharacterCard } from "@tcg/lorcana-types";
import { flotsamRiffraffI18n } from "./072-flotsam-riffraff.i18n";

export const flotsamRiffraff: CharacterCard = {
  id: "zgb",
  canonicalId: "ci_zgb",
  reprints: ["set3-072"],
  cardType: "character",
  name: "Flotsam",
  version: "Riffraff",
  inkType: ["emerald"],
  franchise: "Little Mermaid",
  set: "003",
  cardNumber: 72,
  rarity: "common",
  cost: 3,
  strength: 5,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_ba452763794342109447ecb7b492d919",
    tcgPlayer: 532924,
  },
  text: [
    {
      title: "EERIE PAIR",
      description: "Your characters named Jetsam get +3 {S}.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
  abilities: [
    {
      id: "c4r-1",
      name: "EERIE PAIR",
      text: "EERIE PAIR Your characters named Jetsam get +3 {S}.",
      type: "static",
      effect: {
        modifier: 3,
        stat: "strength",
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
        type: "modify-stat",
      },
    },
  ],
  i18n: flotsamRiffraffI18n,
};
