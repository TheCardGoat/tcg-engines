import type { CharacterCard } from "@tcg/lorcana-types";

export const gazelleBalladSinger: CharacterCard = {
  abilities: [
    {
      id: "1kx-1",
      keyword: "Singer",
      text: "Singer 7",
      type: "keyword",
      value: 7,
    },
  ],
  cardNumber: 25,
  cardType: "character",
  classifications: ["Dreamborn", "Ally"],
  cost: 5,
  externalIds: {
    ravensburger: "05b30af245f5db3c3ab5472910df2f7879c362f0",
  },
  franchise: "Zootropolis",
  fullName: "Gazelle - Ballad Singer",
  id: "1kx",
  inkType: ["amber"],
  inkable: false,
  lore: 1,
  missingImplementation: true,
  missingTests: true,
  name: "Gazelle",
  set: "010",
  strength: 3,
  text: "Singer 7 (This character counts as cost 7 to sing songs.)\nCROWD FAVORITE When you play this character, you may put a song card from your discard on the top of your deck.",
  version: "Ballad Singer",
  willpower: 8,
};
