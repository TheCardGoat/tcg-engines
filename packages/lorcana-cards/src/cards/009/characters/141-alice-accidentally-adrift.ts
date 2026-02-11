import type { CharacterCard } from "@tcg/lorcana-types";

export const aliceAccidentallyAdrift: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: -2,
        target: "CHOSEN_CHARACTER",
        duration: "this-turn",
      },
      id: "ijg-2",
      name: "MAKING WAVES",
      text: "MAKING WAVES Whenever this character quests, chosen opposing character gets -2 {S} this turn.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 141,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 4,
  externalIds: {
    ravensburger: "42d28673c7cc3a36053276edd16cc2814ee60ebc",
  },
  franchise: "Alice in Wonderland",
  fullName: "Alice - Accidentally Adrift",
  id: "ijg",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingImplementation: true,
  missingTests: true,
  name: "Alice",
  set: "009",
  strength: 2,
  text: "WASHED AWAY When you play this character, you may put chosen item into its player's inkwell facedown and exerted.\nMAKING WAVES Whenever this character quests, chosen opposing character gets -2 {S} this turn.",
  version: "Accidentally Adrift",
  willpower: 3,
};
