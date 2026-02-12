import type { CharacterCard } from "@tcg/lorcana-types";

export const boltSuperdog: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "199-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      id: "199-2",
      name: "MARK OF POWER",
      text: "MARK OF POWER Whenever you ready this character, gain 1 lore for each other undamaged character you have in play.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 4,
  cardType: "character",
  classifications: ["Floodborn", "Hero"],
  cost: 5,
  externalIds: {
    ravensburger: "a31d2bdbf009fa85ab285105f4b19017beef7180",
  },
  franchise: "Bolt",
  fullName: "Bolt - Superdog",
  id: "199",
  inkType: ["amber", "steel"],
  inkable: true,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Bolt",
  set: "007",
  strength: 3,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Bolt.)\nMARK OF POWER Whenever you ready this character, gain 1 lore for each other undamaged character you have in play.\nBOLT STARE {E} – Banish chosen Illusion character.",
  version: "Superdog",
  willpower: 5,
};
