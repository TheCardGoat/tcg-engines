import type { LorcanitoActionCard } from "@lorcanito/lorcana-engine/cards/cardTypes";
import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
import type {
  BanishEffect,
  DamageEffect,
} from "@lorcanito/lorcana-engine/effects/effectTypes";

const chosenItemOfYours: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "item" },
    { filter: "owner", value: "self" },
  ],
};

const chosenCharacter: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "zone", value: "play" },
    { filter: "type", value: "character" },
  ],
};

export const launch: LorcanitoActionCard = {
  id: "mu2",

  name: "Launch",
  characteristics: ["action"],
  text: "Banish chosen item of yours to deal 5 damage to chosen character.",
  type: "action",
  abilities: [
    {
      type: "resolution",
      text: "Banish chosen item of yours to deal 5 damage to chosen character.",
      resolveEffectsIndividually: true,
      dependentEffects: true,

      effects: [
        {
          type: "banish",
          target: chosenItemOfYours,
        } as BanishEffect,
        {
          type: "damage",
          amount: 5,
          target: chosenCharacter,
        } as DamageEffect,
      ],
    },
  ],
  flavour: "Ready . . . aim . . . coconut?",
  colors: ["sapphire"],
  cost: 3,
  illustrator: "Juan Diego Leon",
  number: 164,
  set: "ROF",
  rarity: "uncommon",
};
