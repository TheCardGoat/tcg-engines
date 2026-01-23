import type { CharacterCard } from "@tcg/lorcana-types";
import { moveCards, optional } from "../../ability-helpers";

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
      effect: optional(
        moveCards("play", "hand", {
          target: "SELF",
        }),
      ),
    },
  ],
  classifications: ["Storyborn", "Ally"],
};

// LEGACY IMPLEMENTATION: FOR REFERENCE ONLY. AFTER MIGRATION REMOVE THIS!
// import { whenThisCharacterBanishedInAChallenge } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
// import type { LorcanitoCharacterCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
// import { returnThisCardToHand } from "@lorcanito/lorcana-engine/effects/effects";
//
// export const marshmallowPersistentGuardian: LorcanitoCharacterCard = {
//   id: "it5",
//   name: "Marshmallow",
//   title: "Persistent Guardian",
//   characteristics: ["storyborn", "ally"],
//   text: "**DURABLE** When this character is banished in a challenge, you may return this card to your hand.",
//   type: "character",
//   abilities: [
//     whenThisCharacterBanishedInAChallenge({
//       name: "Durable",
//       optional: true,
//       text: "When this character is banished in a challenge, you may return this card to your hand.",
//       effects: [returnThisCardToHand],
//     }),
//   ],
//   flavour:
//     "Hey! We were just talking about you! All good things, all good things. −Olaf",
//   colors: ["amethyst"],
//   cost: 6,
//   strength: 5,
//   willpower: 5,
//   lore: 1,
//   illustrator: "Kendall Hale",
//   number: 50,
//   set: "TFC",
//   externalIds: {
//     tcgPlayer: 505955,
//   },
//   rarity: "super_rare",
// };
//
