import type { CharacterCard } from "@tcg/lorcana-types";

export const tinkerBellMostHelpful: CharacterCard = {
  abilities: [
    {
      id: "ysx-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        duration: "this-turn",
        keyword: "Evasive",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "ysx-2",
      name: "PIXIE DUST",
      text: "PIXIE DUST When you play this character, chosen character gains Evasive this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 88,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Fairy"],
  cost: 4,
  externalIds: {
    ravensburger: "7d6f88911941e9ab84662a1acc5938a3572d710b",
  },
  franchise: "Peter Pan",
  fullName: "Tinker Bell - Most Helpful",
  id: "ysx",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Tinker Bell",
  set: "009",
  strength: 2,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nPIXIE DUST When you play this character, chosen character gains Evasive this turn.",
  version: "Most Helpful",
  willpower: 3,
};
