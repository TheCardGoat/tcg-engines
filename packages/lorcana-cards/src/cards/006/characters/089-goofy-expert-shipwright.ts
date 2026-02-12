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
        keyword: "Ward",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "gjx-2",
      name: "CLEVER DESIGN",
      text: "CLEVER DESIGN Whenever this character quests, chosen character gains Ward until the start of your next turn.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
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
