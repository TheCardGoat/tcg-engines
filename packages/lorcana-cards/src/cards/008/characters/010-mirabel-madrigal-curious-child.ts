import type { CharacterCard } from "@tcg/lorcana-types";

export const mirabelMadrigalCuriousChild: CharacterCard = {
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
      id: "191-1",
      name: "YOU ARE A WONDER",
      text: "YOU ARE A WONDER When you play this character, you may reveal a song card in your hand to gain 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 10,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Madrigal"],
  cost: 1,
  externalIds: {
    ravensburger: "a39249e29acf0c0edfe7e329190ab01462b8a5be",
  },
  franchise: "Encanto",
  fullName: "Mirabel Madrigal - Curious Child",
  id: "191",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Mirabel Madrigal",
  set: "008",
  strength: 0,
  text: "YOU ARE A WONDER When you play this character, you may reveal a song card in your hand to gain 1 lore.",
  version: "Curious Child",
  willpower: 2,
};
