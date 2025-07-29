import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const chosenDamagedCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    {
      filter: "status",
      value: "damage",
      comparison: { operator: "gte", value: 1 },
    },
    { filter: "type", value: "character" },
    { filter: "zone", value: "play" },
  ],
};

export const whatDidYouCallMe: LorcanaActionCardDefinition = {
  id: "vrt",

  name: "What did you call me?",
  characteristics: ["action"],
  text: "Chosen damaged character gets +3 {S} this turn.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "What did you call me?",
      text: "Chosen damaged character gets +3 {S} this turn.",
      effects: [
        {
          type: "attribute",
          attribute: "strength",
          amount: 3,
          modifier: "add",
          duration: "turn",
          target: chosenDamagedCharacter,
        },
      ],
    },
  ],
  flavour:
    "No one can have a higher opinion of you than I have, and I think you're a slimy, contemptible sewer rat! \n−Basil",
  inkwell: true,
  colors: ["ruby"],
  cost: 1,
  illustrator: "Luis Huerta",
  number: 132,
  set: "ROF",
  rarity: "common",
};
