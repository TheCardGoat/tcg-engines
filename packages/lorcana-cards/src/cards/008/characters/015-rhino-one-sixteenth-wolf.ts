import type { CharacterCard } from "@tcg/lorcana-types";

export const rhinoOnesixteenthWolf: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -1,
        target: "CHOSEN_CHARACTER",
      },
      id: "1bm-1",
      name: "TINY HOWL",
      text: "TINY HOWL When you play this character, chosen opposing character gets -1 {S} until the start of your next turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 15,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 1,
  externalIds: {
    ravensburger: "aba2fe21e52c96d75ace0d3a6000001b8db2f5b5",
  },
  franchise: "Bolt",
  fullName: "Rhino - One-Sixteenth Wolf",
  id: "1bm",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Rhino",
  set: "008",
  strength: 1,
  text: "TINY HOWL When you play this character, chosen opposing character gets -1 {S} until the start of your next turn.",
  version: "One-Sixteenth Wolf",
  willpower: 2,
};
