import type { CharacterCard } from "@tcg/lorcana-types";

export const namaariResoluteDaughter: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "1t7-1",
      text: "I DON'T HAVE ANY OTHER CHOICE For each opposing character banished in a challenge this turn, you pay 2 {I} less to play this character.",
      type: "action",
    },
    {
      id: "1t7-2",
      keyword: "Resist",
      text: "Resist +3",
      type: "keyword",
      value: 3,
    },
  ],
  cardNumber: 182,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Princess"],
  cost: 9,
  externalIds: {
    ravensburger: "ea7fa748b4cca0af4bd518d76cb8babd68cdf40c",
  },
  franchise: "Raya and the Last Dragon",
  fullName: "Namaari - Resolute Daughter",
  id: "1t7",
  inkType: ["steel"],
  inkable: false,
  lore: 3,
  missingTests: true,
  name: "Namaari",
  set: "005",
  strength: 5,
  text: "I DON'T HAVE ANY OTHER CHOICE For each opposing character banished in a challenge this turn, you pay 2 {I} less to play this character.\nResist +3 (Damage dealt to this character is reduced by 3.)",
  version: "Resolute Daughter",
  willpower: 5,
};
