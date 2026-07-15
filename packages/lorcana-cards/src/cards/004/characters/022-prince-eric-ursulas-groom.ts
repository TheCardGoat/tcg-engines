import type { CharacterCard } from "@tcg/lorcana-types";

export const princeEricUrsulasGroom: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "1rd-1",
      keyword: "Shift",
      text: "Shift 4",
      type: "keyword",
    },
    {
      effect: {
        steps: [
          {
            keyword: "Bodyguard",
            target: "SELF",
            type: "gain-keyword",
          },
          {
            modifier: 2,
            stat: "willpower",
            target: "CHOSEN_CHARACTER",
            type: "modify-stat",
          },
        ],
        type: "sequence",
      },
      id: "1rd-2",
      text: "UNDER VANESSA'S SPELL While you have a character named Ursula in play, this character gains Bodyguard and gets +2 {W}.",
      type: "action",
    },
  ],
  cardNumber: 22,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Prince"],
  cost: 6,
  externalIds: {
    ravensburger: "e529775247b312583f7d987816f1a0041efaf5ad",
  },
  franchise: "Little Mermaid",
  fullName: "Prince Eric - Ursula's Groom",
  id: "1rd",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Prince Eric",
  set: "004",
  strength: 5,
  text: "Shift 4 (You may pay 4 {I} to play this on top of one of your characters named Prince Eric.)\nUNDER VANESSA'S SPELL While you have a character named Ursula in play, this character gains Bodyguard and gets +2 {W}. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  version: "Ursula's Groom",
  willpower: 5,
};
