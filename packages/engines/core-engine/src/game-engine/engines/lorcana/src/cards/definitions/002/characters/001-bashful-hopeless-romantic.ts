import { thisCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import type { RestrictionStaticAbility } from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const newVar: RestrictionStaticAbility = {
  type: "static",
  ability: "restriction",
  effect: {
    type: "restriction",
    restriction: "quest",
    // TODO: Static should not have duration, they're valid as long as the source is in play
    duration: "turn",
    target: thisCharacter,
  },
  target: thisCharacter,
  conditions: [
    {
      type: "filter",
      comparison: {
        operator: "lte",
        value: 1,
      },
      filters: [
        { filter: "characteristics", value: ["seven dwarfs"] },
        { filter: "type", value: "character" },
        { filter: "zone", value: "play" },
        { filter: "owner", value: "self" },
      ],
    },
  ],
};

export const bashfulHopelessRomantic: LorcanitoCharacterCardDefinition = {
  id: "iu7",
  name: "Bashful",
  title: "Hopeless Romantic",
  characteristics: ["storyborn", "ally", "seven dwarfs"],
  text: "**OH, GOSH** This character can't quest unless you have another Seven Dwarfs character in play.",
  type: "character",
  abilities: [newVar],
  flavour: "Life is sweeter with friends.",
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 3,
  illustrator: "Kendall Hale",
  number: 1,
  set: "ROF",
  rarity: "uncommon",
};
