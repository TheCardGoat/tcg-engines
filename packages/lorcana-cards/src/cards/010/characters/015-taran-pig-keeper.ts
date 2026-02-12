import type { CharacterCard } from "@tcg/lorcana-types";

export const taranPigKeeper: CharacterCard = {
  abilities: [
    {
      id: "5f5-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "return-to-hand",
        },
        type: "optional",
      },
      id: "5f5-2",
      name: "FOLLOW THE PIG",
      text: "FOLLOW THE PIG Whenever this character quests, you may return a character card named Hen Wen from your discard to your hand.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 15,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 5,
  externalIds: {
    ravensburger: "1389ac1326730a0e6706415162ccb1913fd6478d",
  },
  franchise: "Black Cauldron",
  fullName: "Taran - Pig Keeper",
  id: "5f5",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Taran",
  set: "010",
  strength: 5,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\nFOLLOW THE PIG Whenever this character quests, you may return a character card named Hen Wen from your discard to your hand.",
  version: "Pig Keeper",
  willpower: 5,
};
