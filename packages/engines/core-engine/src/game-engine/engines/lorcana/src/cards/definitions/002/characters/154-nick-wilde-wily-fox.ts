import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const nickWildeWilyFox: LorcanaCharacterCardDefinition = {
  id: "eql",
  name: "Nick Wilde",
  title: "Wily Fox",
  characteristics: ["storyborn", "ally"],
  text: "**IT'S CALLED A HUSTLE** When you play this character, you may return an item card named Pawpsicle from your discard to your hand.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      optional: true,
      name: "It's called a Hustle",
      text: "When you play this character, you may return an item card named Pawpsicle from your discard to your hand.",
      effects: [
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              {
                filter: "attribute",
                value: "name",
                comparison: { operator: "eq", value: "Pawpsicle" },
              },
              { filter: "zone", value: "discard" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    },
  ],
  flavour: "It's criminal how good these things taste!",
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  illustrator: "Grace Tran",
  number: 154,
  set: "ROF",
  rarity: "uncommon",
};
