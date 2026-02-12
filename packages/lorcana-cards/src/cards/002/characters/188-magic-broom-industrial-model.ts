import type { CharacterCard } from "@tcg/lorcana-types";

export const magicBroomIndustrialModel: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Resist",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "gain-keyword",
        value: 1,
      },
      id: "11u-1",
      name: "MAKE IT SHINE",
      text: "MAKE IT SHINE When you play this character, chosen character gains Resist +1 until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 188,
  cardType: "character",
  classifications: ["Dreamborn", "Broom"],
  cost: 3,
  externalIds: {
    ravensburger: "886ba59539c115eb94eaabba8dec4a56a76b26c0",
  },
  franchise: "Fantasia",
  fullName: "Magic Broom - Industrial Model",
  id: "11u",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Magic Broom",
  set: "002",
  strength: 2,
  text: "MAKE IT SHINE When you play this character, chosen character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  version: "Industrial Model",
  willpower: 3,
};
