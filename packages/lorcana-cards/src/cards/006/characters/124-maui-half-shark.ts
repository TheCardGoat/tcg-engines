import type { CharacterCard } from "@tcg/lorcana-types";

export const mauiHalfshark: CharacterCard = {
  id: "rcf",
  cardType: "character",
  name: "Maui",
  version: "Half-Shark",
  fullName: "Maui - Half-Shark",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "006",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nCHEEEEOHOOOO! Whenever this character challenges another character, you may return an action card from your discard to your hand.\nWAYFINDING Whenever you play an action, gain 1 lore.",
  cost: 6,
  strength: 7,
  willpower: 5,
  lore: 1,
  cardNumber: 124,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "628de10fb7ee738534e61c94d7bd1f30da4589dd",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Deity"],
};
