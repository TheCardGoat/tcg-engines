import type { CharacterCard } from "@tcg/lorcana-types";

export const faZhouMulansFather: CharacterCard = {
  id: "gc0",
  cardType: "character",
  name: "Fa Zhou",
  version: "Mulan's Father",
  fullName: "Fa Zhou - Mulan's Father",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "004",
  text: "WAR INJURY This character can't challenge.\nHEAD OF THE HOUSEHOLD {E} — Ready chosen character named Mulan. She can't quest for the rest of this turn.",
  cost: 2,
  strength: 0,
  willpower: 4,
  lore: 1,
  cardNumber: 105,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3ade52ca8750abaa4717ad4df3cc61186242ddd6",
  },
  abilities: [
    {
      id: "gc0-1",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-challenge",
        target: "SELF",
      },
      name: "WAR INJURY",
      text: "WAR INJURY This character can't challenge.",
    },
    {
      id: "gc0-2",
      type: "activated",
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
        duration: "this-turn",
      },
      text: "HEAD OF THE HOUSEHOLD {E} — Ready chosen character named Mulan. She can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
};
