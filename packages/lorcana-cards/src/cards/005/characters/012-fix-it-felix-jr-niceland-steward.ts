import type { CharacterCard } from "@tcg/lorcana-types";

export const fixitFelixJrNicelandSteward: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "z1m-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      effect: {
        modifier: 2,
        stat: "willpower",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "z1m-2",
      text: "BUILDING TOGETHER Your locations get +2 {W}.",
      type: "action",
    },
  ],
  cardNumber: 12,
  cardType: "character",
  classifications: ["Floodborn", "Hero"],
  cost: 5,
  externalIds: {
    ravensburger: "7e4e53714f3c4b1b2397062f8fd5e95894fcab60",
  },
  franchise: "Wreck It Ralph",
  fullName: "Fix-It Felix, Jr. - Niceland Steward",
  id: "z1m",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Fix-It Felix, Jr.",
  set: "005",
  strength: 4,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Fix-It Felix, Jr.)\nBUILDING TOGETHER Your locations get +2 {W}.",
  version: "Niceland Steward",
  willpower: 5,
};
