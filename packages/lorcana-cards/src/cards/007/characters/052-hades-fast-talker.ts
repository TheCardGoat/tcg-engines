import type { CharacterCard } from "@tcg/lorcana-types";

export const hadesFastTalker: CharacterCard = {
  abilities: [
    {
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
      id: "1px-1",
      name: "FOR JUST A LITTLE PAIN",
      text: "FOR JUST A LITTLE PAIN When you play this character, you may deal 2 damage to another chosen character of yours to banish chosen character with cost 3 or less.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 52,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Deity"],
  cost: 6,
  externalIds: {
    ravensburger: "df2b712163f2278bdb5a2b67b13b5d5e3e04e6d4",
  },
  franchise: "Hercules",
  fullName: "Hades - Fast Talker",
  id: "1px",
  inkType: ["amethyst", "ruby"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Hades",
  set: "007",
  strength: 4,
  text: "FOR JUST A LITTLE PAIN When you play this character, you may deal 2 damage to another chosen character of yours to banish chosen character with cost 3 or less.",
  version: "Fast Talker",
  willpower: 6,
};
