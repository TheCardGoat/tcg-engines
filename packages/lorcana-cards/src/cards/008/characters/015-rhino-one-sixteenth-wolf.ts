import type { CharacterCard } from "@tcg/lorcana-types";

export const rhinoOnesixteenthWolf: CharacterCard = {
  id: "1bm",
  cardType: "character",
  name: "Rhino",
  version: "One-Sixteenth Wolf",
  fullName: "Rhino - One-Sixteenth Wolf",
  inkType: ["amber"],
  franchise: "Bolt",
  set: "008",
  text: "TINY HOWL When you play this character, chosen opposing character gets -1 {S} until the start of your next turn.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 15,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "aba2fe21e52c96d75ace0d3a6000001b8db2f5b5",
  },
  abilities: [
    {
      id: "1bm-1",
      type: "triggered",
      name: "TINY HOWL",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "CHOSEN_CHARACTER",
      },
      text: "TINY HOWL When you play this character, chosen opposing character gets -1 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
