import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenYouPlayThis } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cinderellaTheRightOne: LorcanaCharacterCardDefinition = {
  id: "v64",
  name: "Cinderella",
  title: "The Right One",
  characteristics: ["storyborn", "hero", "princess"],
  text: "IF THE SLIPPER FITS When you play this character, you may put an item card named The Glass Slipper from your discard on the bottom of your deck to gain 3 lore.",
  type: "character",
  abilities: [
    whenYouPlayThis({
      name: "IF THE SLIPPER FITS",
      text: "When you play this character, you may put an item card named The Glass Slipper from your discard on the bottom of your deck to gain 3 lore.",
      optional: true,
      effects: [
        {
          type: "move",
          to: "deck",
          bottom: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "item" },
              { filter: "zone", value: "discard" },
              {
                filter: "attribute",
                value: "name",
                comparison: { operator: "eq", value: "The Glass Slipper" },
              },
            ],
          },
          forEach: [
            {
              type: "lore",
              amount: 3,
              modifier: "add",
              target: self,
            },
          ],
        },
      ],
    }),
  ],
  inkwell: true,
  colors: ["amber"],
  cost: 4,
  strength: 2,
  willpower: 4,
  illustrator: "Tania Soler",
  number: 15,
  set: "007",
  rarity: "rare",
  lore: 2,
};
