import type { CharacterCard } from "@tcg/lorcana-types";

export const cruellaDeVilPerfectlyWretched: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "1l6-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      effect: {
        duration: "this-turn",
        modifier: -2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1l6-2",
      text: "OH, NO YOU DON'T Whenever this character quests, chosen opposing character gets -2 {S} this turn.",
      type: "action",
    },
  ],
  cardNumber: 145,
  cardType: "character",
  classifications: ["Floodborn", "Villain"],
  cost: 5,
  externalIds: {
    ravensburger: "cee03f2073c8ac1d8da9f9dce64776138f2df77a",
  },
  franchise: "101 Dalmatians",
  fullName: "Cruella De Vil - Perfectly Wretched",
  id: "1l6",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Cruella De Vil",
  set: "002",
  strength: 4,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Cruella De Vil.)\nOH, NO YOU DON'T Whenever this character quests, chosen opposing character gets -2 {S} this turn.",
  version: "Perfectly Wretched",
  willpower: 3,
};
