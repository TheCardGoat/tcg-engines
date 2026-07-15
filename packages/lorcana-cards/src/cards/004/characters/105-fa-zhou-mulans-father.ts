import type { CharacterCard } from "@tcg/lorcana-types";

export const faZhouMulansFather: CharacterCard = {
  abilities: [
    {
      effect: {
        restriction: "cant-challenge",
        target: "SELF",
        type: "restriction",
      },
      id: "gc0-1",
      name: "WAR INJURY",
      text: "WAR INJURY This character can't challenge.",
      type: "static",
    },
    {
      cost: { exert: true },
      effect: {
        duration: "this-turn",
        restriction: "cant-quest",
        target: "SELF",
        type: "restriction",
      },
      id: "gc0-2",
      text: "HEAD OF THE HOUSEHOLD {E} — Ready chosen character named Mulan. She can't quest for the rest of this turn.",
      type: "activated",
    },
  ],
  cardNumber: 105,
  cardType: "character",
  classifications: ["Storyborn", "Mentor"],
  cost: 2,
  externalIds: {
    ravensburger: "3ade52ca8750abaa4717ad4df3cc61186242ddd6",
  },
  franchise: "Mulan",
  fullName: "Fa Zhou - Mulan's Father",
  id: "gc0",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Fa Zhou",
  set: "004",
  strength: 0,
  text: "WAR INJURY This character can't challenge.\nHEAD OF THE HOUSEHOLD {E} — Ready chosen character named Mulan. She can't quest for the rest of this turn.",
  version: "Mulan's Father",
  willpower: 4,
};
