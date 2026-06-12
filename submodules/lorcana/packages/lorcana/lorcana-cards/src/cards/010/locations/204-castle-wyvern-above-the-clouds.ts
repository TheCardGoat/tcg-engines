import type { LocationCard } from "@tcg/lorcana-types";
import { castleWyvernAboveTheCloudsI18n } from "./204-castle-wyvern-above-the-clouds.i18n";

export const castleWyvernAboveTheClouds: LocationCard = {
  id: "M5d",
  canonicalId: "ci_M5d",
  reprints: ["set10-204"],
  cardType: "location",
  name: "Castle Wyvern",
  version: "Above the Clouds",
  inkType: ["steel"],
  franchise: "Gargoyles",
  set: "010",
  cardNumber: 204,
  rarity: "rare",
  cost: 2,
  willpower: 5,
  moveCost: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8212061efed6498f87b6df190c10c4fa",
    tcgPlayer: 659594,
  },
  text: [
    {
      title: "PROTECT THIS CASTLE",
      description:
        "Characters gain Challenger +1 and Resist +1 while here. (They get +1 {S} while challenging. Damage dealt to them is reduced by 1.)",
    },
  ],
  abilities: [
    {
      effect: {
        keyword: "Challenger",
        target: "CHARACTERS_HERE",
        type: "gain-keyword",
        value: 1,
      },
      id: "hqg-1",
      name: "PROTECT THIS CASTLE",
      text: "PROTECT THIS CASTLE Characters gain Challenger +1 and Resist +1 while here.",
      type: "static",
    },
    {
      effect: {
        keyword: "Resist",
        target: "CHARACTERS_HERE",
        type: "gain-keyword",
        value: 1,
      },
      id: "hqg-2",
      name: "PROTECT THIS CASTLE",
      text: "PROTECT THIS CASTLE Characters gain Challenger +1 and Resist +1 while here.",
      type: "static",
    },
  ],
  i18n: castleWyvernAboveTheCloudsI18n,
};
