import type { CharacterCard } from "@tcg/lorcana-types";

export const clawhauserFrontDeskOfficer: CharacterCard = {
  abilities: [
    {
      id: "1u1-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
    {
      id: "1u1-2",
      keyword: "Singer",
      text: "Singer 4",
      type: "keyword",
      value: 4,
    },
  ],
  cardNumber: 35,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Detective"],
  cost: 3,
  externalIds: {
    ravensburger: "ef6860b6167954d4c4f0197491da61470349cd99",
  },
  franchise: "Zootropolis",
  fullName: "Clawhauser - Front Desk Officer",
  id: "1u1",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  name: "Clawhauser",
  set: "008",
  strength: 1,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSinger 4 (This character counts as cost 4 to sing songs.)",
  version: "Front Desk Officer",
  willpower: 4,
};
