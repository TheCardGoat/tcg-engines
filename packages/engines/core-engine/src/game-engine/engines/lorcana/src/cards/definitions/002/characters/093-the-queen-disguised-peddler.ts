import { self } from "@lorcanito/lorcana-engine/abilities/targets";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const theQueenDisguisedPeddler: LorcanitoCharacterCardDefinition = {
  id: "htg",
  name: "The Queen",
  title: "Disguised Peddler",
  characteristics: ["queen", "storyborn", "villain"],
  text: "**A PERFECT DISGUISE** {E}, Choose and discard a character card − Gain lore equal to the discarded character's {L}.",
  type: "character",
  abilities: [
    {
      type: "activated",
      name: "A Perfect Disguise",
      text: "{E}, Choose and discard a character card − Gain lore equal to the discarded character's {L}.",
      costs: [{ type: "exert" }], // Discard a card should be a cost
      effects: [
        {
          type: "discard",
          amount: 1,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "type", value: "character" },
              { filter: "zone", value: "hand" },
              { filter: "owner", value: "self" },
            ],
          },
        },
        {
          type: "lore",
          modifier: "add",
          amount: {
            dynamic: true,
            target: { attribute: "lore" },
          },
          target: self,
        },
      ],
    },
  ],
  flavour: '"This is no ordinary apple . . ."',
  colors: ["emerald"],
  cost: 3,
  lore: 0,
  strength: 2,
  willpower: 3,
  illustrator: "Leonardo Giammichele",
  number: 93,
  set: "ROF",
  rarity: "super_rare",
};
