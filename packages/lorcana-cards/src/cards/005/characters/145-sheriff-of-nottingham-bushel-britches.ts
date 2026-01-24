import type { CharacterCard } from "@tcg/lorcana-types";

export const sheriffOfNottinghamBushelBritches: CharacterCard = {
  id: "133",
  cardType: "character",
  name: "Sheriff of Nottingham",
  version: "Bushel Britches",
  fullName: "Sheriff of Nottingham - Bushel Britches",
  inkType: ["sapphire"],
  franchise: "Robin Hood",
  set: "005",
  text: "EVERY LITTLE BIT HELPS For each item you have in play, you pay 1 {I} less to play this character.\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 9,
  strength: 5,
  willpower: 9,
  lore: 4,
  cardNumber: 145,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "8cd569041e6c00c0075b3630d2e937fda1bd1dd1",
  },
  abilities: [
    {
      id: "133-1",
      type: "action",
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "EVERY LITTLE BIT HELPS For each item you have in play, you pay 1 {I} less to play this character.",
    },
    {
      id: "133-2",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
