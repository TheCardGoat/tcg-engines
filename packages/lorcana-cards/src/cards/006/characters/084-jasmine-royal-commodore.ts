import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineRoyalCommodore: CharacterCard = {
  id: "8v1",
  cardType: "character",
  name: "Jasmine",
  version: "Royal Commodore",
  fullName: "Jasmine - Royal Commodore",
  inkType: ["emerald"],
  franchise: "Aladdin",
  set: "006",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Jasmine.)\nRULER OF THE SEAS When you play this character, if you used Shift to play her, return all other exerted characters to their players’ hands.",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 84,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1ffe7a4dabe4b56c6fbb1a72511efa264a253ecc",
  },
  abilities: [
    {
      id: "8v1-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
      text: "Shift 5",
    },
    {
      id: "8v1-2",
      type: "triggered",
      name: "RULER OF THE SEAS",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "RULER OF THE SEAS When you play this character, if you used Shift to play her, return all other exerted characters to their players’ hands.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
};
