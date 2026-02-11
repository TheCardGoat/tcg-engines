import type { CharacterCard } from "@tcg/lorcana-types";

export const merlinCleverClairvoyant: CharacterCard = {
  abilities: [
    {
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
      id: "1c1-1",
      name: "PRESTIDIGITONIUM",
      text: "PRESTIDIGITONIUM Whenever this character quests, name a card, then reveal the top card of your deck. If it's the named card, put it into your inkwell facedown and exerted. Otherwise, put it on the top of your deck.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 67,
  cardType: "character",
  classifications: ["Storyborn", "Mentor", "Sorcerer"],
  cost: 1,
  externalIds: {
    ravensburger: "ad1a7bee1bba63c46df4b6db68b78cba15608661",
  },
  franchise: "Sword in the Stone",
  fullName: "Merlin - Clever Clairvoyant",
  id: "1c1",
  inkType: ["amethyst", "sapphire"],
  inkable: true,
  lore: 1,
  name: "Merlin",
  set: "007",
  strength: 0,
  text: "PRESTIDIGITONIUM Whenever this character quests, name a card, then reveal the top card of your deck. If it's the named card, put it into your inkwell facedown and exerted. Otherwise, put it on the top of your deck.",
  version: "Clever Clairvoyant",
  willpower: 1,
};
