import type { CharacterCard } from "@tcg/lorcana-types";

export const goofyGhostHunter: CharacterCard = {
  id: "1mg",
  cardType: "character",
  name: "Goofy",
  version: "Ghost Hunter",
  fullName: "Goofy - Ghost Hunter",
  inkType: ["amber"],
  set: "010",
  text: "PERFECT TRAP When you play this character, chosen opposing character gets -1 {S} until the start of your next turn.",
  cost: 4,
  strength: 4,
  willpower: 5,
  lore: 1,
  cardNumber: 21,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d2a4c2dc83f092d2a37f6908c3388b21260ad73d",
  },
  abilities: [
    {
      id: "1mg-1",
      type: "triggered",
      name: "PERFECT TRAP",
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
      text: "PERFECT TRAP When you play this character, chosen opposing character gets -1 {S} until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Detective"],
};
