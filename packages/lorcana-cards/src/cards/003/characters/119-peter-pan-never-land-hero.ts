import type { CharacterCard } from "@tcg/lorcana-types";

export const peterPanNeverLandHero: CharacterCard = {
  abilities: [
    {
      id: "h1y-1",
      keyword: "Rush",
      text: "Rush",
      type: "keyword",
    },
    {
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "h1y-2",
      text: "OVER HERE, TINK While you have a character named Tinker Bell in play, this character gets +2 {S}.",
      type: "action",
    },
  ],
  cardNumber: 119,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "3d77178da6fc4c690c8c13e19ea96bad2ba4627b",
  },
  franchise: "Peter Pan",
  fullName: "Peter Pan - Never Land Hero",
  id: "h1y",
  inkType: ["ruby"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Peter Pan",
  set: "003",
  strength: 1,
  text: "Rush (This character can challenge the turn they're played.)\nOVER HERE, TINK While you have a character named Tinker Bell in play, this character gets +2 {S}.",
  version: "Never Land Hero",
  willpower: 3,
};
