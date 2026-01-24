import type { CharacterCard } from "@tcg/lorcana-types";

export const vincenzoSantoriniTheExplosivesExpert: CharacterCard = {
  id: "t0e",
  cardType: "character",
  name: "Vincenzo Santorini",
  version: "The Explosives Expert",
  fullName: "Vincenzo Santorini - The Explosives Expert",
  inkType: ["steel"],
  franchise: "Atlantis",
  set: "008",
  text: "I JUST LIKE TO BLOW THINGS UP When you play this character, you may deal 3 damage to chosen character.",
  cost: 7,
  strength: 2,
  willpower: 8,
  lore: 3,
  cardNumber: 197,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "688ea6eb39dc0fc75464580b5190fb330861b9ae",
  },
  abilities: [
    {
      id: "t0e-1",
      type: "triggered",
      name: "I JUST LIKE TO BLOW THINGS UP",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 3,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "I JUST LIKE TO BLOW THINGS UP When you play this character, you may deal 3 damage to chosen character.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
