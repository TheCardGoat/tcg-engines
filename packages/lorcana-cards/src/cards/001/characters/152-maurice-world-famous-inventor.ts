import type { CharacterCard } from "@tcg/lorcana-types";

export const mauriceWorldfamousInventor: CharacterCard = {
  id: "x5f",
  cardType: "character",
  name: "Maurice",
  version: "World-Famous Inventor",
  fullName: "Maurice - World-Famous Inventor",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "001",
  text: "GIVE IT A TRY Whenever this character quests, you pay 2 {I} less for the next item you play this turn.\nIT WORKS! Whenever you play an item, you may draw a card.",
  cost: 6,
  strength: 2,
  willpower: 7,
  lore: 2,
  cardNumber: 152,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "777a87e05133c7c929f30c24ced7fa867c084c8e",
  },
  abilities: [
    {
      id: "x5f-1",
      type: "triggered",
      name: "GIVE IT A TRY",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "GIVE IT A TRY Whenever this character quests, you pay 2 {I} less for the next item you play this turn.",
    },
    {
      id: "x5f-2",
      type: "triggered",
      name: "IT WORKS!",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "item",
        },
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      text: "IT WORKS! Whenever you play an item, you may draw a card.",
    },
  ],
  classifications: ["Dreamborn", "Mentor", "Inventor"],
};
