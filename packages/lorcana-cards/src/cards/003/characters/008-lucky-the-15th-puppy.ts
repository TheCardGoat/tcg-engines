import type { CharacterCard } from "@tcg/lorcana-types";

export const luckyThe15thPuppy: CharacterCard = {
  id: "5ql",
  cardType: "character",
  name: "Lucky",
  version: "The 15th Puppy",
  fullName: "Lucky - The 15th Puppy",
  inkType: ["amber"],
  franchise: "101 Dalmatians",
  set: "003",
  text: "GOOD AS NEW {E} — Reveal the top 3 cards of your deck. You may put each character card with cost 2 or less into your hand. Put the rest on the bottom of your deck in any order.\nPUPPY LOVE Whenever this character quests, if you have 4 or more other characters in play, your other characters get +1 {L} this turn.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 8,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "14af32285e4e637e9c48c8e3b7aad9d9d7fc3cc9",
  },
  abilities: [
    {
      id: "5ql-1",
      type: "activated",
      cost: { exert: true },
      effect: {
        type: "optional",
        effect: {
          type: "put-on-bottom",
          target: {
            selector: "all",
            count: "all",
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "GOOD AS NEW {E} — Reveal the top 3 cards of your deck. You may put each character card with cost 2 or less into your hand. Put the rest on the bottom of your deck in any order.",
    },
    {
      id: "5ql-2",
      type: "triggered",
      name: "PUPPY LOVE",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have 4 or more other characters in play",
        },
        then: {
          type: "modify-stat",
          stat: "lore",
          modifier: 1,
          target: "YOUR_CHARACTERS",
          duration: "this-turn",
        },
      },
      text: "PUPPY LOVE Whenever this character quests, if you have 4 or more other characters in play, your other characters get +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Puppy"],
};
