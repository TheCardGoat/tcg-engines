import type { CharacterCard } from "@tcg/lorcana-types";

export const mauriceWorldfamousInventor: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "x5f-1",
      name: "GIVE IT A TRY",
      text: "GIVE IT A TRY Whenever this character quests, you pay 2 {I} less for the next item you play this turn.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
    {
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      id: "x5f-2",
      name: "IT WORKS!",
      text: "IT WORKS! Whenever you play an item, you may draw a card.",
      trigger: {
        event: "play",
        timing: "whenever",
        on: {
          controller: "you",
          cardType: "item",
        },
      },
      type: "triggered",
    },
  ],
  cardNumber: 152,
  cardType: "character",
  classifications: ["Dreamborn", "Mentor", "Inventor"],
  cost: 6,
  externalIds: {
    ravensburger: "777a87e05133c7c929f30c24ced7fa867c084c8e",
  },
  franchise: "Beauty and the Beast",
  fullName: "Maurice - World-Famous Inventor",
  id: "x5f",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Maurice",
  set: "001",
  strength: 2,
  text: "GIVE IT A TRY Whenever this character quests, you pay 2 {I} less for the next item you play this turn.\nIT WORKS! Whenever you play an item, you may draw a card.",
  version: "World-Famous Inventor",
  willpower: 7,
};
