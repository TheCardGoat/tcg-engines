import type { CharacterCard } from "@tcg/lorcana-types";

export const captainHookUnderhanded: CharacterCard = {
  id: "i7x",
  cardType: "character",
  name: "Captain Hook",
  version: "Underhanded",
  fullName: "Captain Hook - Underhanded",
  inkType: ["emerald"],
  franchise: "Peter Pan",
  set: "006",
  text: "INSPIRES DREAD While this character is exerted, opposing Pirate characters can't quest.\nUPPER HAND Whenever this character is challenged, draw a card.",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 71,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "41aae15f1c0ae59cefd34a672334c90a3599987b",
  },
  abilities: [],
  classifications: ["Storyborn", "Villain", "Pirate", "Captain"],
};
