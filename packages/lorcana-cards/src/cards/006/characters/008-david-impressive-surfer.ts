import type { CharacterCard } from "@tcg/lorcana-types";

export const davidImpressiveSurfer: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "mrs-1",
      text: "SHOWING OFF While you have a character named Nani in play, this character gets +2 {L}.",
      type: "action",
    },
  ],
  cardNumber: 8,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 3,
  externalIds: {
    ravensburger: "52123a15d637dba3a83c1fd4207aff4423cd424e",
  },
  franchise: "Lilo and Stitch",
  fullName: "David - Impressive Surfer",
  id: "mrs",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "David",
  set: "006",
  strength: 3,
  text: "SHOWING OFF While you have a character named Nani in play, this character gets +2 {L}.",
  version: "Impressive Surfer",
  willpower: 3,
};
