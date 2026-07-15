import type { CharacterCard } from "@tcg/lorcana-types";

export const stitchAlienTroublemaker: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          type: "gain-lore",
        },
        type: "optional",
      },
      id: "aiz-1",
      name: "I WIN!",
      text: "I WIN! During your turn, whenever this character banishes another character in a challenge, you may draw a card and gain 1 lore.",
      trigger: {
        event: "banish",
        on: "OPPONENT_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 200,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Alien"],
  cost: 4,
  externalIds: {
    ravensburger: "25f0dc4e3fd1b1b13365fcf75768ebd9490bc9d6",
  },
  franchise: "Lilo and Stitch",
  fullName: "Stitch - Alien Troublemaker",
  id: "aiz",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Stitch",
  set: "008",
  strength: 3,
  text: "I WIN! During your turn, whenever this character banishes another character in a challenge, you may draw a card and gain 1 lore.",
  version: "Alien Troublemaker",
  willpower: 4,
};
