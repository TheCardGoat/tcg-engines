import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineRoyalCommodore: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "8v1-1",
      keyword: "Shift",
      text: "Shift 5",
      type: "keyword",
    },
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "8v1-2",
      name: "RULER OF THE SEAS",
      text: "RULER OF THE SEAS When you play this character, if you used Shift to play her, return all other exerted characters to their players’ hands.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 84,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Princess"],
  cost: 6,
  externalIds: {
    ravensburger: "1ffe7a4dabe4b56c6fbb1a72511efa264a253ecc",
  },
  franchise: "Aladdin",
  fullName: "Jasmine - Royal Commodore",
  id: "8v1",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Jasmine",
  set: "006",
  strength: 5,
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Jasmine.)\nRULER OF THE SEAS When you play this character, if you used Shift to play her, return all other exerted characters to their players’ hands.",
  version: "Royal Commodore",
  willpower: 5,
};
