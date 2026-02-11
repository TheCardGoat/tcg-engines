import type { CharacterCard } from "@tcg/lorcana-types";

export const perditaPlayfulMother: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "ehi-1",
      name: "WHO'S NEXT?",
      text: "WHO'S NEXT? Whenever this character quests, you pay 2 {I} less for the next Puppy character you play this turn.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
    {
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "YOUR_CHARACTERS",
      },
      id: "ehi-2",
      name: "DON'T BE AFRAID Your Puppy",
      text: "DON'T BE AFRAID Your Puppy characters gain Ward.",
      type: "static",
    },
  ],
  cardNumber: 2,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "3435d99659b2cfcde044628324d37c6c5fa17c57",
  },
  franchise: "101 Dalmatians",
  fullName: "Perdita - Playful Mother",
  id: "ehi",
  inkType: ["amber", "sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Perdita",
  set: "007",
  strength: 1,
  text: "WHO'S NEXT? Whenever this character quests, you pay 2 {I} less for the next Puppy character you play this turn.\nDON'T BE AFRAID Your Puppy characters gain Ward. (Opponents can't choose them except to challenge.)",
  version: "Playful Mother",
  willpower: 4,
};
