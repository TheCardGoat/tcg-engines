import type { CharacterCard } from "@tcg/lorcana-types";

export const ratiganPartyCrasher: CharacterCard = {
  id: "1b4",
  cardType: "character",
  name: "Ratigan",
  version: "Party Crasher",
  fullName: "Ratigan - Party Crasher",
  inkType: ["ruby"],
  franchise: "Great Mouse Detective",
  set: "005",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Ratigan.)\nEvasive (Only characters with Evasive can challenge this character.)\nDELIGHTFULLY WICKED Your damaged characters get +2 {S}.",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 3,
  cardNumber: 123,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "aaff3438b44616c9f93796643e4f12b9bdd8d044",
  },
  abilities: [
    {
      id: "1b4-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4",
    },
    {
      id: "1b4-2",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "1b4-3",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "YOUR_CHARACTERS",
      },
      name: "DELIGHTFULLY WICKED Your damaged",
      text: "DELIGHTFULLY WICKED Your damaged characters get +2 {S}.",
    },
  ],
  classifications: ["Floodborn", "Villain"],
};
