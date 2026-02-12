import type { CharacterCard } from "@tcg/lorcana-types";

export const gazelleAngelWithHorns: CharacterCard = {
  abilities: [
    {
      effect: {
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
      id: "1b1-1",
      name: "YOU ARE A REALLY HOT DANCER",
      text: "YOU ARE A REALLY HOT DANCER When you play this character, chosen character gains Evasive until the start of your next turn.",
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
  classifications: ["Dreamborn", "Ally"],
  cost: 2,
  externalIds: {
    ravensburger: "aba5859d54a986286125b9b32e0aaf4ff2cc4a94",
  },
  franchise: "Zootropolis",
  fullName: "Gazelle - Angel with Horns",
  id: "1b1",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Gazelle",
  set: "006",
  strength: 1,
  text: "YOU ARE A REALLY HOT DANCER When you play this character, chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  version: "Angel with Horns",
  willpower: 2,
};
