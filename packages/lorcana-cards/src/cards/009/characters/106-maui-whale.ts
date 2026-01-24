import type { CharacterCard } from "@tcg/lorcana-types";

export const mauiWhale: CharacterCard = {
  id: "4dw",
  cardType: "character",
  name: "Maui",
  version: "Whale",
  fullName: "Maui - Whale",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "009",
  text: "THIS MISSION IS CURSED This character can't ready at the start of your turn.\nI GOT YOUR BACK 2 {I} – Ready this character. He can't quest for the rest of this turn.",
  cost: 7,
  strength: 8,
  willpower: 8,
  lore: 1,
  cardNumber: 106,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "0fcf0e2feea7eeb8a66963a14505ba849931709b",
  },
  abilities: [
    {
      id: "4dw-1",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
      },
      name: "THIS MISSION IS CURSED",
      text: "THIS MISSION IS CURSED This character can't ready at the start of your turn.",
    },
    {
      id: "4dw-2",
      type: "action",
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
        duration: "this-turn",
      },
      text: "I GOT YOUR BACK 2 {I} – Ready this character. He can't quest for the rest of this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Deity"],
};
