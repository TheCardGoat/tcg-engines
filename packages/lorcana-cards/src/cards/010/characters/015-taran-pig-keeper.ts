import type { CharacterCard } from "@tcg/lorcana-types";

export const taranPigKeeper: CharacterCard = {
  id: "5f5",
  cardType: "character",
  name: "Taran",
  version: "Pig Keeper",
  fullName: "Taran - Pig Keeper",
  inkType: ["amber"],
  franchise: "Black Cauldron",
  set: "010",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nFOLLOW THE PIG Whenever this character quests, you may return a character card named Hen Wen from your discard to your hand.",
  cost: 5,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 15,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "1389ac1326730a0e6706415162ccb1913fd6478d",
  },
  abilities: [
    {
      id: "5f5-1",
      type: "keyword",
      keyword: "Support",
      text: "Support",
    },
    {
      id: "5f5-2",
      type: "triggered",
      name: "FOLLOW THE PIG",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
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
      text: "FOLLOW THE PIG Whenever this character quests, you may return a character card named Hen Wen from your discard to your hand.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
