import type { CharacterCard } from "@tcg/lorcana-types";

export const rapunzelCreativeCaptor: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -3,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
      id: "1gl-1",
      name: "ENSNARL",
      text: "ENSNARL When you play this character, chosen opposing character gets -3 {S} this turn.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 143,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess"],
  cost: 5,
  externalIds: {
    ravensburger: "bd851b8f1a2e26ff38337ab860a646858284a865",
  },
  franchise: "Tangled",
  fullName: "Rapunzel - Creative Captor",
  id: "1gl",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Rapunzel",
  set: "010",
  strength: 3,
  text: "ENSNARL When you play this character, chosen opposing character gets -3 {S} this turn.",
  version: "Creative Captor",
  willpower: 6,
};
