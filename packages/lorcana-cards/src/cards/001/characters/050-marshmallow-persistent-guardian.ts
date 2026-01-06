import type { CharacterCard } from "@tcg/lorcana-types";

export const marshmallowPersistentGuardian: CharacterCard = {
  id: "it5",
  cardType: "character",
  name: "Marshmallow",
  version: "Persistent Guardian",
  fullName: "Marshmallow - Persistent Guardian",
  inkType: ["amethyst"],
  franchise: "Disney",
  set: "001",
  text: "**DURABLE** When this character is banished in a challenge, you may return this card to your hand.",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 1,
  cardNumber: 50,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**DURABLE** When this character is banished in a challenge, you may return this card to your hand.",
      id: "it5-1",
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: "SELF",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
