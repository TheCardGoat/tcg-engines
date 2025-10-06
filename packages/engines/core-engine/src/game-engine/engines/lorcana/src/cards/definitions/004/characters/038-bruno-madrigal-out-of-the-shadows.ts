import { returnThisCardToHand } from "@lorcanito/lorcana-engine/effects/effects";
import { chosenCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { whenThisCharacterBanished } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const brunoMadrigalOutOfTheShadows: LorcanaCharacterCardDefinition = {
  id: "nsx",
  missingTestCase: true,
  name: "Bruno Madrigal",
  title: "Out of the Shadows",
  characteristics: ["storyborn", "ally", "madrigal"],
  text: '**IT WAS YOUR VISION** When you play this character, chosen character gains "When this character is banished in a challenge, you may return this card to your hand" this turn.',
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Work Together",
      text: "Chosen character gains **Support** this turn.",
      effects: [
        {
          type: "ability",
          ability: "custom",
          customAbility: whenThisCharacterBanished({
            name: "It was your vision",
            text: "When this character is banished in a challenge, you may return this card to your hand.",
            optional: true,
            effects: [returnThisCardToHand],
          }),
          modifier: "add",
          duration: "turn",
          target: chosenCharacter,
        },
      ],
    },
  ],
  colors: ["amethyst"],
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  illustrator: "Aubrey Archer",
  number: 38,
  set: "URR",
  rarity: "rare",
};
