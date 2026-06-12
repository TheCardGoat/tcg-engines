import type { CharacterCard } from "@tcg/lorcana-types";
import { mrsPottsHeadHousekeeperI18n } from "./161-mrs-potts-head-housekeeper.i18n";

export const mrsPottsHeadHousekeeper: CharacterCard = {
  id: "XCS",
  canonicalId: "ci_XCS",
  reprints: ["set8-161"],
  cardType: "character",
  name: "Mrs. Potts",
  version: "Head Housekeeper",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "008",
  cardNumber: 161,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_28a3d3d8855040c3a9fcb602177ff86e",
    tcgPlayer: 631458,
  },
  text: [
    {
      title: "CLEAN UP",
      description: "{E}, Banish one of your items — Draw a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "cpn-1",
      name: "CLEAN UP",
      cost: {
        exert: true,
        banishItem: true,
      },
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      type: "activated",
      text: "CLEAN UP {E}, Banish one of your items — Draw a card.",
    },
  ],
  i18n: mrsPottsHeadHousekeeperI18n,
};
