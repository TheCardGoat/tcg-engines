import type { CharacterCard } from "@tcg/lorcana-types";

export const ratiganPartyCrasher: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "1b4-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
    {
      id: "1b4-2",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "YOUR_CHARACTERS",
      },
      id: "1b4-3",
      name: "DELIGHTFULLY WICKED Your damaged",
      text: "DELIGHTFULLY WICKED Your damaged characters get +2 {S}.",
      type: "static",
    },
  ],
  cardNumber: 123,
  cardType: "character",
  classifications: ["Floodborn", "Villain"],
  cost: 7,
  externalIds: {
    ravensburger: "aaff3438b44616c9f93796643e4f12b9bdd8d044",
  },
  franchise: "Great Mouse Detective",
  fullName: "Ratigan - Party Crasher",
  id: "1b4",
  inkType: ["ruby"],
  inkable: false,
  lore: 3,
  missingTests: true,
  name: "Ratigan",
  set: "005",
  strength: 5,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Ratigan.)\nEvasive (Only characters with Evasive can challenge this character.)\nDELIGHTFULLY WICKED Your damaged characters get +2 {S}.",
  version: "Party Crasher",
  willpower: 5,
};
