import { haveMoreCardsThanOpponent } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenThisCharacterBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const yzmaChangedIntoAKitten: LorcanaCharacterCardDefinition = {
  id: "ol1",
  name: "Yzma",
  title: "Transformed Kitten",
  characteristics: ["storyborn", "villain", "mage"],
  text: "I WON When this character is banished, if you have more cards in hand than any opponent, you may return this character to your hand.",
  type: "character",
  abilities: [
    whenThisCharacterBanished({
      name: "I WON",
      text: "When this character is banished, if you have more cards in hand than any opponent, you may return this character to your hand.",
      optional: true,
      conditions: [haveMoreCardsThanOpponent],
      effects: [
        {
          type: "move",
          to: "hand",
          target: thisCharacter,
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amethyst"],
  cost: 2,
  strength: 2,
  willpower: 1,
  illustrator: "Oospognant",
  number: 59,
  set: "007",
  rarity: "common",
  lore: 1,
};
