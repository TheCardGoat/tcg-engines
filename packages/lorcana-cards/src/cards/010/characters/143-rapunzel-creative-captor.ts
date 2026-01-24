import type { CharacterCard } from "@tcg/lorcana-types";

export const rapunzelCreativeCaptor: CharacterCard = {
  id: "1gl",
  cardType: "character",
  name: "Rapunzel",
  version: "Creative Captor",
  fullName: "Rapunzel - Creative Captor",
  inkType: ["sapphire"],
  franchise: "Tangled",
  set: "010",
  text: "ENSNARL When you play this character, chosen opposing character gets -3 {S} this turn.",
  cost: 5,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 143,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "bd851b8f1a2e26ff38337ab860a646858284a865",
  },
  abilities: [
    {
      id: "1gl-1",
      type: "triggered",
      name: "ENSNARL",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -3,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
      text: "ENSNARL When you play this character, chosen opposing character gets -3 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess"],
};
