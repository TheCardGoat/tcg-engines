import type { CharacterCard } from "@tcg/lorcana-types";

export const aliceSavvySailor: CharacterCard = {
  abilities: [
    {
      id: "1hn-1",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
    {
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
      id: "1hn-2",
      name: "AHOY!",
      text: "AHOY! Whenever this character quests, another chosen character of yours gets +1 {L} and gains Ward until the start of your next turn.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 161,
  cardType: "character",
  classifications: ["Dreamborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "c1525cc95d60ab6fa0f38486bcaaf6379619ef67",
  },
  franchise: "Alice in Wonderland",
  fullName: "Alice - Savvy Sailor",
  id: "1hn",
  inkType: ["sapphire"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Alice",
  set: "006",
  strength: 1,
  text: "Ward (Opponents can't choose this character except to challenge.)\nAHOY! Whenever this character quests, another chosen character of yours gets +1 {L} and gains Ward until the start of your next turn.",
  version: "Savvy Sailor",
  willpower: 4,
};
