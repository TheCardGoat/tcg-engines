import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseStalwartExplorerI18n } from "./181-mickey-mouse-stalwart-explorer.i18n";

export const mickeyMouseStalwartExplorer: CharacterCard = {
  id: "tp9",
  canonicalId: "ci_tp9",
  reprints: ["set3-181"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Stalwart Explorer",
  inkType: ["steel"],
  set: "003",
  cardNumber: 181,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_6910c7f861604c41b2921961ebf886d1",
    tcgPlayer: 539109,
  },
  text: [
    {
      title: "LET'S TAKE A LOOK",
      description: "This character gets +1 {S} for each location you have in play.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      effect: {
        modifier: {
          cardType: "location",
          filters: [],
          owner: "you",
          type: "filtered-count",
        },
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "j8w-1",
      name: "LET'S TAKE A LOOK",
      text: "LET'S TAKE A LOOK This character gets +1 {S} for each location you have in play.",
      type: "static",
    },
  ],
  i18n: mickeyMouseStalwartExplorerI18n,
};
