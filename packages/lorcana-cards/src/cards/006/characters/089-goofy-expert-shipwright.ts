import type { CharacterCard } from "@tcg/lorcana-types";

export const goofyExpertShipwright: CharacterCard = {
  abilities: [
    {
      id: "gjx-1",
      keyword: "Ward",
      text: "Ward",
      type: "keyword",
    },
    {
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
      id: "gjx-2",
      name: "CLEVER DESIGN",
      text: "CLEVER DESIGN Whenever this character quests, chosen character gains Ward until the start of your next turn.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 89,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Inventor"],
  cost: 5,
  externalIds: {
    ravensburger: "3ba92e8b5e5401e6d37f5243fdc400fe6c04ceee",
  },
  fullName: "Goofy - Expert Shipwright",
  id: "gjx",
  inkType: ["emerald"],
  inkable: true,
  lore: 3,
  missingTests: true,
  name: "Goofy",
  set: "006",
  strength: 1,
  text: "Ward (Opponents can't choose this character except to challenge.)\nCLEVER DESIGN Whenever this character quests, chosen character gains Ward until the start of your next turn.",
  version: "Expert Shipwright",
  willpower: 4,
};
