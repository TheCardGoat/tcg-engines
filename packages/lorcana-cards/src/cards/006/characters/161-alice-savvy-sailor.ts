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
        steps: [
          {
            modifier: 1,
            stat: "lore",
            target: "SELF",
            type: "modify-stat",
          },
          {
            keyword: "Ward",
            target: "SELF",
            type: "gain-keyword",
          },
        ],
        type: "sequence",
      },
      id: "1hn-2",
      name: "AHOY!",
      text: "AHOY! Whenever this character quests, another chosen character of yours gets +1 {L} and gains Ward until the start of your next turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
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
