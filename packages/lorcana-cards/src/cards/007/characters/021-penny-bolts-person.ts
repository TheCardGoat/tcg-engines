import type { CharacterCard } from "@tcg/lorcana-types";

export const pennyBoltsPerson: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          keyword: "Resist",
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "gain-keyword",
          value: 1,
        },
        type: "optional",
      },
      id: "i2f-1",
      name: "ENDURING LOYALTY",
      text: "ENDURING LOYALTY When you play this character, you may remove up to 2 damage from chosen character and they gain Resist +1 until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 21,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "411deec2bc09d6d9bad7ac874b976b9ef4264678",
  },
  franchise: "Bolt",
  fullName: "Penny - Bolt's Person",
  id: "i2f",
  inkType: ["amber", "steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Penny",
  set: "007",
  strength: 1,
  text: "ENDURING LOYALTY When you play this character, you may remove up to 2 damage from chosen character and they gain Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  version: "Bolt's Person",
  willpower: 2,
};
