import type { CharacterCard } from "@tcg/lorcana-types";

export const stitchTeamUnderdog: CharacterCard = {
  id: "jmz",
  cardType: "character",
  name: "Stitch",
  version: "Team Underdog",
  fullName: "Stitch - Team Underdog",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "005",
  text: "HEAVE HO! When you play this character, you may deal 2 damage to chosen character.",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 171,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "46c74815d938940a1435bdae976105ce9951db9f",
  },
  abilities: [
    {
      id: "jmz-1",
      type: "triggered",
      name: "HEAVE HO!",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
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
      text: "HEAVE HO! When you play this character, you may deal 2 damage to chosen character.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Alien"],
};
