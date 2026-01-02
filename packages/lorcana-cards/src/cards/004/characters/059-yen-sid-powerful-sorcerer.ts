import type { CharacterCard } from "@tcg/lorcana-types";

export const yenSidPowerfulSorcerer: CharacterCard = {
  id: "7ea",
  cardType: "character",
  name: "Yen Sid",
  version: "Powerful Sorcerer",
  fullName: "Yen Sid - Powerful Sorcerer",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "004",
  text: "TIMELY INTERVENTION When you play this character, if you have a character named Magic Broom in play, you may draw a card. ARCANE STUDY While you have 2 or more Broom characters in play, this character gets +2.",
  cost: 2,
  strength: 1,
  willpower: 3,
  lore: 1,
  cardNumber: 59,
  inkable: true,
  externalIds: {
    ravensburger: "1aa8732475a085d134487bd92f161c07bcdcbb3e",
  },
  abilities: [
    {
      id: "7ea-1",
      text: "TIMELY INTERVENTION When you play this character, if you have a character named Magic Broom in play, you may draw a card. ARCANE STUDY While you have 2 or more Broom characters in play, this character gets +2.",
      name: "TIMELY INTERVENTION",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "has-named-character",
          name: "Magic Broom in play",
          controller: "you",
        },
        then: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
      },
    },
  ],
  classifications: ["Storyborn", "Hero", "Sorcerer"],
};
