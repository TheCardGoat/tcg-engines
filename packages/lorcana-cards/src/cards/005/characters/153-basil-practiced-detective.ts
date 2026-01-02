import type { CharacterCard } from "@tcg/lorcana-types";

export const basilPracticedDetective: CharacterCard = {
  id: "jeb",
  cardType: "character",
  name: "Basil",
  version: "Practiced Detective",
  fullName: "Basil - Practiced Detective",
  inkType: ["sapphire"],
  franchise: "Great Mouse Detective",
  set: "005",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 153,
  inkable: true,
  externalIds: {
    ravensburger: "45e94574ada65e2810ad87f119a52fc83df37d25",
  },
  abilities: [
    {
      id: "jeb-1",
      text: "Support",
      type: "keyword",
      keyword: "Support",
    },
  ],
  classifications: ["Storyborn", "Hero", "Detective"],
};
