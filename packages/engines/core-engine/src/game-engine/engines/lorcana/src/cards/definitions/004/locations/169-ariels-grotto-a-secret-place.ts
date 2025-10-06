import { propertyStaticAbilities } from "~/game-engine/engines/lorcana/src/abilities/propertyStaticAbilities";
import type { LorcanaLocationCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const arielsGrottoASecretPlace: LorcanaLocationCardDefinition = {
  id: "ip4",
  name: "Ariel's Grotto",
  title: "A Secret Place",
  characteristics: ["location"],
  text: "**TREASURE TROVE** While you have 3 or more items in play, this location gets +2 {L}.",
  type: "location",
  abilities: [
    propertyStaticAbilities({
      name: "Treasure Trove",
      text: "While you have 3 or more items in play, this location gets +2 {L}.",
      conditions: [
        {
          type: "filter",
          filters: [
            { filter: "type", value: "item" },
            { filter: "zone", value: "play" },
            { filter: "owner", value: "self" },
          ],
          comparison: {
            operator: "gte",
            value: 3,
          },
        },
      ],
      attribute: "lore",
      amount: 2,
    }),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 2,
  moveCost: 2,
  willpower: 7,
  illustrator: "Jeremy Adams",
  number: 169,
  set: "URR",
  rarity: "rare",
};
