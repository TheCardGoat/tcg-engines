import { returnThisCardToHand } from "@lorcanito/lorcana-engine/effects/effects";
import { whenThisCharacterBanishedInAChallenge } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const camiloMadrigalAtTheCenterOfAttention: LorcanaCharacterCardDefinition =
  {
    id: "mef",
    name: "Camilo Madrigal",
    title: "Center Stage",
    characteristics: ["storyborn", "ally", "madrigal"],
    text: "BIS! BIS! When this character is banished in a challenge, return this card to your hand.",
    type: "character",
    abilities: [
      whenThisCharacterBanishedInAChallenge({
        name: "ENCORE! ENCORE!",
        text: "When this character is banished in a challenge, return this card to your hand.",
        effects: [returnThisCardToHand],
      }),
    ],
    inkwell: true,
    colors: ["amethyst"],
    cost: 5,
    strength: 4,
    willpower: 4,
    illustrator: "Carlos Gomes Cabral",
    number: 75,
    set: "008",
    rarity: "common",
    lore: 2,
  };
