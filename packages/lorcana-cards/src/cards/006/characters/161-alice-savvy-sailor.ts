import type { CharacterCard } from "@tcg/lorcana-types";

export const aliceSavvySailor: CharacterCard = {
  id: "1hn",
  cardType: "character",
  name: "Alice",
  version: "Savvy Sailor",
  fullName: "Alice - Savvy Sailor",
  inkType: ["sapphire"],
  franchise: "Alice in Wonderland",
  set: "006",
  text: "Ward (Opponents can't choose this character except to challenge.)\nAHOY! Whenever this character quests, another chosen character of yours gets +1 {L} and gains Ward until the start of your next turn.",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 161,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "c1525cc95d60ab6fa0f38486bcaaf6379619ef67",
  },
  abilities: [
    {
      id: "1hn-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
    {
      id: "1hn-2",
      type: "triggered",
      name: "AHOY!",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "modify-stat",
            stat: "lore",
            modifier: 1,
            target: "SELF",
          },
          {
            type: "gain-keyword",
            keyword: "Ward",
            target: "SELF",
          },
        ],
      },
      text: "AHOY! Whenever this character quests, another chosen character of yours gets +1 {L} and gains Ward until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
};
