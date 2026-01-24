import type { CharacterCard } from "@tcg/lorcana-types";

export const boltSuperdog: CharacterCard = {
  id: "199",
  cardType: "character",
  name: "Bolt",
  version: "Superdog",
  fullName: "Bolt - Superdog",
  inkType: ["amber", "steel"],
  franchise: "Bolt",
  set: "007",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Bolt.)\nMARK OF POWER Whenever you ready this character, gain 1 lore for each other undamaged character you have in play.\nBOLT STARE {E} – Banish chosen Illusion character.",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  cardNumber: 4,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a31d2bdbf009fa85ab285105f4b19017beef7180",
  },
  abilities: [
    {
      id: "199-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
      text: "Shift 3",
    },
    {
      id: "199-2",
      type: "triggered",
      name: "MARK OF POWER",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      text: "MARK OF POWER Whenever you ready this character, gain 1 lore for each other undamaged character you have in play.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
};
