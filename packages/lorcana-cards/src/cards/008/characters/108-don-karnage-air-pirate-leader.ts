import type { CharacterCard } from "@tcg/lorcana-types";

export const donKarnageAirPirateLeader: CharacterCard = {
  id: "3tm",
  cardType: "character",
  name: "Don Karnage",
  version: "Air Pirate Leader",
  fullName: "Don Karnage - Air Pirate Leader",
  inkType: ["emerald", "steel"],
  franchise: "Talespin",
  set: "008",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nSCORNFUL TAUNT Whenever you play an action that isn’t a song, chosen opposing character gains Reckless during their next turn. (They can’t quest and must challenge if able.)",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 108,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "0dc717cd37ae1be2d1173b144c114628a1e411d5",
  },
  abilities: [
    {
      id: "3tm-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "3tm-2",
      type: "triggered",
      name: "SCORNFUL TAUNT",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        target: "CHOSEN_CHARACTER",
      },
      text: "SCORNFUL TAUNT Whenever you play an action that isn’t a song, chosen opposing character gains Reckless during their next turn.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Prince", "Pirate"],
};
