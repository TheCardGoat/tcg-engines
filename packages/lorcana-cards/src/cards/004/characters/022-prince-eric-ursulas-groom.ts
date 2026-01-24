import type { CharacterCard } from "@tcg/lorcana-types";

export const princeEricUrsulasGroom: CharacterCard = {
  id: "1rd",
  cardType: "character",
  name: "Prince Eric",
  version: "Ursula's Groom",
  fullName: "Prince Eric - Ursula's Groom",
  inkType: ["amber"],
  franchise: "Little Mermaid",
  set: "004",
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Prince Eric.)\nUNDER VANESSA'S SPELL While you have a character named Ursula in play, this character gains Bodyguard and gets +2 {W}. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 22,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e529775247b312583f7d987816f1a0041efaf5ad",
  },
  abilities: [
    {
      id: "1rd-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 4,
      },
      text: "Shift 4",
    },
    {
      id: "1rd-2",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-keyword",
            keyword: "Bodyguard",
            target: "SELF",
          },
          {
            type: "modify-stat",
            stat: "willpower",
            modifier: 2,
            target: "CHOSEN_CHARACTER",
          },
        ],
      },
      text: "UNDER VANESSA'S SPELL While you have a character named Ursula in play, this character gains Bodyguard and gets +2 {W}.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Prince"],
};
