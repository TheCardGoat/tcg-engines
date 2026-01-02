import type { CharacterCard } from "@tcg/lorcana-types";

export const clawhauserFrontDeskOfficer: CharacterCard = {
  id: "1u1",
  cardType: "character",
  name: "Clawhauser",
  version: "Front Desk Officer",
  fullName: "Clawhauser - Front Desk Officer",
  inkType: ["amber"],
  franchise: "Zootropolis",
  set: "008",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSinger 4 (This character counts as cost 4 to sing songs.)",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 35,
  inkable: true,
  externalIds: {
    ravensburger: "ef6860b6167954d4c4f0197491da61470349cd99",
  },
  abilities: [
    {
      id: "1u1-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
    {
      id: "1u1-2",
      text: "Singer 4",
      type: "keyword",
      keyword: "Singer",
      value: 4,
    },
  ],
  classifications: ["Storyborn", "Ally", "Detective"],
};
