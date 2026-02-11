import type { CharacterCard } from "@tcg/lorcana-types";

export const donKarnageAirPirateLeader: CharacterCard = {
  abilities: [
    {
      id: "3tm-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Reckless",
        target: "CHOSEN_CHARACTER",
      },
      id: "3tm-2",
      name: "SCORNFUL TAUNT",
      text: "SCORNFUL TAUNT Whenever you play an action that isn’t a song, chosen opposing character gains Reckless during their next turn.",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "action",
        },
      },
      type: "triggered",
    },
  ],
  cardNumber: 108,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Prince", "Pirate"],
  cost: 3,
  externalIds: {
    ravensburger: "0dc717cd37ae1be2d1173b144c114628a1e411d5",
  },
  franchise: "Talespin",
  fullName: "Don Karnage - Air Pirate Leader",
  id: "3tm",
  inkType: ["emerald", "steel"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Don Karnage",
  set: "008",
  strength: 3,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nSCORNFUL TAUNT Whenever you play an action that isn’t a song, chosen opposing character gains Reckless during their next turn. (They can’t quest and must challenge if able.)",
  version: "Air Pirate Leader",
  willpower: 2,
};
