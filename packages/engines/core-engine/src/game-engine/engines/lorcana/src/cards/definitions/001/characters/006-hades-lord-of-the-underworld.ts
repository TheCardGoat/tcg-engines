import { whenYouPlayThisCharAbility } from "~/game-engine/engines/lorcana/src/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const hadesLordOfUnderworld: LorcanaCharacterCardDefinition = {
  id: "kaz",
  name: "Hades",
  title: "Lord of the Underworld",
  characteristics: ["storyborn", "villain", "deity"],
  text: "**WELL OF SOULS** When you play this character, return a character card from your discard to your hand.",
  type: "character",
  abilities: [
    whenYouPlayThisCharAbility({
      type: "resolution",
      name: "WELL OF SOULS",
      text: "When you play this character, return a character card from your discard to your hand.",
      effects: [
        {
          type: "move",
          to: "hand",
          exerted: false,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "discard" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    }),
  ],
  flavour:
    '"Production is up, costs are down, the rivers are full. Time to talk expansion."',
  colors: ["amber"],
  cost: 4,
  strength: 3,
  willpower: 2,
  lore: 1,
  illustrator: "Randy Bishop",
  number: 6,
  set: "TFC",
  rarity: "rare",
};
