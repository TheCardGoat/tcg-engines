import type { CharacterCard } from "@tcg/lorcana-types";

export const vincenzoSantoriniTheExplosivesExpert: CharacterCard = {
  abilities: [
    {
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
      id: "t0e-1",
      name: "I JUST LIKE TO BLOW THINGS UP",
      text: "I JUST LIKE TO BLOW THINGS UP When you play this character, you may deal 3 damage to chosen character.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 197,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 7,
  externalIds: {
    ravensburger: "688ea6eb39dc0fc75464580b5190fb330861b9ae",
  },
  franchise: "Atlantis",
  fullName: "Vincenzo Santorini - The Explosives Expert",
  id: "t0e",
  inkType: ["steel"],
  inkable: true,
  lore: 3,
  missingTests: true,
  name: "Vincenzo Santorini",
  set: "008",
  strength: 2,
  text: "I JUST LIKE TO BLOW THINGS UP When you play this character, you may deal 3 damage to chosen character.",
  version: "The Explosives Expert",
  willpower: 8,
};
