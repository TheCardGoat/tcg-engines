import type { CharacterCard } from "@tcg/lorcana-types";

export const minnieMouseDrumMajor: CharacterCard = {
  id: "o0p",
  cardType: "character",
  name: "Minnie Mouse",
  version: "Drum Major",
  fullName: "Minnie Mouse - Drum Major",
  inkType: ["amber"],
  set: "005",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Minnie Mouse.)\nPARADE ORDER When you play this character, if you used Shift to play her, you may search your deck for a character card and reveal that card to all players. Shuffle your deck and put that card on top of it.",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 2,
  cardNumber: 15,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "5691a241218d73c335bda2e1619d1160eff5e117",
  },
  abilities: [
    {
      id: "o0p-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4",
    },
    {
      id: "o0p-2",
      type: "triggered",
      name: "PARADE ORDER",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you used Shift to play her",
        },
        then: {
          type: "search-deck",
          putInto: "hand",
          shuffle: true,
          cardType: "character",
        },
      },
      text: "PARADE ORDER When you play this character, if you used Shift to play her, you may search your deck for a character card and reveal that card to all players. Shuffle your deck and put that card on top of it.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
};
