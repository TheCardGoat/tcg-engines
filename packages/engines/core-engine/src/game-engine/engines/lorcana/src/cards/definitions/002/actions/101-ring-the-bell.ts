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

export const ringTheBell: LorcanaActionCardDefinition = {
  id: "bvn",

  name: "Ring The Bell",
  characteristics: ["action"],
  text: "Banish chosen damaged character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      effects: [
        {
          type: "banish",
          target: chosenDamagedCharacter,
        },
      ],
    },
  ],
  flavour: "I'm afraid that you've gone and upset me. \n– Ratigan",
  inkwell: true,
  colors: ["emerald"],
  cost: 3,
  illustrator: "Brian Weisz",
  number: 101,
  set: "ROF",
  rarity: "uncommon",
};
