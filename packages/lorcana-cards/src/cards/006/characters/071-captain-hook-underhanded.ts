import type { CharacterCard } from "@tcg/lorcana-types";

export const captainHookUnderhanded: CharacterCard = {
  abilities: [
    {
      effect: {
        restriction: "cant-quest",
        target: "SELF",
        type: "restriction",
      },
      id: "i7x-1",
      text: "INSPIRES DREAD While this character is exerted, opposing Pirate characters can't quest.",
      type: "static",
    },
    {
      effect: {
        amount: 1,
        target: "CONTROLLER",
        type: "draw",
      },
      id: "i7x-2",
      name: "UPPER HAND",
      text: "UPPER HAND Whenever this character is challenged, draw a card.",
      trigger: {
        event: "challenged",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 71,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Pirate", "Captain"],
  cost: 3,
  externalIds: {
    ravensburger: "41aae15f1c0ae59cefd34a672334c90a3599987b",
  },
  franchise: "Peter Pan",
  fullName: "Captain Hook - Underhanded",
  id: "i7x",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Captain Hook",
  set: "006",
  strength: 1,
  text: "INSPIRES DREAD While this character is exerted, opposing Pirate characters can't quest.\nUPPER HAND Whenever this character is challenged, draw a card.",
  version: "Underhanded",
  willpower: 4,
};
