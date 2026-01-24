import type { CharacterCard } from "@tcg/lorcana-types";

export const hadesFastTalker: CharacterCard = {
  id: "1px",
  cardType: "character",
  name: "Hades",
  version: "Fast Talker",
  fullName: "Hades - Fast Talker",
  inkType: ["amethyst", "ruby"],
  franchise: "Hercules",
  set: "007",
  text: "FOR JUST A LITTLE PAIN When you play this character, you may deal 2 damage to another chosen character of yours to banish chosen character with cost 3 or less.",
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 2,
  cardNumber: 52,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "df2b712163f2278bdb5a2b67b13b5d5e3e04e6d4",
  },
  abilities: [
    {
      id: "1px-1",
      type: "triggered",
      name: "FOR JUST A LITTLE PAIN",
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
      text: "FOR JUST A LITTLE PAIN When you play this character, you may deal 2 damage to another chosen character of yours to banish chosen character with cost 3 or less.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Deity"],
};
