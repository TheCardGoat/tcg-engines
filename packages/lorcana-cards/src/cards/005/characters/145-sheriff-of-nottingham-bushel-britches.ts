import type { CharacterCard } from "@tcg/lorcana-types";

export const sheriffOfNottinghamBushelBritches: CharacterCard = {
  abilities: [
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "133-1",
      text: "EVERY LITTLE BIT HELPS For each item you have in play, you pay 1 {I} less to play this character.",
      type: "action",
    },
    {
      id: "133-2",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
  ],
  cardNumber: 145,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 9,
  externalIds: {
    ravensburger: "8cd569041e6c00c0075b3630d2e937fda1bd1dd1",
  },
  franchise: "Robin Hood",
  fullName: "Sheriff of Nottingham - Bushel Britches",
  id: "133",
  inkType: ["sapphire"],
  inkable: false,
  lore: 4,
  missingTests: true,
  name: "Sheriff of Nottingham",
  set: "005",
  strength: 5,
  text: "EVERY LITTLE BIT HELPS For each item you have in play, you pay 1 {I} less to play this character.\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  version: "Bushel Britches",
  willpower: 9,
};
