import type { CharacterCard } from "@tcg/lorcana";

export const balooFriendAndGuardian: CharacterCard = {
  id: "qnc",
  cardType: "character",
  name: "Baloo",
  version: "Friend and Guardian",
  fullName: "Baloo - Friend and Guardian",
  inkType: ["amber"],
  franchise: "Jungle Book",
  set: "010",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cardNumber: "001",
  cost: 6,
  strength: 3,
  willpower: 8,
  lore: 2,
  inkable: true,
  externalIds: {
    ravensburger: "600b15a6131a9729bcbb09477b1417d11e96769f",
  },
  keywords: ["Bodyguard", "Support"],
  abilities: [
    {
      id: "qnc-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
    {
      id: "qnc-2",
      text: "Support",
      type: "keyword",
      keyword: "Support",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
