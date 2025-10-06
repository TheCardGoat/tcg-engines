import { whenThisCharacterBanishedInAChallenge } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { returnThisCardToHand } from "@lorcanito/lorcana-engine/effects/effects";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const marshmallowPersistentGuardian: LorcanaCharacterCardDefinition = {
  id: "it5",
  name: "Marshmallow",
  title: "Persistent Guardian",
  characteristics: ["storyborn", "ally"],
  text: "**DURABLE** When this character is banished in a challenge, you may return this card to your hand.",
  type: "character",
  abilities: [
    whenThisCharacterBanishedInAChallenge({
      name: "Durable",
      optional: true,
      text: "When this character is banished in a challenge, you may return this card to your hand.",
      effects: [returnThisCardToHand],
    }),
  ],
  flavour:
    "Hey! We were just talking about you! All good things, all good things. −Olaf",
  colors: ["amethyst"],
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 1,
  illustrator: "Kendall Hale",
  number: 50,
  set: "TFC",
  rarity: "super_rare",
};
