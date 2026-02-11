import type { CharacterCard } from "@tcg/lorcana-types";

export const motherGothelKnowsWhatsBest: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 2,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      id: "1pt-1",
      name: "LOOK WHAT YOU'VE DONE",
      text: 'LOOK WHAT YOU\'VE DONE When you play this character, you may deal 2 damage to another chosen character of yours to give that character Challenger +1 and "When this character is banished in a challenge, return this card to your hand" this turn.',
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 70,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  cost: 2,
  externalIds: {
    ravensburger: "dec10104b65a50c0342904a30cb954c857f8035e",
  },
  franchise: "Tangled",
  fullName: "Mother Gothel - Knows What's Best",
  id: "1pt",
  inkType: ["amethyst", "ruby"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Mother Gothel",
  set: "008",
  strength: 1,
  text: 'LOOK WHAT YOU\'VE DONE When you play this character, you may deal 2 damage to another chosen character of yours to give that character Challenger +1 and "When this character is banished in a challenge, return this card to your hand" this turn. (They get +1 {S} while challenging.)',
  version: "Knows What's Best",
  willpower: 3,
};
