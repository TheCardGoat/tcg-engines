import type { CharacterCard } from "@tcg/lorcana-types";

export const liShangNewlyPromoted: CharacterCard = {
  abilities: [
    {
      effect: {
        ability: "can-challenge-ready",
        target: "SELF",
        type: "grant-ability",
      },
      id: "1s1-1",
      name: "I WON'T LET YOU DOWN",
      text: "I WON'T LET YOU DOWN This character can challenge ready characters.",
      type: "static",
    },
    {
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "1s1-2",
      text: "BIG RESPONSIBILITY While this character is damaged, he gets +2 {S}.",
      type: "static",
    },
  ],
  cardNumber: 133,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Captain"],
  cost: 3,
  externalIds: {
    ravensburger: "e8958ebe93bfe67555697e9e3d0477d5a9e145ad",
  },
  franchise: "Mulan",
  fullName: "Li Shang - Newly Promoted",
  id: "1s1",
  inkType: ["ruby", "steel"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Li Shang",
  set: "007",
  strength: 2,
  text: "I WON'T LET YOU DOWN This character can challenge ready characters.\nBIG RESPONSIBILITY While this character is damaged, he gets +2 {S}.",
  version: "Newly Promoted",
  willpower: 3,
};
