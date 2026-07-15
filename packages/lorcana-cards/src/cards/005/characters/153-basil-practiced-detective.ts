import type { CharacterCard } from "@tcg/lorcana-types";

export const basilPracticedDetective: CharacterCard = {
  abilities: [
    {
      id: "jeb-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
  ],
  cardNumber: 153,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Detective"],
  cost: 1,
  externalIds: {
    ravensburger: "45e94574ada65e2810ad87f119a52fc83df37d25",
  },
  franchise: "Great Mouse Detective",
  fullName: "Basil - Practiced Detective",
  id: "jeb",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  name: "Basil",
  set: "005",
  strength: 2,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  version: "Practiced Detective",
  willpower: 1,
};
