import type { CharacterCard } from "@tcg/lorcana-types";

export const transformedChefCastleStove: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 2,
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "remove-damage",
        upTo: true,
      },
      id: "1t8-1",
      name: "A CULINARY MASTERPIECE",
      text: "A CULINARY MASTERPIECE When you play this character, remove up to 2 damage from chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 157,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "eacf9cb4d5bec8eaa5cfe81734389608ea2cd322",
  },
  franchise: "Beauty and the Beast",
  fullName: "Transformed Chef - Castle Stove",
  id: "1t8",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Transformed Chef",
  set: "004",
  strength: 3,
  text: "A CULINARY MASTERPIECE When you play this character, remove up to 2 damage from chosen character.",
  version: "Castle Stove",
  willpower: 3,
};
