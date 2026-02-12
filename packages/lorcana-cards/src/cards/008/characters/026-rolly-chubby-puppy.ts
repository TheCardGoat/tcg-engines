import type { CharacterCard } from "@tcg/lorcana-types";

export const rollyChubbyPuppy: CharacterCard = {
  abilities: [
    {
      id: "f0i-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          exerted: true,
          facedown: true,
          source: "discard",
          target: "CONTROLLER",
          type: "put-into-inkwell",
        },
        type: "optional",
      },
      id: "f0i-2",
      name: "ADORABLE ANTICS",
      text: "ADORABLE ANTICS When you play this character, you may put a character card from your discard into your inkwell facedown and exerted.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 26,
  cardType: "character",
  classifications: ["Storyborn", "Puppy"],
  cost: 4,
  externalIds: {
    ravensburger: "361d17f8907a7fc635693768011f4bff4f343ac9",
  },
  franchise: "101 Dalmatians",
  fullName: "Rolly - Chubby Puppy",
  id: "f0i",
  inkType: ["amber", "sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Rolly",
  set: "008",
  strength: 2,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nADORABLE ANTICS When you play this character, you may put a character card from your discard into your inkwell facedown and exerted.",
  version: "Chubby Puppy",
  willpower: 3,
};
