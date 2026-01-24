import type { CharacterCard } from "@tcg/lorcana-types";

export const liShangNewlyPromoted: CharacterCard = {
  id: "1s1",
  cardType: "character",
  name: "Li Shang",
  version: "Newly Promoted",
  fullName: "Li Shang - Newly Promoted",
  inkType: ["ruby", "steel"],
  franchise: "Mulan",
  set: "007",
  text: "I WON'T LET YOU DOWN This character can challenge ready characters.\nBIG RESPONSIBILITY While this character is damaged, he gets +2 {S}.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 133,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "e8958ebe93bfe67555697e9e3d0477d5a9e145ad",
  },
  abilities: [
    {
      id: "1s1-1",
      type: "static",
      effect: {
        type: "grant-ability",
        ability: "can-challenge-ready",
        target: "SELF",
      },
      name: "I WON'T LET YOU DOWN",
      text: "I WON'T LET YOU DOWN This character can challenge ready characters.",
    },
    {
      id: "1s1-2",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      text: "BIG RESPONSIBILITY While this character is damaged, he gets +2 {S}.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Captain"],
};
