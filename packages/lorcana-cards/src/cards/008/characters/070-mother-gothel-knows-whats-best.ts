import type { CharacterCard } from "@tcg/lorcana-types";

export const motherGothelKnowsWhatsBest: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 2,
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "1pt-1",
      name: "LOOK WHAT YOU'VE DONE",
      text: 'LOOK WHAT YOU\'VE DONE When you play this character, you may deal 2 damage to another chosen character of yours to give that character Challenger +1 and "When this character is banished in a challenge, return this card to your hand" this turn.',
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
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
