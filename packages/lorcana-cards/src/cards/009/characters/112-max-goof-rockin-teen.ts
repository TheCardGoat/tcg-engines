import type { CharacterCard } from "@tcg/lorcana-types";

export const maxGoofRockinTeen: CharacterCard = {
  id: "i0b",
  cardType: "character",
  name: "Max Goof",
  version: "Rockin' Teen",
  fullName: "Max Goof - Rockin' Teen",
  inkType: ["ruby"],
  franchise: "Goofy Movie",
  set: "009",
  text: "Singer 5 (This character counts as cost 5 to sing songs.)\nI JUST WANNA STAY HOME This character can't move to locations.",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 112,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "40e788a23d54bbcc499d63975ecd2b9885ecc59f",
  },
  abilities: [
    {
      id: "i0b-1",
      type: "keyword",
      keyword: "Singer",
      value: 5,
      text: "Singer 5",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
