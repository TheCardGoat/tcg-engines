import type { CharacterCard } from "@tcg/lorcana-types";

export const gazelleAngelWithHorns: CharacterCard = {
  id: "1b1",
  cardType: "character",
  name: "Gazelle",
  version: "Angel with Horns",
  fullName: "Gazelle - Angel with Horns",
  inkType: ["emerald"],
  franchise: "Zootropolis",
  set: "006",
  text: "YOU ARE A REALLY HOT DANCER When you play this character, chosen character gains Evasive until the start of your next turn. (Only characters with Evasive can challenge them.)",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 88,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "aba5859d54a986286125b9b32e0aaf4ff2cc4a94",
  },
  abilities: [
    {
      id: "1b1-1",
      type: "triggered",
      name: "YOU ARE A REALLY HOT DANCER",
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
      },
      text: "YOU ARE A REALLY HOT DANCER When you play this character, chosen character gains Evasive until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Ally"],
};
