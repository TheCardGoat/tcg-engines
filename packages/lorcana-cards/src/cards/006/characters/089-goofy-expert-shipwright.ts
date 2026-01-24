import type { CharacterCard } from "@tcg/lorcana-types";

export const goofyExpertShipwright: CharacterCard = {
  id: "gjx",
  cardType: "character",
  name: "Goofy",
  version: "Expert Shipwright",
  fullName: "Goofy - Expert Shipwright",
  inkType: ["emerald"],
  set: "006",
  text: "Ward (Opponents can't choose this character except to challenge.)\nCLEVER DESIGN Whenever this character quests, chosen character gains Ward until the start of your next turn.",
  cost: 5,
  strength: 1,
  willpower: 4,
  lore: 3,
  cardNumber: 89,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "3ba92e8b5e5401e6d37f5243fdc400fe6c04ceee",
  },
  abilities: [
    {
      id: "gjx-1",
      type: "keyword",
      keyword: "Ward",
      text: "Ward",
    },
    {
      id: "gjx-2",
      type: "triggered",
      name: "CLEVER DESIGN",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      text: "CLEVER DESIGN Whenever this character quests, chosen character gains Ward until the start of your next turn.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Inventor"],
};
