import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellMostHelpful: CharacterCard = {
  id: "ysx",
  cardType: "character",
  name: "Tinker Bell",
  version: "Most Helpful",
  fullName: "Tinker Bell - Most Helpful",
  inkType: ["emerald"],
  franchise: "Peter Pan",
  set: "009",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nPIXIE DUST When you play this character, chosen character gains Evasive this turn.",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 88,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "7d6f88911941e9ab84662a1acc5938a3572d710b",
  },
  abilities: [
    {
      id: "ysx-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "ysx-2",
      type: "triggered",
      name: "PIXIE DUST",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
        duration: "this-turn",
      },
      text: "PIXIE DUST When you play this character, chosen character gains Evasive this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Fairy"],
};
