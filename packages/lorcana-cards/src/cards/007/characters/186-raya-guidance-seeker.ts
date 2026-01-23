import type { CharacterCard } from "@tcg/lorcana-types";

export const rayaGuidanceSeeker: CharacterCard = {
  id: "1id",
  cardType: "character",
  name: "Raya",
  version: "Guidance Seeker",
  fullName: "Raya - Guidance Seeker",
  inkType: ["steel"],
  franchise: "Raya and the Last Dragon",
  set: "007",
  text: "A GREATER PURPOSE During your turn, whenever a card is put into your inkwell, this character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  cost: 3,
  strength: 1,
  willpower: 4,
  lore: 2,
  cardNumber: 186,
  inkable: true,
  missingImplementation: true,
  missingTests: true,
  externalIds: {
    ravensburger: "c3ed1b6beca0a36c4bdc370e94c2f7665523f104",
  },
  abilities: [],
  classifications: ["Storyborn", "Hero", "Princess"],
};
