import type { CharacterCard } from "@tcg/lorcana-types";

export const princeEricdashingAndBrave: CharacterCard = {
  id: "omx",
  cardType: "character",
  name: "Prince Eric",
  version: "Dashing and Brave",
  fullName: "Prince Eric - Dashing and Brave",
  inkType: ["steel"],
  franchise: "Disney",
  set: "001",
  text: "**Challenger** +2 _(While challenging, this character gets +2 {S}.)_",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 187,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**Challenger** +2 _(While challenging, this character gets +2 {S}.)_",
      id: "omx-1",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
    },
  ],
  classifications: ["Hero", "Storyborn", "Prince"],
};
