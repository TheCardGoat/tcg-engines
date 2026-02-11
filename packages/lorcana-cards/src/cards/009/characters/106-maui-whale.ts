import type { CharacterCard } from "@tcg/lorcana-types";

export const mauiWhale: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
      },
      id: "4dw-1",
      name: "THIS MISSION IS CURSED",
      text: "THIS MISSION IS CURSED This character can't ready at the start of your turn.",
      type: "static",
    },
    {
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
        duration: "this-turn",
      },
      id: "4dw-2",
      text: "I GOT YOUR BACK 2 {I} – Ready this character. He can't quest for the rest of this turn.",
      type: "action",
    },
  ],
  cardNumber: 106,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Deity"],
  cost: 7,
  externalIds: {
    ravensburger: "0fcf0e2feea7eeb8a66963a14505ba849931709b",
  },
  franchise: "Moana",
  fullName: "Maui - Whale",
  id: "4dw",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Maui",
  set: "009",
  strength: 8,
  text: "THIS MISSION IS CURSED This character can't ready at the start of your turn.\nI GOT YOUR BACK 2 {I} – Ready this character. He can't quest for the rest of this turn.",
  version: "Whale",
  willpower: 8,
};
