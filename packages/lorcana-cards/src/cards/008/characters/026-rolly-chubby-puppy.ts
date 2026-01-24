import type { CharacterCard } from "@tcg/lorcana-types";

export const rollyChubbyPuppy: CharacterCard = {
  id: "f0i",
  cardType: "character",
  name: "Rolly",
  version: "Chubby Puppy",
  fullName: "Rolly - Chubby Puppy",
  inkType: ["amber", "sapphire"],
  franchise: "101 Dalmatians",
  set: "008",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nADORABLE ANTICS When you play this character, you may put a character card from your discard into your inkwell facedown and exerted.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 26,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "361d17f8907a7fc635693768011f4bff4f343ac9",
  },
  abilities: [
    {
      id: "f0i-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
    {
      id: "f0i-2",
      type: "triggered",
      name: "ADORABLE ANTICS",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          source: "discard",
          target: "CONTROLLER",
          exerted: true,
          facedown: true,
        },
        chooser: "CONTROLLER",
      },
      text: "ADORABLE ANTICS When you play this character, you may put a character card from your discard into your inkwell facedown and exerted.",
    },
  ],
  classifications: ["Storyborn", "Puppy"],
};
