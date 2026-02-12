import type { CharacterCard } from "@tcg/lorcana-types";

export const rayaGuidanceSeeker: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        target: "SELF",
        value: 1,
      },
      id: "1id-1",
      name: "A GREATER PURPOSE",
      text: "A GREATER PURPOSE During your turn, whenever a card is put into your inkwell, this character gains Resist +1 until the start of your next turn.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 186,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 3,
  externalIds: {
    ravensburger: "c3ed1b6beca0a36c4bdc370e94c2f7665523f104",
  },
  franchise: "Raya and the Last Dragon",
  fullName: "Raya - Guidance Seeker",
  id: "1id",
  inkType: ["steel"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Raya",
  set: "007",
  strength: 1,
  text: "A GREATER PURPOSE During your turn, whenever a card is put into your inkwell, this character gains Resist +1 until the start of your next turn. (Damage dealt to them is reduced by 1.)",
  version: "Guidance Seeker",
  willpower: 4,
};
