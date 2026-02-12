import type { CharacterCard } from "@tcg/lorcana-types";

export const elisaMazaIntrepidInvestigator: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "65o-1",
      text: "SPECIAL DETAIL While you have 2 or more other characters in play with 5 {S} or more, this character gets +2 {L}.",
      type: "action",
    },
  ],
  cardNumber: 122,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Detective"],
  cost: 3,
  externalIds: {
    ravensburger: "163121c1a9d00c67b04086d8523139c8e4f29e66",
  },
  franchise: "Gargoyles",
  fullName: "Elisa Maza - Intrepid Investigator",
  id: "65o",
  inkType: ["ruby"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Elisa Maza",
  set: "010",
  strength: 4,
  text: "SPECIAL DETAIL While you have 2 or more other characters in play with 5 {S} or more, this character gets +2 {L}.",
  version: "Intrepid Investigator",
  willpower: 3,
};
