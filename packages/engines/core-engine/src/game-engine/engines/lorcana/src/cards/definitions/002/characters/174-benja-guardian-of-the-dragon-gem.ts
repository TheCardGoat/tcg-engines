import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const benjaGuardianOfTheDragonGem: LorcanaCharacterCardDefinition = {
  id: "buc",
  reprints: ["tik"],
  name: "Benja",
  title: "Guardian of the Dragon Gem",
  characteristics: ["storyborn", "king", "mentor"],
  text: "**WE HAVE A CHOICE** When you play this character, you may banish chosen item.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "We Have a Choice",
      text: "When you play this character, you may banish chosen item.",
      optional: true,
      effects: [
        {
          type: "banish",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "item" },
              { filter: "zone", value: "play" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "Don't mistake spirit for skill.",
  inkwell: true,
  colors: ["steel"],
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  illustrator: "Grace Tran",
  number: 174,
  set: "ROF",
  rarity: "common",
};
