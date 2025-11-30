import type { CharacterCard } from "@tcg/lorcana";

export const basilPracticedDetective: CharacterCard = {
  id: "jeb",
  cardType: "character",
  name: "Basil",
  version: "Practiced Detective",
  fullName: "Basil - Practiced Detective",
  inkType: ["sapphire"],
  franchise: "Great Mouse Detective",
  set: "005",
  text: "Support (Whenever this character quests, you may add their to another chosen character's this turn.)",
  cardNumber: "153",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "45e94574ada65e2810ad87f119a52fc83df37d25",
  },
  keywords: ["Support"],
  abilities: [
    {
      id: "jeba1",
      text: "Support",
      type: "keyword",
      keyword: "Support",
    },
  ],
  classifications: ["Storyborn", "Hero", "Detective"],
};
