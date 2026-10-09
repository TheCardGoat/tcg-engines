import type { CharacterCard } from "@tcg/lorcana-types";
import { goofyEnthusiasticTouristI18n } from "./111-goofy-enthusiastic-tourist.i18n";

export const goofyEnthusiasticTourist: CharacterCard = {
  id: "Wi0",
  canonicalId: "ci_Wi0",
  slug: "lorcana-ci_Wi0",
  printings: [
    {
      id: "set14-111",
      artId: "set14-111",
      setCode: "set14",
      collectorNumber: "111",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-111"],
  cardType: "character",
  name: "Goofy",
  version: "Enthusiastic Tourist",
  inkType: ["ruby"],
  franchise: "Goofy Movie",
  set: "014",
  cardNumber: 111,
  rarity: "common",
  cost: 1,
  strength: 0,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_34c10ff9c954406781cfb194086e4e57",
  },
  text: [
    {
      title: "CAPTURE THE MOMENT",
      description: "While you have a character with Singer in play, this character gets +3 {S}.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "Wi0-1",
      name: "CAPTURE THE MOMENT",
      type: "static",
      text: "CAPTURE THE MOMENT While you have a character with Singer in play, this character gets +3 {S}.",
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "you",
          zones: ["play"],
          cardType: "character",
          filters: [
            {
              type: "has-keyword",
              keyword: "Singer",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 3,
        target: "SELF",
      },
    },
  ],
  i18n: goofyEnthusiasticTouristI18n,
};
