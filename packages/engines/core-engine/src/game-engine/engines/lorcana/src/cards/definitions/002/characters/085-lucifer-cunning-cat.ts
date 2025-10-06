import { discardACard } from "@lorcanito/lorcana-engine/effects/effects";
import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const luciferCunningCat: LorcanaCharacterCardDefinition = {
  id: "s0r",
  name: "Lucifer",
  title: "Cunning Cat",
  characteristics: ["storyborn", "ally"],
  text: "**MOUSE CATCHER** When you play this character, each opponent chooses and discards either 2 cards or 1 action card.",
  type: "character",
  abilities: [
    {
      type: "resolution",
      name: "Mouse Catcher",
      text: "When you play this character, each opponent chooses and discards either 2 cards or 1 action card.",
      responder: "opponent",
      effects: [
        {
          type: "discard",
          amount: 1,
          afterEffect: [
            {
              type: "create-layer-based-on-target",
              responder: "opponent",
              filters: [{ filter: "type", value: ["action"], negate: true }],
              // TODO: get rid of target
              target: thisCharacter,
              effects: [discardACard],
            },
          ],
          target: {
            type: "card",
            value: 1,
            upTo: true,
            filters: [
              { filter: "zone", value: "hand" },
              { filter: "owner", value: "self" },
            ],
          },
        },
      ],
    },
  ],
  flavour: '"There must be something good about him." \\n−Cinderella',
  colors: ["emerald"],
  cost: 5,
  strength: 2,
  willpower: 2,
  lore: 2,
  illustrator: "Isabella Ceravolo",
  number: 85,
  set: "ROF",
  rarity: "rare",
};
