import type { CharacterCard } from "@tcg/lorcana-types";

export const fixitFelixJrNicelandSteward: CharacterCard = {
  id: "z1m",
  cardType: "character",
  name: "Fix-It Felix, Jr.",
  version: "Niceland Steward",
  fullName: "Fix-It Felix, Jr. - Niceland Steward",
  inkType: ["amber"],
  franchise: "Wreck It Ralph",
  set: "005",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Fix-It Felix, Jr.)\nBUILDING TOGETHER Your locations get +2 {W}.",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  cardNumber: 12,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7e4e53714f3c4b1b2397062f8fd5e95894fcab60",
  },
  abilities: [
    {
      id: "z1m-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3",
    },
    {
      id: "z1m-2",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "willpower",
        modifier: 2,
        target: "CHOSEN_CHARACTER",
      },
      text: "BUILDING TOGETHER Your locations get +2 {W}.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
};
