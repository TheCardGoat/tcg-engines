import type { CharacterCard } from "@tcg/lorcana-types";

export const luckyThe15thPuppy: CharacterCard = {
  abilities: [
    {
      cost: { exert: true },
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["character"],
            count: "all",
            owner: "any",
            selector: "all",
            zones: ["play"],
          },
          type: "put-on-bottom",
        },
        type: "optional",
      },
      id: "5ql-1",
      text: "GOOD AS NEW {E} — Reveal the top 3 cards of your deck. You may put each character card with cost 2 or less into your hand. Put the rest on the bottom of your deck in any order.",
      type: "activated",
    },
    {
      effect: {
        condition: {
          expression: "you have 4 or more other characters in play",
          type: "if",
        },
        then: {
          duration: "this-turn",
          modifier: 1,
          stat: "lore",
          target: "YOUR_CHARACTERS",
          type: "modify-stat",
        },
        type: "conditional",
      },
      id: "5ql-2",
      name: "PUPPY LOVE",
      text: "PUPPY LOVE Whenever this character quests, if you have 4 or more other characters in play, your other characters get +1 {L} this turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 8,
  cardType: "character",
  classifications: ["Storyborn", "Puppy"],
  cost: 4,
  externalIds: {
    ravensburger: "14af32285e4e637e9c48c8e3b7aad9d9d7fc3cc9",
  },
  franchise: "101 Dalmatians",
  fullName: "Lucky - The 15th Puppy",
  id: "5ql",
  inkType: ["amber"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Lucky",
  set: "003",
  strength: 2,
  text: "GOOD AS NEW {E} — Reveal the top 3 cards of your deck. You may put each character card with cost 2 or less into your hand. Put the rest on the bottom of your deck in any order.\nPUPPY LOVE Whenever this character quests, if you have 4 or more other characters in play, your other characters get +1 {L} this turn.",
  version: "The 15th Puppy",
  willpower: 3,
};
