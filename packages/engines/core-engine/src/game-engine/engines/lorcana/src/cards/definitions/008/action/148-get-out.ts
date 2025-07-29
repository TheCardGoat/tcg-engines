import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine";
import { chosenCharacter } from "@lorcanito/lorcana-engine/abilities/targets";
import { mayBanish } from "@lorcanito/lorcana-engine/effects/effects";

export const getOut: LorcanitoActionCard = {
  id: "vaq",
  name: "Get Out!",
  characteristics: ["action"],
  text: "Banish chosen character, then return an item card from your discard to your hand.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      resolveEffectsIndividually: true,
      effects: [
        mayBanish(chosenCharacter),
        {
          type: "move",
          to: "hand",
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "item" },
              { filter: "owner", value: "self" },
              { filter: "zone", value: "discard" },
            ],
          },
        },
      ],
    },
  ],
  inkwell: false,
  colors: ["ruby", "sapphire"],
  cost: 6,
  illustrator: "Diego Saito",
  number: 148,
  set: "008",
  rarity: "uncommon",
};
