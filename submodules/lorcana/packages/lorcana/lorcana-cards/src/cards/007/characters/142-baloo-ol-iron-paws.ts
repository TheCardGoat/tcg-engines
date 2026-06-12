import type { CharacterCard } from "@tcg/lorcana-types";
import { balooOlIronPawsI18n } from "./142-baloo-ol-iron-paws.i18n";

export const balooOlIronPaws: CharacterCard = {
  id: "ye2",
  canonicalId: "ci_ye2",
  reprints: ["set7-142"],
  cardType: "character",
  name: "Baloo",
  version: "Ol' Iron Paws",
  inkType: ["ruby"],
  franchise: "Jungle Book",
  set: "007",
  cardNumber: 142,
  rarity: "legendary",
  cost: 6,
  strength: 5,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_aded94a6d9d84b958d8e1b56f83af565",
    tcgPlayer: 618325,
  },
  text: [
    {
      title: "FIGHT LIKE A BEAR",
      description: "Your characters with 7 {S} or more can't be dealt damage.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      id: "ye2-1",
      name: "FIGHT LIKE A BEAR",
      type: "static",
      text: "FIGHT LIKE A BEAR Your characters with 7 {S} or more can't be dealt damage.",
      effect: {
        type: "restriction",
        restriction: "cant-be-dealt-damage",
        target: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "strength-comparison",
              comparison: "or-more",
              value: 7,
            },
          ],
          count: "all",
        },
      },
    },
  ],
  i18n: balooOlIronPawsI18n,
};
