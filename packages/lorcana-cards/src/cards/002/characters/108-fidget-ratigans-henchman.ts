import type { CharacterCard } from "@tcg/lorcana";

export const fidgetRatigansHenchman: CharacterCard = {
  id: "168",
  cardType: "character",
  name: "Fidget",
  version: "Ratigan's Henchman",
  fullName: "Fidget - Ratigan's Henchman",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "002",
  text: "Evasive (Only characters with Evasive can challenge this character.)",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 108,
  inkable: true,
  externalIds: {
    ravensburger: "9836b26ae57048c3c2225cde40cc9be4712fc633",
  },
  abilities: [
    {
      id: "168-1",
      text: "Evasive",
      type: "keyword",
      keyword: "Evasive",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
