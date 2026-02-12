import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseDrumMajor: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "o0p-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
    {
      effect: {
        condition: {
          expression: "you used Shift to play her",
          type: "if",
        },
        then: {
          cardType: "character",
          putInto: "hand",
          shuffle: true,
          type: "search-deck",
        },
        type: "conditional",
      },
      id: "o0p-2",
      name: "PARADE ORDER",
      text: "PARADE ORDER When you play this character, if you used Shift to play her, you may search your deck for a character card and reveal that card to all players. Shuffle your deck and put that card on top of it.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 15,
  cardType: "character",
  classifications: ["Floodborn", "Hero"],
  cost: 5,
  externalIds: {
    ravensburger: "5691a241218d73c335bda2e1619d1160eff5e117",
  },
  fullName: "Minnie Mouse - Drum Major",
  id: "o0p",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Minnie Mouse",
  set: "005",
  strength: 4,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Minnie Mouse.)\nPARADE ORDER When you play this character, if you used Shift to play her, you may search your deck for a character card and reveal that card to all players. Shuffle your deck and put that card on top of it.",
  version: "Drum Major",
  willpower: 4,
};
