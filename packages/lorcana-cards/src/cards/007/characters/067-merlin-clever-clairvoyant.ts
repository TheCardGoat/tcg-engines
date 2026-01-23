import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinCleverClairvoyant: CharacterCard = {
  id: "1c1",
  cardType: "character",
  name: "Merlin",
  version: "Clever Clairvoyant",
  fullName: "Merlin - Clever Clairvoyant",
  inkType: ["amethyst", "sapphire"],
  franchise: "Sword in the Stone",
  set: "007",
  text: "PRESTIDIGITONIUM Whenever this character quests, name a card, then reveal the top card of your deck. If it's the named card, put it into your inkwell facedown and exerted. Otherwise, put it on the top of your deck.",
  cost: 1,
  strength: 0,
  willpower: 1,
  lore: 1,
  cardNumber: 67,
  inkable: true,
  externalIds: {
    ravensburger: "ad1a7bee1bba63c46df4b6db68b78cba15608661",
  },
  abilities: [
    {
      id: "1c1-1",
      text: "PRESTIDIGITONIUM Whenever this character quests, name a card, then reveal the top card of your deck. If it's the named card, put it into your inkwell facedown and exerted. Otherwise, put it on the top of your deck.",
      name: "PRESTIDIGITONIUM",
      type: "triggered",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "sequence",
        steps: [
          {
            type: "name-a-card",
          },
          {
            type: "reveal-top-card",
            target: "CONTROLLER",
          },
          {
            type: "conditional",
            condition: {
              type: "revealed-matches-named",
            },
            then: {
              type: "put-into-inkwell",
              source: "revealed",
              exerted: true,
            },
            else: {
              type: "put-on-top",
              source: "revealed",
            },
          },
        ],
      },
    },
  ],
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
};
