import type { CharacterCard } from "@tcg/lorcana-types";

export const grandCouncilwomanFederationLeader: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
        duration: "this-turn",
      },
      id: "zvy-1",
      name: "FIND IT!",
      text: "FIND IT! Whenever this character quests, your other Alien characters get +1 {L} this turn.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 17,
  cardType: "character",
  classifications: ["Storyborn", "Alien"],
  cost: 2,
  externalIds: {
    ravensburger: "815730fcdc4c6accaa8fb641f7e2461e62a2513a",
  },
  franchise: "Lilo and Stitch",
  fullName: "Grand Councilwoman - Federation Leader",
  id: "zvy",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Grand Councilwoman",
  set: "006",
  strength: 1,
  text: "FIND IT! Whenever this character quests, your other Alien characters get +1 {L} this turn.",
  version: "Federation Leader",
  willpower: 3,
};
