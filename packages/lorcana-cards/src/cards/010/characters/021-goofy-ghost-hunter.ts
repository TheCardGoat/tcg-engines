import type { CharacterCard } from "@tcg/lorcana-types";

export const goofyGhostHunter: CharacterCard = {
  abilities: [
    {
      effect: {
        modifier: -1,
        stat: "strength",
        target: "CHOSEN_CHARACTER",
        type: "modify-stat",
      },
      id: "1mg-1",
      name: "PERFECT TRAP",
      text: "PERFECT TRAP When you play this character, chosen opposing character gets -1 {S} until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 21,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Detective"],
  cost: 4,
  externalIds: {
    ravensburger: "d2a4c2dc83f092d2a37f6908c3388b21260ad73d",
  },
  fullName: "Goofy - Ghost Hunter",
  id: "1mg",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Goofy",
  set: "010",
  strength: 4,
  text: "PERFECT TRAP When you play this character, chosen opposing character gets -1 {S} until the start of your next turn.",
  version: "Ghost Hunter",
  willpower: 5,
};
