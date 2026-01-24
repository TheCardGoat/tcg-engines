import type { CharacterCard } from "@tcg/lorcana-types";

export const henWenPropheticPig: CharacterCard = {
  id: "1ms",
  cardType: "character",
  name: "Hen Wen",
  version: "Prophetic Pig",
  fullName: "Hen Wen - Prophetic Pig",
  inkType: ["sapphire"],
  franchise: "Black Cauldron",
  set: "010",
  text: "FUTURE SIGHT Whenever this character quests, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 138,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "d3e6bc36dde0bb79b16e1217817d3d1be299ac50",
  },
  abilities: [
    {
      id: "1ms-1",
      type: "triggered",
      name: "FUTURE SIGHT",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "put-on-bottom",
        target: "CHOSEN_CHARACTER",
      },
      text: "FUTURE SIGHT Whenever this character quests, look at the top card of your deck. Put it on either the top or the bottom of your deck.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
